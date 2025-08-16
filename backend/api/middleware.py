import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from django.utils.functional import SimpleLazyObject
from django.contrib.auth.middleware import get_user
from django.utils.deprecation import MiddlewareMixin
import jwt
from django.conf import settings

User = get_user_model()

def get_user_jwt(request):
    """
    Get user from JWT token in Authorization header
    """
    user = None
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    
    print(f"DEBUG: JWT Middleware - Auth header: {auth_header}")
    
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        print(f"DEBUG: JWT Middleware - Token: {token[:20]}...")
        
        try:
            # For now, we'll use a simple approach - you might want to implement proper JWT validation
            # This is a temporary solution to get the system working
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            print(f"DEBUG: JWT Middleware - Payload: {payload}")
            
            user_id = payload.get('user_id')
            if user_id:
                user = User.objects.get(id=user_id)
                print(f"DEBUG: JWT Middleware - User found: {user.username}")
            else:
                print(f"DEBUG: JWT Middleware - No user_id in payload")
        except (jwt.InvalidTokenError, User.DoesNotExist) as e:
            print(f"DEBUG: JWT Middleware - Error: {e}")
            pass
    
    fallback_user = get_user(request)
    result = user or fallback_user
    print(f"DEBUG: JWT Middleware - Final user: {result.username if result else 'Anonymous'}")
    return result

class JWTAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware to handle JWT authentication alongside session authentication
    """
    
    def process_request(self, request):
        request.user = SimpleLazyObject(lambda: get_user_jwt(request))

# WebSocket authentication middleware
class WebSocketAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Get the token from query parameters
        query_string = scope.get('query_string', b'').decode()
        query_params = parse_qs(query_string)
        token = query_params.get('token', [None])[0]
        
        if token:
            try:
                # Validate the token and get user
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = payload.get('user_id')
                if user_id:
                    scope['user'] = await self.get_user(user_id)
                else:
                    scope['user'] = AnonymousUser()
            except (jwt.InvalidTokenError, User.DoesNotExist):
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        
        # Continue the WebSocket connection
        return await super().__call__(scope, receive, send)
    
    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

# Apply the WebSocket auth middleware
def WebSocketAuthMiddlewareStack(inner):
    return WebSocketAuthMiddleware(AuthMiddlewareStack(inner))
