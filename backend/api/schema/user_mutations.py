import graphene
from graphene_django.types import DjangoObjectType
from django.contrib.auth.models import User

from api.models import UserProfile

from .user_types import UserProfileType, UserType


class RegisterUser(graphene.Mutation):
    """Mutation for user registration with optional avatar"""

    ok = graphene.Boolean()
    user = graphene.Field(lambda: UserType)  # Import will be added
    user_profile = graphene.Field(UserProfileType)
    errors = graphene.List(graphene.String)

    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        avatar = graphene.String()  # Base64 encoded image

    def mutate(self, info, email, password, first_name, last_name, avatar=None):
        try:
            # Check if user already exists
            if User.objects.filter(email=email).exists():  # type: ignore
                result = RegisterUser()
                result.ok = False
                result.user = None
                result.user_profile = None
                result.errors = ["Email already exists"]
                return result

            # Create user
            user = User.objects.create_user(  # type: ignore
                username=email,  # Use email as username for simplicity
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )

            # Create user profile (use get_or_create to avoid duplicates)
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    # Add any default profile settings here
                }
            )

            # Handle avatar upload if provided
            if avatar:
                try:
                    # Decode base64 image
                    import base64

                    from django.core.files.base import ContentFile

                    # Remove data URL prefix if present
                    if avatar.startswith("data:image"):
                        avatar = avatar.split(",")[1]

                    # Decode base64
                    image_data = base64.b64decode(avatar)

                    # Create image file
                    image_file = ContentFile(
                        image_data, name=f"{user.username}_avatar.jpg"
                    )

                    # Save to profile
                    profile.avatar.save(
                        f"{user.username}_avatar.jpg", image_file, save=True
                    )

                except Exception as e:
                    print(f"Avatar upload failed: {e}")
                    # Don't fail registration if avatar upload fails

            result = RegisterUser()
            result.ok = True
            result.user = user
            result.user_profile = profile
            result.errors = []
            return result

        except Exception as e:
            print(f"Registration failed: {e}")
            result = RegisterUser()
            result.ok = False
            result.user = None
            result.user_profile = None
            result.errors = [str(e)]
            return result


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
            result.userProfile = None
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
            if avatar.startswith("data:image/"):
                # Remove data URL prefix (e.g., 'data:image/png;base64,')
                format, imgstr = avatar.split(";base64,")
                file_extension = format.split("/")[-1]
            else:
                # Assume it's already base64 encoded
                imgstr = avatar
                file_extension = "png"  # Default to PNG

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
            result.userProfile = None
            result.errors = [str(e)]
            return result


class UpdateUserProfile(graphene.Mutation):
    """Mutation for updating user profile"""

    class Arguments:
        # Basic user fields (for updating the User model)
        email = graphene.String()
        first_name = graphene.String()
        last_name = graphene.String()

        # Enhanced name fields
        middle_name = graphene.String()
        maternal_last_name = graphene.String()
        preferred_name = graphene.String()

        # Professional information
        position = graphene.String()
        department = graphene.String()

        # Phone information
        phone = graphene.String()
        phone_country_code = graphene.String()
        phone_type = graphene.String()
        secondary_phone = graphene.String()
        secondary_phone_country_code = graphene.String()
        secondary_phone_type = graphene.String()

        # Address information
        street_address = graphene.String()
        apartment_suite = graphene.String()
        city = graphene.String()
        state_province = graphene.String()
        zip_code = graphene.String()
        country = graphene.String()
        country_code = graphene.String()

        # Extended profile fields
        bio = graphene.String()
        education = graphene.String()  # JSON string
        work_history = graphene.String()  # JSON string
        profile_visibility = graphene.String()  # JSON string

        # Emergency contact information
        emergency_contact_name = graphene.String()
        emergency_contact_relationship = graphene.String()
        emergency_contact_phone = graphene.String()
        emergency_contact_phone_country_code = graphene.String()

        # Date fields
        date_of_birth = graphene.Date()
        hire_date = graphene.Date()
        termination_date = graphene.Date()

        # Status fields
        is_active = graphene.Boolean()
        notes = graphene.String()

    ok = graphene.Boolean()
    userProfile = graphene.Field(UserProfileType)
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.userProfile = None
            result.errors = ["Authentication required"]
            return result

        try:
            # Get or create user profile
            user_profile, created = UserProfile.objects.get_or_create(user=user)  # type: ignore

            # Debug: Log all received kwargs
            print(f"DEBUG: UpdateUserProfile received kwargs: {kwargs}")

            # Fields that should update the User model
            user_fields = ["email", "first_name", "last_name"]
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
                "secondary_phone_country_code",
                "secondary_phone_type",
                "street_address",
                "apartment_suite",
                "city",
                "state_province",
                "zip_code",
                "country",
                "country_code",
                "bio",
                "notes",
                "emergency_contact_name",
                "emergency_contact_relationship",
                "emergency_contact_phone",
                "emergency_contact_phone_country_code",
                "date_of_birth",
                "hire_date",
                "termination_date",
                "is_active",
            ]
            json_fields = ["education", "work_history", "profile_visibility"]

            # Debug: Log address fields specifically
            address_fields = ["street_address", "apartment_suite", "city", "state_province", "zip_code", "country", "country_code"]
            address_data = {field: kwargs.get(field) for field in address_fields if field in kwargs}
            print(f"DEBUG: Address fields received: {address_data}")

            # Update user fields
            for field in user_fields:
                if field in kwargs and kwargs[field] is not None:
                    setattr(user, field, kwargs[field])

            if any(
                field in kwargs and kwargs[field] is not None for field in user_fields
            ):
                user.save()

            # Update profile fields
            for field in profile_fields:
                if field in kwargs and kwargs[field] is not None:
                    setattr(user_profile, field, kwargs[field])

            # Update JSON fields (parse JSON strings)
            for field in json_fields:
                if field in kwargs and kwargs[field] is not None:
                    try:
                        import json

                        parsed_value = json.loads(kwargs[field])
                        setattr(user_profile, field, parsed_value)
                    except (json.JSONDecodeError, TypeError) as e:
                        result = cls()
                        result.ok = False
                        result.userProfile = None
                        result.errors = [f"Invalid JSON for {field}: {str(e)}"]
                        return result

            user_profile.save()

            # Debug: Log what was saved
            saved_address_data = {field: getattr(user_profile, field) for field in address_fields}
            print(f"DEBUG: Address fields saved to database: {saved_address_data}")

            result = cls()
            result.ok = True
            result.userProfile = user_profile
            result.errors = []
            return result

        except Exception as e:
            print(f"DEBUG: UpdateUserProfile error: {str(e)}")
            result = cls()
            result.ok = False
            result.userProfile = None
            result.errors = [str(e)]
            return result


class ChangePassword(graphene.Mutation):
    """Mutation for changing user password"""

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

        try:
            # Check current password
            if not user.check_password(current_password):
                result = cls()
                result.ok = False
                result.errors = ["Current password is incorrect"]
                return result

            # Set new password
            user.set_password(new_password)
            user.save()

            result = cls()
            result.ok = True
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.errors = [str(e)]
            return result


# Import UserType at the end to avoid circular imports
from .user_types import UserType
