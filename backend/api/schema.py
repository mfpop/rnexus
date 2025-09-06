from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.conf import settings
from typing import Any, List, Optional, Union

import graphene
from graphene_django.types import DjangoObjectType

from api.models import (
    Activity,
    ActivityPriority,
    ActivityStatus,
    Chat,
    City,
    Contact,
    Country,
    Department,
    Employee,
    Item,
    Message,
    Role,
    State,
    SystemMessage,
    Update,
    UpdateBookmark,
    UpdateComment,
    UpdateLike,
    UserProfile,
    ZipCode,
    # New streamlined models
    ActivityCategoryNew,
    ActivityStatusNew,
    ActivityPriorityNew,
    ActivityNew,
    NewsCategoryNew,
    NewsStatusNew,
    NewsUpdateNew,
)


class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "date_joined",
            "last_login",
            "is_active",
            "is_staff",
            "is_superuser",
        )

    # Add camelCase field mappings for frontend compatibility
    firstName = graphene.String(source="first_name")
    lastName = graphene.String(source="last_name")
    isActive = graphene.Boolean(source="is_active")

    # Add avatar field from user profile
    avatar = graphene.String()
    avatarUrl = graphene.String()
    profile = graphene.Field(lambda: UserProfileType)
    
    # Add position and department from user profile
    position = graphene.String()
    department = graphene.String()

    def resolve_avatar(self, info):
        """Get avatar filename from user profile"""
        try:
            profile = getattr(self, 'profile', None)
            if profile and hasattr(profile, 'avatar'):
                avatar = getattr(profile, 'avatar', None)
                if avatar:
                    return getattr(avatar, 'name', None)
            return None
        except Exception:
            return None

    def resolve_avatarUrl(self, info):
        """Get full avatar URL from user profile"""
        try:
            profile = getattr(self, 'profile', None)
            if profile and hasattr(profile, 'avatar'):
                avatar = getattr(profile, 'avatar', None)
                if avatar:
                    # Simple approach: construct URL manually
                    base_url = 'http://localhost:8000'  # Hardcoded for now
                    avatar_url = getattr(avatar, 'url', '')
                    url = f"{base_url}{avatar_url}"
                    username = getattr(self, 'username', 'unknown')
                    print(f"🔍 Avatar URL for {username}: {url}")
                    return url
            username = getattr(self, 'username', 'unknown')
            print(f"🔍 No avatar for {username}")
            return None
        except Exception as e:
            username = getattr(self, 'username', 'unknown')
            print(f"🔍 Error getting avatar URL for {username}: {e}")
            return None

    def resolve_profile(self, info):
        """Get user profile"""
        try:
            return self.profile
        except:
            return None

    def resolve_position(self, info):
        """Get position from user profile"""
        try:
            profile = getattr(self, 'profile', None)
            if profile and hasattr(profile, 'position'):
                return getattr(profile, 'position', None)
            return None
        except Exception:
            return None

    def resolve_department(self, info):
        """Get department from user profile"""
        try:
            profile = getattr(self, 'profile', None)
            if profile and hasattr(profile, 'department'):
                return getattr(profile, 'department', None)
            return None
        except Exception:
            return None


class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile
        fields = (
            "id",
            "user",
            "middle_name",
            "maternal_last_name",
            "preferred_name",
            "position",
            "department",
            "phone",
            "phone_country_code",
            "phone_type",
            "secondary_phone",
            "secondary_phone_type",
            "street_address",
            "apartment_suite",
            "city",
            "state_province",
            "zip_code",
            "country",
            "country_code",
            "bio",
            "education",
            "work_history",
            "profile_visibility",
            "avatar",
            "created_at",
            "updated_at",
        )

    # Explicitly define camelCase field names for JSON fields
    workHistory = graphene.JSONString(source="work_history")
    profileVisibility = graphene.JSONString(source="profile_visibility")

    # Add camelCase field mappings for frontend compatibility
    # Note: firstName, lastName, and isActive are accessed through the user relationship
    middleName = graphene.String()
    maternalLastName = graphene.String()
    preferredName = graphene.String()
    phoneCountryCode = graphene.String()
    phoneType = graphene.String()
    secondaryPhone = graphene.String()
    streetAddress = graphene.String()
    apartmentSuite = graphene.String()
    stateProvince = graphene.String()
    zipCode = graphene.String()
    createdAt = graphene.String()
    updatedAt = graphene.String()

    # Add avatar URL field
    avatarUrl = graphene.String()

    # Add explicit countryCode field for GraphQL compatibility
    countryCode = graphene.String()

    def resolve_countryCode(self, info):
        return getattr(self, "country_code", None)

    def resolve_avatarUrl(self, info):
        # Access avatar through the model instance
        avatar = getattr(self, "avatar", None)
        if avatar:
            # Check if context is available and has build_absolute_uri method
            if info.context and hasattr(info.context, 'build_absolute_uri'):
                return info.context.build_absolute_uri(avatar.url)
            else:
                # Fallback: construct URL manually
                base_url = 'http://localhost:8000'  # Hardcoded for now
                avatar_url = getattr(avatar, 'url', '')
                url = f"{base_url}{avatar_url}"
                return url
        return None

    def resolve_middleName(self, info):
        return getattr(self, "middle_name", "")

    def resolve_maternalLastName(self, info):
        return getattr(self, "maternal_last_name", "")

    def resolve_preferredName(self, info):
        return getattr(self, "preferred_name", "")

    def resolve_phoneCountryCode(self, info):
        return getattr(self, "phone_country_code", "")

    def resolve_phoneType(self, info):
        return getattr(self, "phone_type", "")

    def resolve_secondaryPhone(self, info):
        return getattr(self, "secondary_phone", "")

    def resolve_secondaryPhoneType(self, info):
        return getattr(self, "secondary_phone_type", "")

    def resolve_streetAddress(self, info):
        return getattr(self, "street_address", "")

    def resolve_apartmentSuite(self, info):
        return getattr(self, "apartment_suite", "")

    def resolve_stateProvince(self, info):
        return getattr(self, "state_province", "")

    def resolve_zipCode(self, info):
        return getattr(self, "zip_code", "")

    def resolve_createdAt(self, info):
        created_at = getattr(self, "created_at", None)
        return created_at.isoformat() if created_at else ""

    def resolve_updatedAt(self, info):
        updated_at = getattr(self, "updated_at", None)
        return updated_at.isoformat() if updated_at else ""


