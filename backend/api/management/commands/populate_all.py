from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Run all population commands to fully populate the database"

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Force recreation of existing data",
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS("🚀 Starting comprehensive database population...")
        )

        # Step 1: Populate tags (foundation for updates)
        self.stdout.write("\n📋 Step 1: Populating tags...")
        try:
            call_command("populate_tags")
            self.stdout.write(self.style.SUCCESS("✅ Tags populated successfully"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error populating tags: {e}"))

        # Step 2: Populate users (foundation for everything else)
        self.stdout.write("\n👥 Step 2: Populating users...")
        try:
            call_command("populate_users")
            self.stdout.write(self.style.SUCCESS("✅ Users populated successfully"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error populating users: {e}"))

        # Step 3: Populate enhanced updates (with better content)
        self.stdout.write("\n📰 Step 3: Populating enhanced updates...")
        try:
            call_command("populate_enhanced_updates")
            self.stdout.write(
                self.style.SUCCESS("✅ Enhanced updates populated successfully")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Error populating enhanced updates: {e}")
            )

        # Step 4: Populate chats and messages
        self.stdout.write("\n💬 Step 4: Populating chats and messages...")
        try:
            call_command("populate_chats")
            self.stdout.write(
                self.style.SUCCESS("✅ Chats and messages populated successfully")
            )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"❌ Error populating chats: {e}"))

        # Step 5: Populate system messages
        self.stdout.write("\n🔔 Step 5: Populating system messages...")
        try:
            call_command("populate_system_messages")
            self.stdout.write(
                self.style.SUCCESS("✅ System messages populated successfully")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Error populating system messages: {e}")
            )

        # Step 6: Populate basic updates (legacy, if needed)
        self.stdout.write("\n📝 Step 6: Populating basic updates...")
        try:
            call_command("populate_updates")
            self.stdout.write(
                self.style.SUCCESS("✅ Basic updates populated successfully")
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"❌ Error populating basic updates: {e}")
            )

        self.stdout.write(self.style.SUCCESS("\n🎉 Database population completed!"))

        # Display final summary
        self.stdout.write("\n📊 Final Database Summary:")
        try:
            from django.contrib.auth.models import User

            from api.models import (
                Chat,
                Message,
                SystemMessage,
                Tag,
                Update,
                UpdateAttachment,
                UpdateMedia,
            )

            total_users = User.objects.count()
            total_tags = Tag.objects.count()
            total_updates = Update.objects.count()
            total_chats = Chat.objects.count()
            total_messages = Message.objects.count()
            total_system_messages = SystemMessage.objects.count()
            total_attachments = UpdateAttachment.objects.count()
            total_media = UpdateMedia.objects.count()

            self.stdout.write(f"👥 Users: {total_users}")
            self.stdout.write(f"📋 Tags: {total_tags}")
            self.stdout.write(f"📰 Updates: {total_updates}")
            self.stdout.write(f"💬 Chats: {total_chats}")
            self.stdout.write(f"💭 Messages: {total_messages}")
            self.stdout.write(f"🔔 System Messages: {total_system_messages}")
            self.stdout.write(f"📎 Attachments: {total_attachments}")
            self.stdout.write(f"🖼️ Media: {total_media}")

        except Exception as e:
            self.stdout.write(self.style.WARNING(f"Could not display summary: {e}"))

        self.stdout.write(
            self.style.SUCCESS("\n✨ Your database is now rich with sample data!")
        )
