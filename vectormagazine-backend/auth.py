"""
Authentication module for Vector Magazine Admin
Implements JWT-based authentication with secure refresh tokens
"""

import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Blueprint, request, jsonify, current_app, make_response
from models import db, User, UserRole

auth = Blueprint('auth', __name__, url_prefix='/api/auth')

# Configuration
ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)
REFRESH_TOKEN_EXPIRES = timedelta(days=7)
JWT_ALGORITHM = 'HS256'


def get_secret_key():
    """Get JWT secret key from environment or config"""
    return os.environ.get('JWT_SECRET_KEY') or current_app.config.get('SECRET_KEY')


def create_access_token(user_id, role):
    """Create a short-lived access token"""
    payload = {
        'user_id': user_id,
        'role': role,
        'type': 'access',
        'exp': datetime.utcnow() + ACCESS_TOKEN_EXPIRES,
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, get_secret_key(), algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id):
    """Create a long-lived refresh token"""
    payload = {
        'user_id': user_id,
        'type': 'refresh',
        'exp': datetime.utcnow() + REFRESH_TOKEN_EXPIRES,
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, get_secret_key(), algorithm=JWT_ALGORITHM)


def verify_token(token, token_type='access'):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(token, get_secret_key(), algorithms=[JWT_ALGORITHM])
        if payload.get('type') != token_type:
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def require_auth(f):
    """Decorator to require authentication for routes"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Authorization header required'}), 401
        
        # Expect "Bearer <token>"
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'error': 'Invalid authorization header format'}), 401
        
        token = parts[1]
        payload = verify_token(token, 'access')
        
        if not payload:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Add user info to request context
        request.user_id = payload.get('user_id')
        request.user_role = payload.get('role')
        
        return f(*args, **kwargs)
    
    return decorated


def require_admin(f):
    """Decorator to require admin role"""
    @wraps(f)
    @require_auth
    def decorated(*args, **kwargs):
        if request.user_role != UserRole.ADMIN.value:
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    
    return decorated


@auth.route('/login', methods=['POST'])
def login():
    """Authenticate user and return tokens"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body required'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            # Generic error to prevent user enumeration
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is disabled'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(user.id, user.role.value)
        refresh_token = create_refresh_token(user.id)
        
        # Create response with HTTP-only cookie for refresh token
        response = make_response(jsonify({
            'access_token': access_token,
            'user': user.to_dict(),
            'expires_in': int(ACCESS_TOKEN_EXPIRES.total_seconds())
        }))
        
        response.set_cookie(
            'refresh_token',
            refresh_token,
            httponly=True,
            secure=False, # Force False for debugging
            samesite='Lax',
            max_age=int(REFRESH_TOKEN_EXPIRES.total_seconds()),
            path='/'
        )
        
        current_app.logger.info(f'User logged in: {email}')
        return response
        
    except Exception as e:
        current_app.logger.error(f'Login error: {str(e)}')
        return jsonify({'error': 'Login failed'}), 500


@auth.route('/logout', methods=['POST'])
def logout():
    """Clear refresh token cookie"""
    response = make_response(jsonify({'message': 'Logged out successfully'}))
    response.delete_cookie('refresh_token', path='/')
    return response


@auth.route('/refresh', methods=['POST'])
def refresh():
    """Get new access token using refresh token"""
    try:
        refresh_token = request.cookies.get('refresh_token')
        
        if not refresh_token:
            return jsonify({'error': 'Refresh token required'}), 401
        
        payload = verify_token(refresh_token, 'refresh')
        
        if not payload:
            return jsonify({'error': 'Invalid or expired refresh token'}), 401
        
        user_id = payload.get('user_id')
        user = User.query.get(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'User not found or disabled'}), 401
        
        # Create new access token
        access_token = create_access_token(user.id, user.role.value)
        
        return jsonify({
            'access_token': access_token,
            'expires_in': int(ACCESS_TOKEN_EXPIRES.total_seconds())
        })
        
    except Exception as e:
        current_app.logger.error(f'Token refresh error: {str(e)}')
        return jsonify({'error': 'Token refresh failed'}), 500


@auth.route('/me', methods=['GET'])
@require_auth
def get_current_user():
    """Get current authenticated user info"""
    try:
        user = User.query.get(request.user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()})
        
    except Exception as e:
        current_app.logger.error(f'Get user error: {str(e)}')
        return jsonify({'error': 'Failed to get user info'}), 500


@auth.route('/change-password', methods=['POST'])
@require_auth
def change_password():
    """Change current user's password"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Request body required'}), 400
        
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')
        
        if not current_password or not new_password:
            return jsonify({'error': 'Current and new password required'}), 400
        
        if len(new_password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters'}), 400
        
        user = User.query.get(request.user_id)
        
        if not user or not user.check_password(current_password):
            return jsonify({'error': 'Invalid current password'}), 401
        
        user.set_password(new_password)
        db.session.commit()
        
        current_app.logger.info(f'Password changed for user: {user.email}')
        return jsonify({'message': 'Password changed successfully'})
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f'Change password error: {str(e)}')
        return jsonify({'error': 'Failed to change password'}), 500
