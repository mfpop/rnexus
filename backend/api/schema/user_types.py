from typing import Any, List, Optional, Union

from django.contrib.auth.models import User
from django.db import models

import graphene
from graphene_django.types import DjangoObjectType

from api.models import UserBlock, UserFavorite, UserProfile


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
            profile = getattr(self, "profile", None)
            if profile and hasattr(profile, "avatar"):
                avatar = getattr(profile, "avatar", None)
                if avatar:
                    return getattr(avatar, "name", None)
            return None
        except Exception:
            return None

    def resolve_avatarUrl(self, info):
        """Get full avatar URL from user profile"""
        try:
            profile = getattr(self, "profile", None)
            if profile and hasattr(profile, "avatar"):
                avatar = getattr(profile, "avatar", None)
                if avatar:
                    # Simple approach: construct URL manually
                    base_url = "http://localhost:8000"  # Hardcoded for now
                    avatar_url = getattr(avatar, "url", "")
                    url = f"{base_url}{avatar_url}"
                    username = getattr(self, "username", "unknown")
                    print(f"🔍 Avatar URL for {username}: {url}")
                    return url
            username = getattr(self, "username", "unknown")
            print(f"🔍 No avatar for {username}")
            return None
        except Exception as e:
            username = getattr(self, "username", "unknown")
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
            profile = getattr(self, "profile", None)
            if profile and hasattr(profile, "position"):
                return getattr(profile, "position", None)
            return None
        except Exception:
            return None

    def resolve_department(self, info):
        """Get department from user profile"""
        try:
            profile = getattr(self, "profile", None)
            if profile and hasattr(profile, "department"):
                return getattr(profile, "department", None)
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
        )

    # Add camelCase field mappings
    middleName = graphene.String(source="middle_name")
    maternalLastName = graphene.String(source="maternal_last_name")
    preferredName = graphene.String(source="preferred_name")
    phoneCountryCode = graphene.String(source="phone_country_code")
    phoneType = graphene.String(source="phone_type")
    secondaryPhone = graphene.String(source="secondary_phone")
    secondaryPhoneType = graphene.String(source="secondary_phone_type")
    streetAddress = graphene.String(source="street_address")
    apartmentSuite = graphene.String(source="apartment_suite")
    stateProvince = graphene.String(source="state_province")
    zipCode = graphene.String(source="zip_code")
    countryCode = graphene.String(source="country_code")
    education = graphene.JSONString(source="education")
    workHistory = graphene.JSONString(source="work_history")
    profileVisibility = graphene.JSONString(source="profile_visibility")

    # Add computed fields
    fullName = graphene.String()
    avatarUrl = graphene.String()

    def resolve_fullName(self, info):
        """Get full name combining first, middle, and last names"""
        first = getattr(self.user, "first_name", "") if self.user else ""  # type: ignore
        middle = getattr(self, "middle_name", "") or ""
        last = getattr(self.user, "last_name", "") if self.user else ""  # type: ignore
        maternal = getattr(self, "maternal_last_name", "") or ""

        parts = [part for part in [first, middle, last, maternal] if part]
        return " ".join(parts) if parts else ""

    def resolve_avatarUrl(self, info):
        """Get full avatar URL"""
        if self.avatar:  # type: ignore
            try:
                # Simple approach: construct URL manually
                base_url = "http://localhost:8000"  # Hardcoded for now
                avatar_url = getattr(self.avatar, "url", "")  # type: ignore
                url = f"{base_url}{avatar_url}"
                username = getattr(self.user, "username", "unknown") if self.user else "unknown"  # type: ignore
                print(f"🔍 Profile avatar URL for {username}: {url}")
                return url
            except Exception as e:
                username = getattr(self.user, "username", "unknown") if self.user else "unknown"  # type: ignore
                print(f"🔍 Error getting profile avatar URL for {username}: {e}")
                return None
        return None


class UserFavoriteType(DjangoObjectType):
    class Meta:
        model = UserFavorite
        fields = ("id", "user", "favorite_user", "created_at")

    createdAt = graphene.DateTime(source="created_at")


class UserBlockType(DjangoObjectType):
    class Meta:
        model = UserBlock
        fields = ("id", "user", "blocked_user", "created_at")

    createdAt = graphene.DateTime(source="created_at")
