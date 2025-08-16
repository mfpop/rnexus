from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import Update, UpdateAttachment, UpdateMedia


class Command(BaseCommand):
    help = "Populate the database with sample updates for testing"

    def handle(self, *args, **options):
        # Get or create a test user
        user, created = User.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@example.com",
                "first_name": "Admin",
                "last_name": "User",
                "is_staff": True,
                "is_superuser": True,
            },
        )
        if created:
            user.set_password("admin123")
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Created user: {user.username}"))

        # Create sample updates
        updates_data = [
            {
                "id": "update_001",
                "type": "alert",
                "title": "System Outage Scheduled",
                "summary": "Planned maintenance will occur on Aug 20 from 2AM to 4AM.",
                "body": "We will be performing scheduled maintenance on our servers to improve performance and security. During this time, some services may be temporarily unavailable. We apologize for any inconvenience and appreciate your understanding.",
                "status": "new",
                "tags": ["IT", "Maintenance", "Urgent"],
                "author": "IT Department",
                "icon": "🛠️",
                "priority": 10,
                "timestamp": timezone.now() - timedelta(hours=2),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/maintenance-details.pdf",
                        "label": "Maintenance Details",
                    }
                ],
                "media": [],
            },
            {
                "id": "update_002",
                "type": "news",
                "title": "New Employee Portal Launched",
                "summary": "The new portal offers better navigation and personalized tools.",
                "body": "We're excited to announce the launch of our new employee portal! This modern platform provides improved navigation, personalized dashboards, and enhanced tools for managing your work experience. The portal includes features like easy leave requests, performance tracking, and team collaboration tools.",
                "status": "read",
                "tags": ["HR", "Portal"],
                "author": "HR Team",
                "icon": "📰",
                "priority": 5,
                "timestamp": timezone.now() - timedelta(hours=8),
                "attachments": [],
                "media": [
                    {
                        "type": "image",
                        "url": "https://example.com/portal-screenshot.png",
                        "label": "Portal Screenshot",
                    }
                ],
            },
            {
                "id": "update_003",
                "type": "communication",
                "title": "Quarterly Team Meeting Announced",
                "summary": "Join us for our quarterly all-hands meeting on August 25th.",
                "body": "We're excited to announce our quarterly all-hands meeting scheduled for August 25th at 2 PM. This meeting will cover our Q3 achievements, upcoming goals, and provide an opportunity for Q&A with leadership. All employees are encouraged to attend.",
                "status": "new",
                "tags": ["Meeting", "Team", "Quarterly"],
                "author": "Executive Team",
                "icon": "📅",
                "priority": 7,
                "timestamp": timezone.now() - timedelta(hours=12),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/agenda.pdf",
                        "label": "Meeting Agenda",
                    }
                ],
                "media": [],
            },
            {
                "id": "update_004",
                "type": "alert",
                "title": "Security Update Required",
                "summary": "All employees must update their passwords by end of day.",
                "body": "Due to recent security concerns, we require all employees to update their passwords by the end of the day. Please ensure your new password meets our security requirements: minimum 12 characters, including uppercase, lowercase, numbers, and special characters.",
                "status": "urgent",
                "tags": ["Security", "Password", "Urgent"],
                "author": "Security Team",
                "icon": "🔒",
                "priority": 15,
                "timestamp": timezone.now() - timedelta(hours=1),
                "attachments": [],
                "media": [],
            },
            {
                "id": "update_005",
                "type": "news",
                "title": "Company Achieves ISO 9001 Certification",
                "summary": "Our quality management system has been officially certified.",
                "body": "We are proud to announce that our company has successfully achieved ISO 9001:2015 certification for our quality management system. This certification demonstrates our commitment to delivering high-quality products and services to our customers.",
                "status": "read",
                "tags": ["Quality", "Certification", "ISO"],
                "author": "Quality Assurance",
                "icon": "🏆",
                "priority": 8,
                "timestamp": timezone.now() - timedelta(days=1),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/iso-certificate.pdf",
                        "label": "ISO Certificate",
                    }
                ],
                "media": [],
            },
        ]

        # Create updates
        for update_data in updates_data:
            # Extract attachments and media
            attachments_data = update_data.pop("attachments")
            media_data = update_data.pop("media")

            # Create the update
            update = Update.objects.create(created_by=user, **update_data)

            # Create attachments
            for att_data in attachments_data:
                UpdateAttachment.objects.create(update=update, **att_data)

            # Create media
            for med_data in media_data:
                UpdateMedia.objects.create(update=update, **med_data)

            self.stdout.write(self.style.SUCCESS(f"Created update: {update.title}"))

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully created {len(updates_data)} sample updates"
            )
        )
