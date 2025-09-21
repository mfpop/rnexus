#!/usr/bin/env python
"""
Debug script to identify where the old phone field is being accessed
"""
import os
import sys

import django

# Setup Django
sys.path.append("/Users/mihai/Desktop/rnexus/backend")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User

from api.models import UserProfile


def test_userprofile_access():
    """Test different ways of accessing UserProfile to identify the issue"""

    print("=== Testing UserProfile field access ===")

    # Test 1: Model introspection
    print("\n1. Model fields:")
    phone_fields = [
        f.name for f in UserProfile._meta.fields if "phone" in f.name.lower()
    ]
    print(f"   Phone fields: {phone_fields}")

    # Test 2: Direct object access
    print("\n2. Direct object access:")
    try:
        profile = UserProfile.objects.first()
        if profile:
            print(f"   phone1: {profile.phone1}")
            print(f"   phonecc1: {profile.phonecc1}")
            print("   Direct access: SUCCESS")
        else:
            print("   No profiles found")
    except Exception as e:
        print(f"   Direct access: FAILED - {e}")

    # Test 3: QuerySet with specific fields
    print("\n3. QuerySet with values:")
    try:
        values = UserProfile.objects.values("phone1", "phonecc1").first()
        print(f"   Values query: SUCCESS - {values}")
    except Exception as e:
        print(f"   Values query: FAILED - {e}")

    # Test 4: Check if old fields still exist somehow
    print("\n4. Checking for old field names:")
    old_fields = ["phone", "primary_country_code", "phone_type", "secondary_phone"]
    for field in old_fields:
        try:
            # Try to access via values() which would trigger SQL error
            UserProfile.objects.values(field).first()
            print(f"   {field}: EXISTS (this is the problem!)")
        except Exception as e:
            print(f"   {field}: Does not exist (correct)")

    # Test 5: Full model select
    print("\n5. Full model select:")
    try:
        profiles = list(UserProfile.objects.all()[:1])
        print(f"   Full select: SUCCESS - found {len(profiles)} profiles")
    except Exception as e:
        print(f"   Full select: FAILED - {e}")


if __name__ == "__main__":
    test_userprofile_access()
