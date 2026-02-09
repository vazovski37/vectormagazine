from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import uuid

bp = Blueprint('uploads', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@bp.route('', methods=['POST'])
def upload_file():
    try:
        if 'image' not in request.files:
            return jsonify({'success': 0, 'error': 'No file part'}), 400
            
        file = request.files['image']
        if file.filename == '':
            return jsonify({'success': 0, 'error': 'No selected file'}), 400
            
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add uuid to prevent overwrites
            name, ext = os.path.splitext(filename)
            filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
            
            upload_folder = current_app.config['UPLOAD_FOLDER']
            os.makedirs(upload_folder, exist_ok=True)
            
            file.save(os.path.join(upload_folder, filename))
            
            url = f"{request.host_url}static/uploads/{filename}"
            
            return jsonify({
                'success': 1,
                'file': {
                    'url': url
                }
            })
            
        return jsonify({'success': 0, 'error': 'File type not allowed'}), 400
    except Exception as e:
        current_app.logger.error(f"Upload Error: {str(e)}")
        return jsonify({'success': 0, 'error': f"Server Error: {str(e)}"}), 500
