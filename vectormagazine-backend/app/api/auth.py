from flask import Blueprint, request, jsonify, make_response, current_app
from app import db
from app.models import User
from app.services.auth_service import AuthService
from functools import wraps

bp = Blueprint('auth', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        user_id = AuthService.decode_token(token)
        if not user_id:
            return jsonify({'error': 'Token is invalid or expired'}), 401
            
        current_user = User.query.get(user_id)
        if not current_user:
            return jsonify({'error': 'User not found'}), 401
            
        return f(current_user, *args, **kwargs)
    return decorated

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
        
    user = User.query.filter_by(email=data['email'].lower()).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    if not user.is_active:
        return jsonify({'error': 'Account is disabled'}), 403
        
    # Generate tokens
    access_token_expires = 3600 # 1 hour
    access_token = AuthService.generate_token(user.id, expires_in=access_token_expires)
    refresh_token = AuthService.generate_refresh_token(user.id)
    
    # Update last login
    user.last_login = datetime.datetime.utcnow()
    db.session.commit()
    
    response_data = {
        'access_token': access_token,
        'expires_in': access_token_expires,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'role': user.role.value,
            'is_active': user.is_active,
            'created_at': user.created_at.isoformat(),
            'last_login': user.last_login.isoformat() if user.last_login else None
        }
    }
    
    response = make_response(jsonify(response_data))
    
    # Set Refresh Token cookie (HTTP Only)
    response.set_cookie(
        'refresh_token',
        refresh_token,
        httponly=True,
        secure=current_app.config.get('SESSION_COOKIE_SECURE', False),
        samesite='Lax', # Or 'None' if cross-site
        max_age=30 * 24 * 3600
    )
    
    return response

@bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'message': 'Logged out'}))
    response.delete_cookie('refresh_token')
    return response

@bp.route('/refresh', methods=['POST'])
def refresh():
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token:
        # Frontend might try to access current user check on hard load
        return jsonify({'error': 'Refresh token missing'}), 401
        
    user_id = AuthService.decode_token(refresh_token)
    if not user_id:
        return jsonify({'error': 'Refresh token invalid'}), 401
        
    user = User.query.get(user_id)
    if not user or not user.is_active:
        return jsonify({'error': 'User invalid'}), 401
        
    # Generate new access token
    access_token_expires = 3600
    access_token = AuthService.generate_token(user.id, expires_in=access_token_expires)
    
    return jsonify({
        'access_token': access_token,
        'expires_in': access_token_expires
    })

@bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'name': current_user.name,
            'role': current_user.role.value,
            'is_active': current_user.is_active,
            'created_at': current_user.created_at.isoformat(),
            'last_login': current_user.last_login.isoformat() if current_user.last_login else None
        }
    })

@bp.route('/change-password', methods=['POST'])
@token_required
def change_password(current_user):
    data = request.json
    if not data or not data.get('current_password') or not data.get('new_password'):
        return jsonify({'error': 'Missing fields'}), 400
        
    if not current_user.check_password(data['current_password']):
        return jsonify({'error': 'Incorrect password'}), 401
    
    if len(data['new_password']) < 6:
        return jsonify({'error': 'Password too short'}), 400
        
    current_user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'})

import datetime
