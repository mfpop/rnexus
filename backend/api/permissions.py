from django.http import HttpRequest

from rest_framework.permissions import SAFE_METHODS, BasePermission

from .views import get_user_from_jwt


class IsAuthenticatedJWT(BasePermission):
    """Simple DRF permission that authenticates using our existing JWT helper.

    During migration, allow anonymous read-only (GET/HEAD/OPTIONS) requests.
    """

    def has_permission(self, request: HttpRequest, view) -> bool:
        if request.method in SAFE_METHODS:
            return True
        user = get_user_from_jwt(request)
        if user:
            request.user = user  # type: ignore
            return True
        return False
