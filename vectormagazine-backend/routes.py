from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from models import db, Article, Category, ArticleStatus
import os
import uuid
from datetime import datetime
import re

api = Blueprint('api', __name__, url_prefix='/api')

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

@api.route('/articles', methods=['GET'])
def get_articles():
    page = request.args.get('page', 1, type=int)
    per_page = current_app.config.get('DEFAULT_PAGE_SIZE', 20)
    
    query = Article.query.filter_by(status=ArticleStatus.PUBLISHED)
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
            'published_at': article.published_at.isoformat() if article.published_at else None
        })
        
    return jsonify({
        'articles': articles,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@api.route('/articles/<slug_or_id>', methods=['GET'])
def get_article(slug_or_id):
    # Try ID first if integer
    article = None
    if slug_or_id.isdigit():
        article = Article.query.get(int(slug_or_id))
    
    # Try slug
    if not article:
        article = Article.query.filter_by(slug=slug_or_id).first()
        
    if not article:
        return jsonify({'error': 'Article not found'}), 404
        
    return jsonify({
        'id': article.id,
        'title': article.title,
        'description': article.description,
        'content': article.content,
        'cover_image': article.cover_image,
        'created_at': article.created_at.isoformat(),
        'slug': article.slug,
        'subtitle': article.subtitle,
        'read_time': article.read_time,
        'published_at': article.published_at.isoformat() if article.published_at else None,
        'meta_title': article.meta_title,
        'meta_description': article.meta_description,
        'og_image': article.og_image,
        'tags': article.tags,
        'category': {'name': article.category.name, 'slug': article.category.slug} if article.category else None,
        'status': article.status.value,
        'views_count': article.views_count
    })

@api.route('/articles', methods=['POST'])
def create_article():
    data = request.json
    
    if not data or not data.get('title'):
        return jsonify({'error': 'Title is required'}), 400
        
    article = Article(
        title=data.get('title'),
        description=data.get('description'),
        content=data.get('content'),
        cover_image=data.get('cover_image'),
        subtitle=data.get('subtitle'),
        meta_title=data.get('meta_title'),
        meta_description=data.get('meta_description'),
        status=ArticleStatus.DRAFT
    )
    
    # Generate slug
    article.slug = generate_slug(article.title)
    
    db.session.add(article)
    db.session.commit()
    
    return jsonify({'id': article.id, 'slug': article.slug, 'message': 'Article created'}), 201

@api.route('/upload', methods=['POST'])
def upload_file():
    if 'image' not in request.files:
        return jsonify({'success': 0, 'error': 'No file part'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': 0, 'error': 'No selected file'}), 400
        
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Add uuid to prevent overwrites
        name, ext = os.path.splitext(filename)
        filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
        
        upload_folder = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_folder, exist_ok=True)
        
        file.save(os.path.join(upload_folder, filename))
        
        url = f"{request.host_url}static/uploads/{filename}"
        
        return jsonify({
            'success': 1,
            'file': {
                'url': url
            }
        })
        
    return jsonify({'success': 0, 'error': 'File type not allowed'}), 400

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

