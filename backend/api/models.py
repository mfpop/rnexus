import json
import uuid
from typing import List, Optional, Union

from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

# Custom User model temporarily disabled to avoid migration conflicts
# class User(AbstractUser):
#     """Custom User model that matches the existing database structure"""
#
#     # Override the default ID field to use UUID
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#
#     # Additional fields from the existing users table
#     phone = models.CharField(max_length=20, blank=True, null=True)
#     department = models.CharField(max_length=100, blank=True, null=True)
#     position = models.CharField(max_length=100, blank=True, null=True)
#     employee_id = models.CharField(max_length=50, blank=True, null=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#
#     # Override email field to make it required
#     email = models.EmailField(unique=True)
#
#     class Meta:
#         db_table = 'users'
#         verbose_name = 'User'
#         verbose_name_plural = 'Users'
#         managed = False  # Tell Django not to manage this table
#
#     def __str__(self):
#         return self.username


class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class ActivityStatus(models.Model):
    """Model to store activity status configurations with colors and icons"""

    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("in-progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("overdue", "Overdue"),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, unique=True)
    display_name = models.CharField(max_length=50)
    color_bg = models.CharField(
        max_length=20, help_text="Tailwind CSS background color class"
    )
    color_text = models.CharField(
        max_length=20, help_text="Tailwind CSS text color class"
    )
    color_border = models.CharField(
        max_length=20, help_text="Tailwind CSS border color class"
    )
    icon = models.CharField(max_length=10, help_text="Emoji or icon representation")
    description = models.TextField(
        blank=True, help_text="Description of what this status means"
    )
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0, help_text="Order for display purposes")

    class Meta:
        ordering = ["sort_order", "status"]
        verbose_name_plural = "Activity Statuses"

    def __str__(self):
        return f"{self.display_name} ({self.status})"


class ActivityPriority(models.Model):
    """Model to store activity priority configurations with colors"""

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, unique=True)
    display_name = models.CharField(max_length=50)
    color_bg = models.CharField(
        max_length=20, help_text="Tailwind CSS background color class"
    )
    color_text = models.CharField(
        max_length=20, help_text="Tailwind CSS text color class"
    )
    color_border = models.CharField(
        max_length=20, help_text="Tailwind CSS border color class"
    )
    description = models.TextField(
        blank=True, help_text="Description of priority level"
    )
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0, help_text="Order for display purposes")

    class Meta:
        ordering = ["sort_order", "priority"]
        verbose_name_plural = "Activity Priorities"

    def __str__(self):
        return f"{self.display_name} ({self.priority})"


