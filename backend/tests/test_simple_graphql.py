#!/usr/bin/env python
"""
Simple test script to verify GraphQL endpoint
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


def test_simple_query():
    """Test a simple GraphQL query"""

    print("🧪 Testing Simple GraphQL Query...")

    # Simple query to test basic functionality
    query = """
    query {
        userProfile {
            id
            user {
                email
                firstName
                lastName
            }
            position
            department
        }
    }
    """

    try:
        result = schema.execute(query)

        if result.errors:
            print("❌ GraphQL Errors:")
            for error in result.errors:
                print(f"   - {error}")
        else:
            print("✅ GraphQL Query Successful!")
            print(f"   Data: {result.data}")

            if result.data and result.data.get("user_profile"):
                profile = result.data["user_profile"]
                if profile:
                    print(f"   Profile ID: {profile.get('id') if profile else 'None'}")
                    user_data = profile.get("user") if profile else None
                    if user_data:
                        print(
                            f"   User: {user_data.get('email') if user_data else 'None'}"
                        )
                    print(
                        f"   Position: {profile.get('position') if profile else 'None'}"
                    )
                    print(
                        f"   Department: {profile.get('department') if profile else 'None'}"
                    )
                else:
                    print("   Profile data is null")
            else:
                print("   No user_profile data returned")

    except Exception as e:
        print(f"❌ Exception occurred: {e}")
        import traceback

        traceback.print_exc()


def test_departments_query():
    """Test departments query"""

    print("\n🏭 Testing Departments Query...")

    query = """
    query {
        allDepartments {
            id
            name
            description
        }
    }
    """

    try:
        result = schema.execute(query)

        if result.errors:
            print("❌ GraphQL Errors:")
            for error in result.errors:
                print(f"   - {error}")
        else:
            print("✅ Departments Query Successful!")
            if result.data:
                departments = result.data.get("allDepartments", [])
                print(f"   Found {len(departments)} departments:")
                for dept in departments:
                    print(f"     - {dept['name']}: {dept['description']}")
            else:
                print("   No data returned")

    except Exception as e:
        print(f"❌ Exception occurred: {e}")


if __name__ == "__main__":
    test_simple_query()
    test_departments_query()
