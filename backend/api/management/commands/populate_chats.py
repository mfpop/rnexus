import json
import random
from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import Chat, Message


class Command(BaseCommand):
    help = "Populate the database with sample chats and messages for testing"

    def handle(self, *args, **options):
        # Get users for creating chats
        users = list(User.objects.all())
        if len(users) < 2:
            self.stdout.write(
                self.style.ERROR(
                    "Need at least 2 users to create chats. Run populate_users first."
                )
            )
            return

        # Sample conversation starters
        conversation_starters = [
            "Hey! How's it going?",
            "Good morning! Ready for the day?",
            "Hi there! Do you have a minute?",
            "Hello! I wanted to discuss something with you.",
            "Hey! Quick question for you.",
            "Good afternoon! How was your weekend?",
            "Hi! I need your input on something.",
            "Hello! Are you free for a quick chat?",
            "Hey there! Got a moment?",
            "Hi! I wanted to catch up with you.",
        ]

        # Sample responses
        responses = [
            "I'm doing great, thanks for asking!",
            "Good morning! Yes, feeling ready!",
            "Of course! What's on your mind?",
            "Sure thing! What would you like to discuss?",
            "Absolutely! What's the question?",
            "It was wonderful! How about yours?",
            "I'd be happy to help! What do you need?",
            "Yes, I'm free! What's up?",
            "Definitely! What's going on?",
            "Always! What's new with you?",
        ]

        # Sample follow-up messages
        follow_ups = [
            "That sounds great!",
            "I'm glad to hear that.",
            "Thanks for sharing that with me.",
            "That's really interesting.",
            "I appreciate you telling me.",
            "That makes perfect sense.",
            "I'm happy for you!",
            "That's wonderful news!",
            "I can relate to that.",
            "That's exactly what I was thinking.",
        ]

        # Sample work-related messages
        work_messages = [
            "Have you reviewed the latest project proposal?",
            "The quarterly report is ready for your review.",
            "We have a team meeting scheduled for tomorrow.",
            "The new software update has been deployed.",
            "Customer feedback has been very positive.",
            "We need to discuss the budget for next quarter.",
            "The training session went really well.",
            "I've updated the project timeline.",
            "The client presentation is scheduled for Friday.",
            "We've received approval for the new initiative.",
        ]

        created_chats = 0
        created_messages = 0

        # Create individual chats between random users
        for i in range(min(10, len(users) // 2)):
            user1 = users[i * 2]
            user2 = users[i * 2 + 1]

            # Create chat ID
            chat_id = f"chat_{user1.pk}_{user2.pk}"

            # Create or get chat
            chat, created = Chat.objects.get_or_create(
                id=chat_id,
                defaults={
                    "chat_type": Chat.CHAT_TYPE_USER,
                    "user1": user1,
                    "user2": user2,
                    "name": f"Chat with {user2.first_name}",
                    "description": f"Direct message conversation with {user2.get_full_name()}",
                },
            )

            if created:
                created_chats += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Created chat: {user1.username} <-> {user2.username}"
                    )
                )

            # Create conversation
            messages_created = self._create_conversation(
                chat, user1, user2, conversation_starters, responses, follow_ups
            )
            created_messages += messages_created

        # Create group chats
        group_chats_data = [
            {
                "name": "Technology Team",
                "description": "Daily updates and discussions for the tech team",
                "members": [
                    "john.ceo",
                    "mike.cto",
                    "alex.dev",
                    "emma.dev",
                    "david.dev",
                    "sam.qa",
                ],
            },
            {
                "name": "Operations Hub",
                "description": "Operations team coordination and updates",
                "members": ["john.ceo", "lisa.ops", "tom.ops", "kevin.research"],
            },
            {
                "name": "Company Announcements",
                "description": "Important company-wide announcements and updates",
                "members": [user.username for user in users],
            },
            {
                "name": "Project Alpha",
                "description": "Project Alpha development team discussions",
                "members": ["mike.cto", "alex.dev", "emma.dev", "david.dev", "sam.qa"],
            },
            {
                "name": "Sales & Marketing",
                "description": "Sales and marketing team coordination",
                "members": ["john.ceo", "anna.sales", "james.marketing", "rachel.hr"],
            },
        ]

        for group_data in group_chats_data:
            # Get member users
            member_usernames = group_data["members"]
            member_users = [user for user in users if user.username in member_usernames]

            if len(member_users) < 2:
                continue

            # Create group chat
            chat_id = f"group_{group_data['name'].lower().replace(' ', '_')}"
            chat, created = Chat.objects.get_or_create(
                id=chat_id,
                defaults={
                    "chat_type": Chat.CHAT_TYPE_GROUP,
                    "name": group_data["name"],
                    "description": group_data["description"],
                    "members": [str(user.pk) for user in member_users],
                    "created_by": member_users[0],
                },
            )

            if created:
                created_chats += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Created group chat: {group_data['name']}")
                )

            # Create group conversation
            messages_created = self._create_group_conversation(
                chat, member_users, work_messages, follow_ups
            )
            created_messages += messages_created

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSuccessfully created:\n"
                f"Chats: {created_chats}\n"
                f"Messages: {created_messages}"
            )
        )

    def _create_conversation(self, chat, user1, user2, starters, responses, follow_ups):
        """Create a conversation between two users"""
        messages_created = 0
        current_time = timezone.now() - timedelta(days=random.randint(1, 30))

        # First message
        starter = random.choice(starters)
        message1 = Message.objects.create(
            chat_id=chat.id,
            chat_type=chat.chat_type,
            sender_id=str(user1.id),
            sender_name=user1.get_full_name(),
            content=starter,
            message_type=Message.MESSAGE_TYPE_TEXT,
            status=Message.MESSAGE_STATUS_READ,
            timestamp=current_time,
        )
        messages_created += 1
        current_time += timedelta(minutes=random.randint(1, 10))

        # Response
        response = random.choice(responses)
        message2 = Message.objects.create(
            chat_id=chat.id,
            chat_type=chat.chat_type,
            sender_id=str(user2.id),
            sender_name=user2.get_full_name(),
            content=response,
            message_type=Message.MESSAGE_TYPE_TEXT,
            status=Message.MESSAGE_STATUS_READ,
            timestamp=current_time,
        )
        messages_created += 1
        current_time += timedelta(minutes=random.randint(1, 15))

        # Follow-up
        follow_up = random.choice(follow_ups)
        message3 = Message.objects.create(
            chat_id=chat.id,
            chat_type=chat.chat_type,
            sender_id=str(user1.id),
            sender_name=user1.get_full_name(),
            content=follow_up,
            message_type=Message.MESSAGE_TYPE_TEXT,
            status=Message.MESSAGE_STATUS_READ,
            timestamp=current_time,
        )
        messages_created += 1

        # Update chat's last message
        chat.update_last_message(message3)

        return messages_created

    def _create_group_conversation(self, chat, members, work_messages, follow_ups):
        """Create a group conversation"""
        messages_created = 0
        current_time = timezone.now() - timedelta(days=random.randint(1, 7))

        # Create 5-10 messages in the group
        for i in range(random.randint(5, 10)):
            sender = random.choice(members)
            content = random.choice(work_messages + follow_ups)

            message = Message.objects.create(
                chat_id=chat.id,
                chat_type=chat.chat_type,
                sender_id=str(sender.id),
                sender_name=sender.get_full_name(),
                content=content,
                message_type=Message.MESSAGE_TYPE_TEXT,
                status=Message.MESSAGE_STATUS_READ,
                timestamp=current_time,
            )
            messages_created += 1

            # Update chat's last message
            chat.update_last_message(message)

            current_time += timedelta(minutes=random.randint(5, 30))

        return messages_created
