from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from api.models import UserProfile


class Command(BaseCommand):
    help = "Check the status of all user profiles"

    def add_arguments(self, parser):
        parser.add_argument(
            "--detailed",
            action="store_true",
            help="Show detailed information for each profile",
        )

    def handle(self, *args, **options):
        detailed = options["detailed"]

        self.stdout.write("Checking user profile status...")
        self.stdout.write("=" * 50)

        # Get all users
        users = User.objects.all().order_by("username")
        total_users = users.count()
        profiles_with_data = 0
        empty_profiles = 0

        for user in users:
            try:
                profile = UserProfile.objects.get(user=user)
                profile_exists = True
            except UserProfile.DoesNotExist:
                self.stdout.write(f"❌ {user.username}: No profile found")
                continue

            # Check if profile has meaningful data
            has_data = (
                profile.position
                or profile.phone1
                or profile.bio
                or profile.street_address
                or profile.city
                or profile.department
            )

            if has_data:
                profiles_with_data += 1
                status = "✅"
            else:
                empty_profiles += 1
                status = "⚠️ "

            if detailed:
                self.stdout.write(f"{status} {user.username}:")
                self.stdout.write(f"    Email: {user.email}")
                self.stdout.write(f"    Name: {user.first_name} {user.last_name}")
                self.stdout.write(f'    Position: {profile.position or "Not set"}')
                self.stdout.write(f'    Department: {profile.department or "Not set"}')
                self.stdout.write(f'    Phone: {profile.phone1 or "Not set"}')
                self.stdout.write(
                    f'    Bio: {profile.bio[:50] + "..." if profile.bio else "Not set"}'
                )
                self.stdout.write(f'    Address: {profile.street_address or "Not set"}')
                self.stdout.write(f'    City: {profile.city or "Not set"}')
                self.stdout.write(f"    Education: {len(profile.education)} items")
                self.stdout.write(
                    f"    Work History: {len(profile.work_history)} items"
                )
                self.stdout.write("")
            else:
                self.stdout.write(
                    f'{status} {user.username}: {"Has data" if has_data else "Empty profile"}'
                )

        self.stdout.write("=" * 50)
        self.stdout.write(
            self.style.SUCCESS(
                f"Profile Status Summary:\n"
                f"Total Users: {total_users}\n"
                f"Profiles with Data: {profiles_with_data}\n"
                f"Empty Profiles: {empty_profiles}\n"
                f"Coverage: {(profiles_with_data/total_users)*100:.1f}%"
            )
        )
