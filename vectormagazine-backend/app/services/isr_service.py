import requests
from flask import current_app

class ISRService:
    
    @staticmethod
    def revalidate(path):
        """
        Trigger on-demand revalidation for a specific path in Next.js
        """
        frontend_url = current_app.config.get('FRONTEND_URL') or 'http://localhost:3000'
        secret = current_app.config.get('REVALIDATION_SECRET')
        
        if not secret:
            print("Warning: REVALIDATION_SECRET not set, skipping ISR")
            return False
            
        try:
            # Next.js API route: /api/revalidate?secret=<token>&path=<path>
            url = f"{frontend_url}/api/revalidate"
            params = {
                'secret': secret,
                'path': path
            }
            
            response = requests.post(url, params=params, timeout=5)
            
            if response.status_code == 200:
                return True
            else:
                print(f"ISR Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"ISR Exception: {str(e)}")
            return False
