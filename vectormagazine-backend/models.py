from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Index
from sqlalchemy.orm import relationship
import enum

db = SQLAlchemy()

class ArticleStatus(enum.Enum):
    """Article status enumeration"""
    DRAFT = 'draft'
    PUBLISHED = 'published'
    ARCHIVED = 'archived'


class UserRole(enum.Enum):
    """User role enumeration"""
    ADMIN = 'admin'
    EDITOR = 'editor'
    VIEWER = 'viewer'


class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.EDITOR, nullable=False)
    is_active = Column(db.Boolean, default=True, nullable=False)
    
    # Security timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)

    def set_password(self, password):
        """Hash and set password using bcrypt"""
        import bcrypt
        self.password_hash = bcrypt.hashpw(
            password.encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')

    def check_password(self, password):
        """Verify password against hash"""
        import bcrypt
        return bcrypt.checkpw(
            password.encode('utf-8'), 
            self.password_hash.encode('utf-8')
        )

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role.value if self.role else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
        }

    def __repr__(self):
        return f'<User {self.id}: {self.email}>'

class Category(db.Model):
    """Category model for articles"""
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), nullable=False, unique=True, index=True)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship
    articles = relationship('Article', back_populates='category')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<Category {self.id}: {self.name}>'

class Article(db.Model):
    """Article model for Vector Magazine CMS"""
    __tablename__ = 'articles'

    id = Column(Integer, primary_key=True)
    
    # Essentials
    title = Column(String(500), nullable=False)
    subtitle = Column(String(500), nullable=True)  # excerpt
    description = Column(String(1000), nullable=True)  # Keep for backward compatibility
    content = Column(JSONB, nullable=True)  # Stores Editor.js output blocks
    cover_image = Column(String(500), nullable=True)
    read_time = Column(Integer, nullable=True)  # minutes
    published_at = Column(DateTime, nullable=True)
    
    # Organization
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=True)
    tags = Column(ARRAY(String), nullable=True)  # Array of tag strings
    slug = Column(String(500), nullable=False, unique=True, index=True)
    
    # SEO and Social Media
    meta_title = Column(String(500), nullable=True)
    meta_description = Column(String(1000), nullable=True)
    og_image = Column(String(500), nullable=True)
    
    # System
    author_id = Column(Integer, nullable=True)  # For now, just an integer. Can be ForeignKey later
    status = Column(Enum(ArticleStatus), default=ArticleStatus.DRAFT, nullable=False)
    views_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    category = relationship('Category', back_populates='articles')

    # Indexes
    __table_args__ = (
        Index('idx_article_slug', 'slug'),
        Index('idx_article_status', 'status'),
        Index('idx_article_published_at', 'published_at'),
    )

    def to_dict(self, include_content=False):
        """Convert article to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'subtitle': self.subtitle,
            'description': self.description,
            'cover_image': self.cover_image,
            'read_time': self.read_time,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'category_id': self.category_id,
            'tags': self.tags or [],
            'slug': self.slug,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'og_image': self.og_image,
            'author_id': self.author_id,
            'status': self.status.value if self.status else None,
            'views_count': self.views_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if self.category:
            data['category'] = self.category.to_dict()
        if include_content:
            data['content'] = self.content
        return data

    def __repr__(self):
        return f'<Article {self.id}: {self.title}>'



