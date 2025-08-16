from functools import wraps
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser

def jwt_login_required(view_func):
    """
    Custom decorator that checks if user is authenticated via JWT or session
    This works with our JWTAuthenticationMiddleware
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        print(f"DEBUG: jwt_login_required - User: {request.user}")
        print(f"DEBUG: jwt_login_required - User type: {type(request.user)}")
        print(f"DEBUG: jwt_login_required - Is AnonymousUser: {isinstance(request.user, AnonymousUser)}")
        print(f"DEBUG: jwt_login_required - Auth header: {request.META.get('HTTP_AUTHORIZATION', 'None')}")
        
        # Check if user is authenticated (either via JWT or session)
        if request.user and not isinstance(request.user, AnonymousUser):
            print(f"DEBUG: jwt_login_required - User authenticated: {request.user.username}")
            return view_func(request, *args, **kwargs)
        else:
            print(f"DEBUG: jwt_login_required - User not authenticated, rejecting")
            # Return JSON error instead of redirecting
            return JsonResponse({
                'success': False,
                'error': 'Authentication required',
                'code': 'AUTH_REQUIRED'
            }, status=401)
    
    return wrapper
