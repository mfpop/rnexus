from functools import wraps

from django.contrib.auth.models import AnonymousUser
from django.http import JsonResponse


def jwt_login_required(view_func):
    """
    Custom decorator that checks if user is authenticated via JWT or session
    This works with our JWTAuthenticationMiddleware
    """

    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Check if user is authenticated (either via JWT or session)
        if request.user and not isinstance(request.user, AnonymousUser):
            return view_func(request, *args, **kwargs)
        else:
            # Return JSON error instead of redirecting
            return JsonResponse(
                {
                    "success": False,
                    "error": "Authentication required",
                    "code": "AUTH_REQUIRED",
                },
                status=401,
            )

    return wrapper
