from dotenv import load_dotenv
load_dotenv()

from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        print(f"Using DB: {app.config['SQLALCHEMY_DATABASE_URI']}")
        print("Dropping subscribers table if exists...")
        with db.engine.connect() as connection:
            connection.execute(text("DROP INDEX IF EXISTS ix_subscribers_email"))
            connection.execute(text("DROP TABLE IF EXISTS subscribers CASCADE"))
            connection.commit()
        print("Success.")
    except Exception as e:
        print(f"Error: {e}")
