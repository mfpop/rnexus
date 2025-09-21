from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from api.models import UserProfile


class Command(BaseCommand):
    help = "Populate existing user profiles with default data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Force update even if profile already has data",
        )

    def handle(self, *args, **options):
        force = options["force"]

        self.stdout.write("Starting user profile population...")

        # Get all users
        users = User.objects.all()
        total_users = users.count()
        updated_count = 0
        created_count = 0

        for user in users:
            try:
                profile = UserProfile.objects.get(user=user)
                profile_exists = True
            except UserProfile.DoesNotExist:
                profile = UserProfile.objects.create(user=user)
                profile_exists = False
                created_count += 1

            # Check if profile needs updating
            needs_update = force or not profile_exists

            if not needs_update:
                # Check if profile has meaningful data
                if (
                    profile.position
                    or profile.phone1
                    or profile.bio
                    or profile.street_address
                    or profile.city
                ):
                    continue
                needs_update = True

            if needs_update:
                # Set default values for empty fields
                if not profile.phonecc1:
                    profile.phonecc1 = "+1"
                if not profile.phonet1:
                    profile.phonet1 = "mobile"
                if not profile.phonet2:
                    profile.phonet2 = "mobile"

                # Set default profile visibility
                if not profile.profile_visibility:
                    profile.profile_visibility = {
                        "email": True,
                        "phone1": True,
                        "phone2": True,
                        "address": True,
                        "education": True,
                        "work_history": True,
                        "position": True,
                        "contact": True,
                        "bio": True,
                    }

                # Set default empty arrays
                if not profile.education:
                    profile.education = []
                if not profile.work_history:
                    profile.work_history = []

                # Set some sample data for admin user
                if user.username == "admin" and not profile.position:
                    profile.middle_name = "System"
                    profile.preferred_name = "Admin"
                    profile.position = "System Administrator"
                    profile.department = "IT"
                    profile.phone1 = "+1-555-0123"
                    profile.phone2 = "+1-555-0456"
                    profile.street_address = "123 Admin Street"
                    profile.apartment_suite = "Suite 100"
                    profile.city = "Admin City"
                    profile.state_province = "Admin State"
                    profile.zip_code = "12345"
                    profile.country = "United States"
                    profile.bio = "System administrator with full access to all features and data management capabilities."

                    profile.education = [
                        {
                            "id": "1",
                            "school": "Admin University",
                            "degree": "Master of Information Technology",
                            "field": "System Administration",
                            "startYear": "2020",
                            "endYear": "2022",
                            "description": "Advanced degree in IT management and system administration",
                            "visible": True,
                        }
                    ]

                    profile.work_history = [
                        {
                            "id": "1",
                            "company": "Nexus Corporation",
                            "title": "System Administrator",
                            "department": "IT",
                            "startYear": "2022",
                            "endYear": "Present",
                            "description": "Managing system infrastructure and user access",
                            "visible": True,
                        }
                    ]

                profile.save()
                updated_count += 1

                if profile_exists:
                    self.stdout.write(f"  Updated profile for {user.username}")
                else:
                    self.stdout.write(f"  Created profile for {user.username}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Profile population completed! "
                f"Total users: {total_users}, "
                f"Profiles created: {created_count}, "
                f"Profiles updated: {updated_count}"
            )
        )