class ItemType(DjangoObjectType):
    class Meta:
        model = Item


class MessageType(DjangoObjectType):
    class Meta:
        model = Message


class ChatType(DjangoObjectType):
    class Meta:
        model = Chat
        fields = (
            "id",
            "chat_type",
            "name",
            "description",
            "user1",
            "user2",
            "members",
            "last_message",
            "last_activity",
            "is_active",
            "created_by",
            "avatar_url",
            "created_at",
            "updated_at",
        )


class SystemMessageType(DjangoObjectType):
    class Meta:
        model = SystemMessage
        fields = (
            "id",
            "recipient_id",
            "title",
            "message",
            "message_type",
            "link",
            "is_read",
            "created_at",
        )


class ContactType(DjangoObjectType):
    class Meta:
        model = Contact
        fields = (
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
            "ip_address",
            "user_agent",
            "created_at",
            "updated_at",
            "responded_at",
            "admin_notes",
            "assigned_to",
        )

    # Add computed fields
    full_name = graphene.String()

    def resolve_full_name(self, info):
        # Access fields through the model instance
        first_name = getattr(self, "first_name", "")
        last_name = getattr(self, "last_name", "")
        return f"{first_name} {last_name}".strip()


class DepartmentType(DjangoObjectType):
    class Meta:
        model = Department
        fields = (
            "id",
            "name",
            "description",
        )


class RoleType(DjangoObjectType):
    class Meta:
        model = Role
        fields = (
            "id",
            "title",
            "description",
            "department",
            "reports_to",
            "subordinates",
        )


class CountryType(DjangoObjectType):
    class Meta:
        model = Country
        fields = (
            "id",
            "name",
            "code",
            "flag_emoji",
            "phone_code",
            "is_active",
            "created_at",
            "updated_at",
        )


class StateType(DjangoObjectType):
    class Meta:
        model = State
        fields = (
            "id",
            "name",
            "code",
            "country",
            "is_active",
            "created_at",
            "updated_at",
        )


class CityType(DjangoObjectType):
    class Meta:
        model = City
        fields = (
            "id",
            "name",
            "state",
            "country",
            "is_active",
            "created_at",
            "updated_at",
        )


class ZipCodeType(DjangoObjectType):
    class Meta:
        model = ZipCode
        fields = (
            "id",
            "code",
            "city",
            "state",
            "country",
            "latitude",
            "longitude",
            "is_active",
            "created_at",
            "updated_at",
        )


class EmployeeType(DjangoObjectType):
    class Meta:
        model = Employee
        fields = (
            "id",
            "name",
            "email",
            "role",
            "user",
        )


class ActivityStatusType(DjangoObjectType):
    class Meta:
        model = ActivityStatus
        fields = (
            "id",
            "status",
            "display_name",
            "color_bg",
            "color_text",
            "color_border",
            "icon",
            "description",
            "is_active",
        )

    # Add camelCase field mappings for frontend compatibility
    displayName = graphene.String(source="display_name")
    colorBg = graphene.String(source="color_bg")
    colorText = graphene.String(source="color_text")
    colorBorder = graphene.String(source="color_border")


class ActivityPriorityType(DjangoObjectType):
    class Meta:
        model = ActivityPriority
        fields = (
            "id",
            "priority",
            "display_name",
            "color_bg",
            "color_text",
            "color_border",
            "description",
            "is_active",
        )

    # Add camelCase field mappings for frontend compatibility
    displayName = graphene.String(source="display_name")
    colorBg = graphene.String(source="color_bg")
    colorText = graphene.String(source="color_text")
    colorBorder = graphene.String(source="color_border")


class ActivityType(DjangoObjectType):
    class Meta:
        model = Activity
        fields = (
            "id",
            "title",
            "description",
            "type",
            "status",
            "priority",
            "status_config",
            "priority_config",
            "start_time",
            "end_time",
            "assigned_to",
            "assigned_by",
            "location",
            "progress",
            "estimated_duration",
            "actual_duration",
            "notes",
            "created_at",
            "updated_at",
            "created_by",
        )

    # Add camelCase field mappings for frontend compatibility
    statusConfig = graphene.Field(ActivityStatusType, source="status_config")
    priorityConfig = graphene.Field(ActivityPriorityType, source="priority_config")
    startTime = graphene.String(source="start_time")
    endTime = graphene.String(source="end_time")
    assignedTo = graphene.String(source="assigned_to")
    assignedBy = graphene.String(source="assigned_by")
    estimatedDuration = graphene.Int(source="estimated_duration")
    actualDuration = graphene.Int(source="actual_duration")
    createdAt = graphene.String(source="created_at")
    updatedAt = graphene.String(source="updated_at")
    createdBy = graphene.Field(UserType, source="created_by")


class UpdateType(DjangoObjectType):
    class Meta:
        model = Update
        fields = (
            "id",
            "type",
            "title",
            "summary",
            "body",
            "timestamp",
            "status",
            "tags",
            "author",
            "icon",
            "created_by",
            "is_active",
            "priority",
            "expires_at",
            "created_at",
            "updated_at",
        )

    # Add camelCase field mappings for frontend compatibility
    isActive = graphene.Boolean(source="is_active")
    expiresAt = graphene.String(source="expires_at")
    createdAt = graphene.String(source="created_at")
    updatedAt = graphene.String(source="updated_at")
    createdBy = graphene.Field(UserType, source="created_by")

    # Add interaction fields
    likes = graphene.List(lambda: UpdateLikeType)
    comments = graphene.List(lambda: UpdateCommentType)
    bookmarks = graphene.List(lambda: UpdateBookmarkType)
    likes_count = graphene.Int()
    dislikes_count = graphene.Int()
    comments_count = graphene.Int()
    bookmarks_count = graphene.Int()
    user_like_status = graphene.String()  # 'like', 'dislike', or None
    is_bookmarked = graphene.Boolean()

    def resolve_likes(self, info):
        """Get likes for this update"""
        return getattr(self, 'likes', UpdateLike.objects.none()).all()  # type: ignore

    def resolve_comments(self, info):
        """Get comments for this update"""
        return getattr(self, 'comments', UpdateComment.objects.none()).filter(is_active=True)  # type: ignore

    def resolve_bookmarks(self, info):
        """Get bookmarks for this update"""
        return getattr(self, 'bookmarks', UpdateBookmark.objects.none()).all()  # type: ignore

    def resolve_likes_count(self, info):
        """Get count of likes for this update"""
        return getattr(self, 'likes', UpdateLike.objects.none()).filter(is_like=True).count()  # type: ignore

    def resolve_dislikes_count(self, info):
        """Get count of dislikes for this update"""
        return getattr(self, 'likes', UpdateLike.objects.none()).filter(is_like=False).count()  # type: ignore

    def resolve_comments_count(self, info):
        """Get count of comments for this update"""
        return getattr(self, 'comments', UpdateComment.objects.none()).filter(is_active=True).count()  # type: ignore

    def resolve_bookmarks_count(self, info):
        """Get count of bookmarks for this update"""
        return getattr(self, 'bookmarks', UpdateBookmark.objects.none()).count()  # type: ignore

    def resolve_user_like_status(self, info):
        """Get current user's like status for this update"""
        user = info.context.user
        if not user or user.is_anonymous:
            return None
        
        try:
            likes_manager = getattr(self, 'likes', UpdateLike.objects.none())  # type: ignore
            like = likes_manager.get(user=user)
            return 'like' if like.is_like else 'dislike'
        except UpdateLike.DoesNotExist:  # type: ignore
            return None

    def resolve_is_bookmarked(self, info):
        """Check if current user has bookmarked this update"""
        user = info.context.user
        if not user or user.is_anonymous:
            return False
        
        bookmarks_manager = getattr(self, 'bookmarks', UpdateBookmark.objects.none())  # type: ignore
        return bookmarks_manager.filter(user=user).exists()


