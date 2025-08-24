from django.http import HttpRequest

from rest_framework.permissions import BasePermission

from .views import get_user_from_jwt


class IsAuthenticatedJWT(BasePermission):
    """Simple DRF permission that authenticates using our existing JWT helper."""

    def has_permission(self, request: HttpRequest, view) -> bool:
        user = get_user_from_jwt(request)
        if user:
            request.user = user  # type: ignore
            return True
        return False
