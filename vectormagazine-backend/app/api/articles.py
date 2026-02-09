from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import Article, Category, ArticleStatus
from app.services.isr_service import ISRService
import re
import json
from datetime import datetime

bp = Blueprint('articles', __name__)

def generate_slug(title, article_id=None):
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    slug = slug.strip('-')
    
    if not slug and article_id:
        slug = f'article-{article_id}'
    
    # Check uniqueness
    base_slug = slug
    counter = 1
    while True:
        query = Article.query.filter_by(slug=slug)
        if article_id:
            query = query.filter(Article.id != article_id)
        if not query.first():
            break
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug

def get_article(slug_or_id):
    """Helper to get article by slug or ID"""
    article = None
    
    # Try ID first if integer
    if isinstance(slug_or_id, int) or (isinstance(slug_or_id, str) and slug_or_id.isdigit()):
        article = Article.query.get(int(slug_or_id))
        
    # Try slug
    if not article:
        article = Article.query.filter_by(slug=slug_or_id).first()
        
    if not article:
        return jsonify({'error': 'Article not found'}), 404
        
    # Return article data
    return jsonify({
        'id': article.id,
        'title': article.title,
        'description': article.description,
        'cover_image': article.cover_image,
        'created_at': article.created_at.isoformat(),
        'slug': article.slug,
        'subtitle': article.subtitle,
        'category': {'name': article.category.name, 'slug': article.category.slug} if article.category else None,
        'read_time': article.read_time,
        'published_at': article.published_at.isoformat() if article.published_at else None,
        'status': article.status.value,
        'content': article.content,
        'meta_title': article.meta_title,
        'meta_description': article.meta_description,
        'tags': article.tags,
        'author': {'name': article.author.name} if article.author else None,
        'views_count': article.views_count
    })

