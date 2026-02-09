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
            current_app.logger.warning("REVALIDATION_SECRET not set, skipping ISR")
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
                current_app.logger.info(f"ISR Success: Revalidated {path}")
                return True
            else:
                current_app.logger.error(f"ISR Error for {path}: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            current_app.logger.exception(f"ISR Exception for {path}: {str(e)}")
            return False
