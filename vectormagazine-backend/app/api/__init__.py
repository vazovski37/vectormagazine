from flask import Blueprint
from .articles import bp as articles_bp
from .uploads import bp as uploads_bp
from .analytics import bp as analytics_bp
from .auth import bp as auth_bp
from .categories import bp as categories_bp

api = Blueprint('api', __name__, url_prefix='/api')

api.register_blueprint(articles_bp, url_prefix='/articles')
api.register_blueprint(uploads_bp, url_prefix='/upload')
api.register_blueprint(analytics_bp, url_prefix='/analytics')
api.register_blueprint(auth_bp, url_prefix='/auth')
api.register_blueprint(categories_bp, url_prefix='/categories')

from .newsletter import bp as newsletter_bp
api.register_blueprint(newsletter_bp, url_prefix='/subscribers')
