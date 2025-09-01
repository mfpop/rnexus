from django.contrib.auth.models import User

from rest_framework import serializers

from .models import Activity, ActivityPriority, ActivityStatus, Contact


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


class ContactSerializer(serializers.ModelSerializer):
    """Serializer for Contact model"""

    class Meta:
        model = Contact
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "company",
            "subject",
            "message",
            "inquiry_type",
            "status",
            "phone",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "created_at", "updated_at"]

    def create(self, validated_data):
        """Create a new contact submission"""
        # Get request data for additional fields
        request = self.context.get("request")
        if request:
            validated_data["ip_address"] = self.get_client_ip(request)
            validated_data["user_agent"] = request.META.get("HTTP_USER_AGENT", "")

        return super().create(validated_data)

    def get_client_ip(self, request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip
