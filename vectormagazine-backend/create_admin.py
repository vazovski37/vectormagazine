import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app import create_app, db
from app.models import User, UserRole

def create_admin_user(email=None, password=None, name=None):
    """
    Creates or updates an admin user.
    """
    app = create_app()
    with app.app_context():
        # Get credentials from args or env or defaults
        email = email or os.environ.get('ADMIN_EMAIL', 'giorgi@vectormagazine.com')
        password = password or os.environ.get('ADMIN_PASSWORD', 'giorgigiorgi')
        name = name or os.environ.get('ADMIN_NAME', 'Admin')

        print(f"Checking for user: {email}")
        user = User.query.filter_by(email=email).first()

        if user:
            print(f"User {email} already exists. Updating...")
            user.name = name
            user.role = UserRole.ADMIN
            user.is_active = True
        else:
            print(f"Creating new admin user: {email}")
            user = User(
                email=email,
                name=name,
                role=UserRole.ADMIN,
                is_active=True
            )
            db.session.add(user)

        user.set_password(password)
        try:
            db.session.commit()
            print(f"Successfully configured admin user: {email}")
            print("You can now log in to the admin panel.")
        except Exception as e:
            print(f"Error creating admin user: {e}")
            db.session.rollback()

if __name__ == "__main__":
    # check for command line args
    import argparse
    parser = argparse.ArgumentParser(description='Create Admin User')
    parser.add_argument('--email', help='Admin Email')
    parser.add_argument('--password', help='Admin Password')
    parser.add_argument('--name', help='Admin Name')
    
    args = parser.parse_args()
    
    create_admin_user(args.email, args.password, args.name)