class UpdateLikeType(DjangoObjectType):
    class Meta:
        model = UpdateLike
        fields = ("id", "update", "user", "is_like", "created_at")

    createdAt = graphene.String(source="created_at")

    def resolve_created_at(self, info):
        created_at = getattr(self, 'created_at', None)
        return created_at.isoformat() if created_at else ""


class UpdateCommentType(DjangoObjectType):
    class Meta:
        model = UpdateComment
        fields = ("id", "update", "author", "content", "parent_comment", "is_active", "created_at", "updated_at")

    createdAt = graphene.String(source="created_at")
    updatedAt = graphene.String(source="updated_at")
    parentComment = graphene.Field(lambda: UpdateCommentType, source="parent_comment")
    replies = graphene.List(lambda: UpdateCommentType)
    can_edit = graphene.Boolean()
    can_delete = graphene.Boolean()

    def resolve_created_at(self, info):
        created_at = getattr(self, 'created_at', None)
        return created_at.isoformat() if created_at else ""

    def resolve_updated_at(self, info):
        updated_at = getattr(self, 'updated_at', None)
        return updated_at.isoformat() if updated_at else ""

    def resolve_replies(self, info):
        replies_method = getattr(self, 'get_replies', None)
        return replies_method() if replies_method else []

    def resolve_can_edit(self, info):
        user = info.context.user
        can_edit_method = getattr(self, 'can_edit', None)
        return can_edit_method(user) if user and not user.is_anonymous and can_edit_method else False

    def resolve_can_delete(self, info):
        user = info.context.user
        can_delete_method = getattr(self, 'can_delete', None)
        return can_delete_method(user) if user and not user.is_anonymous and can_delete_method else False


class UpdateBookmarkType(DjangoObjectType):
    class Meta:
        model = UpdateBookmark
        fields = ("id", "update", "user", "created_at")

    createdAt = graphene.String(source="created_at")

    def resolve_created_at(self, info):
        created_at = getattr(self, 'created_at', None)
        return created_at.isoformat() if created_at else ""


