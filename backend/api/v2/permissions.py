from django.http import HttpRequest

from rest_framework.permissions import SAFE_METHODS, BasePermission

from ..views import get_user_from_jwt


class IsAuthenticatedJWT(BasePermission):
    """JWT-based permission; allow anonymous read-only during migration."""

    def has_permission(self, request: HttpRequest, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        user = get_user_from_jwt(request)
        if user:
            request.user = user  # type: ignore[attr-defined]
            return True
        return False
