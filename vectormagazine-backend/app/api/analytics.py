from flask import Blueprint, request, jsonify
from app import db
from app.models import PageHit
from app.services.stats_service import StatsService
import hashlib

bp = Blueprint('analytics', __name__)

@bp.route('/track', methods=['POST'])
def track_event():
    data = request.json
    
    # Simple fingerprinting (IP + User Agent)
    # In production, respect DNT headers and GDPR
    user_string = f"{request.remote_addr}-{request.user_agent.string}"
    visitor_hash = hashlib.sha256(user_string.encode()).hexdigest()
    
    hit = PageHit(
        article_id=data.get('article_id'),
        path=data.get('path'),
        visitor_hash=visitor_hash,
        user_agent=str(request.user_agent),
        event_type=data.get('event_type', 'view'),
        event_metadata=data.get('metadata')
    )
    
    db.session.add(hit)
    db.session.commit()
    
    return jsonify({'status': 'ok'}), 201

@bp.route('/dashboard', methods=['GET'])
def get_stats():
    # In a real app, protect this with @login_required or Check Role
    days = request.args.get('days', 30, type=int)
    stats = StatsService.get_dashboard_stats(days=days)
    return jsonify(stats)
