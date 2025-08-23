import random
from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone


class Command(BaseCommand):
    help = "Populate the database with sample users for testing"

    def handle(self, *args, **options):
        # Sample user data with realistic company structure
        users_data = [
            # Executive Team
            {
                "username": "john.ceo",
                "email": "john.ceo@nexus.com",
                "first_name": "John",
                "last_name": "Anderson",
                "password": "nexus123",
                "is_staff": True,
                "is_superuser": True,
                "date_joined": timezone.now() - timedelta(days=1095),  # 3 years ago
                "profile": {
                    "department": "Executive",
                    "position": "Chief Executive Officer",
                    "employee_id": "EMP001",
                    "phone": "+1-555-0101",
                },
            },
            {
                "username": "sarah.cfo",
                "email": "sarah.cfo@nexus.com",
                "first_name": "Sarah",
                "last_name": "Mitchell",
                "password": "nexus123",
                "is_staff": True,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=730),  # 2 years ago
                "profile": {
                    "department": "Finance",
                    "position": "Chief Financial Officer",
                    "employee_id": "EMP002",
                    "phone": "+1-555-0102",
                },
            },
            {
                "username": "mike.cto",
                "email": "mike.cto@nexus.com",
                "first_name": "Mike",
                "last_name": "Chen",
                "password": "nexus123",
                "is_staff": True,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=730),
                "profile": {
                    "department": "Technology",
                    "position": "Chief Technology Officer",
                    "employee_id": "EMP003",
                    "phone": "+1-555-0103",
                },
            },
            # Technology Team
            {
                "username": "alex.dev",
                "email": "alex.dev@nexus.com",
                "first_name": "Alex",
                "last_name": "Rodriguez",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=365),
                "profile": {
                    "department": "Technology",
                    "position": "Senior Software Engineer",
                    "employee_id": "EMP004",
                    "phone": "+1-555-0104",
                },
            },
            {
                "username": "emma.dev",
                "email": "emma.dev@nexus.com",
                "first_name": "Emma",
                "last_name": "Thompson",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=180),
                "profile": {
                    "department": "Technology",
                    "position": "Frontend Developer",
                    "employee_id": "EMP005",
                    "phone": "+1-555-0105",
                },
            },
            {
                "username": "david.dev",
                "email": "david.dev@nexus.com",
                "first_name": "David",
                "last_name": "Kim",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=90),
                "profile": {
                    "department": "Technology",
                    "position": "Backend Developer",
                    "employee_id": "EMP006",
                    "phone": "+1-555-0106",
                },
            },
            # Operations Team
            {
                "username": "lisa.ops",
                "email": "lisa.ops@nexus.com",
                "first_name": "Lisa",
                "last_name": "Wang",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=547),
                "profile": {
                    "department": "Operations",
                    "position": "Operations Manager",
                    "employee_id": "EMP007",
                    "phone": "+1-555-0107",
                },
            },
            {
                "username": "tom.ops",
                "email": "tom.ops@nexus.com",
                "first_name": "Tom",
                "last_name": "Johnson",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=365),
                "profile": {
                    "department": "Operations",
                    "position": "Production Supervisor",
                    "employee_id": "EMP008",
                    "phone": "+1-555-0108",
                },
            },
            # Sales & Marketing
            {
                "username": "anna.sales",
                "email": "anna.sales@nexus.com",
                "first_name": "Anna",
                "last_name": "Garcia",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=730),
                "profile": {
                    "department": "Sales",
                    "position": "Sales Director",
                    "employee_id": "EMP009",
                    "phone": "+1-555-0109",
                },
            },
            {
                "username": "james.marketing",
                "email": "james.marketing@nexus.com",
                "first_name": "James",
                "last_name": "Wilson",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=456),
                "profile": {
                    "department": "Marketing",
                    "position": "Marketing Manager",
                    "employee_id": "EMP010",
                    "phone": "+1-555-0110",
                },
            },
            # HR Team
            {
                "username": "rachel.hr",
                "email": "rachel.hr@nexus.com",
                "first_name": "Rachel",
                "last_name": "Brown",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=547),
                "profile": {
                    "department": "Human Resources",
                    "position": "HR Manager",
                    "employee_id": "EMP011",
                    "phone": "+1-555-0111",
                },
            },
            # Quality Assurance
            {
                "username": "sam.qa",
                "email": "sam.qa@nexus.com",
                "first_name": "Sam",
                "last_name": "Davis",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=365),
                "profile": {
                    "department": "Quality Assurance",
                    "position": "QA Engineer",
                    "employee_id": "EMP012",
                    "phone": "+1-555-0112",
                },
            },
            # Customer Support
            {
                "username": "maria.support",
                "email": "maria.support@nexus.com",
                "first_name": "Maria",
                "last_name": "Lopez",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=180),
                "profile": {
                    "department": "Customer Support",
                    "position": "Support Specialist",
                    "employee_id": "EMP013",
                    "phone": "+1-555-0113",
                },
            },
            # Research & Development
            {
                "username": "kevin.research",
                "email": "kevin.research@nexus.com",
                "first_name": "Kevin",
                "last_name": "Taylor",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=547),
                "profile": {
                    "department": "Research & Development",
                    "position": "Research Scientist",
                    "employee_id": "EMP014",
                    "phone": "+1-555-0114",
                },
            },
            # Legal & Compliance
            {
                "username": "jennifer.legal",
                "email": "jennifer.legal@nexus.com",
                "first_name": "Jennifer",
                "last_name": "Clark",
                "password": "nexus123",
                "is_staff": False,
                "is_superuser": False,
                "date_joined": timezone.now() - timedelta(days=730),
                "profile": {
                    "department": "Legal",
                    "position": "Legal Counsel",
                    "employee_id": "EMP015",
                    "phone": "+1-555-0115",
                },
            },
        ]

        created_count = 0
        updated_count = 0

        for user_data in users_data:
            profile_data = user_data.pop("profile")

            # Create or get user
            user, created = User.objects.get_or_create(
                username=user_data["username"], defaults=user_data
            )

            if created:
                user.set_password(user_data["password"])
                user.save()
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created user: {user.username} ({profile_data['position']})"
                    )
                )
            else:
                # Update existing user
                for key, value in user_data.items():
                    if key != "username" and hasattr(user, key):
                        setattr(user, key, value)
                user.save()
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"Updated user: {user.username} ({profile_data['position']})"
                    )
                )

            # Note: In a real implementation, you might want to create a separate UserProfile model
            # For now, we'll just store the profile info in the user object if needed

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully processed users. Created: {created_count}, Updated: {updated_count}"
            )
        )

        # Display summary
        total_users = User.objects.count()
        staff_users = User.objects.filter(is_staff=True).count()
        superusers = User.objects.filter(is_superuser=True).count()

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDatabase Summary:\n"
                f"Total Users: {total_users}\n"
                f"Staff Users: {staff_users}\n"
                f"Superusers: {superusers}"
            )
        )
