from django.contrib.auth.models import User
from django.db import models

import graphene

from api.models import (
    Activity,
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
    UpdateComment,
    UserBlock,
    UserFavorite,
    ZipCode,
)

from .activity_schema import ActivityType, UpdateCommentType, UpdateType
from .chat_schema import ChatType, MessageType, SystemMessageType
from .common_types import (
    CityType,
    ContactType,
    CountryType,
    DepartmentType,
    EmployeeType,
    ItemType,
    RoleType,
    StateType,
    ZipCodeType,
)
from .user_types import UserBlockType, UserFavoriteType, UserProfileType, UserType


class Query(graphene.ObjectType):
    # Item queries
    all_items = graphene.List(ItemType)

    # Chat and Message queries
    all_chats = graphene.List(ChatType)
    chat = graphene.Field(ChatType, id=graphene.String(required=True))
    user_chats = graphene.List(ChatType, user_id=graphene.ID())
    archived_chats = graphene.List(ChatType)
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
    user_favorites = graphene.List(UserFavoriteType)
    user_blocks = graphene.List(UserBlockType)

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
    update_comments = graphene.List(
        UpdateCommentType, update_id=graphene.String(required=True)
    )
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
        offset=graphene.Int(),
    )

    all_updates_new = graphene.List(
        UpdateType,
        type_filter=graphene.String(),
        status_filter=graphene.String(),
        limit=graphene.Int(),
        offset=graphene.Int(),
    )

    # Resolver methods would go here - abbreviated for brevity
    def resolve_all_items(self, info, **kwargs):
        return Item.objects.all()

    def resolve_all_chats(self, info, **kwargs):
        return Chat.objects.filter(is_active=True).order_by("-last_activity")

    def resolve_chat(self, info, id, **kwargs):
        try:
            return Chat.objects.get(id=id, is_active=True)
        except Chat.DoesNotExist:
            return None

    def resolve_user_chats(self, info, user_id=None, **kwargs):
        if user_id:
            return Chat.objects.filter(
                models.Q(user1_id=user_id)
                | models.Q(user2_id=user_id)
                | models.Q(members__contains=user_id),
                is_active=True,
            ).order_by("-last_activity")
        return Chat.objects.none()

    def resolve_archived_chats(self, info, **kwargs):
        """Get archived chats for the current user"""
        user = info.context.user
        if not user or user.is_anonymous:
            return []

        try:
            return Chat.objects.filter(
                models.Q(user1=user)
                | models.Q(user2=user)
                | models.Q(members__contains=str(user.id)),
                is_archived=True,
                is_active=True,
            ).order_by("-archived_at")
        except Exception as e:
            print(f"Error loading archived chats: {e}")
            return []

    def resolve_messages(self, info, chat_id, chat_type, **kwargs):
        return Message.objects.filter(chat_id=chat_id, chat_type=chat_type).order_by(
            "timestamp"
        )

    def resolve_system_messages(self, info, is_read=None, **kwargs):
        user = info.context.user
        if user and not user.is_anonymous:
            messages = SystemMessage.objects.filter(recipient_id=str(user.id))
        else:
            # If no authenticated user, return empty queryset
            messages = SystemMessage.objects.none()

        if is_read is not None:
            messages = messages.filter(is_read=is_read)
        return messages.order_by("-created_at")

    def resolve_all_users(self, info, **kwargs):
        """Resolve all users - requires authentication"""
        user = info.context.user
        if user and not user.is_anonymous:
            # Return all active users
            return User.objects.filter(is_active=True).order_by("username")
        else:
            # If no authenticated user, return empty queryset
            return User.objects.none()

    def resolve_user_profile(self, info, **kwargs):
        user = info.context.user
        if user and not user.is_anonymous:
            try:
                return user.profile
            except:
                return None
        return None

    # Activity resolvers
    def resolve_all_activities(self, info, **kwargs):
        return Activity.objects.all().order_by("-created_at")

    def resolve_activity(self, info, id, **kwargs):
        try:
            return Activity.objects.get(id=id)
        except Activity.DoesNotExist:
            return None

    def resolve_activities_by_status(self, info, status, **kwargs):
        return Activity.objects.filter(status=status).order_by("-created_at")

    def resolve_activities_by_priority(self, info, priority, **kwargs):
        return Activity.objects.filter(priority=priority).order_by("-created_at")

    def resolve_activities_by_type(self, info, type, **kwargs):
        return Activity.objects.filter(type=type).order_by("-created_at")

    # Project resolvers (projects are activities with type="Projects")
    def resolve_all_projects(self, info, **kwargs):
        return Activity.objects.filter(type="Projects").order_by("-created_at")

    def resolve_project(self, info, id, **kwargs):
        try:
            return Activity.objects.get(id=id, type="Projects")
        except Activity.DoesNotExist:
            return None

    def resolve_projects_by_status(self, info, status, **kwargs):
        return Activity.objects.filter(type="Projects", status=status).order_by(
            "-created_at"
        )

    def resolve_projects_by_priority(self, info, priority, **kwargs):
        return Activity.objects.filter(type="Projects", priority=priority).order_by(
            "-created_at"
        )

    # Update/News resolvers
    def resolve_all_updates(self, info, **kwargs):
        return Update.objects.all().order_by("-created_at")

    def resolve_update(self, info, id, **kwargs):
        try:
            return Update.objects.get(id=id)
        except Update.DoesNotExist:
            return None

    def resolve_updates_by_type(self, info, type, **kwargs):
        return Update.objects.filter(type=type).order_by("-created_at")

    def resolve_updates_by_status(self, info, status, **kwargs):
        return Update.objects.filter(status=status).order_by("-created_at")

    def resolve_news_updates(self, info, **kwargs):
        return Update.objects.filter(type="news").order_by("-created_at")

    def resolve_update_comments(self, info, **kwargs):
        return UpdateComment.objects.all().order_by("-created_at")

    def resolve_comment(self, info, **kwargs):
        return UpdateComment.objects.all().order_by("-created_at")

    # New optimized resolvers
    def resolve_all_activities_new(
        self,
        info,
        type_filter=None,
        status_filter=None,
        priority_filter=None,
        assigned_to_filter=None,
        limit=None,
        offset=None,
        **kwargs,
    ):
        queryset = Activity.objects.all()

        if type_filter:
            queryset = queryset.filter(type=type_filter)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if priority_filter:
            queryset = queryset.filter(priority=priority_filter)
        if assigned_to_filter:
            queryset = queryset.filter(assigned_to__icontains=assigned_to_filter)

        queryset = queryset.order_by("-created_at")

        if offset:
            queryset = queryset[offset:]
        if limit:
            queryset = queryset[:limit]

        return queryset

    def resolve_all_updates_new(
        self,
        info,
        type_filter=None,
        status_filter=None,
        limit=None,
        offset=None,
        **kwargs,
    ):
        queryset = Update.objects.all()

        if type_filter:
            queryset = queryset.filter(type=type_filter)
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        queryset = queryset.order_by("-created_at")

        if offset:
            queryset = queryset[offset:]
        if limit:
            queryset = queryset[:limit]

        return queryset

    # Add more resolver methods as needed...
