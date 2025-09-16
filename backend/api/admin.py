from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import (
    Activity,
    ActivityCategoryNew,
    ActivityNew,
    ActivityPriority,
    ActivityPriorityNew,
    ActivityStatus,
    ActivityStatusNew,
    Area,
    Chat,
    City,
    Contact,
    Country,
    Department,
    Employee,
    Item,
    Message,
    NewsCategoryNew,
    NewsStatusNew,
    NewsUpdateNew,
    Plant,
    ProductionModel,
    Resource,
    ResourceGroup,
    Role,
    State,
    SystemMessage,
    Tag,
    Update,
    UpdateAttachment,
    UpdateBookmark,
    UpdateComment,
    UpdateLike,
    UpdateMedia,
    UpdateRelation,
    UserBlock,
    UserFavorite,
    UserProfile,
    ZipCode,
)

# Import models from models_new.py (only non-conflicting ones)
# Temporarily disabled due to model conflicts
# from .models_new import (
#     ActivityCategory,
#     NewsCategory,
#     NewsStatus,
#     NewsUpdate,
# )


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


# Location Models Admin
@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "code",
        "flag_emoji",
        "phone_code",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("name", "code")
    ordering = ("name",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "country", "is_active", "created_at")
    list_filter = ("country", "is_active", "created_at")
    search_fields = ("name", "code", "country__name")
    ordering = ("country__name", "name")
    autocomplete_fields = ["country"]
    readonly_fields = ("created_at", "updated_at")


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "state", "country", "is_active", "created_at")
    list_filter = ("state__country", "state", "is_active", "created_at")
    search_fields = ("name", "state__name", "country__name")
    ordering = ("country__name", "state__name", "name")
    autocomplete_fields = ["state", "country"]
    readonly_fields = ("created_at", "updated_at")


@admin.register(ZipCode)
class ZipCodeAdmin(admin.ModelAdmin):
    list_display = (
        "code",
        "city",
        "state",
        "country",
        "latitude",
        "longitude",
        "is_active",
    )
    list_filter = ("country", "state", "is_active", "created_at")
    search_fields = ("code", "city__name", "state__name", "country__name")
    ordering = ("country__name", "state__name", "city__name", "code")
    autocomplete_fields = ["city", "state", "country"]
    readonly_fields = ("created_at", "updated_at")


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = (
        "get_full_name",
        "email",
        "company",
        "inquiry_type",
        "status",
        "created_at",
        "assigned_to",
    )
    list_filter = (
        "status",
        "inquiry_type",
        "created_at",
        "assigned_to",
    )
    search_fields = (
        "first_name",
        "last_name",
        "email",
        "company",
        "subject",
        "message",
    )
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "ip_address", "user_agent")

    fieldsets = (
        (
            "Contact Information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "company",
                    "phone",
                )
            },
        ),
        (
            "Message Details",
            {
                "fields": (
                    "subject",
                    "message",
                    "inquiry_type",
                )
            },
        ),
        (
            "Status & Assignment",
            {
                "fields": (
                    "status",
                    "assigned_to",
                    "admin_notes",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "ip_address",
                    "user_agent",
                    "created_at",
                    "updated_at",
                    "responded_at",
                ),
                "classes": ("collapse",),
            },
        ),
    )

    list_editable = ("status", "assigned_to")
    autocomplete_fields = ["assigned_to"]

    def get_full_name(self, obj):
        return obj.get_full_name()

    get_full_name.short_description = "Full Name"  # type: ignore
    get_full_name.admin_order_field = "first_name"  # type: ignore

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("assigned_to")


