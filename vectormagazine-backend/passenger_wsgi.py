import sys
import os
import traceback

# Add the current directory to sys.path
sys.path.insert(0, os.path.dirname(__file__))

try:
    # Try to import the application
    from app import app as application
except Exception as e:
    # If it fails, create a dummy app that prints the error
    def application(environ, start_response):
        start_response('200 OK', [('Content-Type', 'text/plain')])
        error_msg = f"STARTUP ERROR:\n{traceback.format_exc()}"
        return [error_msg.encode()]