class Activity(models.Model):
    """Model to store activities with status and priority references"""

    STATUS_CHOICES = [
        ("planned", "Planned"),
        ("in-progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("overdue", "Overdue"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical", "Critical"),
    ]

    TYPE_CHOICES = [
        ("Production", "Production"),
        ("Maintenance", "Maintenance"),
        ("Inspection & Audit", "Inspection & Audit"),
        ("Engineering", "Engineering"),
        ("Logistics", "Logistics"),
        ("Quality", "Quality"),
        ("Meetings", "Meetings"),
        ("Projects", "Projects"),
        ("Training", "Training"),
        ("Admin & Systems", "Admin & Systems"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")
    priority = models.CharField(
        max_length=20, choices=PRIORITY_CHOICES, default="medium"
    )

    # Status and Priority references for color management
    status_config = models.ForeignKey(
        ActivityStatus, on_delete=models.PROTECT, related_name="activities"
    )
    priority_config = models.ForeignKey(
        ActivityPriority, on_delete=models.PROTECT, related_name="activities"
    )

    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    assigned_to = models.CharField(max_length=100)
    assigned_by = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True, null=True)
    progress = models.IntegerField(default=0, help_text="Progress percentage (0-100)")
    estimated_duration = models.IntegerField(help_text="Estimated duration in minutes")
    actual_duration = models.IntegerField(
        blank=True, null=True, help_text="Actual duration in minutes"
    )
    notes = models.TextField(blank=True)

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_activities"
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Activities"

    def __str__(self):
        return f"{self.title} ({self.status})"

    def save(self, *args, **kwargs):
        # Auto-assign status and priority configs if not set
        if not hasattr(self, "status_config") or not self.status_config:
            self.status_config = ActivityStatus.objects.get(status=self.status)
        if not hasattr(self, "priority_config") or not self.priority_config:
            self.priority_config = ActivityPriority.objects.get(priority=self.priority)
        super().save(*args, **kwargs)


class Chat(models.Model):
    CHAT_TYPE_USER = "user"
    CHAT_TYPE_GROUP = "group"

    CHAT_TYPE_CHOICES = (
        (CHAT_TYPE_USER, "User"),
        (CHAT_TYPE_GROUP, "Group"),
    )

    id = models.CharField(
        max_length=100, primary_key=True, db_index=True
    )  # Fixed: added primary_key=True
    chat_type = models.CharField(max_length=10, choices=CHAT_TYPE_CHOICES)
    name = models.CharField(max_length=255, blank=True)  # For group chats
    description = models.TextField(blank=True)  # For group chats

    # For user chats, store both user objects
    user1 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="chats_as_user1",
        null=True,
        blank=True,
    )
    user2 = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="chats_as_user2",
        null=True,
        blank=True,
    )

    # For group chats, store member IDs as JSON
    members = models.JSONField(default=list, blank=True)

    # Chat metadata
    last_message = models.ForeignKey(
        "Message",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="chat_last_message",
    )
    last_activity = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    # Group chat specific fields
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="created_chats",
        null=True,
        blank=True,
    )
    avatar_url = models.URLField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-last_activity"]
        indexes = [
            models.Index(fields=["chat_type", "last_activity"]),
            models.Index(fields=["user1", "user2"]),
        ]

    def __str__(self) -> str:
        if self.chat_type == self.CHAT_TYPE_GROUP:
            return f"Group: {self.name}"
        return f"Chat: {self.user1.username if self.user1 else 'Unknown'} - {self.user2.username if self.user2 else 'Unknown'}"

    def get_participants(self):
        """Get list of participant User objects"""
        if self.chat_type == self.CHAT_TYPE_USER:
            participants = []
            if self.user1:
                participants.append(self.user1)
            if self.user2:
                participants.append(self.user2)
            return participants
        else:
            # For group chats, return User objects from member IDs
            from django.contrib.auth.models import User

            return User.objects.filter(id__in=self.members)

    def add_member(self, user):
        """Add member to group chat"""
        if self.chat_type == self.CHAT_TYPE_GROUP and str(user.id) not in self.members:
            self.members.append(str(user.id))
            self.save(update_fields=["members"])

    def remove_member(self, user):
        """Remove member from group chat"""
        if self.chat_type == self.CHAT_TYPE_GROUP and str(user.id) in self.members:
            self.members.remove(str(user.id))
            self.save(update_fields=["members"])

    def update_last_message(self, message):
        """Update last message and activity"""
        self.last_message = message
        self.last_activity = message.timestamp
        self.save(update_fields=["last_message", "last_activity"])


