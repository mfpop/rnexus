import json
from urllib.parse import parse_qs

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.utils import timezone
from django.utils.deprecation import MiddlewareMixin
from django.utils.functional import SimpleLazyObject

import jwt
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.middleware import BaseMiddleware

User = get_user_model()


def get_user_jwt(request):
    """
    Get user from JWT token in Authorization header
    """
    print(f"DEBUG: JWT Middleware - get_user_jwt called for {request.path}")
    user = None
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")

    print(f"DEBUG: JWT Middleware - Auth header: {auth_header}")

    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        print(f"DEBUG: JWT Middleware - Token: {token[:20]}...")

        try:
            # For now, we'll use a simple approach - you might want to implement proper JWT validation
            # This is a temporary solution to get the system working
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            print(f"DEBUG: JWT Middleware - Payload: {payload}")
            print(f"DEBUG: JWT Middleware - Current time: {timezone.now()}")
            print(f"DEBUG: JWT Middleware - Token exp: {payload.get('exp')}")

            user_id = payload.get("user_id")
            if user_id:
                user = User.objects.get(id=user_id)
                print(f"DEBUG: JWT Middleware - User found: {user.username}")
            else:
                print(f"DEBUG: JWT Middleware - No user_id in payload")
        except (jwt.InvalidTokenError, User.DoesNotExist) as e:
            print(f"DEBUG: JWT Middleware - Error: {e}")
            print(f"DEBUG: JWT Middleware - Error type: {type(e)}")
            pass

    fallback_user = AnonymousUser()
    result = user or fallback_user

    # Safely get username for logging
    if result and hasattr(result, "username") and result.username:
        username = result.username
    elif isinstance(result, AnonymousUser):
        username = "Anonymous"
    else:
        username = "None"

    print(f"DEBUG: JWT Middleware - Final user: {username}")
    return result


class JWTAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware to handle JWT authentication alongside session authentication
    """

    def process_request(self, request):
        print(f"DEBUG: JWT Middleware - process_request called for {request.path}")
        print(f"DEBUG: JWT Middleware - request.META keys: {list(request.META.keys())}")

        # Check if there's a JWT token in the Authorization header
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            # Only process JWT authentication if we have a Bearer token
            user = get_user_jwt(request)
            request.user = user
            print(
                f"DEBUG: JWT Middleware - Set request.user to: {user.username if hasattr(user, 'username') else 'Anonymous'}"
            )
        else:
            print(f"DEBUG: JWT Middleware - No Bearer token, skipping JWT auth")

        print(f"DEBUG: JWT Middleware - process_request completed for {request.path}")

    def process_view(self, request, view_func, view_args, view_kwargs):
        """
        Ensure request.user is set correctly before the view is called
        """
        print(f"DEBUG: JWT Middleware - process_view called for {request.path}")
        print(f"DEBUG: JWT Middleware - request.user before view: {request.user}")
        print(f"DEBUG: JWT Middleware - request.user type: {type(request.user)}")

        # Check if there's a JWT token and ensure the user is set
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            # Re-check and set user if needed
            user = get_user_jwt(request)
            if user and not isinstance(user, AnonymousUser):
                request.user = user
                print(
                    f"DEBUG: JWT Middleware - Re-set request.user to: {user.username}"
                )

        print(f"DEBUG: JWT Middleware - request.user after view setup: {request.user}")
        print(f"DEBUG: JWT Middleware - process_view completed for {request.path}")
        return None


# WebSocket authentication middleware
class WebSocketAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Get the token from query parameters
        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)
        token = query_params.get("token", [None])[0]

        if token:
            try:
                # Validate the token and get user
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = payload.get("user_id")
                if user_id:
                    scope["user"] = await self.get_user(user_id)
                else:
                    scope["user"] = AnonymousUser()
            except (jwt.InvalidTokenError, User.DoesNotExist):
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

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
