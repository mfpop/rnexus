from django.db import models

import graphene
from graphene_django import DjangoObjectType

from api.models import (
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
    UserBlock,
    UserFavorite,
    ZipCode,
)

from .activity_schema import (
    ActivityPriorityType,
    ActivityStatusType,
    ActivityType,
    UpdateBookmarkType,
    UpdateCommentType,
    UpdateLikeType,
    UpdateType,
)
from .chat_schema import ChatType, MessageType, SystemMessageType
from .user_types import UserBlockType, UserFavoriteType, UserProfileType, UserType


class ItemType(DjangoObjectType):
    class Meta:
        model = Item
        fields = ("id", "name", "description")


class DepartmentType(DjangoObjectType):
    class Meta:
        model = Department
        fields = ("name", "description")

    isActive = graphene.Boolean(source="is_active")


class RoleType(DjangoObjectType):
    class Meta:
        model = Role
        fields = ("title", "description", "department", "reports_to")

    isActive = graphene.Boolean(source="is_active")


class CountryType(DjangoObjectType):
    class Meta:
        model = Country
        fields = ("id", "name", "code", "is_active")

    isActive = graphene.Boolean(source="is_active")


class StateType(DjangoObjectType):
    class Meta:
        model = State
        fields = ("id", "name", "code", "country", "is_active")

    isActive = graphene.Boolean(source="is_active")


class CityType(DjangoObjectType):
    class Meta:
        model = City
        fields = ("id", "name", "state", "country", "is_active")

    isActive = graphene.Boolean(source="is_active")


class ZipCodeType(DjangoObjectType):
    class Meta:
        model = ZipCode
        fields = ("id", "code", "city", "state", "country", "is_active")

    isActive = graphene.Boolean(source="is_active")


class EmployeeType(DjangoObjectType):
    class Meta:
        model = Employee
        fields = ("name", "email", "role", "user")

    hireDate = graphene.Date(source="hire_date")
    terminationDate = graphene.Date(source="termination_date")
    isActive = graphene.Boolean(source="is_active")


class ContactType(DjangoObjectType):
    class Meta:
        model = Contact
        fields = (
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

    firstName = graphene.String(source="first_name")
    lastName = graphene.String(source="last_name")
    inquiryType = graphene.String(source="inquiry_type")
    ipAddress = graphene.String(source="ip_address")
    userAgent = graphene.String(source="user_agent")
    createdAt = graphene.DateTime(source="created_at")
    updatedAt = graphene.DateTime(source="updated_at")
    respondedAt = graphene.DateTime(source="responded_at")
    adminNotes = graphene.String(source="admin_notes")
    assignedTo = graphene.Field(lambda: UserType)


# Import UserType at the end to avoid circular imports
from .user_types import UserType
