import os
import uuid
import re
import requests
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app, make_response
from werkzeug.utils import secure_filename
from models import db, Article, Category, ArticleStatus
from auth import require_auth
from middleware.security import (
    validate_article_input, 
    sanitize_article_data,
    SecurityConfig
)

api = Blueprint('api', __name__, url_prefix='/api')


# ISR Revalidation Configuration
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
REVALIDATION_SECRET = os.environ.get('REVALIDATION_SECRET', 'vectormagazine-revalidate-secret')


def trigger_revalidation(article_slug=None, revalidate_home=True):
    """
    Trigger ISR revalidation on the Next.js frontend.
    Called when articles are published, updated, or deleted.
    """
    try:
        revalidation_url = f"{FRONTEND_URL}/api/revalidate"
        headers = {'Content-Type': 'application/json'}
        
        paths_to_revalidate = []
        
        # Revalidate specific article page
        if article_slug:
            paths_to_revalidate.append(f"/articles/{article_slug}")
        
        # Revalidate homepage and listings
        if revalidate_home:
            paths_to_revalidate.extend(['/', '/articles'])
        
        for path in paths_to_revalidate:
            payload = {
                'secret': REVALIDATION_SECRET,
                'path': path
            }
            
            response = requests.post(
                revalidation_url, 
                json=payload,
                headers=headers,
                timeout=5  # 5 second timeout
            )
            
            if response.status_code == 200:
                current_app.logger.info(f'[ISR] Revalidated: {path}')
            else:
                current_app.logger.warning(f'[ISR] Failed to revalidate {path}: {response.status_code}')
                
    except requests.exceptions.RequestException as e:
        # Don't fail the main request if revalidation fails
        current_app.logger.warning(f'[ISR] Revalidation request failed: {str(e)}')
    except Exception as e:
        current_app.logger.warning(f'[ISR] Unexpected error during revalidation: {str(e)}')


def generate_slug(title):
    """Generate URL-friendly slug from title"""
    # Convert to lowercase
    slug = title.lower()
    # Replace spaces and special characters with hyphens
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    # Remove leading/trailing hyphens
    slug = slug.strip('-')
    return slug


def calculate_read_time(content):
    """Calculate reading time in minutes based on content"""
    if not content or not content.get('blocks'):
        return None
    
    word_count = 0
    for block in content.get('blocks', []):
        if block.get('type') == 'paragraph':
            text = block.get('data', {}).get('text', '')
            word_count += len(text.split())
        elif block.get('type') == 'header':
            text = block.get('data', {}).get('text', '')
            word_count += len(text.split())
        elif block.get('type') == 'list':
            items = block.get('data', {}).get('items', [])
            for item in items:
                word_count += len(str(item).split())
        elif block.get('type') == 'quote':
            text = block.get('data', {}).get('text', '')
            word_count += len(text.split())
    
    # Average reading speed: 200-250 words per minute
    read_time = max(1, round(word_count / 225))
    return read_time


def ensure_unique_slug(base_slug, article_id=None):
    """Ensure slug is unique by appending number if needed"""
    slug = base_slug
    counter = 1
    while True:
        query = Article.query.filter_by(slug=slug)
        if article_id:
            query = query.filter(Article.id != article_id)
        if not query.first():
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


def add_cache_headers(response, max_age=60):
    """Add cache control headers to response"""
    response.headers['Cache-Control'] = f'public, max-age={max_age}'
    response.headers['Vary'] = 'Accept-Encoding'
    return response



