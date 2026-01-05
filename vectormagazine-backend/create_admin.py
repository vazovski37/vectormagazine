"""
Setup script to create initial admin user
Run this once after database migration to create the first admin account
"""

import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from models import db, User, UserRole


def create_admin_user(email, password, name):
    """Create an admin user if it doesn't exist"""
    app = create_app()
    
    with app.app_context():
        # Check if user already exists
        existing = User.query.filter_by(email=email.lower()).first()
        if existing:
            print(f"User with email {email} already exists.")
            return False
        
        # Create new admin user
        user = User(
            email=email.lower(),
            name=name,
            role=UserRole.ADMIN,
            is_active=True
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        print(f"Admin user created successfully!")
        print(f"  Email: {email}")
        print(f"  Name: {name}")
        print(f"  Role: admin")
        return True


if __name__ == '__main__':
    print("\n=== Vector Magazine Admin User Setup ===\n")
    
    # Default admin credentials (change in production!)
    default_email = os.environ.get('ADMIN_EMAIL', 'admin@vectormagazine.com')
    default_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    default_name = os.environ.get('ADMIN_NAME', 'Admin')
    
    # Interactive mode if no environment variables
    if len(sys.argv) > 1:
        if sys.argv[1] == '--interactive':
            email = input(f"Email [{default_email}]: ").strip() or default_email
            password = input("Password: ").strip()
            if not password:
                print("Password cannot be empty!")
                sys.exit(1)
            name = input(f"Name [{default_name}]: ").strip() or default_name
        else:
            email = sys.argv[1]
            password = sys.argv[2] if len(sys.argv) > 2 else default_password
            name = sys.argv[3] if len(sys.argv) > 3 else default_name
    else:
        email = default_email
        password = default_password
        name = default_name
    
    print(f"Creating admin user with email: {email}")
    
    # Validate password length
    if len(password) < 6:
        print("Error: Password must be at least 6 characters!")
        sys.exit(1)
    
    success = create_admin_user(email, password, name)
    
    if success:
        print("\n✓ You can now login to the admin panel!")
    else:
        print("\n! User already exists. Use the existing credentials to login.")
