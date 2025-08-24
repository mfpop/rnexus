from django.contrib.auth.models import User

import graphene
from graphene_django.types import DjangoObjectType

from api.models import (
    Department,
    Employee,
    Item,
    Message,
    Role,
    SystemMessage,
    UserProfile,
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
            "created_at",
            "updated_at",
        )


class ItemType(DjangoObjectType):
    class Meta:
        model = Item


class MessageType(DjangoObjectType):
    class Meta:
        model = Message


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

    def resolve_all_items(self, info, **kwargs):
        return Item.objects.all()

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
        # For now, return the first user profile since we don't have user authentication
        return UserProfile.objects.first()

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


class CreateItem(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        description = graphene.String()

    ok = graphene.Boolean()
    item = graphene.Field(ItemType)

    @classmethod
    def mutate(cls, root, info, name, description):
        item = Item(name=name, description=description)
        item.save()
        result = CreateItem()
        result.ok = True
        result.item = item
        return result


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
        message = Message(**kwargs)
        message.save()
        result = CreateMessage()
        result.ok = True
        result.message = message
        return result


class MarkSystemMessageAsRead(graphene.Mutation):
    class Arguments:
        message_id = graphene.ID(required=True)

    ok = graphene.Boolean()
    system_message = graphene.Field(SystemMessageType)

    @classmethod
    def mutate(cls, root, info, message_id):
        try:
            message = SystemMessage.objects.get(id=message_id)
            message.is_read = True
            message.save()
            result = MarkSystemMessageAsRead()
            result.ok = True
            result.system_message = message
            return result
        except SystemMessage.DoesNotExist:
            raise Exception("System message not found.")


class UpdateUserProfile(graphene.Mutation):
    class Arguments:
        # User fields
        email = graphene.String()
        first_name = graphene.String()
        last_name = graphene.String()

        # Profile fields
        middle_name = graphene.String()
        maternal_last_name = graphene.String()
        preferred_name = graphene.String()
        position = graphene.String()
        department = graphene.String()
        phone = graphene.String()
        phone_country_code = graphene.String()
        phone_type = graphene.String()
        secondary_phone = graphene.String()
        street_address = graphene.String()
        apartment_suite = graphene.String()
        city = graphene.String()
        state_province = graphene.String()
        zip_code = graphene.String()
        country = graphene.String()
        bio = graphene.String()
        education = graphene.String()  # JSON string
        work_history = graphene.String()  # JSON string
        profile_visibility = graphene.String()  # JSON string
        is_active = graphene.Boolean()

    ok = graphene.Boolean()
    user_profile = graphene.Field(UserProfileType)
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
            user_fields = ["email", "first_name", "last_name"]
            for field in user_fields:
                if field in kwargs and kwargs[field] is not None:
                    setattr(user, field, kwargs[field])

            # Handle is_active field
            if "is_active" in kwargs and kwargs["is_active"] is not None:
                user.is_active = kwargs["is_active"]

            user.save()

            # Get or create profile
            profile, created = UserProfile.objects.get_or_create(user=user)

            # Update Profile fields
            profile_fields = [
                "middle_name",
                "maternal_last_name",
                "preferred_name",
                "position",
                "department",
                "phone",
                "phone_country_code",
                "phone_type",
                "secondary_phone",
                "street_address",
                "apartment_suite",
                "city",
                "state_province",
                "zip_code",
                "country",
                "bio",
            ]

            for field in profile_fields:
                if field in kwargs and kwargs[field] is not None:
                    setattr(profile, field, kwargs[field])

            # Handle JSON fields
            import json

            json_fields = ["education", "work_history", "profile_visibility"]
            for field in json_fields:
                if field in kwargs and kwargs[field] is not None:
                    try:
                        setattr(profile, field, json.loads(kwargs[field]))
                    except json.JSONDecodeError:
                        result = cls()
                        result.ok = False
                        result.errors = [f"Invalid JSON for {field}"]
                        return result

            profile.save()

            result = cls()
            result.ok = True
            result.user_profile = profile
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


class Mutation(graphene.ObjectType):
    create_item = CreateItem.Field()
    create_message = CreateMessage.Field()
    mark_system_message_as_read = MarkSystemMessageAsRead.Field()
    update_user_profile = UpdateUserProfile.Field()
    change_password = ChangePassword.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