class Message(models.Model):
    CHAT_TYPE_USER = "user"
    CHAT_TYPE_GROUP = "group"

    MESSAGE_TYPE_TEXT = "text"
    MESSAGE_TYPE_IMAGE = "image"
    MESSAGE_TYPE_AUDIO = "audio"
    MESSAGE_TYPE_VIDEO = "video"
    MESSAGE_TYPE_DOCUMENT = "document"
    MESSAGE_TYPE_LOCATION = "location"
    MESSAGE_TYPE_CONTACT = "contact"

    MESSAGE_STATUS_SENDING = "sending"
    MESSAGE_STATUS_SENT = "sent"
    MESSAGE_STATUS_DELIVERED = "delivered"
    MESSAGE_STATUS_READ = "read"

    CHAT_TYPE_CHOICES = (
        (CHAT_TYPE_USER, "User"),
        (CHAT_TYPE_GROUP, "Group"),
    )

    MESSAGE_TYPE_CHOICES = (
        (MESSAGE_TYPE_TEXT, "Text"),
        (MESSAGE_TYPE_IMAGE, "Image"),
        (MESSAGE_TYPE_AUDIO, "Audio"),
        (MESSAGE_TYPE_VIDEO, "Video"),
        (MESSAGE_TYPE_DOCUMENT, "Document"),
        (MESSAGE_TYPE_LOCATION, "Location"),
        (MESSAGE_TYPE_CONTACT, "Contact"),
    )

    MESSAGE_STATUS_CHOICES = (
        (MESSAGE_STATUS_SENDING, "Sending"),
        (MESSAGE_STATUS_SENT, "Sent"),
        (MESSAGE_STATUS_DELIVERED, "Delivered"),
        (MESSAGE_STATUS_READ, "Read"),
    )

    chat_id = models.CharField(max_length=100, db_index=True)
    chat_type = models.CharField(max_length=10, choices=CHAT_TYPE_CHOICES)
    sender_id = models.CharField(max_length=100)
    sender_name = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    message_type = models.CharField(
        max_length=10, choices=MESSAGE_TYPE_CHOICES, default=MESSAGE_TYPE_TEXT
    )

    # Message metadata
    status = models.CharField(
        max_length=10, choices=MESSAGE_STATUS_CHOICES, default=MESSAGE_STATUS_SENT
    )
    reply_to = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="replies"
    )
    forwarded = models.BooleanField(default=False)
    forwarded_from = models.CharField(max_length=100, blank=True)
    edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)

    # File/media information
    file_name = models.CharField(max_length=255, blank=True)
    file_size = models.CharField(max_length=50, blank=True)
    file_url = models.URLField(blank=True)
    thumbnail_url = models.URLField(blank=True)
    caption = models.TextField(blank=True)

    # Audio/Video specific fields
    duration = models.IntegerField(default=0)  # Duration in seconds
    waveform = models.JSONField(null=True, blank=True)  # Audio waveform data

    # Location specific fields
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    location_name = models.CharField(max_length=255, blank=True)

    # Contact specific fields
    contact_name = models.CharField(max_length=100, blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_email = models.EmailField(blank=True)

    timestamp = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["timestamp"]
        indexes = [
            models.Index(fields=["chat_id", "timestamp"]),
            models.Index(fields=["sender_id", "timestamp"]),
            models.Index(fields=["status", "timestamp"]),
        ]

    def __str__(self) -> str:
        return (
            f"[{self.chat_type}:{self.chat_id}] {self.sender_name}: {self.content[:30]}"
        )

    def mark_as_read(self):
        """Mark message as read"""
        self.status = self.MESSAGE_STATUS_READ
        self.save(update_fields=["status"])

    def mark_as_delivered(self):
        """Mark message as delivered"""
        self.status = self.MESSAGE_STATUS_DELIVERED
        self.save(update_fields=["status"])

    def update_status(self, new_status):
        """Update message status"""
        if new_status in dict(self.MESSAGE_STATUS_CHOICES):
            self.status = new_status
            self.save(update_fields=["status"])


class SystemMessage(models.Model):
    MESSAGE_TYPE_CHOICES = [
        ("info", "Info"),
        ("warning", "Warning"),
        ("error", "Error"),
        ("success", "Success"),
    ]

    recipient_id = models.CharField(
        max_length=100
    )  # Using CharField instead of ForeignKey
    title = models.CharField(max_length=255, blank=True, null=True)
    message = models.TextField()
    message_type = models.CharField(
        max_length=10, choices=MESSAGE_TYPE_CHOICES, default="info"
    )
    link = models.URLField(blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"System Message for {self.recipient_id} - {self.message_type}: {self.title or self.message[:50]}"


# New models for the Update system
class UpdateAttachment(models.Model):
    ATTACHMENT_TYPE_PDF = "pdf"
    ATTACHMENT_TYPE_DOC = "doc"
    ATTACHMENT_TYPE_DOCX = "docx"
    ATTACHMENT_TYPE_TXT = "txt"
    ATTACHMENT_TYPE_IMAGE = "image"
    ATTACHMENT_TYPE_AUDIO = "audio"
    ATTACHMENT_TYPE_VIDEO = "video"

    ATTACHMENT_TYPE_CHOICES = [
        (ATTACHMENT_TYPE_PDF, "PDF"),
        (ATTACHMENT_TYPE_DOC, "DOC"),
        (ATTACHMENT_TYPE_DOCX, "DOCX"),
        (ATTACHMENT_TYPE_TXT, "TXT"),
        (ATTACHMENT_TYPE_IMAGE, "Image"),
        (ATTACHMENT_TYPE_AUDIO, "Audio"),
        (ATTACHMENT_TYPE_VIDEO, "Video"),
    ]

    id = models.AutoField(primary_key=True)
    update = models.ForeignKey(
        "Update", on_delete=models.CASCADE, related_name="attachments"
    )
    type = models.CharField(max_length=20, choices=ATTACHMENT_TYPE_CHOICES)
    url = models.URLField()
    label = models.CharField(max_length=255)
    file_size = models.IntegerField(null=True, blank=True)  # in bytes
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.label} ({self.type})"


class UpdateMedia(models.Model):
    MEDIA_TYPE_IMAGE = "image"
    MEDIA_TYPE_VIDEO = "video"
    MEDIA_TYPE_AUDIO = "audio"

    MEDIA_TYPE_CHOICES = [
        (MEDIA_TYPE_IMAGE, "Image"),
        (MEDIA_TYPE_VIDEO, "Video"),
        (MEDIA_TYPE_AUDIO, "Audio"),
    ]

    id = models.AutoField(primary_key=True)
    update = models.ForeignKey("Update", on_delete=models.CASCADE, related_name="media")
    type = models.CharField(max_length=20, choices=MEDIA_TYPE_CHOICES)
    url = models.URLField()
    label = models.CharField(max_length=255)
    thumbnail_url = models.URLField(blank=True)
    duration = models.IntegerField(null=True, blank=True)  # in seconds for video/audio
    file_size = models.IntegerField(null=True, blank=True)  # in bytes
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.label} ({self.type})"


