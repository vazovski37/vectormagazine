from flask import Blueprint, request, jsonify
from app import db
from app.models import PageHit
from app.services.stats_service import StatsService
import hashlib

bp = Blueprint('analytics', __name__)

from user_agents import parse

@bp.route('/track', methods=['POST'])
def track_event():
    data = request.json
    
    # Simple fingerprinting
    user_string = f"{request.remote_addr}-{request.user_agent.string}"
    visitor_hash = hashlib.sha256(user_string.encode()).hexdigest()
    
    # Device Detection
    ua_string = request.user_agent.string
    user_agent = parse(ua_string)
    
    device_type = 'desktop'
    if user_agent.is_mobile:
        device_type = 'mobile'
    elif user_agent.is_tablet:
        device_type = 'tablet'
        
    # Country Detection (Cloudflare or similar)
    country = request.headers.get('CF-IPCountry')
    # Local dev fallback or direct IP lookup could be here, but simpler to rely on headers for now
    
    hit = PageHit(
        article_id=data.get('article_id'),
        path=data.get('path'),
        visitor_hash=visitor_hash,
        user_agent=ua_string,
        device_type=device_type,
        country=country,
        event_type=data.get('event_type', 'view'),
        event_metadata=data.get('metadata')
    )
    
    db.session.add(hit)
    
    # Increment Article View Count efficiently
    if hit.event_type == 'view' and hit.article_id:
        # Use simple update to avoid overhead
        try:
            from app.models import Article
            Article.query.filter_by(id=data.get('article_id')).update(
                {'views_count': Article.views_count + 1}
            )
        except Exception as e:
            # Don't fail the request if update fails
            print(f"Failed to update view count: {e}")
            
    db.session.commit()
    
    return jsonify({'status': 'ok'}), 201

@bp.route('/dashboard', methods=['GET'])
def get_stats():
    # In a real app, protect this with @login_required or Check Role
    days = request.args.get('days', 30, type=int)
    stats = StatsService.get_dashboard_stats(days=days)
    return jsonify(stats)

@bp.route('/article/<int:id>', methods=['GET'])
def get_article_stats(id):
    days = request.args.get('days', 30, type=int)
    stats = StatsService.get_article_stats(article_id=id, days=days)
    return jsonify(stats)
