import os
from dotenv import load_dotenv

# Load env before importing app
load_dotenv()

from app import create_app, db
from app.models import User, Article, Category, UserRole, ArticleStatus

app = create_app(os.getenv('FLASK_CONFIG') or 'default')

@app.shell_context_processor
def make_shell_context():
    return dict(db=db, User=User, Article=Article, Category=Category, 
                UserRole=UserRole, ArticleStatus=ArticleStatus)

if __name__ == '__main__':
    app.run(debug=True)
