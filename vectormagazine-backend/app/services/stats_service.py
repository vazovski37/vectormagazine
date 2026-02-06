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
        
        return {
            'period': f'Last {days} days',
            'summary': {
                'total_views': total_views,
                'unique_visitors': unique_visitors
            },
            'chart_data': [{'date': str(d[0]), 'views': d[1]} for d in daily_views],
            'top_content': [{'title': a[0], 'slug': a[1], 'views': a[2]} for a in top_articles]
        }
