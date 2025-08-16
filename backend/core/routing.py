from django.urls import re_path

from api import consumers

websocket_urlpatterns = [
    re_path(r'ws/system_messages/', consumers.SystemMessageConsumer.as_asgi()),
    re_path(r'ws/test/', consumers.TestConsumer.as_asgi()),
]
