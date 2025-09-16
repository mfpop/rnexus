from django.core.management.base import BaseCommand
from django.db import transaction

from api.models import ActivityPriority, ActivityStatus


class Command(BaseCommand):
    help = "Populate database with default activity status and priority configurations"

    def handle(self, *args, **options):
        self.stdout.write("Populating activity status and priority configurations...")

        with transaction.atomic():
            # Create Activity Status configurations
            status_configs = [
                {
                    "status": "planned",
                    "display_name": "Planned",
                    "color_bg": "bg-blue-50",
                    "color_text": "text-blue-700",
                    "color_border": "border-blue-200",
                    "icon": "📋",
                    "description": "Activity is planned and scheduled for future execution",
                    "sort_order": 1,
                },
                {
                    "status": "in-progress",
                    "display_name": "In Progress",
                    "color_bg": "bg-amber-50",
                    "color_text": "text-amber-700",
                    "color_border": "border-amber-200",
                    "icon": "⚡",
                    "description": "Activity is currently being worked on",
                    "sort_order": 2,
                },
                {
                    "status": "completed",
                    "display_name": "Completed",
                    "color_bg": "bg-green-50",
                    "color_text": "text-green-700",
                    "color_border": "border-green-200",
                    "icon": "✅",
                    "description": "Activity has been successfully completed",
                    "sort_order": 3,
                },
                {
                    "status": "cancelled",
                    "display_name": "Cancelled",
                    "color_bg": "bg-red-50",
                    "color_text": "text-red-700",
                    "color_border": "border-red-200",
                    "icon": "❌",
                    "description": "Activity has been cancelled and will not be executed",
                    "sort_order": 4,
                },
                {
                    "status": "overdue",
                    "display_name": "Overdue",
                    "color_bg": "bg-red-100",
                    "color_text": "text-red-800",
                    "color_border": "border-red-300",
                    "icon": "⚠️",
                    "description": "Activity is past its scheduled end time and requires immediate attention",
                    "sort_order": 5,
                },
            ]

            for config in status_configs:
                ActivityStatus.objects.update_or_create(
                    status=config["status"], defaults=config
                )
                self.stdout.write(f"✓ Created/Updated status: {config['display_name']}")

            # Create Activity Priority configurations
            priority_configs = [
                {
                    "priority": "low",
                    "display_name": "Low",
                    "color_bg": "bg-green-50",
                    "color_text": "text-green-700",
                    "color_border": "border-green-200",
                    "description": "Low priority activity, can be addressed when convenient",
                    "sort_order": 1,
                },
                {
                    "priority": "medium",
                    "display_name": "Medium",
                    "color_bg": "bg-blue-50",
                    "color_text": "text-blue-700",
                    "color_border": "border-blue-200",
                    "description": "Normal priority activity, should be addressed within normal timeframes",
                    "sort_order": 2,
                },
                {
                    "priority": "high",
                    "display_name": "High",
                    "color_bg": "bg-amber-50",
                    "color_text": "text-amber-700",
                    "color_border": "border-amber-200",
                    "description": "High priority activity, requires prompt attention",
                    "sort_order": 3,
                },
                {
                    "priority": "critical",
                    "display_name": "Critical",
                    "color_bg": "bg-red-50",
                    "color_text": "text-red-700",
                    "color_border": "border-red-200",
                    "description": "Critical priority activity, requires immediate attention and may block other work",
                    "sort_order": 4,
                },
            ]

            for config in priority_configs:
                ActivityPriority.objects.update_or_create(
                    priority=config["priority"], defaults=config
                )
                self.stdout.write(
                    f"✓ Created/Updated priority: {config['display_name']}"
                )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully populated activity status and priority configurations!"
            )
        )
