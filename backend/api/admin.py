from django.contrib import admin
from .models import Item, Chat, Message, SystemMessage, Update, UpdateAttachment, UpdateMedia, UpdateLike, UpdateComment, Tag


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "chat_type", "chat_id", "sender_name", "message_type", "timestamp")
    list_filter = ("chat_type", "message_type")
    search_fields = ("chat_id", "sender_id", "sender_name", "content", "file_name")
    ordering = ("-timestamp",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_active', 'usage_count', 'created_at')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'category')
    ordering = ('category', 'name')
    readonly_fields = ('usage_count', 'created_at', 'updated_at')

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'category')
        }),
        ('Appearance', {
            'fields': ('color',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Statistics', {
            'fields': ('usage_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).order_by('category', 'name')
