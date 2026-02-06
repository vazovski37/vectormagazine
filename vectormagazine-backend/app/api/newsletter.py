from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import Subscriber
from sqlalchemy.exc import IntegrityError
import re

bp = Blueprint('newsletter', __name__)

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@bp.route('/', methods=['GET'])
def get_subscribers():
    page = request.args.get('page', 1, type=int)
    per_page = 20
    
    query = Subscriber.query.order_by(Subscriber.created_at.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'subscribers': [s.to_dict() for s in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@bp.route('/', methods=['POST'])
def add_subscriber():
    data = request.json
    email = data.get('email')
    
    if not email or not is_valid_email(email):
        return jsonify({'error': 'Invalid email address'}), 400
        
    if Subscriber.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already subscribed'}), 400
        
    subscriber = Subscriber(email=email)
    db.session.add(subscriber)
    db.session.commit()
    
    return jsonify(subscriber.to_dict()), 201

@bp.route('/<int:id>', methods=['DELETE'])
def delete_subscriber(id):
    subscriber = Subscriber.query.get_or_404(id)
    db.session.delete(subscriber)
    db.session.commit()
    return jsonify({'message': 'Subscriber removed'})
