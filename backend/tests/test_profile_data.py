#!/usr/bin/env python3
"""
Simple test script to check profile data
"""

import os

import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User

from api.models import UserProfile


def test_profile_data():
    """Test profile data directly"""

    # Get admin user and profile
    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        print("❌ No admin user found")
        return
    profile = UserProfile.objects.get(user=admin_user)

    print("🔍 Direct Profile Data Check:")
    print(f"   City: '{profile.city}'")
    print(f"   State: '{profile.state_province}'")
    print(f"   Country: '{profile.country}'")
    print(f"   ZIP: '{profile.zip_code}'")

    # Check if the data is actually in the database
    from django.db import connection

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT city, state_province, country, zip_code FROM user_profiles WHERE user_id = %s",
            [admin_user.pk],
        )
        row = cursor.fetchone()
        if row:
            print(f"\n🔍 Raw Database Query:")
            print(f"   City: '{row[0]}'")
            print(f"   State: '{row[1]}'")
            print(f"   Country: '{row[2]}'")
            print(f"   ZIP: '{row[3]}'")


if __name__ == "__main__":
    test_profile_data()
