import graphene
from graphene_django.types import DjangoObjectType

from api.models import Item, Message, SystemMessage


class ItemType(DjangoObjectType):
    class Meta:
        model = Item


class MessageType(DjangoObjectType):
    class Meta:
        model = Message


class SystemMessageType(DjangoObjectType):
    class Meta:
        model = SystemMessage
        fields = (
            "id",
            "recipient_id",
            "title",
            "message",
            "message_type",
            "link",
            "is_read",
            "created_at",
        )


class Query(graphene.ObjectType):
    all_items = graphene.List(ItemType)
    messages = graphene.List(
        MessageType,
        chat_id=graphene.String(required=True),
        chat_type=graphene.String(required=True),
    )
    system_messages = graphene.List(SystemMessageType, is_read=graphene.Boolean())

    def resolve_all_items(self, info, **kwargs):
        return Item.objects.all()

    def resolve_messages(self, info, chat_id, chat_type, **kwargs):
        return Message.objects.filter(chat_id=chat_id, chat_type=chat_type).order_by(
            "timestamp"
        )

    def resolve_system_messages(self, info, is_read=None, **kwargs):
        # For now, return all system messages since we don't have user authentication
        messages = SystemMessage.objects.all()
        if is_read is not None:
            messages = messages.filter(is_read=is_read)
        return messages.order_by("-created_at")


class CreateItem(graphene.Mutation):
    class Arguments:
        name = graphene.String()
        description = graphene.String()

    ok = graphene.Boolean()
    item = graphene.Field(ItemType)

    @classmethod
    def mutate(cls, root, info, name, description):
        item = Item(name=name, description=description)
        item.save()
        result = CreateItem()
        result.ok = True
        result.item = item
        return result


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
        message = Message(**kwargs)
        message.save()
        result = CreateMessage()
        result.ok = True
        result.message = message
        return result


class MarkSystemMessageAsRead(graphene.Mutation):
    class Arguments:
        message_id = graphene.ID(required=True)

    ok = graphene.Boolean()
    system_message = graphene.Field(SystemMessageType)

    @classmethod
    def mutate(cls, root, info, message_id):
        try:
            message = SystemMessage.objects.get(id=message_id)
            message.is_read = True
            message.save()
            result = MarkSystemMessageAsRead()
            result.ok = True
            result.system_message = message
            return result
        except SystemMessage.DoesNotExist:
            raise Exception("System message not found.")


class Mutation(graphene.ObjectType):
    create_item = CreateItem.Field()
    create_message = CreateMessage.Field()
    mark_system_message_as_read = MarkSystemMessageAsRead.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
