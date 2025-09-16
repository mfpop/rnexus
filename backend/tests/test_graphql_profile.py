#!/usr/bin/env python3
"""
Test script to verify GraphQL profile queries are working correctly.
"""

import os
import sys

import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

import json

from api.models import User, UserProfile


def test_profile_data():
    """Test that profile data exists and can be accessed"""
    print("Testing profile data...")

    # Check user profiles
    profiles = UserProfile.objects.all()
    print(f"\nTotal profiles: {profiles.count()}")

    if profiles.exists():
        # Get first profile
        profile = profiles.first()
        if profile and profile.user:
            print(f"\nFirst profile: {profile.user.username}")
            print(
                f"Education count: {len(profile.education) if profile.education else 0}"
            )
            print(
                f"Work history count: {len(profile.work_history) if profile.work_history else 0}"
            )

            if profile.education:
                print(f"\nEducation data:")
                if isinstance(profile.education, list):
                    for edu in profile.education:
                        if isinstance(edu, dict):
                            print(
                                f"  - {edu.get('school', 'Unknown')}: {edu.get('degree', 'Unknown')}"
                            )
                        else:
                            print(f"  - {edu} (type: {type(edu)})")
                else:
                    print(f"  Raw data: {profile.education[:200]}...")
                    print(f"  Type: {type(profile.education)}")
                    try:
                        parsed = json.loads(profile.education)
                        print(f"  Parsed JSON: {parsed}")
                    except:
                        print("  Could not parse as JSON")

            if profile.work_history:
                print(f"\nWork history data:")
                if isinstance(profile.work_history, list):
                    for work in profile.work_history:
                        if isinstance(work, dict):
                            print(
                                f"  - {work.get('company', 'Unknown')}: {work.get('title', 'Unknown')}"
                            )
                        else:
                            print(f"  - {work} (type: {type(work)})")
                else:
                    print(f"  Raw data: {profile.work_history[:200]}...")
                    print(f"  Type: {type(profile.work_history)}")
                    try:
                        parsed = json.loads(profile.work_history)
                        print(f"  Parsed JSON: {parsed}")
                    except:
                        print("  Could not parse as JSON")

            # Test JSON serialization
            print(f"\nTesting JSON serialization:")
            try:
                education_json = json.dumps(profile.education)
                work_history_json = json.dumps(profile.work_history)
                print(f"  Education JSON: {education_json[:100]}...")
                print(f"  Work History JSON: {work_history_json[:100]}...")
            except Exception as e:
                print(f"  JSON serialization error: {e}")

    # Check specific user
    try:
        user = User.objects.get(username="emma.dev")
        profile = UserProfile.objects.get(user=user)
        print(f"\nEmma's profile:")
        print(f"  Education: {profile.education}")
        print(f"  Work History: {profile.work_history}")
    except User.DoesNotExist:
        print("\nEmma user not found")
    except UserProfile.DoesNotExist:
        print("\nEmma profile not found")


def test_graphql_schema():
    """Test GraphQL schema types"""
    print("\n" + "=" * 50)
    print("Testing GraphQL schema...")

    try:
        from api.schema import UserProfileType

        # Get the fields from the GraphQL type
        fields = UserProfileType._meta.fields
        print(f"UserProfile GraphQL fields: {list(fields.keys())}")

        # Check if education and work_history are in the fields
        if "education" in fields:
            print("✅ Education field found in GraphQL schema")
        else:
            print("❌ Education field NOT found in GraphQL schema")

        if "work_history" in fields:
            print("✅ Work history field found in GraphQL schema")
        else:
            print("❌ Work history field NOT found in GraphQL schema")

    except Exception as e:
        print(f"Error testing GraphQL schema: {e}")


if __name__ == "__main__":
    test_profile_data()
    test_graphql_schema()
