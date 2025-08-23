from django.contrib import admin

from .models import (
    Activity,
    ActivityPriority,
    ActivityStatus,
    Chat,
    Item,
    Message,
    SystemMessage,
    Tag,
    Update,
    UpdateAttachment,
    UpdateComment,
    UpdateLike,
    UpdateMedia,
)


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "chat_type",
        "chat_id",
        "sender_name",
        "message_type",
        "timestamp",
    )
    list_filter = ("chat_type", "message_type")
    search_fields = ("chat_id", "sender_id", "sender_name", "content", "file_name")
    ordering = ("-timestamp",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "is_active", "usage_count", "created_at")
    list_filter = ("category", "is_active", "created_at")
    search_fields = ("name", "description", "category")
    ordering = ("category", "name")
    readonly_fields = ("usage_count", "created_at", "updated_at")

    fieldsets = (
        ("Basic Information", {"fields": ("name", "description", "category")}),
        ("Appearance", {"fields": ("color",)}),
        ("Status", {"fields": ("is_active",)}),
        (
            "Statistics",
            {
                "fields": ("usage_count", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).order_by("category", "name")


@admin.register(ActivityStatus)
class ActivityStatusAdmin(admin.ModelAdmin):
    list_display = (
        "status",
        "display_name",
        "color_bg",
        "color_text",
        "icon",
        "is_active",
        "sort_order",
    )
    list_filter = ("is_active", "status")
    search_fields = ("status", "display_name", "description")
    ordering = ("sort_order", "status")
    list_editable = ("is_active", "sort_order")

    fieldsets = (
        ("Basic Information", {"fields": ("status", "display_name", "description")}),
        ("Appearance", {"fields": ("color_bg", "color_text", "color_border", "icon")}),
        ("Settings", {"fields": ("is_active", "sort_order")}),
    )


@admin.register(ActivityPriority)
class ActivityPriorityAdmin(admin.ModelAdmin):
    list_display = (
        "priority",
        "display_name",
        "color_bg",
        "color_text",
        "is_active",
        "sort_order",
    )
    list_filter = ("is_active", "priority")
    search_fields = ("priority", "display_name", "description")
    ordering = ("sort_order", "priority")
    list_editable = ("is_active", "sort_order")

    fieldsets = (
        ("Basic Information", {"fields": ("priority", "display_name", "description")}),
        ("Display", {"fields": ("color_bg", "color_text", "color_border")}),
        ("Settings", {"fields": ("is_active", "sort_order")}),
    )


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "type",
        "status",
        "priority",
        "assigned_to",
        "progress",
        "start_time",
        "created_at",
    )
    list_filter = ("type", "status", "priority", "created_at")
    search_fields = ("title", "description", "assigned_to", "assigned_by")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "progress")

    fieldsets = (
        ("Basic Information", {"fields": ("title", "description", "type")}),
        (
            "Status & Priority",
            {"fields": ("status", "priority", "status_config", "priority_config")},
        ),
        (
            "Timing",
            {
                "fields": (
                    "start_time",
                    "end_time",
                    "estimated_duration",
                    "actual_duration",
                )
            },
        ),
        ("Assignment", {"fields": ("assigned_to", "assigned_by", "location")}),
        ("Progress", {"fields": ("progress", "notes")}),
        ("Metadata", {"fields": ("created_by", "created_at", "updated_at")}),
    )
