import json
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, TypeAlias, Union, cast

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import F, Q
from django.http import HttpRequest, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

import jwt

from api.decorators import jwt_login_required

from .models import (
    Activity,
    ActivityPriority,
    ActivityStatus,
    Chat,
    Message,
    SystemMessage,
    Tag,
    Update,
    UpdateAttachment,
    UpdateComment,
    UpdateLike,
    UpdateMedia,
)

# Type alias for Django User to help with type checking
DjangoUser: TypeAlias = User

# Type ignore comment for Django model attributes that type checker can't see
# This is needed because Django models use dynamic attributes that aren't visible to static type checkers


def create_jwt_token(user: Union[User, AbstractBaseUser]) -> str:
    """Create a JWT token for the user"""
    payload = {
        "user_id": user.id,  # type: ignore
        "username": user.username,  # type: ignore
        "exp": timezone.now() + timedelta(days=1),  # Token expires in 1 day
        "iat": timezone.now(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def get_user_from_jwt(request: HttpRequest) -> Optional[User]:
    """Get user from JWT token in Authorization header"""
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            if user_id:
                return User.objects.get(id=user_id)
        except (jwt.InvalidTokenError, User.DoesNotExist):
            pass
    return None


@csrf_exempt
def django_login_view(request: HttpRequest) -> JsonResponse:
    """Handle Django default auth redirects for API requests"""
    # If this is an API request, return JSON instead of redirecting
    if request.path.startswith("/api/"):
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    # For regular web requests, redirect to the frontend login page
    return JsonResponse(
        {
            "success": False,
            "error": "Please login at the frontend application",
            "redirect": "/login",
        },
        status=401,
    )


@csrf_exempt
def login_view(request: HttpRequest) -> JsonResponse:
    """Handle user login"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            if not username or not password:
                return JsonResponse(
                    {"success": False, "error": "Username and password are required"},
                    status=400,
                )

            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                # Create JWT token
                token = create_jwt_token(user)
                return JsonResponse(
                    {
                        "success": True,
                        "user": {
                            "id": user.id,  # type: ignore
                            "username": user.username,  # type: ignore
                            "email": user.email,  # type: ignore
                            "first_name": user.first_name,  # type: ignore
                            "last_name": user.last_name,  # type: ignore
                        },
                        "token": token,
                    }
                )
            else:
                return JsonResponse(
                    {"success": False, "error": "Invalid credentials"}, status=401
                )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
def logout_view(request: HttpRequest) -> JsonResponse:
    """Handle user logout"""
    if request.method == "POST":
        logout(request)
        return JsonResponse({"success": True, "message": "Logged out successfully"})

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
def register_view(request: HttpRequest) -> JsonResponse:
    """Handle user registration"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")
            first_name = data.get("first_name", "")
            last_name = data.get("last_name", "")

            if not username or not email or not password:
                return JsonResponse(
                    {
                        "success": False,
                        "error": "Username, email, and password are required",
                    },
                    status=400,
                )

            if User.objects.filter(username=username).exists():
                return JsonResponse(
                    {"success": False, "error": "Username already exists"}, status=400
                )

            if User.objects.filter(email=email).exists():
                return JsonResponse(
                    {"success": False, "error": "Email already exists"}, status=400
                )

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )

            return JsonResponse(
                {
                    "success": True,
                    "user": {
                        "id": user.id,  # type: ignore
                        "username": user.username,  # type: ignore
                        "email": user.email,  # type: ignore
                        "first_name": user.first_name,  # type: ignore
                        "last_name": user.last_name,  # type: ignore
                    },
                }
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@jwt_login_required
def user_info_view(request: HttpRequest) -> JsonResponse:
    """Get current user information"""
    if request.method == "GET":
        user = request.user
        username = getattr(user, "username", None)
        print(f"DEBUG: user_info_view - User: {username if username else 'None'}")
        print(f"DEBUG: user_info_view - User type: {type(user)}")
        print(
            f"DEBUG: user_info_view - Auth header: {request.META.get('HTTP_AUTHORIZATION', 'None')}"
        )

        return JsonResponse(
            {
                "success": True,
                "user": {
                    "id": user.id,  # type: ignore
                    "username": user.username,  # type: ignore
                    "email": user.email,  # type: ignore
                    "first_name": user.first_name,  # type: ignore
                    "last_name": user.last_name,  # type: ignore
                    "is_staff": user.is_staff,  # type: ignore
                    "is_superuser": user.is_superuser,  # type: ignore
                },
            }
        )

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def profile_view(request: HttpRequest) -> JsonResponse:
    """Handle user profile operations"""
    if request.method == "GET":
        user = cast(User, request.user)
        return JsonResponse(
            {
                "success": True,
                "profile": {
                    "id": user.id,  # type: ignore
                    "username": user.username,  # type: ignore
                    "email": user.email,  # type: ignore
                    "first_name": user.first_name,  # type: ignore
                    "last_name": user.last_name,  # type: ignore
                    "date_joined": user.date_joined.isoformat(),  # type: ignore
                    "last_login": user.last_login.isoformat() if user.last_login else None,  # type: ignore
                },
            }
        )

    elif request.method == "PUT":
        try:
            data = json.loads(request.body)
            user = cast(User, request.user)

            if "first_name" in data:
                user.first_name = data["first_name"]  # type: ignore
            if "last_name" in data:
                user.last_name = data["last_name"]  # type: ignore
            if "email" in data:
                user.email = data["email"]  # type: ignore

            user.save()

            return JsonResponse(
                {
                    "success": True,
                    "profile": {
                        "id": user.id,  # type: ignore
                        "username": user.username,  # type: ignore
                        "email": user.email,  # type: ignore
                        "first_name": user.first_name,  # type: ignore
                        "last_name": user.last_name,  # type: ignore
                    },
                }
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def change_password_view(request: HttpRequest) -> JsonResponse:
    """Handle password change"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            current_password = data.get("current_password")
            new_password = data.get("new_password")

            if not current_password or not new_password:
                return JsonResponse(
                    {
                        "success": False,
                        "error": "Current and new password are required",
                    },
                    status=400,
                )

            user = request.user
            if not user.check_password(current_password):
                return JsonResponse(
                    {"success": False, "error": "Current password is incorrect"},
                    status=400,
                )

            user.set_password(new_password)
            user.save()

            return JsonResponse(
                {"success": True, "message": "Password changed successfully"}
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


# Chat API Views
@csrf_exempt
@login_required
def chat_list_view(request: HttpRequest) -> JsonResponse:
    """Handle GET requests to list chats and POST requests to create new chats"""
    if request.method == "GET":
        try:
            user = request.user
            # Get user's chats (both direct and group)
            chats = Chat.objects.filter(
                Q(user1=user) | Q(user2=user) | Q(members__contains=[str(user.id)])  # type: ignore
            ).filter(is_active=True)

            chats_data = []
            for chat in chats:
                # Get unread count
                unread_count = Message.objects.filter(
                    chat=chat,
                    sender__id__in=[u.id for u in chat.get_participants() if u.id != user.id],  # type: ignore
                    status__in=["sent", "delivered"],
                ).count()

                # Get last message info
                last_message = chat.last_message
                last_message_data = None
                if last_message:
                    last_message_data = {
                        "id": last_message.id,
                        "content": last_message.content,
                        "sender_name": last_message.sender.get_full_name()
                        or last_message.sender.username,
                        "type": last_message.message_type,
                        "timestamp": last_message.timestamp.isoformat(),
                        "status": last_message.status,
                    }

                chat_data = {
                    "id": chat.id,
                    "name": chat.name,
                    "type": chat.chat_type,
                    "last_message": last_message_data,
                    "last_activity": chat.last_activity.isoformat(),
                    "unread_count": unread_count,
                    "participants": [u.username for u in chat.get_participants()],
                    "is_group": chat.chat_type == "group",
                }
                chats_data.append(chat_data)

            return JsonResponse({"success": True, "chats": chats_data})

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            chat_type = data.get("type", "user")
            participant_ids = data.get("participant_ids", [])
            name = data.get("name", "")

            if chat_type == "user" and len(participant_ids) != 1:
                return JsonResponse(
                    {
                        "success": False,
                        "error": "Direct chat must have exactly one participant",
                    },
                    status=400,
                )

            if chat_type == "group" and len(participant_ids) < 2:
                return JsonResponse(
                    {
                        "success": False,
                        "error": "Group chat must have at least 2 participants",
                    },
                    status=400,
                )

            # Create chat
            if chat_type == "user":
                other_user = User.objects.get(id=participant_ids[0])
                chat = Chat.objects.create(
                    id=f"chat_{min(request.user.id, other_user.id)}_{max(request.user.id, other_user.id)}",  # type: ignore
                    chat_type="user",
                    name=f"{other_user.get_full_name() or other_user.username}",
                    user1=request.user,
                    user2=other_user,
                    created_by=request.user,
                )
            else:
                participants = User.objects.filter(id__in=participant_ids)
                chat = Chat.objects.create(
                    id=f"group_{int(timezone.now().timestamp())}",
                    chat_type="group",
                    name=name or f"Group with {len(participants)} members",
                    members=[str(u.id) for u in participants],  # type: ignore
                    created_by=request.user,
                )

            return JsonResponse(
                {
                    "success": True,
                    "chat": {"id": chat.id, "name": chat.name, "type": chat.chat_type},
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def chat_messages_view(request: HttpRequest, chat_id: str) -> JsonResponse:
    """Handle GET requests to get messages and POST requests to send messages"""
    try:
        chat = Chat.objects.get(id=chat_id, is_active=True)
        user = cast(DjangoUser, request.user)

        # Check if user is participant
        if chat.chat_type == "user":
            if user not in [chat.user1, chat.user2]:
                return JsonResponse(
                    {"success": False, "error": "Access denied"}, status=403
                )
        else:
            if str(user.id) not in chat.members:  # type: ignore
                return JsonResponse(
                    {"success": False, "error": "Access denied"}, status=403
                )

        if request.method == "GET":
            try:
                page = int(request.GET.get("page", 1))
                page_size = int(request.GET.get("page_size", 50))

                # Get messages with pagination
                start = (page - 1) * page_size
                end = start + page_size
                messages = Message.objects.filter(chat=chat).order_by("-timestamp")[
                    start:end
                ]

                # Mark messages as delivered
                unread_messages = messages.filter(
                    sender__id__in=[u.id for u in chat.get_participants() if u.id != user.id],  # type: ignore
                    status__in=["sent", "delivered"],
                )
                for msg in unread_messages:
                    msg.mark_as_delivered()

                messages_data = []
                for msg in reversed(messages):  # Reverse to show oldest first
                    message_data = {
                        "id": msg.id,  # type: ignore
                        "sender_id": msg.sender.id,  # type: ignore
                        "sender_name": msg.sender.get_full_name() or msg.sender.username,  # type: ignore
                        "content": msg.content,  # type: ignore
                        "type": msg.message_type,  # type: ignore
                        "timestamp": msg.timestamp.isoformat(),  # type: ignore
                        "status": msg.status,  # type: ignore
                        "reply_to": None,
                        "forwarded": msg.forwarded,  # type: ignore
                        "forwarded_from": msg.forwarded_from,  # type: ignore
                        "edited": msg.edited,  # type: ignore
                        "edited_at": msg.edited_at.isoformat() if msg.edited_at else None,  # type: ignore
                    }

                    # Add reply info if exists
                    if msg.reply_to:
                        message_data["reply_to"] = {
                            "id": msg.reply_to.id,
                            "sender_id": msg.reply_to.sender.id,
                            "sender_name": msg.reply_to.sender.get_full_name()
                            or msg.reply_to.sender.username,
                            "content": msg.reply_to.content,
                            "type": msg.reply_to.message_type,
                            "timestamp": msg.reply_to.timestamp.isoformat(),
                            "status": msg.reply_to.status,
                            "reply_to": None,
                            "forwarded": False,
                            "forwarded_from": "",
                            "edited": False,
                            "edited_at": None,
                        }

                    messages_data.append(message_data)

                return JsonResponse(
                    {
                        "success": True,
                        "messages": messages_data,
                        "chat_info": {
                            "id": chat.id,
                            "name": chat.name,
                            "type": chat.chat_type,
                            "participants": [
                                u.username for u in chat.get_participants()
                            ],
                        },
                    }
                )

            except Exception as e:
                return JsonResponse({"success": False, "error": str(e)}, status=500)

        elif request.method == "POST":
            try:
                data = json.loads(request.body)
                content = data.get("content", "")
                message_type = data.get("type", "text")
                reply_to_id = data.get("reply_to_id")
                forwarded = data.get("forwarded", False)
                forwarded_from = data.get("forwarded_from", "")

                if not content:
                    return JsonResponse(
                        {"success": False, "error": "Message content is required"},
                        status=400,
                    )

                # Create message
                message = Message.objects.create(
                    chat=chat,
                    sender=request.user,
                    content=content,
                    message_type=message_type,
                    forwarded=forwarded,
                    forwarded_from=forwarded_from,
                )

                # Add reply if specified
                if reply_to_id:
                    try:
                        reply_to = Message.objects.get(id=reply_to_id, chat=chat)
                        # Use setattr to avoid type checker issues with Django model fields
                        setattr(message, "reply_to", reply_to)
                        message.save()
                    except Message.DoesNotExist:
                        pass

                # Update chat's last message
                chat.update_last_message(message)

                return JsonResponse(
                    {
                        "success": True,
                        "message": {
                            "id": getattr(message, "id", None),
                            "sender_id": (
                                getattr(getattr(message, "sender", None), "id", None)
                                if getattr(message, "sender", None)
                                else None
                            ),
                            "sender_name": (
                                (
                                    getattr(
                                        getattr(message, "sender", None),
                                        "get_full_name",
                                        lambda: None,
                                    )()
                                    or getattr(
                                        getattr(message, "sender", None),
                                        "username",
                                        None,
                                    )
                                )
                                if getattr(message, "sender", None)
                                else None
                            ),
                            "content": getattr(message, "content", None),
                            "type": getattr(message, "message_type", None),
                            "timestamp": message.timestamp.isoformat(),
                            "status": message.status,
                        },
                    }
                )

            except Exception as e:
                return JsonResponse({"success": False, "error": str(e)}, status=500)

    except Chat.DoesNotExist:
        return JsonResponse({"success": False, "error": "Chat not found"}, status=404)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def message_status_view(request: HttpRequest, message_id: str) -> JsonResponse:
    """Handle PUT requests to update message status"""
    if request.method == "PUT":
        try:
            message = Message.objects.get(id=message_id)
            # Check if user is the sender
            if getattr(message, "sender", None) != request.user:
                return JsonResponse(
                    {"success": False, "error": "Access denied"}, status=403
                )

            data = json.loads(request.body)
            new_status = data.get("status")

            if new_status in dict(Message.MESSAGE_STATUS_CHOICES):
                message.update_status(new_status)
                return JsonResponse(
                    {
                        "success": True,
                        "message": {
                            "id": getattr(message, "id", None),
                            "status": getattr(message, "status", None),
                        },
                    }
                )
            else:
                return JsonResponse(
                    {"success": False, "error": "Invalid status"}, status=400
                )

        except Message.DoesNotExist:
            return JsonResponse(
                {"success": False, "error": "Message not found"}, status=404
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def message_delete_view(request: HttpRequest, message_id: str) -> JsonResponse:
    """Handle DELETE requests to delete messages"""
    if request.method == "DELETE":
        try:
            message = Message.objects.get(id=message_id)

            # Check if user is the sender
            if getattr(message, "sender", None) != request.user:
                return JsonResponse(
                    {"success": False, "error": "Access denied"}, status=403
                )

            message.delete()

            return JsonResponse(
                {"success": True, "message": "Message deleted successfully"}
            )

        except Message.DoesNotExist:
            return JsonResponse(
                {"success": False, "error": "Message not found"}, status=404
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def chat_search_view(request: HttpRequest) -> JsonResponse:
    """Handle GET requests to search messages in a chat"""
    if request.method == "GET":
        try:
            chat_id = request.GET.get("chat_id")
            query = request.GET.get("q", "")

            if not chat_id or not query:
                return JsonResponse(
                    {
                        "success": False,
                        "error": "Chat ID and search query are required",
                    },
                    status=400,
                )

            try:
                chat = Chat.objects.get(id=chat_id, is_active=True)

                # Check if user is participant
                if chat.chat_type == "user":
                    if request.user not in [chat.user1, chat.user2]:
                        return JsonResponse(
                            {"success": False, "error": "Access denied"}, status=403
                        )
                else:
                    if not chat.members.filter(
                        id=getattr(request.user, "id", None)
                    ).exists():
                        return JsonResponse(
                            {"success": False, "error": "Access denied"}, status=403
                        )

                # Search messages
                messages = Message.objects.filter(
                    chat=chat, content__icontains=query
                ).order_by("-timestamp")[:50]

                results = []
                for msg in messages:
                    result = {
                        "id": getattr(msg, "id", None),
                        "sender_id": getattr(msg, "sender_id", None),
                        "sender_name": (
                            (
                                getattr(
                                    getattr(msg, "sender", None),
                                    "get_full_name",
                                    lambda: None,
                                )()
                                or getattr(
                                    getattr(msg, "sender", None), "username", None
                                )
                            )
                            if getattr(msg, "sender", None)
                            else None
                        ),
                        "content": getattr(msg, "content", None),
                        "type": getattr(msg, "message_type", None),
                        "timestamp": msg.timestamp.isoformat(),
                        "status": msg.status,
                        "reply_to": None,
                        "forwarded": msg.forwarded,
                        "forwarded_from": msg.forwarded_from,
                        "edited": msg.edited,
                        "edited_at": (
                            msg.edited_at.isoformat() if msg.edited_at else None
                        ),
                    }

                    # Add reply info if exists
                    if msg.reply_to:
                        result["reply_to"] = {
                            "id": msg.reply_to.id,
                            "sender_id": msg.reply_to.sender.id,
                            "sender_name": msg.reply_to.sender.get_full_name()
                            or msg.reply_to.sender.username,
                            "content": msg.reply_to.content,
                            "type": msg.reply_to.message_type,
                            "timestamp": msg.reply_to.timestamp.isoformat(),
                            "status": msg.reply_to.status,
                            "reply_to": None,
                            "forwarded": False,
                            "forwarded_from": "",
                            "edited": False,
                            "edited_at": None,
                        }

                    results.append(result)

                return JsonResponse(
                    {"success": True, "results": results, "count": len(results)}
                )

            except Chat.DoesNotExist:
                return JsonResponse(
                    {"success": False, "error": "Chat not found"}, status=404
                )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


# Update API Views
@csrf_exempt
def update_list_view(request: HttpRequest) -> JsonResponse:
    """Handle GET requests to list updates and POST requests to create new updates"""

    # Check JWT authentication first
    user = get_user_from_jwt(request)
    if not user:
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    if request.method == "GET":
        try:
            # Get query parameters
            update_type = request.GET.get("type", "all")
            status = request.GET.get("status", "all")
            search_query = request.GET.get("q", "")
            page = int(request.GET.get("page", 1))
            page_size = int(request.GET.get("page_size", 20))

            # Start with base queryset
            updates = Update.objects.filter(is_active=True)

            # Apply filters
            if update_type != "all":
                updates = updates.filter(type=update_type)

            if status != "all":
                updates = updates.filter(status=status)

            if search_query:
                updates = updates.filter(
                    Q(title__icontains=search_query)
                    | Q(summary__icontains=search_query)
                    | Q(body__icontains=search_query)
                    | Q(tags__contains=[search_query])
                )

            # Apply pagination
            start = (page - 1) * page_size
            end = start + page_size
            total_count = updates.count()
            updates_page = updates[start:end]

            # Prepare response data
            updates_data = []
            for update in updates_page:
                update_data = {
                    "id": update.id,
                    "type": update.type,
                    "title": update.title,
                    "summary": update.summary,
                    "timestamp": update.timestamp.isoformat(),
                    "status": update.status,
                    "tags": update.tags,
                    "author": update.author,
                    "icon": update.icon,
                    "priority": update.priority,
                    "likes_count": update.get_likes_count(),
                    "dislikes_count": update.get_dislikes_count(),
                    "comments_count": update.get_comments_count(),
                    "user_like_status": update.user_has_liked(user),
                    "can_edit": update.can_edit(user),
                    "can_delete": update.can_delete(user),
                    "content": {
                        "body": update.body,
                        "attachments": [
                            {
                                "type": getattr(att, "type", None),
                                "url": getattr(att, "url", None),
                                "label": getattr(att, "label", None),
                            }
                            for att in update.get_attachments()
                            if hasattr(update, "get_attachments")
                        ],
                        "media": [
                            {
                                "type": getattr(med, "type", None),
                                "url": getattr(med, "url", None),
                                "label": getattr(med, "label", None),
                                "thumbnailUrl": getattr(med, "thumbnail_url", None),
                            }
                            for med in update.get_media()
                            if hasattr(update, "get_media")
                        ],
                        "related": update.get_related_updates(),
                    },
                }
                updates_data.append(update_data)

            return JsonResponse(
                {
                    "success": True,
                    "updates": updates_data,
                    "pagination": {
                        "page": page,
                        "page_size": page_size,
                        "total_count": total_count,
                        "total_pages": (total_count + page_size - 1) // page_size,
                    },
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)

            # Validate required fields
            required_fields = ["id", "type", "title", "summary", "body", "author"]
            for field in required_fields:
                if field not in data:
                    return JsonResponse(
                        {"success": False, "error": f"Missing required field: {field}"},
                        status=400,
                    )

            # Create the update
            update = Update.objects.create(
                id=data["id"],
                type=data["type"],
                title=data["title"],
                summary=data["summary"],
                body=data["body"],
                author=data["author"],
                icon=data.get("icon", "📰"),
                tags=data.get("tags", []),
                status=data.get("status", "new"),
                priority=data.get("priority", 0),
                created_by=request.user,
            )

            # Handle attachments if provided
            if "attachments" in data:
                for att_data in data["attachments"]:
                    UpdateAttachment.objects.create(
                        update=update,
                        type=att_data["type"],
                        url=att_data["url"],
                        label=att_data["label"],
                    )

            # Handle media if provided
            if "media" in data:
                for med_data in data["media"]:
                    UpdateMedia.objects.create(
                        update=update,
                        type=med_data["type"],
                        url=med_data["url"],
                        label=med_data["label"],
                        thumbnail_url=med_data.get("thumbnailUrl", ""),
                    )

            return JsonResponse(
                {
                    "success": True,
                    "update": {
                        "id": update.id,
                        "type": update.type,
                        "title": update.title,
                        "summary": update.summary,
                        "timestamp": update.timestamp.isoformat(),
                        "status": update.status,
                        "tags": update.tags,
                        "author": update.author,
                        "icon": update.icon,
                    },
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    # Default response for unsupported methods
    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def update_detail_view(request: HttpRequest, update_id: str) -> JsonResponse:
    """Handle GET, PUT, and DELETE requests for a specific update"""
    try:
        update = Update.objects.get(id=update_id, is_active=True)
    except Update.DoesNotExist:
        return JsonResponse({"success": False, "error": "Update not found"}, status=404)

    if request.method == "GET":
        # Mark as read if user is viewing it
        if update.status == "new":
            update.mark_as_read()

        # Get related data
        attachments = list(getattr(update, "attachments", []))
        media = list(getattr(update, "media", []))

        update_data = {
            "id": update.id,
            "type": update.type,
            "title": update.title,
            "summary": update.summary,
            "timestamp": update.timestamp.isoformat(),
            "status": update.status,
            "tags": update.tags,
            "author": update.author,
            "icon": update.icon,
            "priority": update.priority,
            "content": {
                "body": update.body,
                "attachments": [
                    {"type": att.type, "url": att.url, "label": att.label}
                    for att in attachments
                ],
                "media": [
                    {
                        "type": med.type,
                        "url": med.url,
                        "label": med.label,
                        "thumbnailUrl": med.thumbnail_url,
                    }
                    for med in media
                ],
                "related": update.get_related_updates(),
            },
        }

        return JsonResponse({"success": True, "update": update_data})

    elif request.method == "PUT":
        try:
            data = json.loads(request.body)

            # Update fields
            if "title" in data:
                update.title = data["title"]
            if "summary" in data:
                update.summary = data["summary"]
            if "body" in data:
                update.body = data["body"]
            if "status" in data:
                update.status = data["status"]
            if "tags" in data:
                update.tags = data["tags"]
            if "priority" in data:
                update.priority = data["priority"]

            update.save()

            return JsonResponse(
                {
                    "success": True,
                    "update": {
                        "id": update.id,
                        "type": update.type,
                        "title": update.title,
                        "summary": update.summary,
                        "timestamp": update.timestamp.isoformat(),
                        "status": update.status,
                        "tags": update.tags,
                        "author": update.author,
                        "icon": update.icon,
                    },
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    elif request.method == "DELETE":
        try:
            # Soft delete - mark as inactive
            update.is_active = False
            update.save()

            return JsonResponse(
                {"success": True, "message": "Update deleted successfully"}
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    # Default response for unsupported methods
    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def update_status_view(request: HttpRequest, update_id: str) -> JsonResponse:
    """Handle PUT requests to update the status of an update"""
    if request.method == "PUT":
        try:
            update = Update.objects.get(id=update_id, is_active=True)
            data = json.loads(request.body)

            if "status" in data:
                new_status = data["status"]
                if new_status in dict(Update.UPDATE_STATUS_CHOICES):
                    update.status = new_status
                    update.save(update_fields=["status"])

                    return JsonResponse(
                        {
                            "success": True,
                            "update": {"id": update.id, "status": update.status},
                        }
                    )
                else:
                    return JsonResponse(
                        {"success": False, "error": "Invalid status value"}, status=400
                    )
            else:
                return JsonResponse(
                    {"success": False, "error": "Status field is required"}, status=400
                )

        except Update.DoesNotExist:
            return JsonResponse(
                {"success": False, "error": "Update not found"}, status=404
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    # Default response for unsupported methods
    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def update_search_view(request: HttpRequest) -> JsonResponse:
    """Handle GET requests to search updates"""
    if request.method == "GET":
        try:
            query = request.GET.get("q", "")
            update_type = request.GET.get("type", "all")
            tags = request.GET.get("tags", "")

            if not query:
                return JsonResponse(
                    {"success": False, "error": "Search query is required"}, status=400
                )

            # Start with base queryset
            updates = Update.objects.filter(is_active=True)

            # Apply type filter
            if update_type != "all":
                updates = updates.filter(type=update_type)

            # Apply tag filter
            if tags:
                tag_list = [tag.strip() for tag in tags.split(",")]
                updates = updates.filter(tags__overlap=tag_list)

            # Apply search query
            updates = updates.filter(
                Q(title__icontains=query)
                | Q(summary__icontains=query)
                | Q(body__icontains=query)
                | Q(tags__contains=[query])
            )

            # Limit results
            updates = updates[:50]

            # Prepare response data
            results = []
            for update in updates:
                result = {
                    "id": update.id,
                    "type": update.type,
                    "title": update.title,
                    "summary": update.summary,
                    "timestamp": update.timestamp.isoformat(),
                    "status": update.status,
                    "author": update.author,
                    "icon": update.icon,
                    "tags": update.tags,
                }
                results.append(result)

            return JsonResponse(
                {"success": True, "results": results, "total_count": len(results)}
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    # Default response for unsupported methods
    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
def websocket_test_view(request: HttpRequest) -> JsonResponse:
    """Simple WebSocket test endpoint"""
    return JsonResponse({"success": True, "message": "WebSocket endpoint is working"})


# New API endpoints for Update CRUD operations
@csrf_exempt
def update_create_view(request: HttpRequest) -> JsonResponse:
    """Create a new update"""
    user = get_user_from_jwt(request)
    if not user:
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Create the update
            update = Update.objects.create(
                id=data.get("id", f"update_{int(timezone.now().timestamp())}"),
                type=data.get("type", Update.UPDATE_TYPE_NEWS),
                title=data.get("title"),
                summary=data.get("summary", ""),
                body=data.get("body", ""),
                author=data.get("author", user.username),
                tags=data.get("tags", []),
                icon=data.get("icon", "📰"),
                created_by=user,
                priority=data.get("priority", 0),
                expires_at=data.get("expires_at"),
            )

            return JsonResponse(
                {
                    "success": True,
                    "update": {
                        "id": update.id,
                        "title": update.title,
                        "type": update.type,
                        "status": update.status,
                        "created_at": update.created_at.isoformat(),
                    },
                }
            )
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
def update_edit_view(request: HttpRequest, update_id: str) -> JsonResponse:
    """Edit an existing update"""
    user = get_user_from_jwt(request)
    if not user:
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    try:
        update = Update.objects.get(id=update_id)

        # Check permissions
        if not update.can_edit(user):
            return JsonResponse(
                {"success": False, "error": "Permission denied"}, status=403
            )

        if request.method == "PUT":
            data = json.loads(request.body)

            # Update fields
            if "title" in data:
                update.title = data["title"]
            if "summary" in data:
                update.summary = data["summary"]
            if "body" in data:
                update.body = data["body"]
            if "type" in data:
                update.type = data["type"]
            if "tags" in data:
                update.tags = data["tags"]
            if "icon" in data:
                update.icon = data["icon"]
            if "priority" in data:
                update.priority = data["priority"]
            if "expires_at" in data:
                update.expires_at = data["expires_at"]

            update.save()

            return JsonResponse(
                {
                    "success": True,
                    "update": {
                        "id": update.id,
                        "title": update.title,
                        "type": update.type,
                        "status": update.status,
                        "updated_at": update.updated_at.isoformat(),
                    },
                }
            )
        elif request.method == "GET":
            return JsonResponse(
                {
                    "success": True,
                    "update": {
                        "id": update.id,
                        "title": update.title,
                        "type": update.type,
                        "summary": update.summary,
                        "body": update.body,
                        "tags": update.tags,
                        "icon": update.icon,
                        "priority": update.priority,
                        "expires_at": (
                            update.expires_at.isoformat() if update.expires_at else None
                        ),
                        "can_edit": update.can_edit(user),
                        "can_delete": update.can_delete(user),
                    },
                }
            )
        else:
            return JsonResponse(
                {"success": False, "error": "Method not allowed"}, status=405
            )

    except Update.DoesNotExist:
        return JsonResponse({"success": False, "error": "Update not found"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


@csrf_exempt
def update_delete_view(request: HttpRequest, update_id: str) -> JsonResponse:
    """Delete an update"""
    user = get_user_from_jwt(request)
    if not user:
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    try:
        update = Update.objects.get(id=update_id)

        # Check permissions
        if not update.can_delete(user):
            return JsonResponse(
                {"success": False, "error": "Permission denied"}, status=403
            )

        if request.method == "DELETE":
            update.delete()
            return JsonResponse(
                {"success": True, "message": "Update deleted successfully"}
            )
        else:
            return JsonResponse(
                {"success": False, "error": "Method not allowed"}, status=405
            )

    except Update.DoesNotExist:
        return JsonResponse({"success": False, "error": "Update not found"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


# Like/Dislike functionality
@csrf_exempt
def update_like_view(request: HttpRequest, update_id: str) -> JsonResponse:
    """Like or dislike an update"""
    user = get_user_from_jwt(request)
    if not user:
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    try:
        update = Update.objects.get(id=update_id)

        if request.method == "POST":
            data = json.loads(request.body)
            is_like = data.get("is_like", True)

            # Check if user already has a like/dislike
            existing_like, created = UpdateLike.objects.get_or_create(
                update=update, user=user, defaults={"is_like": is_like}
            )

            if not created:
                # Update existing like/dislike
                if existing_like.is_like == is_like:
                    # Remove like/dislike if clicking the same button
                    existing_like.delete()
                    action = "removed"
                else:
                    # Change from like to dislike or vice versa
                    existing_like.is_like = is_like
                    existing_like.save()
                    action = "updated"
            else:
                action = "created"

            return JsonResponse(
                {
                    "success": True,
                    "action": action,
                    "likes_count": update.get_likes_count(),
                    "dislikes_count": update.get_dislikes_count(),
                    "user_like_status": update.user_has_liked(user),
                }
            )
        else:
            return JsonResponse(
                {"success": False, "error": "Method not allowed"}, status=405
            )

    except Update.DoesNotExist:
        return JsonResponse({"success": False, "error": "Update not found"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


# Comment functionality
@csrf_exempt
def comment_create_view(request: HttpRequest, update_id: str) -> JsonResponse:
    """Create a comment on an update"""
    user = get_user_from_jwt(request)
    if not user:
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    try:
        update = Update.objects.get(id=update_id)

        if request.method == "POST":
            data = json.loads(request.body)
            content = data.get("content", "").strip()
            parent_comment_id = data.get("parent_comment_id")

            if not content:
                return JsonResponse(
                    {"success": False, "error": "Comment content is required"},
                    status=400,
                )

            parent_comment = None
            if parent_comment_id:
                try:
                    parent_comment = UpdateComment.objects.get(
                        id=parent_comment_id, update=update, is_active=True
                    )
                except UpdateComment.DoesNotExist:
                    return JsonResponse(
                        {"success": False, "error": "Parent comment not found"},
                        status=404,
                    )

            comment = UpdateComment.objects.create(
                update=update,
                author=user,
                content=content,
                parent_comment=parent_comment,
            )

            return JsonResponse(
                {
                    "success": True,
                    "comment": {
                        "id": comment.id,
                        "content": comment.content,
                        "author": comment.author.username,
                        "created_at": comment.created_at.isoformat(),
                        "parent_comment_id": parent_comment_id,
                    },
                }
            )
        else:
            return JsonResponse(
                {"success": False, "error": "Method not allowed"}, status=405
            )

    except Update.DoesNotExist:
        return JsonResponse({"success": False, "error": "Update not found"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


@csrf_exempt
def comment_edit_view(request: HttpRequest, comment_id: str) -> JsonResponse:
    """Edit a comment"""
    user = get_user_from_jwt(request)
    if not user:
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    try:
        comment = UpdateComment.objects.get(id=comment_id, is_active=True)

        # Check permissions
        if not comment.can_edit(user):
            return JsonResponse(
                {"success": False, "error": "Permission denied"}, status=403
            )

        if request.method == "PUT":
            data = json.loads(request.body)
            content = data.get("content", "").strip()

            if not content:
                return JsonResponse(
                    {"success": False, "error": "Comment content is required"},
                    status=400,
                )

            comment.content = content
            comment.save()

            return JsonResponse(
                {
                    "success": True,
                    "comment": {
                        "id": comment.id,
                        "content": comment.content,
                        "updated_at": comment.updated_at.isoformat(),
                    },
                }
            )
        else:
            return JsonResponse(
                {"success": False, "error": "Method not allowed"}, status=405
            )

    except UpdateComment.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Comment not found"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


@csrf_exempt
def comment_delete_view(request: HttpRequest, comment_id: str) -> JsonResponse:
    """Delete a comment"""
    user = get_user_from_jwt(request)
    if not user:
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    try:
        comment = UpdateComment.objects.get(id=comment_id, is_active=True)

        # Check permissions
        if not comment.can_delete(user):
            return JsonResponse(
                {"success": False, "error": "Permission denied"}, status=403
            )

        if request.method == "DELETE":
            comment.is_active = False
            comment.save()

            return JsonResponse(
                {"success": True, "message": "Comment deleted successfully"}
            )
        else:
            return JsonResponse(
                {"success": False, "error": "Method not allowed"}, status=405
            )

    except UpdateComment.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Comment not found"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


@csrf_exempt
def comment_list_view(request: HttpRequest, update_id: str) -> JsonResponse:
    """Get comments for an update"""
    try:
        update = Update.objects.get(id=update_id)

        if request.method == "GET":
            # Get comments using the Django relationship
            # Django models use dynamic attributes that aren't visible to static type checkers
            try:
                comments = (
                    update.comments.filter(  # type: ignore
                        is_active=True,
                        parent_comment__isnull=True,  # Only top-level comments
                    )
                    .select_related("author")
                    .prefetch_related("replies__author")
                )
            except AttributeError:
                # Fallback if comments relationship doesn't exist
                comments = []

            comments_data = []
            for comment in comments:
                comment_data = {
                    "id": comment.id,
                    "content": comment.content,
                    "author": comment.author.username,
                    "created_at": comment.created_at.isoformat(),
                    "can_edit": (
                        comment.can_edit(request.user)
                        if hasattr(request, "user") and request.user.is_authenticated
                        else False
                    ),
                    "can_delete": (
                        comment.can_delete(request.user)
                        if hasattr(request, "user") and request.user.is_authenticated
                        else False
                    ),
                    "replies": [],
                }

                # Add replies
                for reply in comment.replies.filter(is_active=True):
                    reply_data = {
                        "id": reply.id,
                        "content": reply.content,
                        "author": reply.author.username,
                        "created_at": reply.created_at.isoformat(),
                        "can_edit": (
                            reply.can_edit(request.user)
                            if hasattr(request, "user")
                            and request.user.is_authenticated
                            else False
                        ),
                        "can_delete": (
                            reply.can_delete(request.user)
                            if hasattr(request, "user")
                            and request.user.is_authenticated
                            else False
                        ),
                    }
                    comment_data["replies"].append(reply_data)

                comments_data.append(comment_data)

            return JsonResponse({"success": True, "comments": comments_data})
        else:
            return JsonResponse(
                {"success": False, "error": "Method not allowed"}, status=405
            )

    except Update.DoesNotExist:
        return JsonResponse({"success": False, "error": "Update not found"}, status=404)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=400)


@csrf_exempt
# @login_required  # Temporarily disabled for development
def tags_list_view(request: HttpRequest) -> JsonResponse:
    """Handle GET requests to list all available tags"""
    if request.method == "GET":
        try:
            # Get query parameters
            category = request.GET.get("category", "")
            search_query = request.GET.get("q", "")
            active_only = request.GET.get("active_only", "true").lower() == "true"

            # Start with base queryset
            tags = Tag.objects.all()

            # Apply filters
            if active_only:
                tags = tags.filter(is_active=True)

            if category:
                tags = tags.filter(category=category)

            if search_query:
                tags = tags.filter(
                    Q(name__icontains=search_query)
                    | Q(description__icontains=search_query)
                    | Q(category__icontains=search_query)
                )

            # Prepare response data
            tags_data = []
            for tag in tags:
                tag_data = {
                    "id": getattr(tag, "id", None),
                    "name": tag.name,
                    "description": tag.description,
                    "color": tag.color,
                    "category": tag.category,
                    "is_active": tag.is_active,
                    "usage_count": tag.usage_count,
                    "created_at": tag.created_at.isoformat(),
                    "updated_at": tag.updated_at.isoformat(),
                }
                tags_data.append(tag_data)

            return JsonResponse(
                {"success": True, "tags": tags_data, "total_count": len(tags_data)}
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def tag_detail_view(request: HttpRequest, tag_id: str) -> JsonResponse:
    """Handle GET, PUT, and DELETE requests for a specific tag"""
    try:
        tag = Tag.objects.get(id=tag_id)
    except Tag.DoesNotExist:
        return JsonResponse({"success": False, "error": "Tag not found"}, status=404)

    if request.method == "GET":
        tag_data = {
            "id": getattr(tag, "id", None),
            "name": tag.name,
            "description": tag.description,
            "color": tag.color,
            "category": tag.category,
            "is_active": tag.is_active,
            "usage_count": tag.usage_count,
            "created_at": tag.created_at.isoformat(),
            "updated_at": tag.updated_at.isoformat(),
        }

        return JsonResponse({"success": True, "tag": tag_data})

    elif request.method == "PUT":
        try:
            data = json.loads(request.body)

            # Update fields
            if "name" in data:
                tag.name = data["name"]
            if "description" in data:
                tag.description = data["description"]
            if "color" in data:
                tag.color = data["color"]
            if "category" in data:
                tag.category = data["category"]
            if "is_active" in data:
                tag.is_active = data["is_active"]

            tag.save()

            return JsonResponse(
                {
                    "success": True,
                    "tag": {
                        "id": getattr(tag, "id", None),
                        "name": tag.name,
                        "description": tag.description,
                        "color": tag.color,
                        "category": tag.category,
                        "is_active": tag.is_active,
                        "usage_count": tag.usage_count,
                        "updated_at": tag.updated_at.isoformat(),
                    },
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    elif request.method == "DELETE":
        try:
            # Check if tag is in use
            if tag.usage_count > 0:
                return JsonResponse(
                    {
                        "success": False,
                        "error": "Cannot delete tag that is currently in use",
                    },
                    status=400,
                )

            tag.delete()

            return JsonResponse(
                {"success": True, "message": "Tag deleted successfully"}
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@login_required
def tag_create_view(request: HttpRequest) -> JsonResponse:
    """Create a new tag"""
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            # Validate required fields
            if "name" not in data:
                return JsonResponse(
                    {"success": False, "error": "Tag name is required"}, status=400
                )

            # Check if tag name already exists
            if Tag.objects.filter(name=data["name"]).exists():
                return JsonResponse(
                    {"success": False, "error": "Tag with this name already exists"},
                    status=400,
                )

            # Create the tag
            tag = Tag.objects.create(
                name=data["name"],
                description=data.get("description", ""),
                color=data.get("color", "#3B82F6"),
                category=data.get("category", ""),
                is_active=data.get("is_active", True),
            )

            return JsonResponse(
                {
                    "success": True,
                    "tag": {
                        "id": getattr(tag, "id", None),
                        "name": getattr(tag, "name", ""),
                        "description": getattr(tag, "description", ""),
                        "color": getattr(tag, "color", ""),
                        "category": getattr(tag, "category", ""),
                        "is_active": tag.is_active,
                        "usage_count": tag.usage_count,
                        "created_at": tag.created_at.isoformat(),
                    },
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


# Activity Views
@csrf_exempt
def activity_list_view(request: HttpRequest) -> JsonResponse:
    """Get list of activities with optional filtering"""

    # Check JWT authentication first
    user = get_user_from_jwt(request)
    if not user:
        return JsonResponse(
            {
                "success": False,
                "error": "Authentication required",
                "code": "AUTH_REQUIRED",
            },
            status=401,
        )

    if request.method == "GET":
        try:
            # Get query parameters for filtering
            status_filter = request.GET.get("status")
            priority_filter = request.GET.get("priority")
            type_filter = request.GET.get("type")
            assigned_to_filter = request.GET.get("assigned_to")

            # Build queryset
            activities = Activity.objects.all()

            # Apply filters
            if status_filter:
                activities = activities.filter(status=status_filter)
            if priority_filter:
                activities = activities.filter(priority=priority_filter)
            if type_filter:
                activities = activities.filter(type=type_filter)
            if assigned_to_filter:
                activities = activities.filter(
                    assigned_to__icontains=assigned_to_filter
                )

            # Serialize activities
            activities_data = []
            for activity in activities:
                activities_data.append(
                    {
                        "id": str(activity.id),
                        "title": activity.title,
                        "description": activity.description,
                        "type": activity.type,
                        "status": activity.status,
                        "priority": activity.priority,
                        "startTime": activity.start_time.isoformat(),
                        "endTime": activity.end_time.isoformat(),
                        "assignedTo": activity.assigned_to,
                        "assignedBy": activity.assigned_by,
                        "location": activity.location,
                        "progress": activity.progress,
                        "estimatedDuration": activity.estimated_duration,
                        "actualDuration": activity.actual_duration,
                        "notes": activity.notes,
                        "createdAt": activity.created_at.isoformat(),
                        "updatedAt": activity.updated_at.isoformat(),
                    }
                )

            return JsonResponse(
                {
                    "success": True,
                    "activities": activities_data,
                    "count": len(activities_data),
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)

            # Validate required fields
            required_fields = [
                "title",
                "description",
                "type",
                "start_time",
                "end_time",
                "assigned_to",
                "estimated_duration",
            ]
            for field in required_fields:
                if field not in data:
                    return JsonResponse(
                        {"success": False, "error": f"Field '{field}' is required"},
                        status=400,
                    )

            # Create activity
            activity = Activity.objects.create(
                title=data["title"],
                description=data["description"],
                type=data["type"],
                status=data.get("status", "planned"),
                priority=data.get("priority", "medium"),
                start_time=datetime.fromisoformat(
                    data["start_time"].replace("Z", "+00:00")
                ),
                end_time=datetime.fromisoformat(
                    data["end_time"].replace("Z", "+00:00")
                ),
                assigned_to=data["assigned_to"],
                assigned_by=data.get("assigned_by", user.username),
                location=data.get("location", ""),
                progress=data.get("progress", 0),
                estimated_duration=data["estimated_duration"],
                notes=data.get("notes", ""),
                created_by=user,
            )

            # Serialize the created activity
            activity_data = {
                "id": str(activity.id),
                "title": activity.title,
                "description": activity.description,
                "type": activity.type,
                "status": activity.status,
                "priority": activity.priority,
                "startTime": activity.start_time.isoformat(),
                "endTime": activity.end_time.isoformat(),
                "assignedTo": activity.assigned_to,
                "assignedBy": activity.assigned_by,
                "location": activity.location,
                "progress": activity.progress,
                "estimatedDuration": activity.estimated_duration,
                "actualDuration": activity.actual_duration,
                "notes": activity.notes,
                "createdAt": activity.created_at.isoformat(),
                "updatedAt": activity.updated_at.isoformat(),
            }

            return JsonResponse(
                {"success": True, "activity": activity_data}, status=201
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@jwt_login_required
def activity_detail_view(request: HttpRequest, activity_id: str) -> JsonResponse:
    """Get, update, or delete a specific activity"""
    try:
        activity = get_object_or_404(Activity, id=activity_id)
    except Exception:
        return JsonResponse(
            {"success": False, "error": "Activity not found"}, status=404
        )

    if request.method == "GET":
        try:
            activity_data = {
                "id": str(activity.id),
                "title": activity.title,
                "description": activity.description,
                "type": activity.type,
                "status": activity.status,
                "priority": activity.priority,
                "startTime": activity.start_time.isoformat(),
                "endTime": activity.end_time.isoformat(),
                "assignedTo": activity.assigned_to,
                "assignedBy": activity.assigned_by,
                "location": activity.location,
                "progress": activity.progress,
                "estimatedDuration": activity.estimated_duration,
                "actualDuration": activity.actual_duration,
                "notes": activity.notes,
                "createdAt": activity.created_at.isoformat(),
                "updatedAt": activity.updated_at.isoformat(),
            }

            return JsonResponse({"success": True, "activity": activity_data})

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    elif request.method == "PUT":
        try:
            user = get_user_from_jwt(request)
            if not user:
                return JsonResponse(
                    {"success": False, "error": "Authentication required"}, status=401
                )

            data = json.loads(request.body)

            # Update fields
            if "title" in data:
                activity.title = data["title"]
            if "description" in data:
                activity.description = data["description"]
            if "type" in data:
                activity.type = data["type"]
            if "status" in data:
                activity.status = data["status"]
            if "priority" in data:
                activity.priority = data["priority"]
            if "start_time" in data:
                activity.start_time = datetime.fromisoformat(
                    data["start_time"].replace("Z", "+00:00")
                )
            if "end_time" in data:
                activity.end_time = datetime.fromisoformat(
                    data["end_time"].replace("Z", "+00:00")
                )
            if "assigned_to" in data:
                activity.assigned_to = data["assigned_to"]
            if "location" in data:
                activity.location = data["location"]
            if "progress" in data:
                activity.progress = data["progress"]
            if "estimated_duration" in data:
                activity.estimated_duration = data["estimated_duration"]
            if "actual_duration" in data:
                activity.actual_duration = data["actual_duration"]
            if "notes" in data:
                activity.notes = data["notes"]

            activity.save()

            # Serialize the updated activity
            activity_data = {
                "id": str(activity.id),
                "title": activity.title,
                "description": activity.description,
                "type": activity.type,
                "status": activity.status,
                "priority": activity.priority,
                "startTime": activity.start_time.isoformat(),
                "endTime": activity.end_time.isoformat(),
                "assignedTo": activity.assigned_to,
                "assignedBy": activity.assigned_by,
                "location": activity.location,
                "progress": activity.progress,
                "estimatedDuration": activity.estimated_duration,
                "actualDuration": activity.actual_duration,
                "notes": activity.notes,
                "createdAt": activity.created_at.isoformat(),
                "updatedAt": activity.updated_at.isoformat(),
            }

            return JsonResponse({"success": True, "activity": activity_data})

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    elif request.method == "DELETE":
        try:
            user = get_user_from_jwt(request)
            if not user:
                return JsonResponse(
                    {"success": False, "error": "Authentication required"}, status=401
                )

            activity.delete()

            return JsonResponse(
                {"success": True, "message": "Activity deleted successfully"}
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@jwt_login_required
def activity_start_view(request: HttpRequest, activity_id: str) -> JsonResponse:
    """Start an activity (change status to in-progress)"""
    if request.method == "POST":
        try:
            user = get_user_from_jwt(request)
            if not user:
                return JsonResponse(
                    {"success": False, "error": "Authentication required"}, status=401
                )

            activity = get_object_or_404(Activity, id=activity_id)

            # Check if activity can be started
            if activity.status == "completed":
                return JsonResponse(
                    {"success": False, "error": "Cannot start a completed activity"},
                    status=400,
                )

            if activity.status == "in-progress":
                return JsonResponse(
                    {"success": False, "error": "Activity is already in progress"},
                    status=400,
                )

            # Start the activity
            activity.status = "in-progress"
            activity.progress = max(activity.progress, 10)  # Set minimum progress
            activity.save()

            # Serialize the updated activity
            activity_data = {
                "id": str(activity.id),
                "title": activity.title,
                "description": activity.description,
                "type": activity.type,
                "status": activity.status,
                "priority": activity.priority,
                "startTime": activity.start_time.isoformat(),
                "endTime": activity.end_time.isoformat(),
                "assignedTo": activity.assigned_to,
                "assignedBy": activity.assigned_by,
                "location": activity.location,
                "progress": activity.progress,
                "estimatedDuration": activity.estimated_duration,
                "actualDuration": activity.actual_duration,
                "notes": activity.notes,
                "createdAt": activity.created_at.isoformat(),
                "updatedAt": activity.updated_at.isoformat(),
            }

            return JsonResponse(
                {
                    "success": True,
                    "activity": activity_data,
                    "message": "Activity started successfully",
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@jwt_login_required
def activity_pause_view(request: HttpRequest, activity_id: str) -> JsonResponse:
    """Pause an activity (change status back to planned)"""
    if request.method == "POST":
        try:
            user = get_user_from_jwt(request)
            if not user:
                return JsonResponse(
                    {"success": False, "error": "Authentication required"}, status=401
                )

            activity = get_object_or_404(Activity, id=activity_id)

            # Check if activity can be paused
            if activity.status != "in-progress":
                return JsonResponse(
                    {
                        "success": False,
                        "error": "Can only pause activities that are in progress",
                    },
                    status=400,
                )

            # Pause the activity
            activity.status = "planned"
            activity.save()

            # Serialize the updated activity
            activity_data = {
                "id": str(activity.id),
                "title": activity.title,
                "description": activity.description,
                "type": activity.type,
                "status": activity.status,
                "priority": activity.priority,
                "startTime": activity.start_time.isoformat(),
                "endTime": activity.end_time.isoformat(),
                "assignedTo": activity.assigned_to,
                "assignedBy": activity.assigned_by,
                "location": activity.location,
                "progress": activity.progress,
                "estimatedDuration": activity.estimated_duration,
                "actualDuration": activity.actual_duration,
                "notes": activity.notes,
                "createdAt": activity.created_at.isoformat(),
                "updatedAt": activity.updated_at.isoformat(),
            }

            return JsonResponse(
                {
                    "success": True,
                    "activity": activity_data,
                    "message": "Activity paused successfully",
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


@csrf_exempt
@jwt_login_required
def activity_complete_view(request: HttpRequest, activity_id: str) -> JsonResponse:
    """Complete an activity (change status to completed)"""
    if request.method == "POST":
        try:
            user = get_user_from_jwt(request)
            if not user:
                return JsonResponse(
                    {"success": False, "error": "Authentication required"}, status=401
                )

            activity = get_object_or_404(Activity, id=activity_id)

            # Check if activity can be completed
            if activity.status == "completed":
                return JsonResponse(
                    {"success": False, "error": "Activity is already completed"},
                    status=400,
                )

            # Complete the activity
            activity.status = "completed"
            activity.progress = 100

            # Calculate actual duration if not set
            if not activity.actual_duration:
                start_time = activity.start_time
                end_time = timezone.now()
                duration_minutes = int((end_time - start_time).total_seconds() / 60)
                activity.actual_duration = duration_minutes

            activity.save()

            # Serialize the updated activity
            activity_data = {
                "id": str(activity.id),
                "title": activity.title,
                "description": activity.description,
                "type": activity.type,
                "status": activity.status,
                "priority": activity.priority,
                "startTime": activity.start_time.isoformat(),
                "endTime": activity.end_time.isoformat(),
                "assignedTo": activity.assigned_to,
                "assignedBy": activity.assigned_by,
                "location": activity.location,
                "progress": activity.progress,
                "estimatedDuration": activity.estimated_duration,
                "actualDuration": activity.actual_duration,
                "notes": activity.notes,
                "createdAt": activity.created_at.isoformat(),
                "updatedAt": activity.updated_at.isoformat(),
            }

            return JsonResponse(
                {
                    "success": True,
                    "activity": activity_data,
                    "message": "Activity completed successfully",
                }
            )

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=500)

    return JsonResponse({"success": False, "error": "Method not allowed"}, status=405)


# Activity ViewSet for DRF router
class ActivityViewSet:
    """ViewSet for Activity model - provides CRUD operations"""

    def list(self, request):
        """Get list of activities"""
        return activity_list_view(request)

    def create(self, request):
        """Create a new activity"""
        return activity_list_view(request)

    def retrieve(self, request, pk=None):
        """Get a specific activity"""
        if pk is None:
            return JsonResponse(
                {"success": False, "error": "Activity ID is required"}, status=400
            )
        return activity_detail_view(request, str(pk))

    def update(self, request, pk=None):
        """Update an activity"""
        if pk is None:
            return JsonResponse(
                {"success": False, "error": "Activity ID is required"}, status=400
            )
        return activity_detail_view(request, str(pk))

    def destroy(self, request, pk=None):
        """Delete an activity"""
        if pk is None:
            return JsonResponse(
                {"success": False, "error": "Activity ID is required"}, status=400
            )
        return activity_detail_view(request, str(pk))


class TaskViewSet:
    """ViewSet for Task model - placeholder for future implementation"""

    pass


class MilestoneViewSet:
    """ViewSet for Milestone model - placeholder for future implementation"""

    pass


class ChecklistViewSet:
    """ViewSet for Checklist model - placeholder for future implementation"""

    pass


class ChecklistItemViewSet:
    """ViewSet for ChecklistItem model - placeholder for future implementation"""

    pass


class TimeLogViewSet:
    """ViewSet for TimeLog model - placeholder for future implementation"""

    pass


class AttachmentViewSet:
    """ViewSet for Attachment model - placeholder for future implementation"""

    pass


class CommentViewSet:
    """ViewSet for Comment model - placeholder for future implementation"""

    pass


class ProjectViewSet:
    """ViewSet for Project model - placeholder for future implementation"""

    pass


class ProjectTeamMemberViewSet:
    """ViewSet for ProjectTeamMember model - placeholder for future implementation"""

    pass


class ActivityParticipantViewSet:
    """ViewSet for ActivityParticipant model - placeholder for future implementation"""

    pass


@csrf_exempt
def test_view(request: HttpRequest) -> JsonResponse:
    """Simple test view to debug URL configuration"""
    return JsonResponse({"success": True, "message": "Test endpoint working!"})
