"""
ASGI config for ft_transcendenceBackend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator


from spa.routing import websocket_urlpatterns


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ft_transcendenceBackend.settings')

django_asgi_app = get_asgi_application()

import spa.routing

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        'websocket':AuthMiddlewareStack(
            URLRouter(
                spa.routing.websocket_urlpatterns
            )
        )
    }
)