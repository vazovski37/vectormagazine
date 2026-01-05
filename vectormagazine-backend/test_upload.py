"""
Simple test script to verify the upload endpoint works
Run this after starting the Flask server
"""
import requests

def test_upload():
    url = 'http://127.0.0.1:5000/api/upload'
    
    # Create a simple test file
    files = {'image': ('test.txt', b'This is a test file', 'text/plain')}
    
    try:
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to backend server.")
        print("Make sure the Flask server is running on http://127.0.0.1:5000")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_upload()





