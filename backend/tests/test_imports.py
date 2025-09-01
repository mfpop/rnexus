#!/usr/bin/env python3
"""
Test Imports Script
This script tests if the Activity model and views can be imported properly.
"""

import os
import sys

import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

try:
    print("🔍 Testing Activity model import...")
    from api.models import Activity

    print("✅ Activity model imported successfully")

    # Check if we can query the model
    count = Activity.objects.count()
    print(f"✅ Activity model query successful: {count} activities found")

except Exception as e:
    print(f"❌ Activity model import failed: {e}")
    import traceback

    traceback.print_exc()

try:
    print("\n🔍 Testing activities views import...")
    from api.views import activity_list_view

    print("✅ activity_list_view imported successfully")

    from api.views import activity_detail_view

    print("✅ activity_detail_view imported successfully")

    from api.views import activity_start_view

    print("✅ activity_start_view imported successfully")

    from api.views import activity_pause_view

    print("✅ activity_pause_view imported successfully")

    # from api.views import activity_complete_view  # Not implemented yet

    # print("✅ activity_complete_view imported successfully")

except Exception as e:
    print(f"❌ Activities views import failed: {e}")
    import traceback

    traceback.print_exc()

print("\n🎉 Import testing completed!")
