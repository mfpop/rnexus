from django.urls import include, path

from rest_framework.routers import DefaultRouter

from .viewsets import ActivityViewSet

router = DefaultRouter()
router.register(r"activities", ActivityViewSet, basename="activity")

urlpatterns = [
    path("", include(router.urls)),
]
