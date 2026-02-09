import os

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_key_vector_magazine_2024')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload Configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app/static/uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max limit
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}
    ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'webm', 'mov', 'avi'}
    
    # Pagination
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100
    
    # CORS
    CORS_HEADERS = 'Content-Type'
    
    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    
    # Use DEV_ prefixed variables, fallback to non-prefixed
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(os.path.abspath(os.path.dirname(__file__)), 'app.db')
    
    SECRET_KEY = os.environ.get('DEV_SECRET_KEY') or os.environ.get('SECRET_KEY', 'dev_key_vector_magazine_2024')
    FRONTEND_URL = os.environ.get('DEV_FRONTEND_URL', 'http://localhost:3000')
    ADMIN_URL = os.environ.get('DEV_ADMIN_URL', 'http://localhost:3001')
    REVALIDATION_SECRET = os.environ.get('DEV_REVALIDATION_SECRET', 'vectormagazine-revalidate-secret-dev')
    
    # Cookie security - relaxed for development
    SESSION_COOKIE_SECURE = False
    REMEMBER_COOKIE_SECURE = False

    CORS_ORIGINS = [
        FRONTEND_URL,
        ADMIN_URL,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
    ]


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
    # Use PROD_ prefixed variables, fallback to non-prefixed
    SQLALCHEMY_DATABASE_URI = os.environ.get('PROD_DATABASE_URL') or os.environ.get('DATABASE_URL')
    SECRET_KEY = os.environ.get('PROD_SECRET_KEY') or os.environ.get('SECRET_KEY')
    FRONTEND_URL = os.environ.get('PROD_FRONTEND_URL', 'https://vectormagazine.com')
    ADMIN_URL = os.environ.get('PROD_ADMIN_URL', 'https://admin.vectormagazine.com')
    REVALIDATION_SECRET = os.environ.get('PROD_REVALIDATION_SECRET')
    
    # Cookie security - strict for production
    SESSION_COOKIE_SECURE = True
    REMEMBER_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    REMEMBER_COOKIE_HTTPONLY = True
    
    _origins_str = os.environ.get('PROD_CORS_ORIGINS') or os.environ.get('CORS_ORIGINS')
    CORS_ORIGINS = [o.strip() for o in _origins_str.split(',')] if _origins_str else ['https://vectormagazine.com', 'https://admin.vectormagazine.com']
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        # Log to stderr in production
        import logging
        from logging import StreamHandler
        file_handler = StreamHandler()
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
