import json

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import UserProfile

# Temporarily commented out due to missing SystemMessage model
# from .models import SystemMessage

# @receiver(post_save, sender=SystemMessage)
# def send_system_message_to_websocket(sender, instance, created, **kwargs):
#     if created: # Only send when a new message is created
#         channel_layer = get_channel_layer()
#         user_id = instance.recipient.id
#         group_name = f'user_{user_id}'
#
#         message_data = {
#             'id': instance.id,
#             'title': instance.title,
#             'message': instance.message,
#             'message_type': instance.message_type,
#             'link': instance.link,
#             'is_read': instance.is_read,
#             'created_at': instance.created_at.isoformat(),
#         }
#
#         async_to_sync(channel_layer.group_send)(
#             group_name,
#             {
#                 'type': 'send_system_message', # This maps to a method in your consumer
#                 'message': message_data
#             }
#         )


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Automatically create a UserProfile when a new User is created"""
    if created:
        UserProfile.objects.create(
            user=instance,
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
        print(f"Created UserProfile for user: {instance.username}")


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """Automatically save the UserProfile when the User is saved"""
    try:
        instance.profile.save()
    except UserProfile.DoesNotExist:
        # If profile doesn't exist, create it
        create_user_profile(sender, instance, created=True, **kwargs)