# User Profile Admin
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "preferred_name",
        "position",
        "department",
        "created_at",
    )
    list_filter = ("department", "created_at", "updated_at")
    search_fields = (
        "user__username",
        "user__email",
        "preferred_name",
        "position",
        "department",
    )
    ordering = ("user__username",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("User Information", {"fields": ("user",)}),
        (
            "Personal Information",
            {
                "fields": (
                    "preferred_name",
                    "middle_name",
                    "maternal_last_name",
                )
            },
        ),
        (
            "Professional Information",
            {"fields": ("position", "department")},
        ),
        (
            "Address Information",
            {
                "fields": (
                    "street_address",
                    "apartment_suite",
                    "city",
                    "state_province",
                    "zip_code",
                    "country",
                    "country_code",
                )
            },
        ),
        (
            "Contact Information",
            {
                "fields": (
                    "phone",
                    "phone_country_code",
                    "phone_type",
                    "secondary_phone",
                )
            },
        ),
        ("Additional Information", {"fields": ("bio", "education", "work_history")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


# Manufacturing Models Admin
@admin.register(Plant)
class PlantAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "model_count", "created_at")
    list_filter = ("created_at", "updated_at")
    search_fields = ("name", "location", "description")
    ordering = ("name",)
    readonly_fields = ("created_at", "updated_at")

    def model_count(self, obj):
        return obj.models.count()

    model_count.short_description = "Production Models"


@admin.register(ProductionModel)
class ProductionModelAdmin(admin.ModelAdmin):
    list_display = ("name", "plant", "model_code", "created_at")
    list_filter = ("plant", "created_at", "updated_at")
    search_fields = ("name", "model_code", "description", "plant__name")
    ordering = ("plant__name", "name")
    autocomplete_fields = ["plant"]
    readonly_fields = ("created_at", "updated_at")


# Organizational Structure Admin
@admin.register(Area)
class AreaAdmin(admin.ModelAdmin):
    list_display = ("name", "department", "resource_group_count", "created_at")
    list_filter = ("department", "created_at", "updated_at")
    search_fields = ("name", "description", "department__name")
    ordering = ("department__name", "name")
    autocomplete_fields = ["department"]
    readonly_fields = ("created_at", "updated_at")

    def resource_group_count(self, obj):
        return obj.resource_groups.count()

    resource_group_count.short_description = "Resource Groups"


@admin.register(ResourceGroup)
class ResourceGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "operation", "department", "area", "resource_count", "created_at")
    list_filter = ("department", "area", "created_at", "updated_at")
    search_fields = ("name", "operation", "description", "department__name", "area__name")
    ordering = ("department__name", "area__name", "name")
    autocomplete_fields = ["department", "area"]
    readonly_fields = ("created_at", "updated_at")

    def resource_count(self, obj):
        return obj.resources.count()

    resource_count.short_description = "Resources"


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ("name", "resource_group", "resource_type", "status", "created_at")
    list_filter = ("status", "resource_type", "created_at", "updated_at")
    search_fields = ("name", "resource_type", "description", "resource_group__name")
    ordering = ("resource_group__name", "name")
    autocomplete_fields = ["resource_group"]
    readonly_fields = ("created_at", "updated_at")
    list_editable = ("status",)


# Chat System Admin
@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ("name", "chat_type", "user1", "user2", "last_activity", "is_active")
    list_filter = ("chat_type", "is_active", "is_archived", "created_at")
    search_fields = ("name", "user1__username", "user2__username", "description")
    ordering = ("-last_activity",)
    readonly_fields = ("created_at", "updated_at", "last_activity")
    autocomplete_fields = ["user1", "user2", "created_by", "archived_by"]

    fieldsets = (
        ("Basic Information", {"fields": ("chat_type", "name", "description")}),
        ("Participants", {"fields": ("user1", "user2", "members")}),
        ("Status", {"fields": ("is_active", "is_archived", "archived_at", "archived_by")}),
        ("Metadata", {"fields": ("created_by", "created_at", "updated_at", "last_activity")}),
    )


# Update System Admin
@admin.register(Update)
class UpdateAdmin(admin.ModelAdmin):
    list_display = ("title", "type", "status", "author", "timestamp", "is_active")
    list_filter = ("type", "status", "is_active", "created_at")
    search_fields = ("title", "summary", "body", "author", "tags")
    ordering = ("-timestamp",)
    autocomplete_fields = ["created_by"]
    readonly_fields = ("created_at", "updated_at")


@admin.register(UpdateRelation)
class UpdateRelationAdmin(admin.ModelAdmin):
    list_display = ("source_update", "target_update", "relation_type", "created_at")
    list_filter = ("relation_type", "created_at")
    search_fields = ("source_update__title", "target_update__title", "relation_type")
    ordering = ("-created_at",)
    autocomplete_fields = ["source_update", "target_update"]


@admin.register(UpdateBookmark)
class UpdateBookmarkAdmin(admin.ModelAdmin):
    list_display = ("user", "update", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "update__title")
    ordering = ("-created_at",)
    autocomplete_fields = ["user", "update"]


# New Streamlined Models Admin
@admin.register(ActivityCategoryNew)
class ActivityCategoryNewAdmin(admin.ModelAdmin):
    list_display = ("display_name", "name", "icon", "color", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "display_name")
    ordering = ("display_name",)
    list_editable = ("is_active",)


@admin.register(ActivityStatusNew)
class ActivityStatusNewAdmin(admin.ModelAdmin):
    list_display = ("display_name", "name", "color_bg", "color_text", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "display_name")
    ordering = ("display_name",)
    list_editable = ("is_active",)


@admin.register(ActivityPriorityNew)
class ActivityPriorityNewAdmin(admin.ModelAdmin):
    list_display = ("display_name", "name", "level", "color_bg", "color_text", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "display_name")
    ordering = ("-level",)
    list_editable = ("is_active",)


@admin.register(ActivityNew)
class ActivityNewAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "status",
        "priority",
        "assigned_to",
        "start_time",
        "created_at",
    )
    list_filter = ("category", "status", "priority", "created_at", "is_active")
    search_fields = ("title", "description", "assigned_to", "assigned_by")
    ordering = ("-created_at",)
    autocomplete_fields = ["category", "status", "priority", "created_by"]
    readonly_fields = ("created_at", "updated_at")


