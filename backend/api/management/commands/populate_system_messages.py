import random
from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import SystemMessage


class Command(BaseCommand):
    help = "Populate the database with sample system messages for testing"

    def handle(self, *args, **options):
        # Get users for creating system messages
        users = list(User.objects.all())
        if len(users) == 0:
            self.stdout.write(
                self.style.ERROR("No users found. Run populate_users first.")
            )
            return

        # Sample system message data
        system_messages_data = [
            # Welcome messages
            {
                "type": "info",
                "title": "Welcome to Nexus!",
                "message": "Welcome to the Nexus platform! We're excited to have you on board. Take a moment to explore the features and let us know if you need any help.",
                "link": "/help/getting-started",
            },
            {
                "type": "success",
                "title": "Account Setup Complete",
                "message": "Your account has been successfully set up. You now have access to all platform features.",
                "link": "/profile",
            },
            # Security notifications
            {
                "type": "warning",
                "title": "Password Expiry Reminder",
                "message": "Your password will expire in 7 days. Please update it to maintain account security.",
                "link": "/settings/security",
            },
            {
                "type": "warning",
                "title": "New Login Detected",
                "message": "We detected a new login to your account from an unrecognized device. If this was you, no action is needed.",
                "link": "/settings/security",
            },
            {
                "type": "error",
                "title": "Security Alert",
                "message": "Multiple failed login attempts detected. Your account has been temporarily locked for security.",
                "link": "/support/security",
            },
            # System updates
            {
                "type": "info",
                "title": "System Maintenance Scheduled",
                "message": "Scheduled maintenance will occur on Sunday from 2AM to 4AM EST. Some services may be temporarily unavailable.",
                "link": "/status",
            },
            {
                "type": "success",
                "title": "System Update Complete",
                "message": "The latest system update has been successfully deployed. New features are now available!",
                "link": "/whats-new",
            },
            {
                "type": "info",
                "title": "New Feature Available",
                "message": "We've added a new chat feature that allows you to create group conversations. Try it out!",
                "link": "/chat",
            },
            # Training and development
            {
                "type": "info",
                "title": "Training Session Available",
                "message": "A new training session on 'Advanced Platform Features' is now available. Complete it to earn a certification badge.",
                "link": "/training",
            },
            {
                "type": "success",
                "title": "Training Completed",
                "message": "Congratulations! You've completed the 'Platform Basics' training module. Your progress has been recorded.",
                "link": "/certificates",
            },
            # Company announcements
            {
                "type": "info",
                "title": "Company Meeting Reminder",
                "message": "Don't forget about the quarterly all-hands meeting tomorrow at 2 PM. All employees are encouraged to attend.",
                "link": "/events",
            },
            {
                "type": "success",
                "title": "Company Achievement",
                "message": "Great news! Our company has been recognized as one of the top 100 companies to work for this year.",
                "link": "/news",
            },
            # Work-related notifications
            {
                "type": "info",
                "title": "New Project Assignment",
                "message": "You have been assigned to Project Alpha. Please review the project details and timeline.",
                "link": "/projects/alpha",
            },
            {
                "type": "warning",
                "title": "Deadline Reminder",
                "message": "The quarterly report is due in 3 days. Please ensure all data is submitted on time.",
                "link": "/reports",
            },
            {
                "type": "success",
                "title": "Task Completed",
                "message": "Your task 'Review User Feedback' has been marked as completed. Great work!",
                "link": "/tasks",
            },
            # Error notifications
            {
                "type": "error",
                "title": "Upload Failed",
                "message": "The file upload failed due to an invalid file format. Please check the file and try again.",
                "link": "/help/upload",
            },
            {
                "type": "error",
                "title": "Connection Error",
                "message": "We're experiencing connectivity issues. Please check your internet connection and try again.",
                "link": "/status",
            },
            # Reminders
            {
                "type": "info",
                "title": "Profile Update Reminder",
                "message": "It's been 6 months since you last updated your profile. Please review and update your information.",
                "link": "/profile/edit",
            },
            {
                "type": "warning",
                "title": "Document Expiry",
                "message": "Your security clearance document will expire in 30 days. Please submit a renewal application.",
                "link": "/documents",
            },
            # Social features
            {
                "type": "info",
                "title": "New Connection Request",
                "message": "John Anderson has sent you a connection request. Accept to expand your professional network.",
                "link": "/connections",
            },
            {
                "type": "success",
                "title": "Connection Accepted",
                "message": "Your connection request to Sarah Mitchell has been accepted. You can now message each other.",
                "link": "/chat",
            },
        ]

        created_count = 0
        updated_count = 0

        # Create system messages for each user
        for user in users:
            # Create 3-8 random system messages per user
            num_messages = random.randint(3, 8)
            selected_messages = random.sample(system_messages_data, num_messages)

            for message_data in selected_messages:
                # Randomize if message is read
                is_read = random.choice([True, False])

                # Randomize timestamp (within last 30 days)
                days_ago = random.randint(0, 30)
                hours_ago = random.randint(0, 23)
                created_at = timezone.now() - timedelta(days=days_ago, hours=hours_ago)

                # Create or get system message
                system_message, created = SystemMessage.objects.get_or_create(
                    recipient_id=str(user.pk),
                    title=message_data["title"],
                    message=message_data["message"],
                    defaults={
                        "message_type": message_data["type"],
                        "link": message_data["link"],
                        "is_read": is_read,
                        "created_at": created_at,
                    },
                )

                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Created system message for {user.username}: {message_data['title']}"
                        )
                    )
                else:
                    # Update existing message if needed
                    for key, value in message_data.items():
                        if (
                            key != "title"
                            and key != "message"
                            and hasattr(system_message, key)
                        ):
                            setattr(system_message, key, value)

                    if system_message.is_read != is_read:
                        system_message.is_read = is_read

                    if system_message.created_at != created_at:
                        system_message.created_at = created_at

                    system_message.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(
                            f"Updated system message for {user.username}: {message_data['title']}"
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSuccessfully processed system messages:\n"
                f"Created: {created_count}\n"
                f"Updated: {updated_count}"
            )
        )

        # Display summary
        total_messages = SystemMessage.objects.count()
        read_messages = SystemMessage.objects.filter(is_read=True).count()
        unread_messages = SystemMessage.objects.filter(is_read=False).count()

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSystem Messages Summary:\n"
                f"Total Messages: {total_messages}\n"
                f"Read Messages: {read_messages}\n"
                f"Unread Messages: {unread_messages}"
            )
        )
