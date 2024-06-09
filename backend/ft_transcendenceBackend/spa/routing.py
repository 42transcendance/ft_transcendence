from django.urls import path

from .consumers import chatConsumer
from .consumers import pongConsumer

websocket_urlpatterns = [
    path('ws/chat/', chatConsumer.chatConsumer.as_asgi()),
    path('ws/pong/', pongConsumer.pongConsumer.as_asgi()),
]
