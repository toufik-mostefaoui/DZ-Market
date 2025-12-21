# auth_app/eureka_service.py
import py_eureka_client.eureka_client as eureka_client
import socket
import logging

# Initialize logger at module level
logger = logging.getLogger(__name__)

class EurekaService:
    @staticmethod
    def register_with_eureka():
        """Register with Eureka server"""
        try:
            # DON'T import settings at module level - import HERE
            from django.conf import settings
            
            # Get configuration
            eureka_server = settings.EUREKA_SERVER
            app_name = settings.SERVICE_NAME.lower()  # Force lowercase
            instance_port = settings.SERVICE_PORT
            
            # Get actual host IP
            instance_host = socket.gethostname()
            instance_ip = socket.gethostbyname(instance_host)
            
            # Build URLs
            home_page_url = f"http://{instance_ip}:{instance_port}/"
            health_check_url = f"http://{instance_ip}:{instance_port}/health"
            status_page_url = f"http://{instance_ip}:{instance_port}/info"
            
            logger.info(f"Registering {app_name} on {instance_ip}:{instance_port}")
            
            # Eureka registration - use Spring-compatible format
            eureka_client.init(
                eureka_server=eureka_server,
                app_name=app_name,
                instance_port=instance_port,
                instance_host=instance_host,
                instance_ip=instance_ip,
                home_page_url=home_page_url,
                health_check_url=health_check_url,
                status_page_url=status_page_url,
                renewal_interval_in_secs=10,
                duration_in_secs=30,
                metadata={
                    "management.port": str(instance_port),
                    "securePortEnabled": "false"
                }
            )
            
            logger.info(f"✅ Service {app_name} registered successfully with Eureka")
            return True
            
        except Exception as e:
            logger.error(f"❌ Eureka registration failed: {str(e)}", exc_info=True)
            return False
    
    @staticmethod
    def deregister_from_eureka():
        try:
            eureka_client.stop()
            logger.info("Service deregistered from Eureka")
        except Exception as e:
            logger.error(f"Failed to deregister: {str(e)}")