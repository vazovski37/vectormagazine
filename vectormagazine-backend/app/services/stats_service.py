from app import db
from app.models import PageHit, Article
from sqlalchemy import func, text
from datetime import datetime, timedelta

class StatsService:
    
    @staticmethod
    def get_dashboard_stats(days=30):
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Total Views
        total_views = PageHit.query.filter(
            PageHit.timestamp >= start_date, 
            PageHit.event_type == 'view'
        ).count()
        
        # Unique Visitors
        unique_visitors = db.session.query(func.count(func.distinct(PageHit.visitor_hash))).filter(
            PageHit.timestamp >= start_date
        ).scalar()
        
        # Views Per Day
        daily_views = db.session.query(
            func.date_trunc('day', PageHit.timestamp).label('date'),
            func.count(PageHit.id)
        ).filter(
            PageHit.timestamp >= start_date,
            PageHit.event_type == 'view'
        ).group_by('date').order_by('date').all()
        
        # Top Articles
        top_articles = db.session.query(
            Article.title,
            Article.slug,
            func.count(PageHit.id).label('views')
        ).join(PageHit, PageHit.article_id == Article.id).filter(
            PageHit.timestamp >= start_date,
            PageHit.event_type == 'view'
        ).group_by(Article.id).order_by(text('views DESC')).limit(10).all()
        
        # Device Breakdown
        device_stats = db.session.query(
            PageHit.device_type,
            func.count(PageHit.id)
        ).filter(
            PageHit.timestamp >= start_date,
            PageHit.event_type == 'view'
        ).group_by(PageHit.device_type).all()
        
        # Country Breakdown
        country_stats = db.session.query(
            PageHit.country,
            func.count(PageHit.id)
        ).filter(
            PageHit.timestamp >= start_date,
            PageHit.event_type == 'view'
        ).group_by(PageHit.country).order_by(func.count(PageHit.id).desc()).limit(10).all()
        
        return {
            'period': f'Last {days} days',
            'summary': {
                'total_views': total_views,
                'unique_visitors': unique_visitors
            },
            'chart_data': [{'date': str(d[0]), 'views': d[1]} for d in daily_views],
            'top_content': [{'title': a[0], 'slug': a[1], 'views': a[2]} for a in top_articles],
            'device_breakdown': [{'name': d[0] or 'Unknown', 'value': d[1]} for d in device_stats],
            'country_breakdown': [{'code': c[0] or 'Unknown', 'views': c[1]} for c in country_stats]
        }

    @staticmethod
    def get_article_stats(article_id, days=30):
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Daily views for this article
        daily_views = db.session.query(
            func.date_trunc('day', PageHit.timestamp).label('date'),
            func.count(PageHit.id)
        ).filter(
            PageHit.article_id == article_id,
            PageHit.timestamp >= start_date,
            PageHit.event_type == 'view'
        ).group_by('date').order_by('date').all()
        
        # Total views in period
        period_views = PageHit.query.filter(
            PageHit.article_id == article_id,
            PageHit.timestamp >= start_date,
            PageHit.event_type == 'view'
        ).count()
        
        # Unique visitors in period
        unique_visitors = db.session.query(func.count(func.distinct(PageHit.visitor_hash))).filter(
            PageHit.article_id == article_id,
            PageHit.timestamp >= start_date
        ).scalar()
        
        return {
            'period': f'Last {days} days',
            'summary': {
                'views': period_views,
                'unique_visitors': unique_visitors
            },
            'chart_data': [{'date': str(d[0]), 'views': d[1]} for d in daily_views]
        }
