#!/usr/bin/env python3
"""
Script to fix corrupted JSON data in user profiles.
Some profiles have double/triple encoded JSON strings that need to be fixed.
"""

import json
import os
import sys

import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from api.models import UserProfile


def fix_corrupted_json():
    """Fix corrupted JSON data in user profiles"""
    print("🔧 Fixing corrupted JSON data in user profiles...")

    profiles = UserProfile.objects.all()
    fixed_count = 0

    for profile in profiles:
        profile_updated = False

        # Fix education field
        if profile.education and isinstance(profile.education, str):
            try:
                # Handle triple-encoded JSON by parsing multiple times
                current_data = profile.education
                parsed_education = None

                # Try to parse up to 3 times to handle triple encoding
                for attempt in range(3):
                    try:
                        parsed_education = json.loads(current_data)
                        if isinstance(parsed_education, str):
                            current_data = parsed_education
                        else:
                            break
                    except json.JSONDecodeError:
                        break

                # If we got a list, save it
                if isinstance(parsed_education, list):
                    profile.education = parsed_education
                    profile_updated = True
                    print(f"✅ Fixed education for {profile.user.username}")
                else:
                    print(
                        f"⚠️  Could not parse education for {profile.user.username}: {type(parsed_education)}"
                    )
                    # Reset to empty list if we can't parse
                    profile.education = []
                    profile_updated = True

            except Exception as e:
                print(f"❌ Error parsing education for {profile.user.username}: {e}")
                # Reset to empty list if we can't parse
                profile.education = []
                profile_updated = True

        # Fix work_history field
        if profile.work_history and isinstance(profile.work_history, str):
            try:
                # Handle triple-encoded JSON by parsing multiple times
                current_data = profile.work_history
                parsed_work = None

                # Try to parse up to 3 times to handle triple encoding
                for attempt in range(3):
                    try:
                        parsed_work = json.loads(current_data)
                        if isinstance(parsed_work, str):
                            current_data = parsed_work
                        else:
                            break
                    except json.JSONDecodeError:
                        break

                # If we got a list, save it
                if isinstance(parsed_work, list):
                    profile.work_history = parsed_work
                    profile_updated = True
                    print(f"✅ Fixed work history for {profile.user.username}")
                else:
                    print(
                        f"⚠️  Could not parse work history for {profile.user.username}: {type(parsed_work)}"
                    )
                    # Reset to empty list if we can't parse
                    profile.work_history = []
                    profile_updated = True

            except Exception as e:
                print(f"❌ Error parsing work history for {profile.user.username}: {e}")
                # Reset to empty list if we can't parse
                profile.work_history = []
                profile_updated = True

        # Save the profile if it was updated
        if profile_updated:
            profile.save()
            fixed_count += 1

    print(f"\n🎯 Fixed {fixed_count} profiles out of {profiles.count()} total profiles")

    # Verify the fix
    print("\n🔍 Verifying fix...")
    for profile in profiles[:3]:  # Check first 3 profiles
        print(f"\n{profile.user.username}:")
        print(
            f"  Education: {type(profile.education)} - {len(profile.education) if isinstance(profile.education, list) else 'N/A'}"
        )
        print(
            f"  Work History: {type(profile.work_history)} - {len(profile.work_history) if isinstance(profile.work_history, list) else 'N/A'}"
        )

        if isinstance(profile.education, list) and profile.education:
            print(
                f"  Sample education: {profile.education[0].get('school', 'Unknown')}"
            )

        if isinstance(profile.work_history, list) and profile.work_history:
            print(f"  Sample work: {profile.work_history[0].get('company', 'Unknown')}")


if __name__ == "__main__":
    fix_corrupted_json()
