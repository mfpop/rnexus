#!/usr/bin/env python3
"""
Debug script to check actual database field values
"""

import os
import sys

import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User

from api.models import UserProfile


def debug_profile_fields():
    """Debug the actual database field values"""

    try:
        # Find admin user
        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            print("❌ No admin user found.")
            return False

        print(f"✅ Found admin user: {admin_user.email}")

        # Get user profile
        try:
            profile = UserProfile.objects.get(user=admin_user)
        except UserProfile.DoesNotExist:
            print("❌ No profile found for admin user.")
            return False

        print(f"✅ Found user profile")

        # Check all field values
        print("\n🔍 Raw Database Field Values:")
        print(f"   city: '{profile.city}' (type: {type(profile.city)})")
        print(
            f"   state_province: '{profile.state_province}' (type: {type(profile.state_province)})"
        )
        print(f"   country: '{profile.country}' (type: {type(profile.country)})")
        print(f"   zip_code: '{profile.zip_code}' (type: {type(profile.zip_code)})")
        print(
            f"   street_address: '{profile.street_address}' (type: {type(profile.street_address)})"
        )
        print(
            f"   apartment_suite: '{profile.apartment_suite}' (type: {type(profile.apartment_suite)})"
        )
        print(f"   phone1: '{profile.phone1}' (type: {type(profile.phone1)})")
        print(f"   phonecc1: '{profile.phonecc1}' (type: {type(profile.phonecc1)})")
        print(f"   phonet1: '{profile.phonet1}' (type: {type(profile.phonet1)})")

        # Check if fields are None or empty strings
        print(f"\n🔍 Field Status:")
        print(f"   city is None: {profile.city is None}")
        print(f"   city is empty string: {profile.city == ''}")
        print(f"   state_province is None: {profile.state_province is None}")
        print(f"   state_province is empty string: {profile.state_province == ''}")

        # Try to set the values directly
        print(f"\n🔧 Attempting to set values directly...")
        profile.city = "San Francisco"
        profile.state_province = "California"
        profile.save()

        print(f"✅ Values set directly")

        # Refresh and check again
        profile.refresh_from_db()
        print(f"\n🔍 After Direct Update:")
        print(f"   city: '{profile.city}'")
        print(f"   state_province: '{profile.state_province}'")

        return True

    except Exception as e:
        print(f"❌ Error debugging profile fields: {e}")
        import traceback

        traceback.print_exc()
        return False


def main():
    """Main function"""
    print("🔍 Debugging Admin User Profile Fields")
    print("=" * 50)

    success = debug_profile_fields()

    if success:
        print("\n✅ Debug completed successfully!")
    else:
        print("\n❌ Debug failed. Please check the error messages above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
