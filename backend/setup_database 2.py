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

from api.models import (
    Activity,
    ActivityParticipant,
    Attachment,
    Checklist,
    ChecklistItem,
    Comment,
    Milestone,
    Project,
    ProjectTeamMember,
    Task,
    TimeLog,
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
    """Create a sample project"""
    project, created = Project.objects.get_or_create(
        name="Nexus Development Project",
        defaults={
            "description": "Main development project for Nexus platform",
            "status": "active",
            "start_date": datetime.now().date(),
            "end_date": (datetime.now() + timedelta(days=90)).date(),
            "budget": 50000.00,
            "owner": user,
        },
    )

    if created:
        print("✅ Sample project created")
    else:
        print("ℹ️  Sample project already exists")

    return project


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
            "project": project,
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
    """Create sample tasks for the activity"""
    tasks_data = [
        {
            "title": "Prepare KPI Dashboard",
            "description": "Create the main KPI dashboard component",
            "status": "completed",
            "priority": "high",
            "completed": True,
            "start_date": datetime.now() - timedelta(days=3),
            "due_date": datetime.now() - timedelta(days=1),
            "completed_date": datetime.now() - timedelta(hours=12),
            "assignee": user,
            "estimated_hours": 8,
            "actual_hours": 7,
        },
        {
            "title": "Review Previous Action Items",
            "description": "Review and update all previous action items",
            "status": "pending",
            "priority": "medium",
            "completed": False,
            "start_date": datetime.now(),
            "due_date": datetime.now() + timedelta(days=2),
            "assignee": user,
            "estimated_hours": 4,
            "actual_hours": 0,
        },
        {
            "title": "Implement User Authentication",
            "description": "Set up user authentication and authorization",
            "status": "in-progress",
            "priority": "critical",
            "completed": False,
            "start_date": datetime.now() - timedelta(days=1),
            "due_date": datetime.now() + timedelta(days=5),
            "assignee": user,
            "estimated_hours": 16,
            "actual_hours": 8,
        },
    ]

    created_tasks = []
    for task_data in tasks_data:
        task, created = Task.objects.get_or_create(
            title=task_data["title"], activity=activity, defaults=task_data
        )
        if created:
            print(f"✅ Task '{task.title}' created")
        else:
            print(f"ℹ️  Task '{task.title}' already exists")
        created_tasks.append(task)

    return created_tasks


def create_sample_milestones(activity, user):
    """Create sample milestones for the activity"""
    milestones_data = [
        {
            "title": "Design Phase Complete",
            "description": "Complete all design and planning activities",
            "status": "completed",
            "completed": True,
            "due_date": datetime.now() - timedelta(days=7),
            "completed_date": datetime.now() - timedelta(days=6),
            "assignee": user,
        },
        {
            "title": "Development Phase Complete",
            "description": "Complete all development activities",
            "status": "pending",
            "completed": False,
            "due_date": datetime.now() + timedelta(days=10),
            "assignee": user,
        },
        {
            "title": "Testing Phase Complete",
            "description": "Complete all testing and quality assurance",
            "status": "pending",
            "completed": False,
            "due_date": datetime.now() + timedelta(days=20),
            "assignee": user,
        },
    ]

    created_milestones = []
    for milestone_data in milestones_data:
        milestone, created = Milestone.objects.get_or_create(
            title=milestone_data["title"], activity=activity, defaults=milestone_data
        )
        if created:
            print(f"✅ Milestone '{milestone.title}' created")
        else:
            print(f"ℹ️  Milestone '{milestone.title}' already exists")
        created_milestones.append(milestone)

    return created_milestones


def create_sample_checklists(activity, user):
    """Create sample checklists for the activity"""
    checklists_data = [
        {
            "title": "Code Review Checklist",
            "description": "Checklist for code review process",
            "assignee": user,
            "items": [
                "Code follows style guidelines",
                "All tests pass",
                "Documentation updated",
                "Security review completed",
            ],
        },
        {
            "title": "Deployment Checklist",
            "description": "Checklist for deployment process",
            "assignee": user,
            "items": [
                "Environment variables configured",
                "Database migrations applied",
                "Static files collected",
                "Health checks passing",
            ],
        },
    ]

    created_checklists = []
    for checklist_data in checklists_data:
        items = checklist_data.pop("items")
        checklist, created = Checklist.objects.get_or_create(
            title=checklist_data["title"], activity=activity, defaults=checklist_data
        )

        if created:
            print(f"✅ Checklist '{checklist.title}' created")
            # Create checklist items
            for i, item_description in enumerate(items):
                ChecklistItem.objects.create(
                    checklist=checklist,
                    description=item_description,
                    completed=i < 2,  # First two items completed
                    completed_date=(
                        datetime.now() - timedelta(hours=i) if i < 2 else None
                    ),
                    assignee=user,
                    sort_order=i,
                )
                print(f"  ✅ Checklist item '{item_description}' created")
        else:
            print(f"ℹ️  Checklist '{checklist.title}' already exists")

        created_checklists.append(checklist)

    return created_checklists


def create_sample_time_logs(activity, user):
    """Create sample time logs for the activity"""
    time_logs_data = [
        {
            "description": "Design review and planning",
            "start_time": datetime.now() - timedelta(days=3, hours=2),
            "end_time": datetime.now() - timedelta(days=3),
            "duration_minutes": 120,
        },
        {
            "description": "Frontend development",
            "start_time": datetime.now() - timedelta(days=1, hours=4),
            "end_time": datetime.now() - timedelta(days=1),
            "duration_minutes": 240,
        },
        {
            "description": "Code review and testing",
            "start_time": datetime.now() - timedelta(hours=2),
            "end_time": None,
            "duration_minutes": None,
        },
    ]

    created_time_logs = []
    for time_log_data in time_logs_data:
        time_log, created = TimeLog.objects.get_or_create(
            description=time_log_data["description"],
            activity=activity,
            user=user,
            start_time=time_log_data["start_time"],
            defaults=time_log_data,
        )

        if created:
            print(f"✅ Time log '{time_log.description}' created")
        else:
            print(f"ℹ️  Time log '{time_log.description}' already exists")

        created_time_logs.append(time_log)

    return created_time_logs


def create_sample_comments(activity, user):
    """Create sample comments for the activity"""
    comments_data = [
        {
            "content": "Great progress on the frontend! The UI looks clean and modern.",
            "created_at": datetime.now() - timedelta(days=1),
        },
        {
            "content": "Need to review the authentication implementation before proceeding.",
            "created_at": datetime.now() - timedelta(hours=6),
        },
        {
            "content": "Testing phase should start next week. All features are ready.",
            "created_at": datetime.now() - timedelta(hours=2),
        },
    ]

    created_comments = []
    for comment_data in comments_data:
        comment, created = Comment.objects.get_or_create(
            content=comment_data["content"],
            activity=activity,
            author=user,
            defaults=comment_data,
        )

        if created:
            print(f"✅ Comment created: '{comment.content[:50]}...'")
        else:
            print(f"ℹ️  Comment already exists: '{comment.content[:50]}...'")

        created_comments.append(comment)

    return created_comments


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
        print(f"📁 Sample project: {project.name}")
        print(f"🎯 Sample activity: {activity.title}")

    except Exception as e:
        print(f"❌ Error during database setup: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    setup_database()
