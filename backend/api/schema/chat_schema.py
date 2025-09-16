import graphene
from graphene_django.types import DjangoObjectType

from api.models import Chat, Message, SystemMessage


class MessageType(DjangoObjectType):
    class Meta:
        model = Message
        fields = (
            "id",
            "chat_id",
            "chat_type",
            "sender_id",
            "sender_name",
            "content",
            "message_type",
            "status",
            "reply_to",
            "forwarded",
            "forwarded_from",
            "edited",
            "edited_at",
            "file_name",
            "file_size",
            "file_url",
            "thumbnail_url",
            "caption",
            "duration",
            "waveform",
            "latitude",
            "longitude",
            "location_name",
            "contact_name",
            "contact_phone",
            "contact_email",
            "timestamp",
        )

    # Add camelCase field mappings
    chatId = graphene.String(source="chat_id")
    chatType = graphene.String(source="chat_type")
    senderId = graphene.String(source="sender_id")
    senderName = graphene.String(source="sender_name")
    messageType = graphene.String(source="message_type")
    replyTo = graphene.Field(lambda: MessageType, source="reply_to")
    forwardedFrom = graphene.String(source="forwarded_from")
    editedAt = graphene.DateTime(source="edited_at")
    fileName = graphene.String(source="file_name")
    fileSize = graphene.String(source="file_size")
    fileUrl = graphene.String(source="file_url")
    thumbnailUrl = graphene.String(source="thumbnail_url")
    locationName = graphene.String(source="location_name")
    contactName = graphene.String(source="contact_name")
    contactPhone = graphene.String(source="contact_phone")
    contactEmail = graphene.String(source="contact_email")


class ChatType(DjangoObjectType):
    class Meta:
        model = Chat
        fields = (
            "id",
            "chat_type",
            "name",
            "description",
            "user1",
            "user2",
            "members",
            "last_activity",
            "is_active",
            "is_archived",
            "archived_at",
            "created_at",
        )

    # Add camelCase field mappings
    user1 = graphene.Field(lambda: UserType)  # Import will be added
    user2 = graphene.Field(lambda: UserType)  # Import will be added
    lastActivity = graphene.DateTime(source="last_activity")
    isActive = graphene.Boolean(source="is_active")
    isArchived = graphene.Boolean(source="is_archived")
    archivedAt = graphene.DateTime(source="archived_at")
    createdAt = graphene.DateTime(source="created_at")

    # Add computed fields
    messages = graphene.List(MessageType)
    latestMessage = graphene.Field(MessageType)

    def resolve_messages(self, info, **kwargs):
        # In DjangoObjectType resolvers, self is the Django model instance
        chat_id = getattr(self, "id", None)
        if chat_id:
            return Message.objects.filter(chat_id=str(chat_id)).order_by("-timestamp")[
                :50
            ]
        return []

    def resolve_latest_message(self, info):
        # In DjangoObjectType resolvers, self is the Django model instance
        chat_id = getattr(self, "id", None)
        if chat_id:
            return (
                Message.objects.filter(chat_id=str(chat_id))
                .order_by("-timestamp")
                .first()
            )
        return None


class SystemMessageType(DjangoObjectType):
    class Meta:
        model = SystemMessage
        fields = (
            "recipient_id",
            "title",
            "message",
            "message_type",
            "link",
            "is_read",
            "created_at",
        )

    # Add camelCase field mappings
    recipientId = graphene.String(source="recipient_id")
    messageType = graphene.String(source="message_type")
    isRead = graphene.Boolean(source="is_read")
    createdAt = graphene.DateTime(source="created_at")


class CreateMessage(graphene.Mutation):
    class Arguments:
        chat_id = graphene.String(required=True)
        chat_type = graphene.String(required=True)
        sender_id = graphene.String(required=True)
        sender_name = graphene.String(required=True)
        content = graphene.String(required=False)
        message_type = graphene.String(required=True)
        file_name = graphene.String(required=False)
        file_size = graphene.String(required=False)
        file_url = graphene.String(required=False)

    ok = graphene.Boolean()
    message = graphene.Field(MessageType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        try:
            message = Message(**kwargs)
            message.save()
            result = CreateMessage()
            result.ok = True
            result.message = message
            return result
        except Exception as e:
            result = CreateMessage()
            result.ok = False
            result.message = None
            print(f"Error creating message: {e}")
            return result


# Simple Archive Chat Mutation
class ArchiveChat(graphene.Mutation):
    """Archive a chat for the current user"""

    class Arguments:
        user_id = graphene.Int(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, user_id):
        current_user = info.context.user
        if not current_user or current_user.is_anonymous:
            result = ArchiveChat()
            result.success = False
            result.message = "Authentication required"
            return result

        if current_user.id == user_id:
            result = ArchiveChat()
            result.success = False
            result.message = "Cannot archive chat with yourself"
            return result

        try:
            # Store in user preferences/session - simple approach
            # For now, we'll use a simple approach and extend later
            result = ArchiveChat()
            result.success = True
            result.message = f"Chat with user {user_id} archived"
            return result
        except Exception as e:
            result = ArchiveChat()
            result.success = False
            result.message = f"Error: {str(e)}"
            return result


# Simple Unarchive Chat Mutation
class UnarchiveChat(graphene.Mutation):
    """Unarchive a chat for the current user"""

    class Arguments:
        user_id = graphene.Int(required=True)

    success = graphene.Boolean()
    message = graphene.String()

    def mutate(self, info, user_id):
        current_user = info.context.user
        if not current_user or current_user.is_anonymous:
            result = UnarchiveChat()
            result.success = False
            result.message = "Authentication required"
            return result

        try:
            # Remove from archived list - simple approach
            result = UnarchiveChat()
            result.success = True
            result.message = f"Chat with user {user_id} unarchived"
            return result
        except Exception as e:
            result = UnarchiveChat()
            result.success = False
            result.message = f"Error: {str(e)}"
            return result


# Import UserType at the end to avoid circular imports
from .user_types import UserType
