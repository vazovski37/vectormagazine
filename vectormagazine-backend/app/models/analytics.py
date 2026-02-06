from app import db
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSONB

class PageHit(db.Model):
    __tablename__ = 'page_hits'

    id = db.Column(db.Integer, primary_key=True)
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'), nullable=True) # Nullable for homepage/category hits
    path = db.Column(db.String(500), nullable=False, index=True)
    
    # Visitor Identity (Hashed/Anonymized)
    visitor_hash = db.Column(db.String(64), nullable=True, index=True)
    session_id = db.Column(db.String(64), nullable=True)
    
    # Device & Location
    user_agent = db.Column(db.String(500), nullable=True)
    device_type = db.Column(db.String(50), nullable=True) # mobile, desktop, tablet
    browser = db.Column(db.String(50), nullable=True)
    os = db.Column(db.String(50), nullable=True)
    country = db.Column(db.String(2), nullable=True) # ISO code
    city = db.Column(db.String(100), nullable=True)
    referrer = db.Column(db.String(500), nullable=True)
    
    # Engagement
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    event_type = db.Column(db.String(50), default='view') # view, heartbeat, scroll
    event_metadata = db.Column(JSONB, nullable=True) # scroll_depth, time_on_page
