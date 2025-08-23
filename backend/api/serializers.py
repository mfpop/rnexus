from django.contrib.auth.models import User

from rest_framework import serializers

from .models import Activity, ActivityPriority, ActivityStatus


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email"]


class ActivityStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityStatus
        fields = "__all__"
        read_only_fields = ["id"]


class ActivityPrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityPriority
        fields = "__all__"
        read_only_fields = ["id"]


class ActivitySerializer(serializers.ModelSerializer):
    status_config = ActivityStatusSerializer(read_only=True)
    priority_config = ActivityPrioritySerializer(read_only=True)
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Activity
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]
