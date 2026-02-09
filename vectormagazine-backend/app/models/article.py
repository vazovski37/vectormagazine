from app import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
import enum

class ArticleStatus(enum.Enum):
    DRAFT = 'DRAFT'
    PUBLISHED = 'PUBLISHED'
    ARCHIVED = 'ARCHIVED'

class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    slug = db.Column(db.String(100), nullable=False, unique=True, index=True)
    description = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    articles = db.relationship('Article', backref='category', lazy=True)

class Article(db.Model):
    __tablename__ = 'articles'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    content = db.Column(JSONB, nullable=True)
    cover_image = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Enhanced fields
    subtitle = db.Column(db.String(500), nullable=True)
    read_time = db.Column(db.Integer, nullable=True)
    published_at = db.Column(db.DateTime, nullable=True, index=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)
    tags = db.Column(JSONB, nullable=True)
    slug = db.Column(db.String(500), nullable=False, unique=True, index=True)
    meta_title = db.Column(db.String(500), nullable=True)
    meta_description = db.Column(db.String(1000), nullable=True)
    og_image = db.Column(db.String(500), nullable=True)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    author = db.relationship('User', foreign_keys=[author_id], backref='articles')
    status = db.Column(db.Enum(ArticleStatus), nullable=False, default=ArticleStatus.DRAFT, index=True)
    views_count = db.Column(db.Integer, nullable=False, default=0)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