class Query(graphene.ObjectType):
    all_items = graphene.List(ItemType)

    # Chat and Message queries
    all_chats = graphene.List(ChatType)
    chat = graphene.Field(ChatType, id=graphene.String(required=True))
    user_chats = graphene.List(ChatType, user_id=graphene.ID())
    messages = graphene.List(
        MessageType,
        chat_id=graphene.String(required=True),
        chat_type=graphene.String(required=True),
    )
    system_messages = graphene.List(SystemMessageType, is_read=graphene.Boolean())
    user_profile = graphene.Field(UserProfileType)

    # Organizational hierarchy queries
    all_departments = graphene.List(DepartmentType)
    department = graphene.Field(DepartmentType, id=graphene.ID())
    all_roles = graphene.List(RoleType)
    role = graphene.Field(RoleType, id=graphene.ID())
    roles_by_department = graphene.List(RoleType, department_id=graphene.ID())
    all_employees = graphene.List(EmployeeType)
    employee = graphene.Field(EmployeeType, id=graphene.ID())
    employees_by_role = graphene.List(EmployeeType, role_id=graphene.ID())
    organizational_hierarchy = graphene.List(RoleType)

    # Location queries
    all_countries = graphene.List(CountryType)
    country = graphene.Field(CountryType, id=graphene.ID(), code=graphene.String())
    all_states = graphene.List(StateType, country_code=graphene.String())
    state = graphene.Field(StateType, id=graphene.ID())
    all_cities = graphene.List(
        CityType, state_id=graphene.ID(), country_code=graphene.String()
    )
    city = graphene.Field(CityType, id=graphene.ID())
    all_zipcodes = graphene.List(
        ZipCodeType, city_id=graphene.ID(), state_id=graphene.ID()
    )
    zipcode = graphene.Field(ZipCodeType, id=graphene.ID(), code=graphene.String())

    # Contact queries
    all_contacts = graphene.List(ContactType, status=graphene.String())
    contact = graphene.Field(ContactType, id=graphene.ID())
    contacts_by_inquiry_type = graphene.List(
        ContactType, inquiry_type=graphene.String()
    )

    # User queries
    all_users = graphene.List(UserType)

    # Activity queries
    all_activities = graphene.List(ActivityType)
    activity = graphene.Field(ActivityType, id=graphene.String(required=True))
    activities_by_status = graphene.List(ActivityType, status=graphene.String())
    activities_by_priority = graphene.List(ActivityType, priority=graphene.String())
    activities_by_type = graphene.List(ActivityType, type=graphene.String())
    
    # Project queries (projects are activities with type="Projects")
    all_projects = graphene.List(ActivityType)
    project = graphene.Field(ActivityType, id=graphene.String(required=True))
    projects_by_status = graphene.List(ActivityType, status=graphene.String())
    projects_by_priority = graphene.List(ActivityType, priority=graphene.String())

    # Update/News queries
    all_updates = graphene.List(UpdateType)
    update = graphene.Field(UpdateType, id=graphene.String(required=True))
    updates_by_type = graphene.List(UpdateType, type=graphene.String())
    updates_by_status = graphene.List(UpdateType, status=graphene.String())
    news_updates = graphene.List(UpdateType)  # Convenience query for news type
    
    # Comment queries
    update_comments = graphene.List(UpdateCommentType, update_id=graphene.String(required=True))
    comment = graphene.Field(UpdateCommentType, id=graphene.Int(required=True))
    
    # =====================================================
    # New optimized queries using streamlined models
    # =====================================================
    all_activities_new = graphene.List(
        ActivityType,
        type_filter=graphene.String(),
        status_filter=graphene.String(), 
        priority_filter=graphene.String(),
        assigned_to_filter=graphene.String(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    
    all_updates_new = graphene.List(
        UpdateType,
        type_filter=graphene.String(),
        status_filter=graphene.String(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )

    def resolve_all_items(self, info, **kwargs):
        return Item.objects.all()  # type: ignore

    # Chat resolvers
    def resolve_all_chats(self, info, **kwargs):
        return Chat.objects.filter(is_active=True).order_by("-last_activity")  # type: ignore

    def resolve_chat(self, info, id, **kwargs):
        try:
            return Chat.objects.get(id=id, is_active=True)  # type: ignore
        except Chat.DoesNotExist:  # type: ignore
            return None

    def resolve_user_chats(self, info, user_id=None, **kwargs):
        if user_id:
            return Chat.objects.filter(  # type: ignore
                models.Q(user1_id=user_id)  # type: ignore
                | models.Q(user2_id=user_id)  # type: ignore
                | models.Q(members__contains=user_id),  # type: ignore
                is_active=True,
            ).order_by("-last_activity")
        return Chat.objects.none()  # type: ignore

    def resolve_messages(self, info, chat_id, chat_type, **kwargs):
        return Message.objects.filter(chat_id=chat_id, chat_type=chat_type).order_by(  # type: ignore
            "timestamp"
        )

    def resolve_system_messages(self, info, is_read=None, **kwargs):
        # For now, return all system messages since we don't have user authentication
        messages = SystemMessage.objects.all()  # type: ignore
        if is_read is not None:
            messages = messages.filter(is_read=is_read)
        return messages.order_by("-created_at")

    def resolve_user_profile(self, info, **kwargs):
        # Check if user is authenticated
        try:
            user = info.context.user if info.context else None
            if user and user.is_authenticated:
                try:
                    # Try to get existing profile
                    return UserProfile.objects.get(user=user)  # type: ignore
                except UserProfile.DoesNotExist:  # type: ignore
                    # Create profile if it doesn't exist
                    profile = UserProfile.objects.create(user=user)  # type: ignore
                    print(f"Created new profile for user: {user.username}")
                    return profile
            else:
                # For development/testing, return first profile if available
                # This allows testing without authentication
                try:
                    return UserProfile.objects.first()  # type: ignore
                except:
                    return None
        except Exception as e:
            print(f"Error in resolve_user_profile: {e}")
            # Fallback: return first profile for development
            try:
                return UserProfile.objects.first()  # type: ignore
            except:
                return None

    def resolve_all_users(self, info, **kwargs):
        """Return all users with their profile information, excluding the current user"""
        # Get current user from context
        current_user = info.context.user if info.context else None

        if current_user and current_user.is_authenticated:
            # Exclude the current user from the list
            return (
                User.objects.filter(is_active=True)  # type: ignore
                .exclude(id=current_user.id)
                .order_by("username")
            )
        else:
            # If no authenticated user, return all active users
            return User.objects.filter(is_active=True).order_by("username")  # type: ignore

    # Organizational hierarchy resolvers
    def resolve_all_departments(self, info, **kwargs):
        return Department.objects.all().order_by("name")  # type: ignore

    def resolve_department(self, info, id, **kwargs):
        return Department.objects.get(pk=id)  # type: ignore

    def resolve_all_roles(self, info, **kwargs):
        return Role.objects.all().order_by("department__name", "title")  # type: ignore

    def resolve_role(self, info, id, **kwargs):
        return Role.objects.get(pk=id)  # type: ignore

    def resolve_roles_by_department(self, info, department_id, **kwargs):
        return Role.objects.filter(department_id=department_id).order_by("title")  # type: ignore

    def resolve_all_employees(self, info, **kwargs):
        return Employee.objects.all().order_by("name")  # type: ignore

    def resolve_employee(self, info, id, **kwargs):
        return Employee.objects.get(pk=id)  # type: ignore

    def resolve_employees_by_role(self, info, role_id, **kwargs):
        return Employee.objects.filter(role_id=role_id).order_by("name")  # type: ignore

    def resolve_organizational_hierarchy(self, info, **kwargs):
        """Return roles organized by hierarchy level, starting from top-level roles"""
        return Role.objects.filter(reports_to__isnull=True).order_by(  # type: ignore
            "department__name", "title"
        )

    # Location resolvers
    def resolve_all_countries(self, info, **kwargs):
        return Country.objects.filter(is_active=True).order_by("name")  # type: ignore

    def resolve_country(self, info, id=None, code=None, **kwargs):
        if id:
            return Country.objects.get(pk=id)  # type: ignore
        elif code:
            return Country.objects.get(code=code)  # type: ignore
        return None

    def resolve_all_states(self, info, country_code=None, **kwargs):
        if country_code:
            return State.objects.filter(  # type: ignore
                country__code=country_code, is_active=True
            ).order_by("name")
        return State.objects.filter(is_active=True).order_by("country__name", "name")  # type: ignore

    def resolve_state(self, info, id, **kwargs):
        return State.objects.get(pk=id)  # type: ignore

    def resolve_all_cities(self, info, state_id=None, country_code=None, **kwargs):
        if state_id:
            return City.objects.filter(state_id=state_id, is_active=True).order_by(  # type: ignore
                "name"
            )
        elif country_code:
            return City.objects.filter(  # type: ignore
                country__code=country_code, is_active=True
            ).order_by("state__name", "name")
        return City.objects.filter(is_active=True).order_by(  # type: ignore
            "country__name", "state__name", "name"
        )

    def resolve_city(self, info, id, **kwargs):
        return City.objects.get(pk=id)  # type: ignore

    def resolve_all_zipcodes(self, info, city_id=None, state_id=None, **kwargs):
        if city_id:
            return ZipCode.objects.filter(city_id=city_id, is_active=True).order_by(  # type: ignore
                "code"
            )
        elif state_id:
            return ZipCode.objects.filter(state_id=state_id, is_active=True).order_by(  # type: ignore
                "code"
            )
        return ZipCode.objects.filter(is_active=True).order_by(  # type: ignore
            "country__name", "state__name", "city__name", "code"
        )

    def resolve_zipcode(self, info, id=None, code=None, **kwargs):
        if id:
            return ZipCode.objects.get(pk=id)  # type: ignore
        elif code:
            return ZipCode.objects.get(code=code)  # type: ignore
        return None

    # Contact resolvers
    def resolve_all_contacts(self, info, status=None, **kwargs):
        contacts = Contact.objects.all()  # type: ignore
        if status:
            contacts = contacts.filter(status=status)
        return contacts.order_by("-created_at")

    def resolve_contact(self, info, id, **kwargs):
        return Contact.objects.get(pk=id)  # type: ignore

    def resolve_contacts_by_inquiry_type(self, info, inquiry_type, **kwargs):
        return Contact.objects.filter(inquiry_type=inquiry_type).order_by("-created_at")  # type: ignore

    # Activity resolvers
    def resolve_all_activities(self, info, **kwargs):
        return Activity.objects.filter().order_by("-created_at")  # type: ignore

    def resolve_activity(self, info, id, **kwargs):
        return Activity.objects.get(pk=id)  # type: ignore

    def resolve_activities_by_status(self, info, status, **kwargs):
        return Activity.objects.filter(status=status).order_by("-created_at")  # type: ignore

    def resolve_activities_by_priority(self, info, priority, **kwargs):
        return Activity.objects.filter(priority=priority).order_by("-created_at")  # type: ignore

    def resolve_activities_by_type(self, info, type, **kwargs):
        return Activity.objects.filter(type=type).order_by("-created_at")  # type: ignore

    # Project resolvers (projects are activities with type="Projects")
    def resolve_all_projects(self, info, **kwargs):
        return Activity.objects.filter(type="Projects").order_by("-created_at")  # type: ignore

    def resolve_project(self, info, id, **kwargs):
        return Activity.objects.get(pk=id, type="Projects")  # type: ignore

    def resolve_projects_by_status(self, info, status, **kwargs):
        return Activity.objects.filter(type="Projects", status=status).order_by("-created_at")  # type: ignore

    def resolve_projects_by_priority(self, info, priority, **kwargs):
        return Activity.objects.filter(type="Projects", priority=priority).order_by("-created_at")  # type: ignore

    # Update/News resolvers
    def resolve_all_updates(self, info, **kwargs):
        return Update.objects.filter(is_active=True).order_by("-priority", "-timestamp")  # type: ignore

    def resolve_update(self, info, id, **kwargs):
        return Update.objects.get(pk=id)  # type: ignore

    def resolve_updates_by_type(self, info, type, **kwargs):
        return Update.objects.filter(type=type, is_active=True).order_by("-priority", "-timestamp")  # type: ignore

    def resolve_updates_by_status(self, info, status, **kwargs):
        return Update.objects.filter(status=status, is_active=True).order_by("-priority", "-timestamp")  # type: ignore

    def resolve_news_updates(self, info, **kwargs):
        return Update.objects.filter(type=Update.UPDATE_TYPE_NEWS, is_active=True).order_by("-priority", "-timestamp")  # type: ignore

    def resolve_update_comments(self, info, update_id, **kwargs):
        """Get all comments for a specific update"""
        try:
            update = Update.objects.get(id=update_id)  # type: ignore
            return UpdateComment.objects.filter(  # type: ignore
                update=update,
                is_active=True,
                parent_comment__isnull=True  # Only top-level comments
            ).select_related('author').order_by('created_at')
        except Update.DoesNotExist:  # type: ignore
            return []

    def resolve_comment(self, info, id, **kwargs):
        """Get a specific comment by ID"""
        try:
            return UpdateComment.objects.get(id=id, is_active=True)  # type: ignore
        except UpdateComment.DoesNotExist:  # type: ignore
            return None

    # =====================================================
    # NEW OPTIMIZED RESOLVERS FOR DATABASE REWRITE
    # These provide better performance and cleaner data access
    # =====================================================
    
    # New Activity Resolvers using the streamlined models
    def resolve_all_activities_new(self, info, type_filter=None, status_filter=None, 
                              priority_filter=None, assigned_to_filter=None, 
                              limit=None, offset=None, **kwargs):
        """Optimized resolver for all activities with filtering"""
        queryset = Activity.objects.select_related('status_config', 'priority_config', 'created_by')  # type: ignore
        
        # Apply filters
        if type_filter:
            queryset = queryset.filter(type__icontains=type_filter)
        if status_filter:
            queryset = queryset.filter(status__icontains=status_filter)
        if priority_filter:
            queryset = queryset.filter(priority__icontains=priority_filter)
        if assigned_to_filter:
            queryset = queryset.filter(assigned_to__icontains=assigned_to_filter)
        
        # Order by creation date (newest first)
        queryset = queryset.order_by('-created_at')
        
        # Apply pagination
        if offset:
            queryset = queryset[offset:]
        if limit:
            queryset = queryset[:limit]
            
        return queryset

    # New Update Resolvers using the streamlined models  
    def resolve_all_updates_new(self, info, type_filter=None, status_filter=None,
                           active_only=True, limit=None, offset=None, **kwargs):
        """Optimized resolver for all updates with filtering"""
        queryset = Update.objects.select_related('created_by')  # type: ignore
        
        # Apply filters
        if active_only:
            queryset = queryset.filter(is_active=True)
        if type_filter:
            queryset = queryset.filter(type=type_filter)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Order by priority and timestamp
        queryset = queryset.order_by('-priority', '-timestamp')
        
        # Apply pagination
        if offset:
            queryset = queryset[offset:]
        if limit:
            queryset = queryset[:limit]
            
        return queryset


# Temporarily commented out to debug schema loading
# class CreateItem(graphene.Mutation):
#     class Arguments:
#         name = graphene.String()
#         description = graphene.String()
#
#     ok = graphene.Boolean()
#     item = graphene.Field(ItemType)
#
#     @classmethod
#     def mutate(cls, root, info, name, description):
#         item = Item(name=name, description=description)
#         item.save()
#         result = CreateItem()
#         result.ok = True
#         result.item = item
#         return result


# Temporarily commented out to debug schema loading
# class CreateChat(graphene.Mutation):
#     class Arguments:
#         chat_type = graphene.String(required=True)
#         name = graphene.String(required=False)
#         description = graphene.String(required=False)
#         user1_id = graphene.ID(required=False)
#         user2_id = graphene.ID(required=False)
#         member_ids = graphene.List(graphene.ID, required=False)
#
#     ok = graphene.Boolean()
#     chat = graphene.Field(ChatType)
#     error = graphene.String()
#
#     @classmethod
#     def mutate(cls, root, info, chat_type, **kwargs):
#         try:
#             import uuid
#
#             chat_data = {
#                 'id': str(uuid.uuid4()),
#                 'chat_type': chat_type,
#                 'name': kwargs.get('name', ''),
#                 'description': kwargs.get('description', ''),
#             }
#
#             if chat_type == 'user':
#                 user1_id = kwargs.get('user1_id')
#                 user2_id = kwargs.get('user2_id')
#                 if not user1_id or not user2_id:
#                     result = cls()
#                     result.ok = False
#                     result.error = "user1_id and user2_id are required for user chats"
#                     return result
#
#                 chat_data['user1_id'] = user1_id
#                 chat_data['user2_id'] = user2_id
#
#             elif chat_type == 'group':
#                 member_ids = kwargs.get('member_ids', [])
#                 if not member_ids:
#                     result = cls()
#                     result.ok = False
#                     result.error = "member_ids are required for group chats"
#                     return result
#
#                 chat_data['members'] = member_ids
#                 if 'name' not in kwargs or not kwargs['name']:
#                     result = cls()
#                     result.ok = False
#                     result.error = "name is required for group chats"
#                     return result
#
#             chat = Chat(**chat_data)
#             chat.save()
#
#             result = cls()
#             result.ok = True
#             result.chat = chat
#             return result
#
#         except Exception as e:
#             result = cls()
#             result.ok = False
#             result.error = str(e)
#             return result


# Restored message creation functionality
class CreateMessage(graphene.Mutation):
    class Arguments:
        chat_id = graphene.String(required=True)
        chat_type = graphene.String(required=True)
        sender_id = graphene.String(required=True)
        sender_name = graphene.String(required=True)
        content = graphene.String(required=False)
        message_type = graphene.String(required=True)
        file_name = graphene.String(required=False)
        file_size = graphene.String(required=False)
        file_url = graphene.String(required=False)

    ok = graphene.Boolean()
    message = graphene.Field(MessageType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            message = Message(**kwargs)
            message.save()
            result = CreateMessage()
            result.ok = True
            result.message = message
            return result
        except Exception as e:
            result = CreateMessage()
            result.ok = False
            result.message = None
            print(f"Error creating message: {e}")
            return result


# Temporarily commented out to debug schema loading
# class MarkSystemMessageAsRead(graphene.Mutation):
#     class Arguments:
#         message_id = graphene.ID(required=True)
#
#     ok = graphene.Boolean()
#     system_message = graphene.Field(SystemMessageType)
#
#     @classmethod
#     def mutate(cls, root, info, message_id):
#         try:
#             message = SystemMessage.objects.get(id=message_id)
#             message.is_read = True
#             message.save()
#             result = MarkSystemMessageAsRead()
#             result.ok = True
#             result.system_message = message
#             return result
#         except SystemMessage.DoesNotExist:
#             raise Exception("System message not found.")


class UpdateUserProfile(graphene.Mutation):
    class Arguments:
        # User fields
        email = graphene.String()
        firstName = graphene.String()
        lastName = graphene.String()

        # Profile fields
        middleName = graphene.String()
        maternalLastName = graphene.String()
        preferredName = graphene.String()
        position = graphene.String()
        department = graphene.String()
        phone = graphene.String()
        phoneCountryCode = graphene.String()
        phoneType = graphene.String()
        secondaryPhone = graphene.String()
        streetAddress = graphene.String()
        apartmentSuite = graphene.String()
        city = graphene.String()
        stateProvince = graphene.String()
        zipCode = graphene.String()
        country = graphene.String()
        countryCode = graphene.String()
        bio = graphene.String()
        education = graphene.String()  # JSON string
        workHistory = graphene.String()  # JSON string
        profileVisibility = graphene.String()  # JSON string
        isActive = graphene.Boolean()

    ok = graphene.Boolean()
    userProfile = graphene.Field(UserProfileType)
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.errors = ["Authentication required"]
            return result

        try:
            # Update User fields
            user_fields = ["email", "firstName", "lastName"]
            for field in user_fields:
                if field in kwargs and kwargs[field] is not None:
                    # Map camelCase to snake_case for Django model
                    django_field = field.replace("firstName", "first_name").replace(
                        "lastName", "last_name"
                    )
                    setattr(user, django_field, kwargs[field])

            # Handle isActive field
            if "isActive" in kwargs and kwargs["isActive"] is not None:
                user.is_active = kwargs["isActive"]

            user.save()

            # Get or create profile
            profile, created = UserProfile.objects.get_or_create(user=user)  # type: ignore

            # Update Profile fields
            profile_fields = [
                "middleName",
                "maternalLastName",
                "preferredName",
                "position",
                "department",
                "phone",
                "phoneCountryCode",
                "phoneType",
                "secondaryPhone",
                "secondaryPhoneType",
                "streetAddress",
                "apartmentSuite",
                "city",
                "stateProvince",
                "zipCode",
                "country",
                "countryCode",
                "bio",
                "education",
                "workHistory",
                "profileVisibility",
            ]

            for field in profile_fields:
                if field in kwargs and kwargs[field] is not None:
                    # Map camelCase to snake_case for Django model
                    django_field = (
                        field.replace("middleName", "middle_name")
                        .replace("maternalLastName", "maternal_last_name")
                        .replace("preferredName", "preferred_name")
                        .replace("phoneCountryCode", "phone_country_code")
                        .replace("phoneType", "phone_type")
                        .replace("secondaryPhone", "secondary_phone")
                        .replace("secondaryPhoneType", "secondary_phone_type")
                        .replace("streetAddress", "street_address")
                        .replace("apartmentSuite", "apartment_suite")
                        .replace("stateProvince", "state_province")
                        .replace("zipCode", "zip_code")
                        .replace("workHistory", "work_history")
                        .replace("profileVisibility", "profile_visibility")
                    )
                    setattr(profile, django_field, kwargs[field])

            # Handle JSON fields
            import json

            json_fields = ["education", "workHistory", "profileVisibility"]
            for field in json_fields:
                if field in kwargs and kwargs[field] is not None:
                    try:
                        # Map camelCase to snake_case for Django model
                        django_field = field.replace(
                            "workHistory", "work_history"
                        ).replace("profileVisibility", "profile_visibility")
                        setattr(profile, django_field, json.loads(kwargs[field]))
                    except json.JSONDecodeError:
                        result = cls()
                        result.ok = False
                        result.errors = [f"Invalid JSON for {field}"]
                        return result

            profile.save()

            result = cls()
            result.ok = True
            result.userProfile = profile
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.errors = [str(e)]
            return result


class ChangePassword(graphene.Mutation):
    class Arguments:
        current_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    ok = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, current_password, new_password):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.errors = ["Authentication required"]
            return result

        if not user.check_password(current_password):
            result = cls()
            result.ok = False
            result.errors = ["Current password is incorrect"]
            return result

        if len(new_password) < 8:
            result = cls()
            result.ok = False
            result.errors = ["Password must be at least 8 characters"]
            return result

        user.set_password(new_password)
        user.save()

        result = cls()
        result.ok = True
        result.errors = []
        return result


class CreateContact(graphene.Mutation):
    class Arguments:
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        company = graphene.String(required=True)
        subject = graphene.String(required=True)
        message = graphene.String(required=True)
        inquiry_type = graphene.String(required=False)
        phone = graphene.String(required=False)

    ok = graphene.Boolean()
    contact = graphene.Field(ContactType)
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            # Get request data for additional fields
            request = info.context
            if hasattr(request, "META"):
                kwargs["ip_address"] = cls.get_client_ip(request)
                kwargs["user_agent"] = request.META.get("HTTP_USER_AGENT", "")

            # Create contact
            contact = Contact.objects.create(**kwargs)  # type: ignore

            # Log the contact submission
            import logging

            logger = logging.getLogger(__name__)
            logger.info(
                f"New contact submission from {contact.email}: {contact.subject}"
            )

            result = cls()
            result.ok = True
            result.contact = contact
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.errors = [str(e)]
            return result

    @staticmethod
    def get_client_ip(request):
        """Get client IP address from request"""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip


# Profile field is not needed since avatar data is available directly on UserType

class UploadAvatar(graphene.Mutation):
    """Mutation for uploading user avatar"""

    class Arguments:
        avatar = graphene.String(required=True)  # Base64 encoded image data

    ok = graphene.Boolean()
    userProfile = graphene.Field(UserProfileType)
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, avatar):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.errors = ["Authentication required"]
            return result

        try:
            import base64
            import uuid
            from django.core.files.base import ContentFile
            from django.core.files.storage import default_storage
            
            # Get user profile
            user_profile, created = UserProfile.objects.get_or_create(user=user)  # type: ignore
            
            # Decode base64 image data
            if avatar.startswith('data:image/'):
                # Remove data URL prefix (e.g., 'data:image/png;base64,')
                format, imgstr = avatar.split(';base64,')
                file_extension = format.split('/')[-1]
            else:
                # Assume it's already base64 encoded
                imgstr = avatar
                file_extension = 'png'  # Default to PNG
            
            # Generate unique filename
            filename = f"avatar_{user.username}_{uuid.uuid4().hex[:8]}.{file_extension}"
            
            # Create ContentFile from base64 data
            image_data = base64.b64decode(imgstr)
            image_file = ContentFile(image_data, name=filename)
            
            # Delete old avatar if exists
            if user_profile.avatar:
                try:
                    default_storage.delete(user_profile.avatar.name)
                except:
                    pass  # Ignore if file doesn't exist
            
            # Save new avatar
            user_profile.avatar.save(filename, image_file, save=True)
            
            result = cls()
            result.ok = True
            result.userProfile = user_profile
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.errors = [str(e)]
            return result


# =====================================================
# Update Interaction Mutations
# =====================================================

class ToggleLike(graphene.Mutation):
    """Toggle like/dislike on an update"""
    
    class Arguments:
        update_id = graphene.String(required=True)
        is_like = graphene.Boolean(required=True)  # True for like, False for dislike
    
    success = graphene.Boolean()
    message = graphene.String()
    like_status = graphene.String()  # 'like', 'dislike', or None
    likes_count = graphene.Int()
    dislikes_count = graphene.Int()
    
    @classmethod
    def mutate(cls, root, info, update_id, is_like):
        user = info.context.user
        if not user or user.is_anonymous:
            result = cls()
            result.success = False
            result.message = "Authentication required"
            result.like_status = None
            result.likes_count = 0
            result.dislikes_count = 0
            return result
        
        try:
            update = Update.objects.get(id=update_id)  # type: ignore
            
            # Get or create the like/dislike
            like_obj, created = UpdateLike.objects.get_or_create(  # type: ignore
                update=update,
                user=user,
                defaults={'is_like': is_like}
            )
            
            if not created:
                # If it already exists, toggle it
                if like_obj.is_like == is_like:
                    # Same action, remove the like/dislike
                    like_obj.delete()
                    like_status = None
                else:
                    # Different action, update it
                    like_obj.is_like = is_like
                    like_obj.save()
                    like_status = 'like' if is_like else 'dislike'
            else:
                # New like/dislike created
                like_status = 'like' if is_like else 'dislike'
            
            # Get updated counts
            likes_count = update.likes.filter(is_like=True).count()  # type: ignore
            dislikes_count = update.likes.filter(is_like=False).count()  # type: ignore
            
            result = cls()
            result.success = True
            result.message = "Like status updated successfully"
            result.like_status = like_status
            result.likes_count = likes_count
            result.dislikes_count = dislikes_count
            return result
            
        except Update.DoesNotExist:  # type: ignore
            result = cls()
            result.success = False
            result.message = "Update not found"
            result.like_status = None
            result.likes_count = 0
            result.dislikes_count = 0
            return result
        except Exception as e:
            result = cls()
            result.success = False
            result.message = f"Error updating like status: {str(e)}"
            result.like_status = None
            result.likes_count = 0
            result.dislikes_count = 0
            return result


class ToggleBookmark(graphene.Mutation):
    """Toggle bookmark on an update"""
    
    class Arguments:
        update_id = graphene.String(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    is_bookmarked = graphene.Boolean()
    bookmarks_count = graphene.Int()
    
    @classmethod
    def mutate(cls, root, info, update_id):
        user = info.context.user
        if not user or user.is_anonymous:
            result = cls()
            result.success = False
            result.message = "Authentication required"
            result.is_bookmarked = False
            result.bookmarks_count = 0
            return result
        
        try:
            update = Update.objects.get(id=update_id)  # type: ignore
            
            # Check if already bookmarked
            bookmark, created = UpdateBookmark.objects.get_or_create(  # type: ignore
                update=update,
                user=user
            )
            
            if not created:
                # Already bookmarked, remove it
                bookmark.delete()
                is_bookmarked = False
            else:
                # New bookmark created
                is_bookmarked = True
            
            # Get updated count
            bookmarks_count = update.bookmarks.count()  # type: ignore
            
            result = cls()
            result.success = True
            result.message = "Bookmark status updated successfully"
            result.is_bookmarked = is_bookmarked
            result.bookmarks_count = bookmarks_count
            return result
            
        except Update.DoesNotExist:  # type: ignore
            result = cls()
            result.success = False
            result.message = "Update not found"
            result.is_bookmarked = False
            result.bookmarks_count = 0
            return result
        except Exception as e:
            result = cls()
            result.success = False
            result.message = f"Error updating bookmark status: {str(e)}"
            result.is_bookmarked = False
            result.bookmarks_count = 0
            return result


class CreateComment(graphene.Mutation):
    """Create a comment on an update"""
    
    class Arguments:
        update_id = graphene.String(required=True)
        content = graphene.String(required=True)
        parent_comment_id = graphene.Int(required=False)
    
    success = graphene.Boolean()
    message = graphene.String()
    comment = graphene.Field(UpdateCommentType)
    
    @classmethod
    def mutate(cls, root, info, update_id, content, parent_comment_id=None):
        user = info.context.user
        if not user or user.is_anonymous:
            result = cls()
            result.success = False
            result.message = "Authentication required"
            result.comment = None
            return result
        
        try:
            update = Update.objects.get(id=update_id)  # type: ignore
            
            # Validate parent comment if provided
            parent_comment = None
            if parent_comment_id:
                try:
                    parent_comment = UpdateComment.objects.get(  # type: ignore
                        id=parent_comment_id,
                        update=update,
                        is_active=True
                    )
                except UpdateComment.DoesNotExist:  # type: ignore
                    result = cls()
                    result.success = False
                    result.message = "Parent comment not found"
                    result.comment = None
                    return result
            
            # Create the comment
            comment = UpdateComment.objects.create(  # type: ignore
                update=update,
                author=user,
                content=content,
                parent_comment=parent_comment
            )
            
            result = cls()
            result.success = True
            result.message = "Comment created successfully"
            result.comment = comment
            return result
            
        except Update.DoesNotExist:  # type: ignore
            result = cls()
            result.success = False
            result.message = "Update not found"
            result.comment = None
            return result
        except Exception as e:
            result = cls()
            result.success = False
            result.message = f"Error creating comment: {str(e)}"
            result.comment = None
            return result


class UpdateCommentMutation(graphene.Mutation):
    """Update a comment"""
    
    class Arguments:
        comment_id = graphene.Int(required=True)
        content = graphene.String(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    comment = graphene.Field(UpdateCommentType)
    
    @classmethod
    def mutate(cls, root, info, comment_id, content):
        user = info.context.user
        if not user or user.is_anonymous:
            result = cls()
            result.success = False
            result.message = "Authentication required"
            result.comment = None
            return result
        
        try:
            comment = UpdateComment.objects.get(id=comment_id)  # type: ignore
            
            # Check if user can edit this comment
            can_edit_method = getattr(comment, 'can_edit', None)
            if not can_edit_method or not can_edit_method(user):
                result = cls()
                result.success = False
                result.message = "You don't have permission to edit this comment"
                result.comment = None
                return result
            
            # Update the comment
            comment.content = content
            comment.save()
            
            result = cls()
            result.success = True
            result.message = "Comment updated successfully"
            result.comment = comment
            return result
            
        except UpdateComment.DoesNotExist:  # type: ignore
            result = cls()
            result.success = False
            result.message = "Comment not found"
            result.comment = None
            return result
        except Exception as e:
            result = cls()
            result.success = False
            result.message = f"Error updating comment: {str(e)}"
            result.comment = None
            return result


class DeleteComment(graphene.Mutation):
    """Delete a comment"""
    
    class Arguments:
        comment_id = graphene.Int(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    
    @classmethod
    def mutate(cls, root, info, comment_id):
        user = info.context.user
        if not user or user.is_anonymous:
            result = cls()
            result.success = False
            result.message = "Authentication required"
            return result
        
        try:
            comment = UpdateComment.objects.get(id=comment_id)  # type: ignore
            
            # Check if user can delete this comment
            can_delete_method = getattr(comment, 'can_delete', None)
            if not can_delete_method or not can_delete_method(user):
                result = cls()
                result.success = False
                result.message = "You don't have permission to delete this comment"
                return result
            
            # Soft delete the comment
            comment.is_active = False
            comment.save()
            
            result = cls()
            result.success = True
            result.message = "Comment deleted successfully"
            return result
            
        except UpdateComment.DoesNotExist:  # type: ignore
            result = cls()
            result.success = False
            result.message = "Comment not found"
            return result
        except Exception as e:
            result = cls()
            result.success = False
            result.message = f"Error deleting comment: {str(e)}"
            return result


class Mutation(graphene.ObjectType):
    # create_item = CreateItem.Field()  # Temporarily commented out
    # create_chat = CreateChat.Field()  # Temporarily commented out
    create_message = CreateMessage.Field()  # Restored for message functionality
    # mark_system_message_as_read = MarkSystemMessageAsRead.Field()  # Temporarily commented out
    update_user_profile = UpdateUserProfile.Field()
    change_password = ChangePassword.Field()
    create_contact = CreateContact.Field()
    upload_avatar = UploadAvatar.Field()
    
    # Update interaction mutations
    toggle_like = ToggleLike.Field()
    toggle_bookmark = ToggleBookmark.Field()
    create_comment = CreateComment.Field()
    update_comment = UpdateCommentMutation.Field()
    delete_comment = DeleteComment.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
