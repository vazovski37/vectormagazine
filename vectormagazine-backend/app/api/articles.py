from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import Article, Category, ArticleStatus
from app.services.isr_service import ISRService
import re

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

@bp.route('/', methods=['GET'])
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
            'published_at': article.published_at.isoformat() if article.published_at else None,
            'status': article.status.value
        })
        
    return jsonify({
        'articles': articles,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@bp.route('/<slug_or_id>', methods=['GET'])
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

@bp.route('/', methods=['POST'])
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
    
    # Trigger ISR
    ISRService.revalidate(f"/articles/{article.slug}")
    ISRService.revalidate("/") # Revalidate homepage
    
    return jsonify({'id': article.id, 'slug': article.slug, 'message': 'Article created'}), 201

@bp.route('/slug/<slug>', methods=['GET'])
def get_article_by_slug_route(slug):
    """Explicit endpoint for fetching by slug"""
    return get_article(slug)

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
        article.content = data['content']
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
            article.status = ArticleStatus[status_val]
            
    if 'category_id' in data:
        article.category_id = data['category_id']
        
    if 'tags' in data:
        article.tags = data['tags']
        
    db.session.commit()
    
    # Trigger ISR
    ISRService.revalidate(f"/articles/{article.slug}")
    ISRService.revalidate("/")
    
    return jsonify({'message': 'Article updated', 'article': {
        'id': article.id,
        'slug': article.slug
    }})

@bp.route('/<int:id>', methods=['DELETE'])
def delete_article(id):
    article = Article.query.get_or_404(id)
    db.session.delete(article)
    db.session.commit()
    
    # Optional: ISR revalidate to remove from frontend?
    ISRService.revalidate("/")
    
    return jsonify({'message': 'Article deleted'})
