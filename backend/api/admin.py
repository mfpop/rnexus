from django.contrib import admin

from .models import (
    Activity,
    ActivityPriority,
    ActivityStatus,
    Chat,
    Department,
    Employee,
    Item,
    Message,
    Role,
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


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "role_count")
    search_fields = ("name", "description")
    ordering = ("name",)

    def role_count(self, obj: Department) -> int:
        return obj.roles.count()  # type: ignore

    role_count.short_description = "Number of Roles"  # type: ignore


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "department",
        "reports_to",
        "employee_count",
        "hierarchy_level",
    )
    list_filter = ("department", "reports_to")
    search_fields = ("title", "description", "department__name")
    ordering = ("department__name", "title")
    autocomplete_fields = ["department", "reports_to"]

    def employee_count(self, obj: Role) -> int:
        return obj.employees.count()  # type: ignore

    employee_count.short_description = "Employees"  # type: ignore

    def hierarchy_level(self, obj: Role) -> int:
        return obj.get_hierarchy_level()

    hierarchy_level.short_description = "Level"  # type: ignore


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "role", "department", "supervisor", "user_linked")
    list_filter = ("role__department", "role__reports_to")
    search_fields = ("name", "email", "role__title", "role__department__name")
    ordering = ("name",)
    autocomplete_fields = ["role", "user"]

    def department(self, obj: Employee) -> str:
        dept = obj.get_department()
        return dept.name if dept else "Unknown"

    department.short_description = "Department"  # type: ignore

    def supervisor(self, obj: Employee) -> str:
        supervisor_role = obj.get_supervisor()
        return supervisor_role.title if supervisor_role else "None"

    supervisor.short_description = "Supervisor"  # type: ignore

    def user_linked(self, obj: Employee) -> str:
        return "Yes" if obj.user else "No"

    user_linked.short_description = "User Account"  # type: ignore
