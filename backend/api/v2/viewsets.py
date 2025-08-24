from datetime import datetime

from django.shortcuts import get_object_or_404

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import Activity
from ..serializers import ActivitySerializer
from .permissions import IsAuthenticatedJWT


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticatedJWT]

    def get_queryset(self):  # type: ignore[override]
        qs = Activity.objects.all().order_by("-created_at")  # type: ignore[attr-defined]
        return qs

    def perform_create(self, serializer):
        user = self.request.user  # set by permission
        serializer.save(created_by=user)

    def update(self, request, *args, **kwargs):
        data = request.data.copy()
        for field in ("start_time", "end_time"):
            if field in data and isinstance(data[field], str):
                try:
                    data[field] = datetime.fromisoformat(
                        data[field].replace("Z", "+00:00")
                    )
                except Exception:
                    pass
        request._full_data = data  # type: ignore[attr-defined]
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def start(self, request, pk=None):
        activity = get_object_or_404(Activity, pk=pk)
        if activity.status == "completed":
            return Response(
                {"success": False, "error": "Cannot start a completed activity"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if activity.status == "in-progress":
            return Response(
                {"success": False, "error": "Activity is already in progress"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        activity.status = "in-progress"
        activity.progress = max(activity.progress, 10)
        activity.save()
        return Response(
            {"success": True, "activity": ActivitySerializer(activity).data}
        )

    @action(detail=True, methods=["post"])
    def pause(self, request, pk=None):
        activity = get_object_or_404(Activity, pk=pk)
        if activity.status != "in-progress":
            return Response(
                {
                    "success": False,
                    "error": "Can only pause activities that are in progress",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        activity.status = "planned"
        activity.save()
        return Response(
            {"success": True, "activity": ActivitySerializer(activity).data}
        )
