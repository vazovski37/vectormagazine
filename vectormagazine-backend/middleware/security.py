"""
Security middleware for Vector Magazine API
Provides rate limiting, security headers, and input validation
"""

import os
import re
from functools import wraps
from flask import request, jsonify, current_app

# HTML/XSS sanitization
try:
    import bleach
    BLEACH_AVAILABLE = True
except ImportError:
    BLEACH_AVAILABLE = False


class SecurityConfig:
    """Security configuration constants"""
    
    # Rate limiting
    DEFAULT_RATE_LIMIT = "100 per minute"
    STRICT_RATE_LIMIT = "20 per minute"  # For write operations
    
    # Allowed HTML tags for content (Editor.js output)
    ALLOWED_TAGS = [
        'p', 'br', 'strong', 'em', 'u', 's', 'a', 'code', 
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'pre'
    ]
    ALLOWED_ATTRIBUTES = {
        'a': ['href', 'title', 'target'],
        '*': ['class']
    }
    
    # Input validation limits
    MAX_TITLE_LENGTH = 500
    MAX_DESCRIPTION_LENGTH = 1000
    MAX_CONTENT_BLOCKS = 100
    MAX_TAGS = 20
    
    # Security headers
    SECURITY_HEADERS = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }
    
    # CSP header (more restrictive for production)
    CSP_POLICY = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https: blob:; "
        "font-src 'self' data:; "
        "connect-src 'self' http://localhost:* http://127.0.0.1:*; "
        "frame-ancestors 'self';"
    )


def add_security_headers(response):
    """Add security headers to response"""
    for header, value in SecurityConfig.SECURITY_HEADERS.items():
        response.headers[header] = value
    
    # Add CSP header
    response.headers['Content-Security-Policy'] = SecurityConfig.CSP_POLICY
    
    return response


def sanitize_html(text):
    """Sanitize HTML content to prevent XSS"""
    if not text or not isinstance(text, str):
        return text
    
    if BLEACH_AVAILABLE:
        return bleach.clean(
            text,
            tags=SecurityConfig.ALLOWED_TAGS,
            attributes=SecurityConfig.ALLOWED_ATTRIBUTES,
            strip=True
        )
    return text


def sanitize_string(text, max_length=None):
    """Basic string sanitization"""
    if not text or not isinstance(text, str):
        return text
    
    # Remove null bytes and control characters
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    
    # Trim whitespace
    text = text.strip()
    
    # Enforce max length
    if max_length and len(text) > max_length:
        text = text[:max_length]
    
    return text


def validate_article_input(data):
    """Validate article input data"""
    errors = []
    
    if not data:
        return ['Request body is required']
    
    # Title validation
    title = data.get('title')
    if not title:
        errors.append('Title is required')
    elif len(title) > SecurityConfig.MAX_TITLE_LENGTH:
        errors.append(f'Title must be less than {SecurityConfig.MAX_TITLE_LENGTH} characters')
    
    # Description validation
    description = data.get('description')
    if description and len(description) > SecurityConfig.MAX_DESCRIPTION_LENGTH:
        errors.append(f'Description must be less than {SecurityConfig.MAX_DESCRIPTION_LENGTH} characters')
    
    # Content validation (Editor.js blocks)
    content = data.get('content')
    if content and isinstance(content, dict):
        blocks = content.get('blocks', [])
        if len(blocks) > SecurityConfig.MAX_CONTENT_BLOCKS:
            errors.append(f'Content cannot exceed {SecurityConfig.MAX_CONTENT_BLOCKS} blocks')
    
    # Tags validation
    tags = data.get('tags')
    if tags:
        if not isinstance(tags, list):
            errors.append('Tags must be an array')
        elif len(tags) > SecurityConfig.MAX_TAGS:
            errors.append(f'Cannot have more than {SecurityConfig.MAX_TAGS} tags')
    
    # Slug validation (alphanumeric, hyphens only)
    slug = data.get('slug')
    if slug and not re.match(r'^[a-z0-9-]+$', slug):
        errors.append('Slug can only contain lowercase letters, numbers, and hyphens')
    
    return errors


