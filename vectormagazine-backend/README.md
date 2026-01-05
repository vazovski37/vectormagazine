# Vector Magazine Backend

A production-ready Flask backend for Vector Magazine headless CMS.

## Features

- RESTful API for article management
- PostgreSQL database with JSONB support for Editor.js content
- File upload endpoint compatible with Editor.js image tool
- CORS enabled for Next.js frontend integration
- Database migrations with Flask-Migrate

## Setup

### Prerequisites

- Python 3.11+
- PostgreSQL database
- pip (Python package manager)

### Installation

1. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the database URL and secret key.

5. **Create the database:**
   ```bash
   createdb vectormagazine
   ```
   Or use your PostgreSQL client to create the database.

6. **Initialize the database:**
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

### Running the Server

**Development mode:**
```bash
python app.py
```

The server will run on `http://localhost:5000`

**Production mode:**
```bash
export FLASK_ENV=production
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

## API Endpoints

### Create Article
- **POST** `/api/articles`
- **Body:**
  ```json
  {
    "title": "Article Title",
    "description": "SEO description",
    "content": { /* Editor.js JSON blocks */ },
    "cover_image": "https://example.com/image.jpg"
  }
  ```

### List Articles
- **GET** `/api/articles`
- **Response:** Array of articles (id, title, description, cover_image, created_at)

### Get Article
- **GET** `/api/articles/<id>`
- **Response:** Full article details including content JSON

### Upload Image
- **POST** `/api/upload`
- **Form Data:** `image` (file)
- **Response:** Editor.js compatible format
  ```json
  {
    "success": 1,
    "file": {
      "url": "http://localhost:5000/static/uploads/filename.jpg"
    }
  }
  ```

## Database Models

### Article
- `id` (Integer, Primary Key)
- `title` (String, required)
- `description` (String, optional)
- `content` (JSONB, stores Editor.js blocks)
- `cover_image` (String, URL)
- `created_at` (DateTime)

## File Structure

```
vectormagazine-backend/
├── app.py              # Application entry point
├── config.py           # Configuration settings
├── models.py           # Database models
├── routes.py           # API routes
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
├── static/
│   └── uploads/       # Uploaded images directory
└── migrations/        # Database migrations (generated)
```

## Development

### Running Migrations

```bash
# Create a new migration
flask db migrate -m "Description of changes"

# Apply migrations
flask db upgrade

# Rollback last migration
flask db downgrade
```

### Testing

The API can be tested using tools like:
- Postman
- curl
- httpie
- Your Next.js frontend

Example curl commands:

```bash
# Create article
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Article", "description": "Test description"}'

# List articles
curl http://localhost:5000/api/articles

# Get article
curl http://localhost:5000/api/articles/1

# Upload image
curl -X POST http://localhost:5000/api/upload \
  -F "image=@/path/to/image.jpg"
```

## Production Considerations

1. **Change the SECRET_KEY** in production
2. **Use environment variables** for sensitive data
3. **Set up proper CORS** origins instead of allowing all
4. **Use a production WSGI server** like Gunicorn
5. **Set up proper file storage** (S3, Cloudinary, etc.) instead of local storage
6. **Add authentication/authorization** for API endpoints
7. **Set up logging** and monitoring
8. **Use HTTPS** in production
9. **Add rate limiting** to prevent abuse
10. **Implement proper error handling** and validation





