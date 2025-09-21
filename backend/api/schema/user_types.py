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
    dateJoined = graphene.DateTime(source="date_joined")
    lastLogin = graphene.DateTime(source="last_login")

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
                    return url
            username = getattr(self, "username", "unknown")
            return None
        except Exception as e:
            username = getattr(self, "username", "unknown")
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
            "lastnamem",
            "preferred_name",
            "father_name",
            "birthname",
            "gender",
            "marital_status",
            "identity_mark",
            "medical_fitness",
            "character_certificate",
            "height",
            "position",
            "department",
            "company",
            "employment_status",
            "employment_type",
            "start_date",
            "salary",
            "currency",
            "work_location",
            "manager",
            "employee_id",
            "work_email",
            "work_phone",
            "work_phone_type",
            "work_address",
            "work_city",
            "work_state",
            "work_zip_code",
            "work_country",
            "work_country_code",
            "work_schedule",
            "work_hours",
            "work_days",
            "work_time_zone",
            "work_language",
            "work_language_level",
            "work_skills",
            "work_certifications",
            "work_awards",
            "work_notes",
            "phonecc1",
            "phone1",
            "phonet1",
            "phonecc2",
            "phone2",
            "phonet2",
            "street_address",
            "apartment_suite",
            "city",
            "state_province",
            "zip_code",
            "country",
            "country_code",
            "bio",
            "short_bio",
            "website",
            "linkedin",
            "twitter",
            "github",
            "facebook",
            "instagram",
            "education",
            "work_history",
            "profile_visibility",
            "avatar",
        )

    # Add camelCase field mappings
    middleName = graphene.String(source="middle_name")
    maternalLastName = graphene.String(source="maternal_last_name")
    preferredName = graphene.String(source="preferred_name")
    fatherName = graphene.String(source="father_name")
    dateOfBirth = graphene.Date(source="date_of_birth")
    maritalStatus = graphene.String(source="marital_status")
    identityMark = graphene.String(source="identity_mark")
    medicalFitness = graphene.Boolean(source="medical_fitness")
    characterCertificate = graphene.Boolean(source="character_certificate")
    employmentStatus = graphene.String(source="employment_status")
    employmentType = graphene.String(source="employment_type")
    startDate = graphene.Date(source="start_date")
    workLocation = graphene.String(source="work_location")
    employeeId = graphene.String(source="employee_id")
    workEmail = graphene.String(source="work_email")
    workPhone = graphene.String(source="work_phone")
    workPhoneType = graphene.String(source="work_phone_type")
    workAddress = graphene.String(source="work_address")
    workCity = graphene.String(source="work_city")
    workState = graphene.String(source="work_state")
    workZipCode = graphene.String(source="work_zip_code")
    workCountry = graphene.String(source="work_country")
    workCountryCode = graphene.String(source="work_country_code")
    workSchedule = graphene.String(source="work_schedule")
    workHours = graphene.String(source="work_hours")
    workDays = graphene.String(source="work_days")
    workTimeZone = graphene.String(source="work_time_zone")
    workLanguage = graphene.String(source="work_language")
    workLanguageLevel = graphene.String(source="work_language_level")
    workSkills = graphene.String(source="work_skills")
    workCertifications = graphene.String(source="work_certifications")
    workAwards = graphene.String(source="work_awards")
    workNotes = graphene.String(source="work_notes")
    phonecc1 = graphene.String(source="phonecc1")
    phone1 = graphene.String(source="phone1")
    phonet1 = graphene.String(source="phonet1")
    phonecc2 = graphene.String(source="phonecc2")
    phone2 = graphene.String(source="phone2")
    phonet2 = graphene.String(source="phonet2")
    streetAddress = graphene.String(source="street_address")
    apartmentSuite = graphene.String(source="apartment_suite")
    stateProvince = graphene.String(source="state_province")
    zipCode = graphene.String(source="zip_code")
    countryCode = graphene.String(source="country_code")
    shortBio = graphene.String(source="short_bio")
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

    # Explicit field mappings for new field names
    lastnamem = graphene.String(source="lastnamem")
    birthname = graphene.Date(source="birthname")

    def resolve_avatarUrl(self, info):
        """Get full avatar URL"""
        if self.avatar:  # type: ignore
            try:
                # Simple approach: construct URL manually
                base_url = "http://localhost:8000"  # Hardcoded for now
                avatar_url = getattr(self.avatar, "url", "")  # type: ignore
                url = f"{base_url}{avatar_url}"
                username = getattr(self.user, "username", "unknown") if self.user else "unknown"  # type: ignore
                return url
            except Exception as e:
                username = getattr(self.user, "username", "unknown") if self.user else "unknown"  # type: ignore
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
