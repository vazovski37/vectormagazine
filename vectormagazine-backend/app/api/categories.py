from flask import Blueprint, request, jsonify
from app import db
from app.models import Category
import re

bp = Blueprint('categories', __name__)

def generate_slug(name):
    slug = name.lower()
    slug = re.sub(r'[^\\w\\s-]', '', slug)
    slug = re.sub(r'[-\\s]+', '-', slug)
    return slug.strip('-')

@bp.route('', methods=['GET'])
def get_categories():
    categories = Category.query.order_by(Category.name.asc()).all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'slug': c.slug,
        'description': c.description,
        'count': len(c.articles)
    } for c in categories])

@bp.route('', methods=['POST'])
def create_category():
    data = request.json
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
        
    slug = data.get('slug') or generate_slug(data['name'])
    
    if Category.query.filter_by(slug=slug).first():
        return jsonify({'error': 'Category with this slug already exists'}), 400
        
    category = Category(
        name=data['name'],
        slug=slug,
        description=data.get('description')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify({
        'id': category.id,
        'name': category.name,
        'slug': category.slug
    }), 201