def sanitize_article_data(data):
    """Sanitize article input data"""
    if not data:
        return data
    
    sanitized = {}
    
    # Sanitize string fields
    string_fields = ['title', 'subtitle', 'description', 'slug', 
                     'meta_title', 'meta_description', 'cover_image', 'og_image']
    
    for field in string_fields:
        if field in data:
            max_len = SecurityConfig.MAX_TITLE_LENGTH if 'title' in field else SecurityConfig.MAX_DESCRIPTION_LENGTH
            sanitized[field] = sanitize_string(data[field], max_len)
    
    # Sanitize content blocks (preserve structure, sanitize text)
    if 'content' in data and isinstance(data['content'], dict):
        sanitized['content'] = sanitize_content_blocks(data['content'])
    
    # Sanitize tags
    if 'tags' in data and isinstance(data['tags'], list):
        sanitized['tags'] = [sanitize_string(tag, 50) for tag in data['tags'][:SecurityConfig.MAX_TAGS]]
    
    # Pass through other fields
    for key in ['category_id', 'author_id', 'status', 'read_time', 'published_at']:
        if key in data:
            sanitized[key] = data[key]
    
    return sanitized


def sanitize_content_blocks(content):
    """Sanitize Editor.js content blocks"""
    if not content or not isinstance(content, dict):
        return content
    
    sanitized_content = {
        'time': content.get('time'),
        'version': content.get('version'),
        'blocks': []
    }
    
    blocks = content.get('blocks', [])
    for block in blocks[:SecurityConfig.MAX_CONTENT_BLOCKS]:
        if not isinstance(block, dict):
            continue
            
        block_type = block.get('type')
        block_data = block.get('data', {})
        
        sanitized_block = {'type': block_type, 'data': {}}
        
        # Sanitize based on block type
        if block_type in ['paragraph', 'header', 'quote']:
            sanitized_block['data']['text'] = sanitize_html(block_data.get('text', ''))
            if 'level' in block_data:
                sanitized_block['data']['level'] = block_data['level']
            if 'caption' in block_data:
                sanitized_block['data']['caption'] = sanitize_html(block_data['caption'])
                
        elif block_type == 'list':
            sanitized_block['data']['style'] = block_data.get('style', 'unordered')
            sanitized_block['data']['items'] = [
                sanitize_html(item) if isinstance(item, str) else item
                for item in block_data.get('items', [])
            ]
            
        elif block_type == 'image':
            # Only allow specific image properties
            sanitized_block['data'] = {
                'url': sanitize_string(block_data.get('url', ''), 500),
                'caption': sanitize_html(block_data.get('caption', '')),
                'withBorder': bool(block_data.get('withBorder')),
                'withBackground': bool(block_data.get('withBackground')),
                'stretched': bool(block_data.get('stretched'))
            }
            if 'file' in block_data:
                sanitized_block['data']['file'] = {
                    'url': sanitize_string(block_data['file'].get('url', ''), 500)
                }
                
        elif block_type == 'code':
            sanitized_block['data']['code'] = block_data.get('code', '')
            
        elif block_type == 'delimiter':
            pass  # No data to sanitize
            
        else:
            # For unknown block types, pass through with basic sanitization
            sanitized_block['data'] = block_data
        
        sanitized_content['blocks'].append(sanitized_block)
    
    return sanitized_content


def get_cors_origins():
    """Get allowed CORS origins based on environment"""
    env = os.environ.get('FLASK_ENV', 'development')
    
    if env == 'production':
        # In production, use specific origins from environment
        origins = os.environ.get('CORS_ORIGINS', '')
        if origins:
            return [o.strip() for o in origins.split(',')]
        return ['https://vectormagazine.com']  # Default production origin
    
    # Development - allow localhost origins
    # Note: When using credentials, wildcard (*) is NOT allowed
    return [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
    ]
