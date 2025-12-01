import py_eureka_client.eureka_client as eureka_client
from django.conf import settings

def register_eureka():
    eureka_client.init(
        eureka_server=settings.EUREKA_SERVER,
        app_name=settings.SERVICE_NAME,
        instance_port=settings.SERVICE_PORT,
    )
