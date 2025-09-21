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
    user = None
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")

    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            # For now, we'll use a simple approach - you might want to implement proper JWT validation
            # This is a temporary solution to get the system working
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            if user_id:
                user = User.objects.get(id=user_id)
        except (jwt.InvalidTokenError, User.DoesNotExist) as e:
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

    return result


class JWTAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware to handle JWT authentication alongside session authentication
    """

    def process_request(self, request):
        # Skip JWT processing for admin URLs to allow Django session auth
        if request.path.startswith("/admin/") or request.path.startswith("/accounts/"):
            return

        # Check if there's a JWT token in the Authorization header
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            # Only process JWT authentication if we have a Bearer token
            user = get_user_jwt(request)
            request.user = user
        else:
            # No Bearer token, skip JWT auth
            pass

    def process_view(self, request, view_func, view_args, view_kwargs):
        """
        Ensure request.user is set correctly before the view is called
        """
        # Skip JWT processing for admin URLs to allow Django session auth
        if request.path.startswith("/admin/") or request.path.startswith("/accounts/"):
            return None

        # Check if there's a JWT token and ensure the user is set
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            # Re-check and set user if needed
            user = get_user_jwt(request)
            if user and not isinstance(user, AnonymousUser):
                request.user = user

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