class Tag(models.Model):
    """Predefined tags for categorizing updates"""

    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#3B82F6")  # Hex color code
    category = models.CharField(max_length=50, blank=True)  # Group tags by category
    is_active = models.BooleanField(default=True)
    usage_count = models.IntegerField(default=0)  # Track how often tag is used
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "name"]
        indexes = [
            models.Index(fields=["category", "is_active"]),
            models.Index(fields=["is_active", "usage_count"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.category})"

    def increment_usage(self):
        """Increment usage count when tag is added to an update"""
        self.usage_count += 1
        self.save(update_fields=["usage_count"])

    def decrement_usage(self):
        """Decrement usage count when tag is removed from an update"""
        if self.usage_count > 0:
            self.usage_count -= 1
            self.save(update_fields=["usage_count"])


class Update(models.Model):
    UPDATE_TYPE_NEWS = "news"
    UPDATE_TYPE_COMMUNICATION = "communication"
    UPDATE_TYPE_ALERT = "alert"

    UPDATE_TYPE_CHOICES = [
        (UPDATE_TYPE_NEWS, "News"),
        (UPDATE_TYPE_COMMUNICATION, "Communication"),
        (UPDATE_TYPE_ALERT, "Alert"),
    ]

    UPDATE_STATUS_NEW = "new"
    UPDATE_STATUS_READ = "read"
    UPDATE_STATUS_URGENT = "urgent"

    UPDATE_STATUS_CHOICES = [
        (UPDATE_STATUS_NEW, "New"),
        (UPDATE_STATUS_READ, "Read"),
        (UPDATE_STATUS_URGENT, "Urgent"),
    ]

    id = models.CharField(max_length=255, primary_key=True)
    type = models.CharField(
        max_length=20, choices=UPDATE_TYPE_CHOICES, default=UPDATE_TYPE_NEWS
    )
    title = models.CharField(max_length=255)
    summary = models.TextField()
    body = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    status = models.CharField(
        max_length=20, choices=UPDATE_STATUS_CHOICES, default=UPDATE_STATUS_NEW
    )
    tags = models.JSONField(default=list)  # List of tag strings
    author = models.CharField(max_length=255)
    icon = models.CharField(max_length=10, default="📰")  # Emoji icon
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_updates"
    )
    is_active = models.BooleanField(default=True)
    priority = models.IntegerField(default=0)  # Higher number = higher priority
    expires_at = models.DateTimeField(
        null=True, blank=True
    )  # For time-sensitive updates
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-priority", "-timestamp"]
        indexes = [
            models.Index(fields=["type", "status"]),
            models.Index(fields=["status", "timestamp"]),
            models.Index(fields=["created_by", "timestamp"]),
            models.Index(fields=["is_active", "timestamp"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.type})"

    def mark_as_read(self):
        if self.status != self.UPDATE_STATUS_URGENT:
            self.status = self.UPDATE_STATUS_READ
            self.save(update_fields=["status"])

    def is_expired(self):
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False

    def get_related_updates(self):
        """Get updates with similar tags or type"""
        related = Update.objects.filter(
            is_active=True, tags__overlap=self.tags
        ).exclude(id=self.id)[:5]
        return [update.id for update in related]

    def get_attachments(self):
        """Get attachments for this update"""
        # Django will create this relationship via UpdateAttachment.update ForeignKey
        return self.attachments.all()  # type: ignore

    def get_media(self):
        """Get media for this update"""
        # Django will create this relationship via UpdateMedia.update ForeignKey
        return self.media.all()  # type: ignore

    def get_likes_count(self):
        """Get total likes count"""
        # Django will create this relationship via UpdateLike.update ForeignKey
        return self.likes.filter(is_like=True).count()  # type: ignore

    def get_dislikes_count(self):
        """Get total dislikes count"""
        # Django will create this relationship via UpdateLike.update ForeignKey
        return self.likes.filter(is_like=False).count()  # type: ignore

    def get_comments_count(self):
        """Get total comments count (including replies)"""
        # Django will create this relationship via UpdateComment.update ForeignKey
        return self.comments.filter(is_active=True).count()  # type: ignore

    def get_replies_count(self):
        """Get total replies count"""
        # Django will create this relationship via UpdateComment.update ForeignKey
        return self.comments.filter(is_active=True, parent_comment__isnull=False).count()  # type: ignore

    def user_has_liked(self, user):
        """Check if user has liked this update"""
        if not user.is_authenticated:
            return None
        try:
            # Django will create this relationship via UpdateLike.update ForeignKey
            like = self.likes.get(user=user)  # type: ignore
            return like.is_like
        except UpdateLike.DoesNotExist:
            return None

    def can_edit(self, user):
        """Check if user can edit this update"""
        return user == self.created_by or user.is_staff or user.is_superuser

    def can_delete(self, user):
        """Check if user can delete this update"""
        return user == self.created_by or user.is_staff or user.is_superuser


class UpdateRelation(models.Model):
    """Model to track relationships between updates"""

    id = models.AutoField(primary_key=True)
    source_update = models.ForeignKey(
        Update, on_delete=models.CASCADE, related_name="source_relations"
    )
    target_update = models.ForeignKey(
        Update, on_delete=models.CASCADE, related_name="target_relations"
    )
    relation_type = models.CharField(
        max_length=50, default="related"
    )  # related, follows, references, etc.
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["source_update", "target_update", "relation_type"]
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.source_update.title} -> {self.target_update.title}"


