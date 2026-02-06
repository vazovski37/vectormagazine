from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from sqlalchemy import text, inspect

app = create_app()

with app.app_context():
    print(f"Using DB: {app.config['SQLALCHEMY_DATABASE_URI']}")
    try:
        inspector = inspect(db.engine)
        print("Tables:", inspector.get_table_names())
        
        with db.engine.connect() as conn:
            # Check for index in Postgres
            result = conn.execute(text("SELECT indexname, tablename FROM pg_indexes WHERE indexname = 'ix_subscribers_email'"))
            row = result.fetchone()
            print("Index ix_subscribers_email found:", row)
             
    except Exception as e:
        print(f"Error: {e}")
