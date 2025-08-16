from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

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
