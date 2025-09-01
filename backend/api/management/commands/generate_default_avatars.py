import io
import os

from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from PIL import Image, ImageDraw, ImageFont

from api.models import UserProfile


class Command(BaseCommand):
    help = "Generate default avatar images for all users who don't have them"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Regenerate avatars even if they already exist",
        )

    def handle(self, *args, **options):
        force = options["force"]

        self.stdout.write("Starting avatar generation...")

        # Get all users
        users = User.objects.all()
        total_users = users.count()
        generated_count = 0
        skipped_count = 0

        for user in users:
            try:
                profile = user.profile
            except UserProfile.DoesNotExist:
                self.stdout.write(f"❌ {user.username}: No profile found, skipping")
                continue

            # Check if user already has an avatar
            if profile.avatar and not force:
                self.stdout.write(
                    f"⏭️  {user.username}: Avatar already exists, skipping"
                )
                skipped_count += 1
                continue

            # Generate avatar
            try:
                avatar_image = self.generate_avatar(user)
                if avatar_image:
                    # Save the avatar with a unique name to avoid conflicts
                    filename = f"avatar_{user.username}_{user.id}.png"
                    profile.avatar.save(filename, ContentFile(avatar_image), save=True)
                    generated_count += 1
                    self.stdout.write(
                        f"✅ {user.username}: Avatar generated successfully"
                    )
                else:
                    self.stdout.write(f"❌ {user.username}: Failed to generate avatar")
            except Exception as e:
                self.stdout.write(f"❌ {user.username}: Error generating avatar: {e}")

        self.stdout.write("=" * 50)
        self.stdout.write(
            self.style.SUCCESS(
                f"Avatar generation completed!\n"
                f"Total users: {total_users}\n"
                f"Avatars generated: {generated_count}\n"
                f"Avatars skipped: {skipped_count}\n"
                f"Coverage: {((generated_count + skipped_count) / total_users) * 100:.1f}%"
            )
        )

    def generate_avatar(self, user):
        """Generate a default avatar image for a user"""
        try:
            # Create a 200x200 image with a gradient background
            size = (200, 200)
            image = Image.new("RGB", size, (255, 255, 255))
            draw = ImageDraw.Draw(image)

            # Create gradient background
            for y in range(size[1]):
                # Blue to purple gradient
                r = int(37 + (y / size[1]) * (147 - 37))
                g = int(99 + (y / size[1]) * (51 - 99))
                b = int(235 + (y / size[1]) * (133 - 235))
                draw.line([(0, y), (size[0], y)], fill=(r, g, b))

            # Get initials for the avatar
            first_name = user.first_name or ""
            last_name = user.last_name or ""
            username = user.username

            if first_name and last_name:
                initials = f"{first_name[0]}{last_name[0]}".upper()
            elif first_name:
                initials = first_name[0].upper()
            elif last_name:
                initials = last_name[0].upper()
            else:
                initials = username[0].upper()

            # Try to use a default font, fallback to basic if not available
            try:
                # Try to use a larger, more readable font
                font_size = 80
                font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
            except:
                try:
                    # Fallback to default font
                    font = ImageFont.load_default()
                    font_size = 60
                except:
                    # Last resort - no font
                    font = None
                    font_size = 60

            # Calculate text position to center it
            if font:
                bbox = draw.textbbox((0, 0), initials, font=font)
                text_width = bbox[2] - bbox[0]
                text_height = bbox[3] - bbox[1]
            else:
                # Estimate text dimensions if no font
                text_width = len(initials) * font_size * 0.6
                text_height = font_size

            x = (size[0] - text_width) // 2
            y = (size[1] - text_height) // 2

            # Draw the initials
            if font:
                draw.text((x, y), initials, fill=(255, 255, 255), font=font)
            else:
                # Draw simple text without font
                draw.text((x, y), initials, fill=(255, 255, 255))

            # Convert to bytes
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            buffer.seek(0)

            return buffer.getvalue()

        except Exception as e:
            self.stdout.write(f"Error generating avatar for {user.username}: {e}")
            return None
