# auth_app/apps.py
from django.apps import AppConfig
import threading
import time
import sys
import logging

class AuthAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'auth_app'
    
    def ready(self):
        """
        Register with Eureka when Django starts
        """
        # Setup basic logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        logger = logging.getLogger(__name__)
        
        # Only run if we're starting a server
        is_runserver = 'runserver' in sys.argv
        is_gunicorn = 'gunicorn' in sys.argv
        
        if is_runserver or is_gunicorn:
            logger.info("🚀 Django server starting - will register with Eureka")
            
            def register_eureka():
                """Background thread for Eureka registration"""
                thread_logger = logging.getLogger(__name__ + ".eureka_thread")
                
                # Wait for Django to be fully ready
                time.sleep(5)
                thread_logger.info("Attempting Eureka registration...")
                
                try:
                    # Import inside thread to avoid Django setup issues
                    from .eureka_service import EurekaService
                    
                    if EurekaService.register_with_eureka():
                        thread_logger.info("✅ Eureka registration successful!")
                    else:
                        thread_logger.error("❌ Eureka registration failed")
                        
                except Exception as e:
                    thread_logger.error(f"🔥 Eureka error: {e}", exc_info=True)
            
            # Start the registration thread
            thread = threading.Thread(target=register_eureka, daemon=True)
            thread.start()