# News System Admin
@admin.register(NewsCategoryNew)
class NewsCategoryNewAdmin(admin.ModelAdmin):
    list_display = ("display_name", "name", "icon", "color", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "display_name")
    ordering = ("display_name",)
    list_editable = ("is_active",)


@admin.register(NewsStatusNew)
class NewsStatusNewAdmin(admin.ModelAdmin):
    list_display = ("display_name", "name", "color_bg", "color_text", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "display_name")
    ordering = ("display_name",)
    list_editable = ("is_active",)


@admin.register(NewsUpdateNew)
class NewsUpdateNewAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "status", "author", "timestamp", "is_active")
    list_filter = ("category", "status", "is_active", "created_at")
    search_fields = ("title", "summary", "body", "author", "tags")
    ordering = ("-timestamp",)
    autocomplete_fields = ["category", "status", "created_by"]
    readonly_fields = ("created_at", "updated_at")


# User Relationships Admin
@admin.register(UserFavorite)
class UserFavoriteAdmin(admin.ModelAdmin):
    list_display = ("user", "favorite_user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "favorite_user__username")
    ordering = ("-created_at",)
    autocomplete_fields = ["user", "favorite_user"]


@admin.register(UserBlock)
class UserBlockAdmin(admin.ModelAdmin):
    list_display = ("user", "blocked_user", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "blocked_user__username")
    ordering = ("-created_at",)
    autocomplete_fields = ["user", "blocked_user"]


# Models from models_new.py
# Temporarily disabled due to model conflicts
# @admin.register(ActivityCategory)
# class ActivityCategoryAdmin(admin.ModelAdmin):
#     list_display = ("display_name", "name", "icon", "color", "is_active")
#     list_filter = ("is_active",)
#     search_fields = ("name", "display_name")
#     ordering = ("display_name",)
#     list_editable = ("is_active",)


# Models from models_new.py
# Temporarily disabled due to model conflicts
# @admin.register(ActivityCategory)
# class ActivityCategoryNewAdmin(admin.ModelAdmin):
#     list_display = ("display_name", "name", "icon", "color", "is_active")
#     list_filter = ("is_active",)
#     search_fields = ("name", "display_name")
#     ordering = ("display_name",)
#     list_editable = ("is_active",)


# @admin.register(NewsCategory)
# class NewsCategoryNewAdmin(admin.ModelAdmin):
#     list_display = ("display_name", "name", "icon", "color", "is_active")
#     list_filter = ("is_active",)
#     search_fields = ("name", "display_name")
#     ordering = ("display_name",)
#     list_editable = ("is_active",)


# @admin.register(NewsStatus)
# class NewsStatusNewAdmin(admin.ModelAdmin):
#     list_display = ("display_name", "name", "color_bg", "color_text", "is_active")
#     list_filter = ("is_active",)
#     search_fields = ("name", "display_name")
#     ordering = ("display_name",)
#     list_editable = ("is_active",)


# @admin.register(NewsUpdate)
# class NewsUpdateNewAdmin(admin.ModelAdmin):
#     list_display = ("title", "category", "status", "author", "timestamp", "is_active")
#     list_filter = ("category", "status", "is_active", "created_at")
#     search_fields = ("title", "summary", "body", "author", "tags")
#     ordering = ("-timestamp",)
#     autocomplete_fields = ["category", "status", "created_by"]
#     readonly_fields = ("created_at", "updated_at")


# Custom User Admin with UserProfile Inline
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'


class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)


# Unregister the default User admin and register our custom one
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
