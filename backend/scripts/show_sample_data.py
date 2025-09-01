#!/usr/bin/env python
"""
Sample Data Display Script
Run this to see examples of the populated data
"""

import os
import sys

import django

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

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


def show_sample_data():
    print("=" * 60)
    print("🎯 NEXUS DATABASE - SAMPLE DATA OVERVIEW")
    print("=" * 60)

    # Users
    print("\n👥 USERS (showing first 5):")
    users = User.objects.all()[:5]
    for user in users:
        print(f"  • {user.username} - {user.get_full_name()} (Staff: {user.is_staff})")

    # Tags
    print("\n📋 TAGS by Category:")
    tags_by_category = {}
    for tag in Tag.objects.all():
        if tag.category not in tags_by_category:
            tags_by_category[tag.category] = []
        tags_by_category[tag.category].append(tag.name)

    for category, tag_names in tags_by_category.items():
        print(
            f"  {category.title()}: {', '.join(tag_names[:3])}{'...' if len(tag_names) > 3 else ''}"
        )

    # Updates
    print("\n📰 RECENT UPDATES (showing first 3):")
    updates = Update.objects.all()[:3]
    for update in updates:
        print(f"  • {update.title}")
        print(
            f"    Type: {update.type} | Priority: {update.priority} | Author: {update.author}"
        )
        print(f"    Tags: {', '.join(update.tags[:3])}")

    # Chats
    print("\n💬 CHAT OVERVIEW:")
    individual_chats = Chat.objects.filter(chat_type="user").count()
    group_chats = Chat.objects.filter(chat_type="group").count()
    print(f"  Individual Chats: {individual_chats}")
    print(f"  Group Chats: {group_chats}")

    # Sample group chat
    group_chat = Chat.objects.filter(chat_type="group").first()
    if group_chat:
        print(f"  Sample Group: {group_chat.name} ({len(group_chat.members)} members)")

    # Messages
    print("\n💭 RECENT MESSAGES (showing first 3):")
    messages = Message.objects.all()[:3]
    for msg in messages:
        print(
            f"  • {msg.sender_name}: {msg.content[:50]}{'...' if len(msg.content) > 50 else ''}"
        )
        print(
            f"    Chat: {msg.chat_id} | Time: {msg.timestamp.strftime('%Y-%m-%d %H:%M')}"
        )

    # System Messages
    print("\n🔔 SYSTEM MESSAGES (showing first 3):")
    system_messages = SystemMessage.objects.all()[:3]
    for sm in system_messages:
        print(f"  • {sm.title} ({sm.message_type})")
        print(f"    Recipient: {sm.recipient_id} | Read: {sm.is_read}")

    # Attachments and Media
    print("\n📎 ATTACHMENTS & MEDIA:")
    print(f"  Attachments: {UpdateAttachment.objects.count()}")
    print(f"  Media: {UpdateMedia.objects.count()}")

    # Sample attachment
    attachment = UpdateAttachment.objects.first()
    if attachment:
        print(f"  Sample Attachment: {attachment.label} ({attachment.type})")

    # Sample media
    media = UpdateMedia.objects.first()
    if media:
        print(f"  Sample Media: {media.label} ({media.type})")

    print("\n" + "=" * 60)
    print("✨ Database is now rich with realistic sample data!")
    print("=" * 60)


if __name__ == "__main__":
    show_sample_data()