class UpdateLike(models.Model):
    """Model to track likes/dislikes on updates"""

    id = models.AutoField(primary_key=True)
    update = models.ForeignKey(Update, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="update_likes"
    )
    is_like = models.BooleanField(default=True)  # True for like, False for dislike
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [
            "update",
            "user",
        ]  # One user can only like/dislike once per update
        ordering = ["-created_at"]

    def __str__(self):
        action = "liked" if self.is_like else "disliked"
        return f"{self.user.username} {action} {self.update.title}"


class UpdateComment(models.Model):
    """Model for comments on updates"""

    id = models.AutoField(primary_key=True)
    update = models.ForeignKey(
        Update, on_delete=models.CASCADE, related_name="comments"
    )
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="update_comments"
    )
    content = models.TextField()
    parent_comment = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["update", "created_at"]),
            models.Index(fields=["parent_comment", "created_at"]),
        ]

    def __str__(self):
        return f"Comment by {self.author.username} on {self.update.title}"

    def get_replies(self):
        """Get all replies to this comment"""
        return self.replies.filter(is_active=True)  # type: ignore

    def can_edit(self, user):
        """Check if user can edit this comment"""
        return user == self.author or user.is_staff or user.is_superuser

    def can_delete(self, user):
        """Check if user can delete this comment"""
        return user == self.author or user.is_staff or user.is_superuser
