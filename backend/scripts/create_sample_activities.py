#!/usr/bin/env python3
"""
Create Sample Activities Script
This script creates sample activities in the database for testing.
"""

import os
import sys
import uuid
from datetime import datetime, timedelta

import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User

from api.models import Activity, ActivityPriority, ActivityStatus


def create_sample_activities():
    """Create sample activities for testing"""

    # Get or create a user
    user, created = User.objects.get_or_create(
        username="mihai",
        defaults={
            "email": "mihai@nexus.com",
            "first_name": "Mihai",
            "last_name": "Developer",
        },
    )
    if created:
        user.set_password("password123")
        user.save()
        print("✅ Created user 'mihai'")
    else:
        print("ℹ️  User 'mihai' already exists")

    # Get status and priority configs
    planned_status = ActivityStatus.objects.get(status="planned")
    in_progress_status = ActivityStatus.objects.get(status="in-progress")
    completed_status = ActivityStatus.objects.get(status="completed")

    medium_priority = ActivityPriority.objects.get(priority="medium")
    high_priority = ActivityPriority.objects.get(priority="high")
    low_priority = ActivityPriority.objects.get(priority="low")

    # Sample activities
    activities_data = [
        {
            "title": "Frontend Development Sprint",
            "description": "Complete the frontend development for the activities management system with React and TypeScript",
            "type": "Production",
            "status": "in-progress",
            "priority": "high",
            "start_time": datetime.now() - timedelta(days=2),
            "end_time": datetime.now() + timedelta(days=5),
            "assigned_to": "Mihai Developer",
            "assigned_by": "Project Manager",
            "location": "Development Office",
            "progress": 65,
            "estimated_duration": 120,
            "actual_duration": 78,
            "notes": "Making good progress on the UI components. Need to implement the activity buttons functionality.",
        },
        {
            "title": "Database Schema Review",
            "description": "Review and optimize the database schema for the activities management system",
            "type": "Engineering",
            "status": "planned",
            "priority": "medium",
            "start_time": datetime.now() + timedelta(days=1),
            "end_time": datetime.now() + timedelta(days=3),
            "assigned_to": "Database Team",
            "assigned_by": "Tech Lead",
            "location": "Tech Office",
            "progress": 0,
            "estimated_duration": 180,
            "actual_duration": None,
            "notes": "Need to review the current schema and identify optimization opportunities.",
        },
        {
            "title": "User Acceptance Testing",
            "description": "Conduct UAT for the activities management system with end users",
            "type": "Quality",
            "status": "planned",
            "priority": "medium",
            "start_time": datetime.now() + timedelta(days=7),
            "end_time": datetime.now() + timedelta(days=10),
            "assigned_to": "QA Team",
            "assigned_by": "Product Manager",
            "location": "Testing Lab",
            "progress": 0,
            "estimated_duration": 240,
            "actual_duration": None,
            "notes": "Prepare test scenarios and coordinate with end users for testing sessions.",
        },
        {
            "title": "System Documentation Update",
            "description": "Update system documentation to reflect the new activities management features",
            "type": "Admin & Systems",
            "status": "completed",
            "priority": "low",
            "start_time": datetime.now() - timedelta(days=5),
            "end_time": datetime.now() - timedelta(days=2),
            "assigned_to": "Technical Writer",
            "assigned_by": "Project Manager",
            "location": "Documentation Office",
            "progress": 100,
            "estimated_duration": 90,
            "actual_duration": 85,
            "notes": "Documentation updated successfully. All new features are now documented.",
        },
        {
            "title": "Team Training Session",
            "description": "Conduct training session for the development team on the new activities management system",
            "type": "Training",
            "status": "planned",
            "priority": "high",
            "start_time": datetime.now() + timedelta(days=2),
            "end_time": datetime.now() + timedelta(days=2),
            "assigned_to": "Development Team",
            "assigned_by": "Tech Lead",
            "location": "Training Room",
            "progress": 0,
            "estimated_duration": 120,
            "actual_duration": None,
            "notes": "Prepare training materials and demo environment.",
        },
    ]

    created_count = 0
    for activity_data in activities_data:
        # Check if activity already exists
        if not Activity.objects.filter(title=activity_data["title"]).exists():
            # Get the appropriate status and priority configs
            if activity_data["status"] == "planned":
                status_config = planned_status
            elif activity_data["status"] == "in-progress":
                status_config = in_progress_status
            elif activity_data["status"] == "completed":
                status_config = completed_status
            else:
                status_config = planned_status

            if activity_data["priority"] == "high":
                priority_config = high_priority
            elif activity_data["priority"] == "medium":
                priority_config = medium_priority
            elif activity_data["priority"] == "low":
                priority_config = low_priority
            else:
                priority_config = medium_priority

            # Create the activity
            activity = Activity.objects.create(
                title=activity_data["title"],
                description=activity_data["description"],
                type=activity_data["type"],
                status=activity_data["status"],
                priority=activity_data["priority"],
                status_config=status_config,
                priority_config=priority_config,
                start_time=activity_data["start_time"],
                end_time=activity_data["end_time"],
                assigned_to=activity_data["assigned_to"],
                assigned_by=activity_data["assigned_by"],
                location=activity_data["location"],
                progress=activity_data["progress"],
                estimated_duration=activity_data["estimated_duration"],
                actual_duration=activity_data["actual_duration"],
                notes=activity_data["notes"],
                created_by=user,
            )
            created_count += 1
            print(f"✅ Created activity: {activity.title}")
        else:
            print(f"ℹ️  Activity already exists: {activity_data['title']}")

    print(f"\n🎉 Successfully created {created_count} new activities!")
    print(f"📊 Total activities in database: {Activity.objects.count()}")


if __name__ == "__main__":
    create_sample_activities()
