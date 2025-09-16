from django.core.management.base import BaseCommand

from api.models import Tag


class Command(BaseCommand):
    help = "Populate initial tags for the news system"

    def handle(self, *args, **options):
        # Define initial tags with categories
        initial_tags = [
            # Production tags
            {
                "name": "efficiency",
                "description": "Improvements in production efficiency",
                "category": "production",
                "color": "#10B981",
            },
            {
                "name": "quality",
                "description": "Quality control and improvements",
                "category": "production",
                "color": "#3B82F6",
            },
            {
                "name": "safety",
                "description": "Safety protocols and incidents",
                "category": "production",
                "color": "#EF4444",
            },
            {
                "name": "maintenance",
                "description": "Equipment maintenance and repairs",
                "category": "production",
                "color": "#F59E0B",
            },
            {
                "name": "training",
                "description": "Employee training and development",
                "category": "production",
                "color": "#8B5CF6",
            },
            # Technology tags
            {
                "name": "automation",
                "description": "Automation and robotics",
                "category": "technology",
                "color": "#06B6D4",
            },
            {
                "name": "digital",
                "description": "Digital transformation initiatives",
                "category": "technology",
                "color": "#6366F1",
            },
            {
                "name": "iot",
                "description": "Internet of Things and sensors",
                "category": "technology",
                "color": "#84CC16",
            },
            {
                "name": "ai",
                "description": "Artificial Intelligence and machine learning",
                "category": "technology",
                "color": "#EC4899",
            },
            {
                "name": "data",
                "description": "Data analytics and insights",
                "category": "technology",
                "color": "#F97316",
            },
            # Company tags
            {
                "name": "announcement",
                "description": "Company announcements and news",
                "category": "company",
                "color": "#6B7280",
            },
            {
                "name": "policy",
                "description": "Company policy changes",
                "category": "company",
                "color": "#374151",
            },
            {
                "name": "event",
                "description": "Company events and activities",
                "category": "company",
                "color": "#059669",
            },
            {
                "name": "recognition",
                "description": "Employee recognition and awards",
                "category": "company",
                "color": "#DC2626",
            },
            {
                "name": "update",
                "description": "General company updates",
                "category": "company",
                "color": "#7C3AED",
            },
            # Industry tags
            {
                "name": "market",
                "description": "Market trends and analysis",
                "category": "industry",
                "color": "#1F2937",
            },
            {
                "name": "competition",
                "description": "Competitive landscape",
                "category": "industry",
                "color": "#B91C1C",
            },
            {
                "name": "regulation",
                "description": "Regulatory changes and compliance",
                "category": "industry",
                "color": "#92400E",
            },
            {
                "name": "innovation",
                "description": "Industry innovations and trends",
                "category": "industry",
                "color": "#059669",
            },
            {
                "name": "partnership",
                "description": "Strategic partnerships and collaborations",
                "category": "industry",
                "color": "#7C2D12",
            },
        ]

        created_count = 0
        updated_count = 0

        for tag_data in initial_tags:
            tag, created = Tag.objects.get_or_create(
                name=tag_data["name"], defaults=tag_data
            )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Created tag: {tag.name} ({tag.category})")
                )
            else:
                # Update existing tag if needed
                for key, value in tag_data.items():
                    if key != "name" and getattr(tag, key) != value:
                        setattr(tag, key, value)
                        updated_count += 1

                if updated_count > 0:
                    tag.save()
                    self.stdout.write(
                        self.style.WARNING(f"Updated tag: {tag.name} ({tag.category})")
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully processed tags. Created: {created_count}, Updated: {updated_count}"
            )
        )
