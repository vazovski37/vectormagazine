import jwt
import datetime
from flask import current_app
from app.models import User

class AuthService:
    
    @staticmethod
    def generate_token(user_id, expires_in=3600):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in),
                'iat': datetime.datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return None

    @staticmethod
    def decode_token(token):
        try:
            payload = jwt.decode(token, current_app.config.get('SECRET_KEY'), algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
            
    @staticmethod
    def generate_refresh_token(user_id):
        # Refresh tokens last longer (e.g., 30 days)
        return AuthService.generate_token(user_id, expires_in=30 * 24 * 3600)
