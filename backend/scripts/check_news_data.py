#!/usr/bin/env python3
"""
Check if there are any news updates in the database
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Update

def check_news_data():
    print("=== Checking News Data in Database ===")
    
    # Get all updates
    updates = Update.objects.all()
    total_count = updates.count()
    
    print(f"Total updates in database: {total_count}")
    
    if total_count == 0:
        print("\n❌ No updates found in database!")
        print("This explains why the tabs show no data.")
        print("\nTo fix this, you can:")
        print("1. Create some test updates via Django admin")
        print("2. Run a data migration script")
        print("3. Use the Django shell to create test data")
        return
    
    print(f"\n✅ Found {total_count} updates")
    
    # Show first 5 updates
    print("\nFirst 5 updates:")
    for i, update in enumerate(updates[:5]):
        print(f"  {i+1}. ID: {update.id}")
        print(f"     Type: {update.type}")
        print(f"     Title: {update.title}")
        print(f"     Status: {update.status}")
        print(f"     Active: {update.is_active}")
        print(f"     Author: {update.author}")
        print(f"     Created: {update.created_at}")
        print()
    
    # Count by type
    print("Updates by type:")
    type_counts = {}
    for update in updates:
        type_counts[update.type] = type_counts.get(update.type, 0) + 1
    
    for update_type, count in type_counts.items():
        print(f"  {update_type}: {count}")
    
    # Count by status
    print("\nUpdates by status:")
    status_counts = {}
    for update in updates:
        status_counts[update.status] = status_counts.get(update.status, 0) + 1
    
    for status, count in status_counts.items():
        print(f"  {status}: {count}")
    
    # Check active updates
    active_updates = updates.filter(is_active=True)
    print(f"\nActive updates: {active_updates.count()}")
    
    if active_updates.count() == 0:
        print("❌ No active updates found!")
        print("This might explain why filtering shows no results.")
    else:
        print("✅ Active updates found")

if __name__ == "__main__":
    try:
        check_news_data()
    except Exception as e:
        print(f"Error checking database: {e}")
        print("Make sure the Django backend is properly set up.")

