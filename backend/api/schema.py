from django.contrib.auth.models import User

import graphene
from graphene_django.types import DjangoObjectType

from api.models import (
    City,
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

    # Explicitly define camelCase field names for JSON fields
    workHistory = graphene.JSONString(source="work_history")
    profileVisibility = graphene.JSONString(source="profile_visibility")


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


class Mutation(graphene.ObjectType):
    create_item = CreateItem.Field()
    create_message = CreateMessage.Field()
    mark_system_message_as_read = MarkSystemMessageAsRead.Field()
    update_user_profile = UpdateUserProfile.Field()
    change_password = ChangePassword.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
