"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt

from api import views
from api.v2.routers import urlpatterns as api_v2_router_urls

urlpatterns = [
    path("admin/", admin.site.urls),
    # GraphQL endpoint
    path(
        "graphql/",
        csrf_exempt(views.simple_graphql_view),
        name="graphql",
    ),
    # Django default auth endpoints (for redirects)
    path("accounts/login/", views.django_login_view, name="django_login"),
    # Authentication endpoints
    path("api/login/", views.login_view, name="api_login"),
    path("api/logout/", views.logout_view, name="api_logout"),
    path("api/register/", views.register_view, name="api_register"),
    path(
        "api/auth/user/", views.user_info_view, name="api_auth_user"
    ),  # Frontend expects this
    path(
        "api/user/info/", views.user_info_view, name="api_user_info"
    ),  # Keep for backward compatibility
    path("api/user/profile/", csrf_exempt(views.profile_view), name="api_profile"),
    path(
        "api/user/profile/update/",
        csrf_exempt(views.profile_update_view),
        name="api_profile_update",
    ),
    path("api/test-csrf/", views.test_csrf_view, name="test_csrf"),
    path(
        "api/user/profile/download-cv/", views.download_cv_view, name="api_download_cv"
    ),
    path(
        "api/user/change-password/",
        views.change_password_view,
        name="api_change_password",
    ),
    # Health and meta
    path("api/health/", views.healthcheck_view, name="api_health"),
    path("api/version/", views.version_view, name="api_version"),
    # Chat API endpoints
    path("api/chat/", views.chat_list_view, name="api_chat_list"),
    path(
        "api/chat/<str:chat_id>/messages/",
        views.chat_messages_view,
        name="api_chat_messages",
    ),
    path(
        "api/message/<int:message_id>/status/",
        views.message_status_view,
        name="api_message_status",
    ),
    path(
        "api/message/<int:message_id>/",
        views.message_delete_view,
        name="api_message_delete",
    ),
    path("api/chat/search/", views.chat_search_view, name="api_chat_search"),
    # Update API endpoints
    path("api/updates/", views.update_list_view, name="api_update_list"),
    path(
        "api/updates/<str:update_id>/",
        views.update_detail_view,
        name="api_update_detail",
    ),
    path(
        "api/updates/<str:update_id>/status/",
        views.update_status_view,
        name="api_update_status",
    ),
    path("api/updates/search/", views.update_search_view, name="api_update_search"),
    # Update CRUD operations
    path("api/updates/create/", views.update_create_view, name="api_update_create"),
    path(
        "api/updates/<str:update_id>/edit/",
        views.update_edit_view,
        name="api_update_edit",
    ),
    path(
        "api/updates/<str:update_id>/delete/",
        views.update_delete_view,
        name="api_update_delete",
    ),
    # Tag management endpoints
    path("api/tags/", views.tags_list_view, name="api_tags_list"),
    path("api/tags/create/", views.tag_create_view, name="api_tag_create"),
    path("api/tags/<int:tag_id>/", views.tag_detail_view, name="api_tag_detail"),
    # System message endpoints
    # Update likes/dislikes
    path(
        "api/updates/<str:update_id>/like/",
        views.update_like_view,
        name="api_update_like",
    ),
    # Update comments
    path(
        "api/updates/<str:update_id>/comments/",
        views.comment_list_view,
        name="api_comment_list",
    ),
    path(
        "api/updates/<str:update_id>/comments/create/",
        views.comment_create_view,
        name="api_comment_create",
    ),
    path(
        "api/comments/<int:comment_id>/edit/",
        views.comment_edit_view,
        name="api_comment_edit",
    ),
    path(
        "api/comments/<int:comment_id>/delete/",
        views.comment_delete_view,
        name="api_comment_delete",
    ),
    # WebSocket endpoints
    path("ws/test/", views.websocket_test_view, name="websocket_test"),
    # Activities API endpoints
    path("api/activities/", views.activity_list_view, name="api_activities_list"),
    path(
        "api/activities/<str:activity_id>/",
        views.activity_detail_view,
        name="api_activity_detail",
    ),
    path(
        "api/activities/<str:activity_id>/start/",
        views.activity_start_view,
        name="api_activity_start",
    ),
    path(
        "api/activities/<str:activity_id>/pause/",
        views.activity_pause_view,
        name="api_activity_pause",
    ),
    # DRF v2 router endpoints (clean namespace during migration)
    path("api/v2/", include((api_v2_router_urls, "api-v2"), namespace="api-v2-router")),
    # Include API app URLs
    path("api/", include("api.urls")),
]

# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # Serve media files during development
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
