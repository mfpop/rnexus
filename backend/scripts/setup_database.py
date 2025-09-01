#!/usr/bin/env python3
"""
Database Setup Script for Activities Management System
This script creates the database tables and populates them with sample data.
"""

import os
import sys
import uuid
from datetime import datetime, timedelta

import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth.models import User
from django.db import connection

from api.models import (  # ActivityParticipant,  # Not implemented yet; Attachment,  # Not implemented yet; Checklist,  # Not implemented yet; ChecklistItem,  # Not implemented yet; Comment,  # Not implemented yet; Milestone,  # Not implemented yet; Project,  # Not implemented yet; ProjectTeamMember,  # Not implemented yet; Task,  # Not implemented yet; TimeLog,  # Not implemented yet
    Activity,
)


def create_superuser():
    """Create a superuser if it doesn't exist"""
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser("admin", "admin@nexus.com", "admin123")
        print("✅ Superuser 'admin' created with password 'admin123'")
    else:
        print("ℹ️  Superuser 'admin' already exists")


def create_sample_user():
    """Create a sample user for testing"""
    if not User.objects.filter(username="mihai").exists():
        user = User.objects.create_user(
            username="mihai",
            email="mihai@nexus.com",
            password="password123",
            first_name="Mihai",
            last_name="Developer",
        )
        print("✅ Sample user 'mihai' created")
        return user
    else:
        print("ℹ️  Sample user 'mihai' already exists")
        return User.objects.get(username="mihai")


def create_sample_project(user):
    """Create a sample project - placeholder for future implementation"""
    print("ℹ️  Project creation not implemented yet - using None as placeholder")
    return None


def create_sample_activity(user, project):
    """Create a sample activity"""
    activity, created = Activity.objects.get_or_create(
        title="Frontend Development Sprint",
        defaults={
            "description": "Complete the frontend development for the activities management system",
            "type": "project-related",
            "status": "in-progress",
            "priority": "high",
            "category": "Development",
            "risk_level": "medium",
            "cost": 15000.00,
            "start_date": datetime.now(),
            "due_date": datetime.now() + timedelta(days=14),
            "owner": user,
            "created_by": user,
            # "project": project,  # Project not implemented yet
            "tags": ["frontend", "react", "typescript"],
            "estimated_hours": 80,
            "actual_hours": 45,
        },
    )

    if created:
        print("✅ Sample activity created")
    else:
        print("ℹ️  Sample activity already exists")

    return activity


def create_sample_tasks(activity, user):
    """Create sample tasks for the activity - placeholder for future implementation"""
    print("ℹ️  Task creation not implemented yet")
    return []


def create_sample_milestones(activity, user):
    """Create sample milestones for the activity - placeholder for future implementation"""
    print("ℹ️  Milestone creation not implemented yet")
    return []


def create_sample_checklists(activity, user):
    """Create sample checklists for the activity - placeholder for future implementation"""
    print("ℹ️  Checklist creation not implemented yet")
    return []


def create_sample_time_logs(activity, user):
    """Create sample time logs for the activity - placeholder for future implementation"""
    print("ℹ️  Time log creation not implemented yet")
    return []


def create_sample_comments(activity, user):
    """Create sample comments for the activity - placeholder for future implementation"""
    print("ℹ️  Comment creation not implemented yet")
    return []


def setup_database():
    """Main function to set up the database"""
    print("🚀 Starting database setup...")

    try:
        # Create superuser
        create_superuser()

        # Create sample user
        user = create_sample_user()

        # Create sample project
        project = create_sample_project(user)

        # Create sample activity
        activity = create_sample_activity(user, project)

        # Create sample tasks
        tasks = create_sample_tasks(activity, user)

        # Create sample milestones
        milestones = create_sample_milestones(activity, user)

        # Create sample checklists
        checklists = create_sample_checklists(activity, user)

        # Create sample time logs
        time_logs = create_sample_time_logs(activity, user)

        # Create sample comments
        comments = create_sample_comments(activity, user)

        print("\n🎉 Database setup completed successfully!")
        print(
            f"📊 Created {len(tasks)} tasks, {len(milestones)} milestones, {len(checklists)} checklists"
        )
        print(f"⏱️  Created {len(time_logs)} time logs, {len(comments)} comments")
        print(f"👤 Sample user: {user.username} ({user.email})")
        print(
            f"📁 Sample project: {'Not implemented yet' if project is None else project.name}"
        )
        print(f"🎯 Sample activity: {activity.title}")

    except Exception as e:
        print(f"❌ Error during database setup: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    setup_database()
