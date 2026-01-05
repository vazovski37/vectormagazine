"""
Setup script for Vector Magazine Backend
Run this to verify your installation
"""
import sys
import subprocess

def check_python_version():
    """Check if Python version is 3.11+"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 11):
        print(f"❌ Python 3.11+ required. Current version: {version.major}.{version.minor}")
        return False
    print(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'flask',
        'flask_sqlalchemy',
        'flask_migrate',
        'flask_cors',
        'psycopg2'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package} installed")
        except ImportError:
            print(f"❌ {package} not installed")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    return True

def main():
    print("Vector Magazine Backend - Setup Verification\n")
    print("=" * 50)
    
    python_ok = check_python_version()
    deps_ok = check_dependencies()
    
    print("\n" + "=" * 50)
    if python_ok and deps_ok:
        print("✅ All checks passed! You're ready to go.")
        print("\nNext steps:")
        print("1. Set up your .env file (copy from .env.example)")
        print("2. Create your PostgreSQL database")
        print("3. Run: flask db init")
        print("4. Run: flask db migrate -m 'Initial migration'")
        print("5. Run: flask db upgrade")
        print("6. Run: python app.py")
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        sys.exit(1)

if __name__ == '__main__':
    main()