@api.route('/articles', methods=['POST'])
@require_auth
def create_article():
    """Create a new article (requires authentication)"""
    try:
        data = request.get_json()
        
        # Validate input
        errors = validate_article_input(data)
        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400
        
        # Sanitize input
        data = sanitize_article_data(data)

        # Generate slug from title if not provided
        slug = data.get('slug') or generate_slug(data.get('title'))
        slug = ensure_unique_slug(slug)

        # Calculate read time from content
        content = data.get('content')
        read_time = data.get('read_time')
        if not read_time and content:
            read_time = calculate_read_time(content)

        # Determine published_at based on status
        status_str = data.get('status', 'draft')
        try:
            status = ArticleStatus[status_str.upper()]
        except KeyError:
            status = ArticleStatus.DRAFT

        published_at = None
        if status == ArticleStatus.PUBLISHED:
            published_at = data.get('published_at')
            if published_at:
                try:
                    published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                except:
                    published_at = datetime.utcnow()
            else:
                published_at = datetime.utcnow()

        article = Article(
            title=data.get('title'),
            subtitle=data.get('subtitle'),
            description=data.get('description'),
            content=content,
            cover_image=data.get('cover_image'),
            read_time=read_time,
            published_at=published_at,
            category_id=data.get('category_id'),
            tags=data.get('tags', []),
            slug=slug,
            meta_title=data.get('meta_title'),
            meta_description=data.get('meta_description'),
            og_image=data.get('og_image') or data.get('cover_image'),
            author_id=data.get('author_id', 1),
            status=status,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.session.add(article)
        db.session.commit()

        # Trigger ISR revalidation if article is published
        if status == ArticleStatus.PUBLISHED:
            trigger_revalidation(article_slug=article.slug)

        return jsonify(article.to_dict(include_content=True)), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creating article: {str(e)}')
        return jsonify({'error': 'Failed to create article', 'message': str(e)}), 500


@api.route('/articles', methods=['GET'])
def list_articles():
    """List all articles with pagination and caching"""
    try:
        # Query parameters
        status = request.args.get('status')
        category_id = request.args.get('category_id', type=int)
        limit = request.args.get('limit', type=int, default=current_app.config.get('DEFAULT_PAGE_SIZE', 20))
        offset = request.args.get('offset', type=int, default=0)
        
        # Enforce max page size
        max_page_size = current_app.config.get('MAX_PAGE_SIZE', 100)
        limit = min(limit, max_page_size)
        
        query = Article.query
        
        # Filter by status
        if status:
            try:
                status_enum = ArticleStatus[status.upper()]
                query = query.filter(Article.status == status_enum)
            except KeyError:
                pass
        
        # Filter by category
        if category_id:
            query = query.filter(Article.category_id == category_id)
        
        # Get total count for pagination metadata
        total_count = query.count()
        
        # Order by published_at if available, else created_at
        query = query.order_by(
            Article.published_at.desc().nullslast(),
            Article.created_at.desc()
        )
        
        # Pagination
        query = query.limit(limit).offset(offset)
        
        articles = query.all()
        
        # Build response with pagination metadata
        response_data = {
            'articles': [article.to_dict(include_content=False) for article in articles],
            'pagination': {
                'total': total_count,
                'limit': limit,
                'offset': offset,
                'has_more': offset + limit < total_count
            }
        }
        
        response = make_response(jsonify(response_data))
        
        # Add cache headers (60 seconds for listing)
        cache_timeout = current_app.config.get('CACHE_DEFAULT_TIMEOUT', 60)
        return add_cache_headers(response, cache_timeout)

    except Exception as e:
        current_app.logger.error(f'Error listing articles: {str(e)}')
        return jsonify({'error': 'Failed to fetch articles', 'message': str(e)}), 500


@api.route('/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    """Get full article details including content"""
    try:
        article = Article.query.get_or_404(article_id)
        
        # Increment views count
        article.views_count += 1
        db.session.commit()
        
        response = make_response(jsonify(article.to_dict(include_content=True)))
        return add_cache_headers(response, 60)

    except Exception as e:
        current_app.logger.error(f'Error fetching article {article_id}: {str(e)}')
        return jsonify({'error': 'Article not found', 'message': str(e)}), 404


@api.route('/articles/slug/<slug>', methods=['GET'])
def get_article_by_slug(slug):
    """Get article by slug"""
    try:
        article = Article.query.filter_by(slug=slug).first_or_404()
        
        # Increment views count
        article.views_count += 1
        db.session.commit()
        
        response = make_response(jsonify(article.to_dict(include_content=True)))
        return add_cache_headers(response, 60)

    except Exception as e:
        current_app.logger.error(f'Error fetching article by slug {slug}: {str(e)}')
        return jsonify({'error': 'Article not found', 'message': str(e)}), 404


@api.route('/articles/<int:article_id>', methods=['PUT', 'PATCH'])
@require_auth
def update_article(article_id):
    """Update an existing article (requires authentication)"""
    try:
        article = Article.query.get_or_404(article_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Sanitize input data
        data = sanitize_article_data(data)
        
        # Update fields if provided
        if 'title' in data:
            article.title = data['title']
            # Regenerate slug if title changed
            if article.title != data.get('title'):
                base_slug = generate_slug(data['title'])
                article.slug = ensure_unique_slug(base_slug, article_id)
        
        if 'subtitle' in data:
            article.subtitle = data['subtitle']
        if 'description' in data:
            article.description = data['description']
        if 'content' in data:
            article.content = data['content']
            # Recalculate read time
            article.read_time = calculate_read_time(data['content'])
        if 'cover_image' in data:
            article.cover_image = data['cover_image']
        if 'category_id' in data:
            article.category_id = data['category_id']
        if 'tags' in data:
            article.tags = data['tags'] if isinstance(data['tags'], list) else None
        if 'meta_title' in data:
            article.meta_title = data['meta_title']
        if 'meta_description' in data:
            article.meta_description = data['meta_description']
        if 'og_image' in data:
            article.og_image = data['og_image']
        if 'author_id' in data:
            article.author_id = data['author_id']
        
        # Handle status change
        if 'status' in data:
            try:
                status_str = data['status']
                if isinstance(status_str, str):
                    status = ArticleStatus[status_str.upper()]
                else:
                    status = ArticleStatus.DRAFT
            except (KeyError, AttributeError):
                status = ArticleStatus.DRAFT
            
            old_status = article.status
            article.status = status
            
            # Set published_at when status changes to published
            if status == ArticleStatus.PUBLISHED and old_status != ArticleStatus.PUBLISHED:
                if not article.published_at:
                    article.published_at = datetime.utcnow()
        
        article.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # Trigger ISR revalidation if article is published
        if article.status == ArticleStatus.PUBLISHED:
            trigger_revalidation(article_slug=article.slug)
        
        return jsonify(article.to_dict(include_content=True)), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error updating article {article_id}: {str(e)}')
        return jsonify({'error': 'Failed to update article', 'message': str(e)}), 500


@api.route('/articles/<int:article_id>', methods=['DELETE'])
@require_auth
def delete_article(article_id):
    """Delete an article (requires authentication)"""
    try:
        article = Article.query.get_or_404(article_id)
        article_slug = article.slug
        was_published = article.status == ArticleStatus.PUBLISHED
        
        db.session.delete(article)
        db.session.commit()
        
        # Trigger ISR revalidation if deleted article was published
        if was_published:
            trigger_revalidation(article_slug=article_slug)
        
        return jsonify({'message': 'Article deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error deleting article {article_id}: {str(e)}')
        return jsonify({'error': 'Failed to delete article', 'message': str(e)}), 500


@api.route('/categories', methods=['GET'])
def list_categories():
    """List all categories with caching"""
    try:
        categories = Category.query.order_by(Category.name).all()
        response = make_response(jsonify([category.to_dict() for category in categories]))
        return add_cache_headers(response, 300)  # Cache categories for 5 minutes
    except Exception as e:
        current_app.logger.error(f'Error listing categories: {str(e)}')
        return jsonify({'error': 'Failed to fetch categories', 'message': str(e)}), 500


@api.route('/categories', methods=['POST'])
@require_auth
def create_category():
    """Create a new category (requires authentication)"""
    try:
        data = request.get_json()
        
        if not data or not data.get('name'):
            return jsonify({'error': 'Category name is required'}), 400
        
        # Generate slug if not provided
        slug = data.get('slug') or generate_slug(data.get('name'))
        
        # Check if slug already exists
        existing = Category.query.filter_by(slug=slug).first()
        if existing:
            return jsonify({'error': 'Category with this slug already exists'}), 400
        
        category = Category(
            name=data.get('name'),
            slug=slug,
            description=data.get('description')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Error creating category: {str(e)}')
        return jsonify({'error': 'Failed to create category', 'message': str(e)}), 500


@api.route('/link', methods=['POST'])
def fetch_link():
    """Handle link fetching for Editor.js link tool"""
    try:
        data = request.get_json()
        url = data.get('url') if data else None
        
        if not url:
            return jsonify({
                'success': 0,
                'error': {'message': 'URL is required'}
            }), 400

        return jsonify({
            'success': 1,
            'meta': {
                'title': url,
                'description': '',
                'image': {'url': ''}
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f'Error fetching link: {str(e)}')
        return jsonify({
            'success': 0,
            'error': {'message': 'Failed to fetch link', 'details': str(e)}
        }), 500


@api.route('/upload', methods=['POST'])
@require_auth
def upload_file():
    """Handle file upload for Editor.js image tool (requires authentication)"""
    try:
        # Editor.js can send the file as 'image' or 'file'
        file = None
        if 'image' in request.files:
            file = request.files['image']
        elif 'file' in request.files:
            file = request.files['file']
        else:
            return jsonify({
                'success': 0,
                'error': {'message': 'No file provided. Please select an image file.'}
            }), 400

        if not file or file.filename == '':
            return jsonify({
                'success': 0,
                'error': {'message': 'No file selected'}
            }), 400

        if not allowed_file(file.filename):
            return jsonify({
                'success': 0,
                'error': {'message': f'File type not allowed. Allowed types: {", ".join(current_app.config["ALLOWED_EXTENSIONS"])}'}
            }), 400

        # Generate unique filename
        filename = secure_filename(file.filename)
        if '.' not in filename:
            return jsonify({
                'success': 0,
                'error': {'message': 'Invalid filename: no extension found'}
            }), 400
            
        file_ext = filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_ext}"

        # Ensure upload directory exists
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)

        # Save file
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        # Verify file was saved
        if not os.path.exists(file_path):
            return jsonify({
                'success': 0,
                'error': {'message': 'Failed to save file'}
            }), 500

        # Return Editor.js expected format
        base_url = request.url_root.rstrip('/')
        file_url = f"{base_url}/static/uploads/{unique_filename}"
        
        # Determine if it's a video or image
        video_extensions = current_app.config.get('ALLOWED_VIDEO_EXTENSIONS', {'mp4', 'webm', 'mov', 'avi'})
        is_video = file_ext in video_extensions
        
        current_app.logger.info(f'File uploaded successfully: {unique_filename} (video: {is_video})')
        
        return jsonify({
            'success': 1,
            'file': {
                'url': file_url,
                'type': 'video' if is_video else 'image'
            }
        }), 200

    except Exception as e:
        current_app.logger.error(f'Error uploading file: {str(e)}', exc_info=True)
        return jsonify({
            'success': 0,
            'error': {'message': 'Failed to upload file', 'details': str(e)}
        }), 500
