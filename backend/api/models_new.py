# New Database Models - Simplified and Optimized
# This file contains the new streamlined models for Activities and News/Updates

import uuid

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class ActivityCategory(models.Model):
    """Simple category lookup for activities"""

    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, default="📋")  # Emoji icon
    color = models.CharField(max_length=7, default="#3B82F6")  # Hex color
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Activity Categories"
        ordering = ["display_name"]

    def __str__(self):
        return self.display_name


class ActivityStatus(models.Model):
    """Status definitions with colors"""

    name = models.CharField(max_length=20, unique=True)
    display_name = models.CharField(max_length=50)
    color_bg = models.CharField(max_length=7, default="#F3F4F6")
    color_text = models.CharField(max_length=7, default="#374151")
    color_border = models.CharField(max_length=7, default="#D1D5DB")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Activity Statuses"
        ordering = ["display_name"]

    def __str__(self):
        return self.display_name


class ActivityPriority(models.Model):
    """Priority definitions with colors"""

    name = models.CharField(max_length=20, unique=True)
    display_name = models.CharField(max_length=50)
    level = models.IntegerField(default=0)  # Numeric priority (higher = more urgent)
    color_bg = models.CharField(max_length=7, default="#F3F4F6")
    color_text = models.CharField(max_length=7, default="#374151")
    color_border = models.CharField(max_length=7, default="#D1D5DB")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Activity Priorities"
        ordering = ["-level"]

    def __str__(self):
        return self.display_name


class Activity(models.Model):
    """Simplified Activity model with essential fields"""

    # Primary fields
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()

    # Relationships (simplified)
    category = models.ForeignKey(
        ActivityCategory, on_delete=models.PROTECT, related_name="activities"
    )
    status = models.ForeignKey(
        ActivityStatus, on_delete=models.PROTECT, related_name="activities"
    )
    priority = models.ForeignKey(
        ActivityPriority, on_delete=models.PROTECT, related_name="activities"
    )

    # Time management
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    estimated_duration = models.IntegerField(help_text="Estimated duration in minutes")
    actual_duration = models.IntegerField(
        blank=True, null=True, help_text="Actual duration in minutes"
    )

    # Assignment and location
    assigned_to = models.CharField(max_length=100)
    assigned_by = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True, null=True)

    # Progress and notes
    progress = models.IntegerField(default=0, help_text="Progress percentage (0-100)")
    notes = models.TextField(blank=True)

    # Metadata
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_activities"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Activities"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["category", "status"]),
            models.Index(fields=["status", "priority"]),
            models.Index(fields=["created_by", "created_at"]),
            models.Index(fields=["is_active", "start_time"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.category.name})"

    @property
    def duration_hours(self):
        """Calculate duration in hours"""
        duration = self.actual_duration or self.estimated_duration
        return round(duration / 60, 1) if duration else 0


class NewsCategory(models.Model):
    """Category for news/updates"""

    name = models.CharField(max_length=50, unique=True)
    display_name = models.CharField(max_length=100)
    icon = models.CharField(max_length=10, default="📰")  # Emoji icon
    color = models.CharField(max_length=7, default="#10B981")  # Hex color
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "News Categories"
        ordering = ["display_name"]

    def __str__(self):
        return self.display_name


class NewsStatus(models.Model):
    """Status for news/updates"""

    name = models.CharField(max_length=20, unique=True)
    display_name = models.CharField(max_length=50)
    color_bg = models.CharField(max_length=7, default="#F3F4F6")
    color_text = models.CharField(max_length=7, default="#374151")
    color_border = models.CharField(max_length=7, default="#D1D5DB")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "News Statuses"
        ordering = ["display_name"]

    def __str__(self):
        return self.display_name


class NewsUpdate(models.Model):
    """Simplified News/Update model"""

    # Primary fields
    id = models.CharField(max_length=255, primary_key=True)
    title = models.CharField(max_length=255)
    summary = models.TextField()
    body = models.TextField()

    # Relationships (simplified)
    category = models.ForeignKey(
        NewsCategory, on_delete=models.PROTECT, related_name="updates"
    )
    status = models.ForeignKey(
        NewsStatus, on_delete=models.PROTECT, related_name="updates"
    )

    # Content metadata
    author = models.CharField(max_length=255)
    tags = models.JSONField(default=list)  # List of tag strings
    icon = models.CharField(max_length=10, default="📰")  # Emoji icon

    # Publishing and priority
    timestamp = models.DateTimeField(default=timezone.now)
    priority = models.IntegerField(default=0)  # Higher number = higher priority
    expires_at = models.DateTimeField(
        null=True, blank=True
    )  # For time-sensitive updates

    # Metadata
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_updates"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "News Updates"
        ordering = ["-priority", "-timestamp"]
        indexes = [
            models.Index(fields=["category", "status"]),
            models.Index(fields=["status", "timestamp"]),
            models.Index(fields=["created_by", "timestamp"]),
            models.Index(fields=["is_active", "timestamp"]),
            models.Index(fields=["priority", "timestamp"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.category.name})"

    @property
    def is_expired(self):
        """Check if update is expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
