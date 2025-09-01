#!/usr/bin/env python
"""
Test script to verify GraphQL mutation is working correctly
"""

import os
import sys

import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.schema import schema


def test_update_profile_mutation():
    """Test the updateUserProfile mutation"""

    print("🧪 Testing UpdateUserProfile Mutation...")

    # Test mutation
    mutation = """
    mutation {
        updateUserProfile(
            firstName: "Test"
            lastName: "User"
            position: "Test Position"
            department: "Test Department"
        ) {
            ok
            userProfile {
                id
                user {
                    firstName
                    lastName
                }
                position
                department
            }
            errors
        }
    }
    """

    try:
        result = schema.execute(mutation)

        if result.errors:
            print("❌ GraphQL Errors:")
            for error in result.errors:
                print(f"   - {error}")
        else:
            print("✅ GraphQL Mutation Successful!")
            print(f"   Data: {result.data}")

            if result.data and result.data.get("updateUserProfile"):
                mutation_result = result.data["updateUserProfile"]
                print(f"   Success: {mutation_result.get('ok')}")
                if mutation_result.get("userProfile"):
                    profile = mutation_result["userProfile"]
                    print(f"   Profile ID: {profile.get('id')}")
                    user = profile.get("user", {})
                    print(f"   User: {user.get('firstName')} {user.get('lastName')}")
                    print(f"   Position: {profile.get('position')}")
                    print(f"   Department: {profile.get('department')}")
                if mutation_result.get("errors"):
                    print(f"   Errors: {mutation_result.get('errors')}")
            else:
                print("   No updateUserProfile data returned")

    except Exception as e:
        print(f"❌ Exception occurred: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    test_update_profile_mutation()
