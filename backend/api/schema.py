from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

import graphene
from graphene_django.types import DjangoObjectType

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
    UserProfile,
    ZipCode,
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

    def resolve_avatar(self, info):
        """Get avatar filename from user profile"""
        try:
            profile = self.profile
            return profile.avatar.name if profile.avatar else None
        except:
            return None

    def resolve_avatarUrl(self, info):
        """Get full avatar URL from user profile"""
        try:
            profile = self.profile
            if profile.avatar:
                return info.context.build_absolute_uri(profile.avatar.url)
            return None
        except:
            return None

    def resolve_profile(self, info):
        """Get user profile"""
        try:
            return self.profile
        except:
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

    def resolve_avatarUrl(self, info):
        # Access avatar through the model instance
        avatar = getattr(self, "avatar", None)
        if avatar:
            return info.context.build_absolute_uri(avatar.url)
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

    def resolve_all_items(self, info, **kwargs):
        return Item.objects.all()

    # Chat resolvers
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

    def resolve_messages(self, info, chat_id, chat_type, **kwargs):
        return Message.objects.filter(chat_id=chat_id, chat_type=chat_type).order_by(
            "timestamp"
        )

    def resolve_system_messages(self, info, is_read=None, **kwargs):
        # For now, return all system messages since we don't have user authentication
        messages = SystemMessage.objects.all()
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
                    return UserProfile.objects.get(user=user)
                except UserProfile.DoesNotExist:
                    # Create profile if it doesn't exist
                    profile = UserProfile.objects.create(user=user)
                    print(f"Created new profile for user: {user.username}")
                    return profile
            else:
                # For development/testing, return first profile if available
                # This allows testing without authentication
                try:
                    return UserProfile.objects.first()
                except:
                    return None
        except Exception as e:
            print(f"Error in resolve_user_profile: {e}")
            # Fallback: return first profile for development
            try:
                return UserProfile.objects.first()
            except:
                return None

    def resolve_all_users(self, info, **kwargs):
        """Return all users with their profile information, excluding the current user"""
        # Get current user from context
        current_user = info.context.user if info.context else None

        if current_user and current_user.is_authenticated:
            # Exclude the current user from the list
            return (
                User.objects.filter(is_active=True)
                .exclude(id=current_user.id)
                .order_by("username")
            )
        else:
            # If no authenticated user, return all active users
            return User.objects.filter(is_active=True).order_by("username")

    # Organizational hierarchy resolvers
    def resolve_all_departments(self, info, **kwargs):
        return Department.objects.all().order_by("name")

    def resolve_department(self, info, id, **kwargs):
        return Department.objects.get(pk=id)

    def resolve_all_roles(self, info, **kwargs):
        return Role.objects.all().order_by("department__name", "title")

    def resolve_role(self, info, id, **kwargs):
        return Role.objects.get(pk=id)

    def resolve_roles_by_department(self, info, department_id, **kwargs):
        return Role.objects.filter(department_id=department_id).order_by("title")

    def resolve_all_employees(self, info, **kwargs):
        return Employee.objects.all().order_by("name")

    def resolve_employee(self, info, id, **kwargs):
        return Employee.objects.get(pk=id)

    def resolve_employees_by_role(self, info, role_id, **kwargs):
        return Employee.objects.filter(role_id=role_id).order_by("name")

    def resolve_organizational_hierarchy(self, info, **kwargs):
        """Return roles organized by hierarchy level, starting from top-level roles"""
        return Role.objects.filter(reports_to__isnull=True).order_by(
            "department__name", "title"
        )

    # Location resolvers
    def resolve_all_countries(self, info, **kwargs):
        return Country.objects.filter(is_active=True).order_by("name")

    def resolve_country(self, info, id=None, code=None, **kwargs):
        if id:
            return Country.objects.get(pk=id)
        elif code:
            return Country.objects.get(code=code)
        return None

    def resolve_all_states(self, info, country_code=None, **kwargs):
        if country_code:
            return State.objects.filter(
                country__code=country_code, is_active=True
            ).order_by("name")
        return State.objects.filter(is_active=True).order_by("country__name", "name")

    def resolve_state(self, info, id, **kwargs):
        return State.objects.get(pk=id)

    def resolve_all_cities(self, info, state_id=None, country_code=None, **kwargs):
        if state_id:
            return City.objects.filter(state_id=state_id, is_active=True).order_by(
                "name"
            )
        elif country_code:
            return City.objects.filter(
                country__code=country_code, is_active=True
            ).order_by("state__name", "name")
        return City.objects.filter(is_active=True).order_by(
            "country__name", "state__name", "name"
        )

    def resolve_city(self, info, id, **kwargs):
        return City.objects.get(pk=id)

    def resolve_all_zipcodes(self, info, city_id=None, state_id=None, **kwargs):
        if city_id:
            return ZipCode.objects.filter(city_id=city_id, is_active=True).order_by(
                "code"
            )
        elif state_id:
            return ZipCode.objects.filter(state_id=state_id, is_active=True).order_by(
                "code"
            )
        return ZipCode.objects.filter(is_active=True).order_by(
            "country__name", "state__name", "city__name", "code"
        )

    def resolve_zipcode(self, info, id=None, code=None, **kwargs):
        if id:
            return ZipCode.objects.get(pk=id)
        elif code:
            return ZipCode.objects.get(code=code)
        return None

    # Contact resolvers
    def resolve_all_contacts(self, info, status=None, **kwargs):
        contacts = Contact.objects.all()
        if status:
            contacts = contacts.filter(status=status)
        return contacts.order_by("-created_at")

    def resolve_contact(self, info, id, **kwargs):
        return Contact.objects.get(pk=id)

    def resolve_contacts_by_inquiry_type(self, info, inquiry_type, **kwargs):
        return Contact.objects.filter(inquiry_type=inquiry_type).order_by("-created_at")


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
            profile, created = UserProfile.objects.get_or_create(user=user)

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
            contact = Contact.objects.create(**kwargs)

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

# Temporarily commented out to debug schema loading
# class UploadAvatar(graphene.Mutation):
#     """Mutation for uploading user avatar"""
#
#     class Arguments:
#         avatar = graphene.String(required=True)  # Base64 encoded image
#
#     ok = graphene.Boolean()
#     userProfile = graphene.Field(UserProfileType)
#     errors = graphene.List(graphene.String)
#
#     @classmethod
#     def mutate(cls, root, info, avatar):
#         user = info.context.user
#         if not user.is_authenticated:
#             result = cls()
#             result.ok = False
#             result.errors = ["Authentication required"]
#             return result
#
#         try:
#             # Simple test - just return success for now
#             result = cls()
#             result.ok = True
#             result.userProfile = None
#             result.errors = []
#             return result
#
#         except Exception as e:
#             result = cls()
#             result.ok = False
#             result.errors = [str(e)]
#             return result


class Mutation(graphene.ObjectType):
    # create_item = CreateItem.Field()  # Temporarily commented out
    # create_chat = CreateChat.Field()  # Temporarily commented out
    create_message = CreateMessage.Field()  # Restored for message functionality
    # mark_system_message_as_read = MarkSystemMessageAsRead.Field()  # Temporarily commented out
    update_user_profile = UpdateUserProfile.Field()
    change_password = ChangePassword.Field()
    create_contact = CreateContact.Field()
    # upload_avatar = UploadAvatar.Field()  # Temporarily commented out


schema = graphene.Schema(query=Query, mutation=Mutation)
