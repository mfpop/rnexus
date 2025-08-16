import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from typing import Optional
import datetime

class SystemMessageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get token from query string
        query_string = self.scope['query_string'].decode()
        query_params = {}
        if query_string:
            for param in query_string.split('&'):
                if '=' in param:
                    key, value = param.split('=', 1)
                    query_params[key] = value
        
        token = query_params.get('token')
        
        # For now, accept any connection with a token (you can add proper JWT validation later)
        if token:
            # Create a mock authenticated user for now
            # In production, you would validate the JWT token here
            class MockUser:
                def __init__(self):
                    self.id = 'anonymous'
                    self.is_authenticated = True
            
            self.user = MockUser()
            self.user_group_name = f'user_{self.user.id}'
            if self.channel_layer:
                await self.channel_layer.group_add(
                    self.user_group_name,
                    self.channel_name
                )
            await self.accept()
            print(f"SystemMessageConsumer connected with token: {token[:10]}...")
        else:
            await self.close()
            print("SystemMessageConsumer rejected: no token provided")

    async def disconnect(self, close_code):
        if hasattr(self, 'user') and self.user.is_authenticated and self.channel_layer:
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        # System messages are one-way (server to client), so no receive logic needed for now
        pass

    async def send_system_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': 'system_message',
            'message': message
        }))

    @database_sync_to_async
    def get_user(self, user_id):
        User = get_user_model()
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None

class TestConsumer(AsyncWebsocketConsumer):
    """Simple test consumer for WebSocket testing"""
    
    async def connect(self):
        await self.accept()
        print("Test consumer connected!")

    async def disconnect(self, close_code):
        print(f"Test consumer disconnected with code: {close_code}")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print(f"Received: {data}")
            
            # Echo back the message
            response = {
                'type': 'echo',
                'message': f"Echo: {data.get('message', 'No message')}",
                'timestamp': str(datetime.datetime.now())
            }
            await self.send(text_data=json.dumps(response))
            
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