@bp.route('', methods=['GET'])
def get_articles():
    page = request.args.get('page', 1, type=int)
    per_page = current_app.config.get('DEFAULT_PAGE_SIZE', 20)
    
    query = Article.query
    status = request.args.get('status')
    
    if status and status.upper() in ArticleStatus.__members__:
        query = query.filter_by(status=ArticleStatus[status.upper()])
        
    pagination = query.order_by(Article.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    articles = []
    for article in pagination.items:
        articles.append({
            'id': article.id,
            'title': article.title,
            'description': article.description,
            'cover_image': article.cover_image,
            'created_at': article.created_at.isoformat(),
            'slug': article.slug,
            'subtitle': article.subtitle,
            'category': {'name': article.category.name, 'slug': article.category.slug} if article.category else None,
            'read_time': article.read_time,
            'published_at': article.published_at.isoformat() if article.published_at else None,
            'status': article.status.value
        })
        
    return jsonify({
        'articles': articles,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@bp.route('', methods=['POST'])
def create_article():
    data = request.json
    
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
        
    content = data.get('content')
    current_app.logger.info(f"DEBUG: content type before parsing: {type(content)}")
    
    # Robust parsing: ensure content becomes a dict or None
    if isinstance(content, str):
        try:
            # Handle potential double-encoding
            parsed = json.loads(content)
            if isinstance(parsed, str):
                parsed = json.loads(parsed)
            content = parsed
            current_app.logger.info("DEBUG: content parsed successfully")
        except Exception as e:
            current_app.logger.error(f"DEBUG: content parsing failed: {e}")
            content = {} # Fallback to empty dict to prevent SQL error

    # Final safeguard
    if not isinstance(content, (dict, list)) and content is not None:
         current_app.logger.warning(f"DEBUG: content is still {type(content)}, forcing empty dict")
         content = {}
        
    tags = data.get('tags')
    if tags is not None and not isinstance(tags, list):
        tags = [] # Force empty list if invalid format
        
    status = ArticleStatus[data.get('status', 'DRAFT').upper()] if data.get('status') in ArticleStatus.__members__ else ArticleStatus.DRAFT
    
    article = Article(
        title=data.get('title'),
        description=data.get('description'),
        content=content,
        cover_image=data.get('cover_image'),
        subtitle=data.get('subtitle'),
        meta_title=data.get('meta_title'),
        meta_description=data.get('meta_description'),
        tags=tags,
        status=status,
        published_at=datetime.utcnow() if status == ArticleStatus.PUBLISHED else None
    )
    
    # Generate slug
    article.slug = generate_slug(article.title)
    
    db.session.add(article)
    db.session.commit()
    
    try:
        # Trigger ISR
        ISRService.revalidate(f"/articles/{article.slug}")
        ISRService.revalidate("/") # Revalidate homepage
        ISRService.revalidate("/articles")
    except Exception as e:
        current_app.logger.error(f"Failed to trigger ISR on create: {str(e)}")
    
    return jsonify({'id': article.id, 'slug': article.slug, 'message': 'Article created'}), 201

@bp.route('/slug/<slug>', methods=['GET'])
def get_article_by_slug_route(slug):
    """Explicit endpoint for fetching by slug"""
    return get_article(slug)

@bp.route('/<int:id>', methods=['GET'])
def get_article_by_id_route(id):
    """Explicit endpoint for fetching by ID"""
    return get_article(id)

@bp.route('/<int:id>', methods=['PUT'])
def update_article(id):
    article = Article.query.get_or_404(id)
    data = request.json
    
    if 'title' in data:
        article.title = data['title']
        if not data.get('slug'): # Update slug if title changes but no slug provided? usually strict
            # For now, keep slug unless explicitly changed to avoid breaking URLs
            pass
            
    if 'slug' in data:
        article.slug = data['slug'] 
        
    if 'description' in data:
        article.description = data['description']
    if 'content' in data:
        content = data['content']
        current_app.logger.info(f"DEBUG: update content type before parsing: {type(content)}")
        if isinstance(content, str):
            try:
                parsed = json.loads(content)
                if isinstance(parsed, str):
                    parsed = json.loads(parsed)
                content = parsed
                current_app.logger.info("DEBUG: update content parsed successfully")
            except Exception as e:
                current_app.logger.error(f"DEBUG: update content parsing failed: {e}")
                content = {}
        
        if not isinstance(content, (dict, list)) and content is not None:
             content = {}
             
        article.content = content
    if 'cover_image' in data:
        article.cover_image = data['cover_image']
    if 'subtitle' in data:
        article.subtitle = data['subtitle']
    if 'meta_title' in data:
        article.meta_title = data['meta_title']
    if 'meta_description' in data:
        article.meta_description = data['meta_description']
    if 'status' in data:
        # Handle status conversion
        status_val = data['status'].upper()
        if status_val in ArticleStatus.__members__:
            new_status = ArticleStatus[status_val]
            # Set published_at if moving to PUBLISHED and it wasn't set before
            if new_status == ArticleStatus.PUBLISHED and article.status != ArticleStatus.PUBLISHED:
                article.published_at = datetime.utcnow()
            article.status = new_status
            
    if 'category_id' in data:
        article.category_id = data['category_id']
        
    if 'tags' in data:
        article.tags = data['tags']
        
    db.session.commit()
    
    try:
        # Trigger ISR
        ISRService.revalidate(f"/articles/{article.slug}")
        ISRService.revalidate("/")
        ISRService.revalidate("/articles")
    except Exception as e:
        current_app.logger.error(f"Failed to trigger ISR on update: {str(e)}")
    
    return jsonify({'message': 'Article updated', 'article': {
        'id': article.id,
        'slug': article.slug
    }})

@bp.route('/<int:id>', methods=['DELETE'])
def delete_article(id):
    article = Article.query.get_or_404(id)
    slug = article.slug  # Capture slug before deletion
    
    db.session.delete(article)
    db.session.commit()
    
    try:
        # Trigger ISR
        ISRService.revalidate("/")
        ISRService.revalidate("/articles")
        ISRService.revalidate(f"/articles/{slug}")
    except Exception as e:
        current_app.logger.error(f"Failed to trigger ISR on delete: {str(e)}")
    
    return jsonify({'message': 'Article deleted'})
