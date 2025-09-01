#!/usr/bin/env python3
"""
Script to verify admin user education and work experience data
"""

import os
import sys

import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User

from api.models import UserProfile


def verify_admin_data():
    """Verify admin user data was saved correctly"""

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

        # Display profile information
        print("\n📋 Profile Information:")
        print(f"   Position: {profile.position}")
        print(f"   Department: {profile.department}")
        print(f"   City: {profile.city}")
        print(f"   State: {profile.state_province}")
        print(f"   Country: {profile.country}")
        print(f"   ZIP Code: {profile.zip_code}")
        print(f"   Phone: {profile.phone_country_code} {profile.phone}")
        print(f"   Phone Type: {profile.phone_type}")

        # Display education data
        if profile.education:
            print(f"\n📚 Education ({len(profile.education)} entries):")
            for i, edu in enumerate(profile.education, 1):
                print(f"   {i}. {edu['school']}")
                print(f"      Degree: {edu['degree']} in {edu['field']}")
                print(f"      Years: {edu['startYear']} - {edu['endYear']}")
                print(f"      Description: {edu['description'][:100]}...")
                print()
        else:
            print("\n❌ No education data found")

        # Display work history
        if profile.work_history:
            print(f"\n💼 Work Experience ({len(profile.work_history)} entries):")
            for i, work in enumerate(profile.work_history, 1):
                print(f"   {i}. {work['title']} at {work['company']}")
                print(f"      Department: {work['department']}")
                print(f"      Years: {work['startYear']} - {work['endYear']}")
                print(f"      Description: {work['description'][:100]}...")
                print()
        else:
            print("\n❌ No work history data found")

        # Display bio
        if profile.bio:
            print(f"\n📝 Bio:")
            print(f"   {profile.bio[:200]}...")
        else:
            print("\n❌ No bio found")

        return True

    except Exception as e:
        print(f"❌ Error verifying data: {e}")
        import traceback

        traceback.print_exc()
        return False


def main():
    """Main function"""
    print("🔍 Verifying Admin User Data")
    print("=" * 40)

    success = verify_admin_data()

    if success:
        print("\n✅ Data verification completed successfully!")
    else:
        print("\n❌ Data verification failed. Please check the error messages above.")
        sys.exit(1)


if __name__ == "__main__":
    main()
