import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_compress import Compress
from config import config
from models import db
from routes import api
from auth import auth
from middleware.security import (
    add_security_headers, 
    get_cors_origins,
    SecurityConfig
)

# Load environment variables from .env file
load_dotenv()

# Initialize extensions
compress = Compress()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[SecurityConfig.DEFAULT_RATE_LIMIT],
    storage_uri="memory://"
)

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'development')
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    compress.init_app(app)
    limiter.init_app(app)
    
    # CORS configuration - environment-aware
    allowed_origins = get_cors_origins()
    CORS(app, resources={
        r"/api/*": {
            "origins": allowed_origins,
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
            "supports_credentials": True,  # Required for HTTP-only cookies
            "max_age": 3600
        },
        r"/static/*": {
            "origins": "*"
        }
    })
    
    migrate = Migrate(app, db)
    
    # Register blueprints
    app.register_blueprint(api)
    app.register_blueprint(auth)
    
    # Apply strict rate limiting to auth endpoints
    limiter.limit("5 per minute")(auth)
    
    # Create upload directory if it doesn't exist
    upload_folder = app.config.get('UPLOAD_FOLDER', 'static/uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    # Serve static files for uploaded images
    @app.route('/static/uploads/<filename>')
    def uploaded_file(filename):
        from flask import send_from_directory
        return send_from_directory(upload_folder, filename)
    
    # Add security headers to all responses
    @app.after_request
    def after_request(response):
        # Add security headers
        response = add_security_headers(response)
        
        # Add CORS headers if not already set

        
        # Add cache headers for static files
        if request.path.startswith('/static/'):
            response.headers['Cache-Control'] = 'public, max-age=31536000'
        
        return response
    

    
    # Health check endpoint (exempt from rate limiting)
    @app.route('/health')
    @limiter.exempt
    def health_check():
        return jsonify({'status': 'healthy', 'version': '1.0.0'}), 200
    
    return app

# Create app instance for Flask CLI
app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Create tables if they don't exist (for development)
        try:
            db.create_all()
            print("Database tables created successfully.")
        except Exception as e:
            print(f"Error creating database tables: {e}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)