#!/usr/bin/env python
"""
Script to create sample user profiles for testing the profile page
"""

import os
import sys

import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User
from django.utils import timezone

from api.models import UserProfile


def create_sample_user_profiles():
    """Create sample user profiles for testing"""

    print("🏭 Creating sample user profiles...")

    # Check if users already exist
    if User.objects.exists():
        print("✅ Users already exist, creating profiles for them...")

        # Create profiles for existing users
        for user in User.objects.all():
            profile, created = UserProfile.objects.get_or_create(
                user=user,
                defaults={
                    "middle_name": "Sample",
                    "maternal_last_name": "Family",
                    "preferred_name": user.first_name,
                    "position": "Software Developer",
                    "department": "Engineering",
                    "phone": "+1-555-0123",
                    "phonecc1": "+1",
                    "phonet1": "mobile",
                    "phone2": "+1-555-0456",
                    "street_address": "123 Main Street",
                    "apartment_suite": "Apt 4B",
                    "city": "San Francisco",
                    "state_province": "CA",
                    "zip_code": "94105",
                    "country": "United States",
                    "bio": f"This is a sample profile for {user.first_name} {user.last_name}.",
                    "education": [
                        {
                            "id": "1",
                            "school": "University of Technology",
                            "degree": "Bachelor of Science",
                            "field": "Computer Science",
                            "startYear": "2018",
                            "endYear": "2022",
                            "description": "Studied software engineering and web development",
                            "visible": True,
                        }
                    ],
                    "work_history": [
                        {
                            "id": "1",
                            "company": "Tech Solutions Inc.",
                            "title": "Junior Developer",
                            "department": "Engineering",
                            "startYear": "2022",
                            "endYear": "2024",
                            "description": "Developed web applications using React and Django",
                            "visible": True,
                        }
                    ],
                    "profile_visibility": {
                        "education": True,
                        "work_history": True,
                        "position": True,
                        "contact": True,
                        "bio": True,
                    },
                },
            )

            if created:
                print(f"✅ Created profile for {user.username}")
            else:
                print(f"ℹ️  Profile already exists for {user.username}")

    else:
        print("📝 No users exist, creating sample users with profiles...")

        # Create sample users with profiles
        sample_users = [
            {
                "username": "john.doe",
                "email": "john.doe@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "position": "Plant Manager",
                "department": "Production",
                "phone": "+1-555-0001",
                "city": "Detroit",
                "state_province": "MI",
                "zip_code": "48201",
                "country": "United States",
            },
            {
                "username": "jane.smith",
                "email": "jane.smith@example.com",
                "first_name": "Jane",
                "last_name": "Smith",
                "position": "Quality Manager",
                "department": "Quality Assurance",
                "phone": "+1-555-0002",
                "city": "Detroit",
                "state_province": "MI",
                "zip_code": "48201",
                "country": "United States",
            },
            {
                "username": "mike.johnson",
                "email": "mike.johnson@example.com",
                "first_name": "Mike",
                "last_name": "Johnson",
                "position": "Maintenance Manager",
                "department": "Maintenance",
                "phone": "+1-555-0003",
                "city": "Detroit",
                "state_province": "MI",
                "zip_code": "48201",
                "country": "United States",
            },
        ]

        for user_data in sample_users:
            # Create user
            user = User.objects.create_user(
                username=user_data["username"],
                email=user_data["email"],
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                password="password123",
                is_active=True,
            )

            # Create profile
            profile = UserProfile.objects.create(
                user=user,
                middle_name="Sample",
                maternal_last_name="Family",
                preferred_name=user_data["first_name"],
                position=user_data["position"],
                department=user_data["department"],
                phone1=user_data["phone"],
                phonecc1="+1",
                phonet1="mobile",
                phone2="+1-555-0456",
                street_address="123 Main Street",
                apartment_suite="Apt 4B",
                city=user_data["city"],
                state_province=user_data["state_province"],
                zip_code=user_data["zip_code"],
                country=user_data["country"],
                bio=f'This is a sample profile for {user_data["first_name"]} {user_data["last_name"]}, {user_data["position"]} in {user_data["department"]}.',
                education=[
                    {
                        "id": "1",
                        "school": "University of Technology",
                        "degree": "Bachelor of Science",
                        "field": "Engineering",
                        "startYear": "2018",
                        "endYear": "2022",
                        "description": "Studied engineering and management",
                        "visible": True,
                    }
                ],
                work_history=[
                    {
                        "id": "1",
                        "company": "Manufacturing Corp.",
                        "title": user_data["position"],
                        "department": user_data["department"],
                        "startYear": "2022",
                        "endYear": "2024",
                        "description": f'Managing {user_data["department"]} operations',
                        "visible": True,
                    }
                ],
                profile_visibility={
                    "education": True,
                    "work_history": True,
                    "position": True,
                    "contact": True,
                    "bio": True,
                },
            )

            print(f"✅ Created user {user.username} with profile")

    # Display summary
    total_profiles = UserProfile.objects.count()
    total_users = User.objects.count()

    print(f"\n📊 Summary:")
    print(f"   Total Users: {total_users}")
    print(f"   Total Profiles: {total_profiles}")

    if total_profiles > 0:
        print(f"\n🔍 Sample profile data:")
        sample_profile = UserProfile.objects.first()
        if sample_profile:
            print(f"   User: {sample_profile.user.username}")
            print(f"   Position: {sample_profile.position}")
            print(f"   Department: {sample_profile.department}")
            print(f"   Phone: {sample_profile.phone1}")
            print(f"   City: {sample_profile.city}")
            print(f"   ZIP: {sample_profile.zip_code}")

    print(f"\n✅ Sample user profiles created successfully!")
    print(f"   You can now test the profile page with these accounts.")
    print(f"   Login with any username and password: password123")


if __name__ == "__main__":
    create_sample_user_profiles()
