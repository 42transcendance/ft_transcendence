from django.urls import re_path

from .consumers import chatConsumer
from .consumers import pongConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/', chatConsumer.chatConsumer.as_asgi()),
    re_path(r'ws/pong/', pongConsumer.pongConsumer.as_asgi()),
]
