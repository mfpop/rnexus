from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from api.models import UserProfile


class Command(BaseCommand):
    help = "Create missing users that exist in frontend sample data"

    def handle(self, *args, **options):
        self.stdout.write("Creating missing users...")

        # List of users that should exist based on frontend data
        users_to_create = [
            {
                "username": "alex.rodriguez",
                "email": "alex.rodriguez@company.com",
                "first_name": "Alex",
                "last_name": "Rodriguez",
                "position": "Supply Chain Manager",
                "department": "Logistics",
            },
            {
                "username": "lisa.chen",
                "email": "lisa.chen@company.com",
                "first_name": "Lisa",
                "last_name": "Chen",
                "position": "HR Specialist",
                "department": "Human Resources",
            },
            {
                "username": "david.thompson",
                "email": "david.thompson@company.com",
                "first_name": "David",
                "last_name": "Thompson",
                "position": "IT Administrator",
                "department": "Information Technology",
            },
            {
                "username": "maria.garcia",
                "email": "maria.garcia@company.com",
                "first_name": "Maria",
                "last_name": "Garcia",
                "position": "Financial Analyst",
                "department": "Finance",
            },
            {
                "username": "james.wilson",
                "email": "james.wilson@company.com",
                "first_name": "James",
                "last_name": "Wilson",
                "position": "Safety Officer",
                "department": "Health & Safety",
            },
            {
                "username": "jennifer.lee",
                "email": "jennifer.lee@company.com",
                "first_name": "Jennifer",
                "last_name": "Lee",
                "position": "Marketing Coordinator",
                "department": "Marketing",
            },
            {
                "username": "robert.brown",
                "email": "robert.brown@company.com",
                "first_name": "Robert",
                "last_name": "Brown",
                "position": "Research Engineer",
                "department": "R&D",
            },
            {
                "username": "amanda.taylor",
                "email": "amanda.taylor@company.com",
                "first_name": "Amanda",
                "last_name": "Taylor",
                "position": "Customer Service Lead",
                "department": "Customer Support",
            },
        ]

        created_count = 0
        for user_data in users_to_create:
            username = user_data["username"]

            # Check if user already exists
            if User.objects.filter(username=username).exists():
                self.stdout.write(f"⏭️  {username}: User already exists")
                continue

            try:
                # Create user
                user = User.objects.create_user(
                    username=username,
                    email=user_data["email"],
                    first_name=user_data["first_name"],
                    last_name=user_data["last_name"],
                    password="password123",  # Default password
                )

                # Create profile
                profile = UserProfile.objects.create(
                    user=user,
                    position=user_data["position"],
                    department=user_data["department"],
                    phone_country_code="+1",
                    phone_type="mobile",
                    secondary_phone_type="mobile",
                    profile_visibility={
                        "email": True,
                        "phone": True,
                        "secondary_phone": True,
                        "address": True,
                        "education": True,
                        "work_history": True,
                        "position": True,
                        "contact": True,
                        "bio": True,
                    },
                    education=[],
                    work_history=[],
                )

                created_count += 1
                self.stdout.write(
                    f"✅ {username}: User and profile created successfully"
                )

            except Exception as e:
                self.stdout.write(f"❌ {username}: Error creating user: {e}")

        self.stdout.write("=" * 50)
        self.stdout.write(
            self.style.SUCCESS(
                f"User creation completed!\n"
                f"Users created: {created_count}\n"
                f"Total users now: {User.objects.count()}"
            )
        )
