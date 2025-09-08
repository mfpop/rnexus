import graphene
from graphene_django.types import DjangoObjectType

from api.models import (
    Activity,
    ActivityCategoryNew,
    ActivityPriority,
    ActivityStatus,
    NewsUpdateNew,
    Update,
    UpdateBookmark,
    UpdateComment,
    UpdateLike,
)

from .user_types import UserType


class ActivityStatusType(DjangoObjectType):
    class Meta:
        model = ActivityStatus
        fields = (
            "id",
            "status",
            "display_name",
            "color_bg",
            "color_text",
            "color_border",
            "description",
        )

    displayName = graphene.String(source="display_name")
    colorBg = graphene.String(source="color_bg")
    colorText = graphene.String(source="color_text")
    colorBorder = graphene.String(source="color_border")


class ActivityPriorityType(DjangoObjectType):
    class Meta:
        model = ActivityPriority
        fields = (
            "id",
            "priority",
            "display_name",
            "color_bg",
            "color_text",
            "color_border",
            "description",
        )

    displayName = graphene.String(source="display_name")
    colorBg = graphene.String(source="color_bg")
    colorText = graphene.String(source="color_text")
    colorBorder = graphene.String(source="color_border")


class ActivityType(DjangoObjectType):
    class Meta:
        model = Activity
        fields = (
            "id",
            "title",
            "description",
            "type",
            "status",
            "priority",
            "status_config",
            "priority_config",
            "start_time",
            "end_time",
            "assigned_to",
            "assigned_by",
            "location",
            "progress",
            "estimated_duration",
            "actual_duration",
            "notes",
            "created_at",
            "updated_at",
            "created_by",
        )

    # Add camelCase field mappings
    statusConfig = graphene.Field(lambda: ActivityStatusType)
    priorityConfig = graphene.Field(lambda: ActivityPriorityType)
    startTime = graphene.DateTime(source="start_time")
    endTime = graphene.DateTime(source="end_time")
    assignedTo = graphene.String(source="assigned_to")
    assignedBy = graphene.String(source="assigned_by")
    estimatedDuration = graphene.Int(source="estimated_duration")
    actualDuration = graphene.Int(source="actual_duration")
    createdAt = graphene.DateTime(source="created_at")
    updatedAt = graphene.DateTime(source="updated_at")
    createdBy = graphene.Field(lambda: UserType)
    progressPercentage = graphene.Float(source="progress_percentage")
    estimatedHours = graphene.Float(source="estimated_hours")
    actualHours = graphene.Float(source="actual_hours")
    isActive = graphene.Boolean(source="is_active")

    # Field resolvers to convert case
    def resolve_status(self, info):
        return self.status.lower().replace("_", "-") if self.status else None

    def resolve_priority(self, info):
        return self.priority.lower() if self.priority else None


class UpdateType(DjangoObjectType):
    class Meta:
        model = Update
        fields = (
            "id",
            "type",
            "title",
            "summary",
            "body",
            "timestamp",
            "status",
            "tags",
            "author",
            "icon",
            "created_by",
            "is_active",
            "priority",
            "expires_at",
            "created_at",
            "updated_at",
        )

    # Add camelCase field mappings
    createdBy = graphene.Field(lambda: UserType)
    isActive = graphene.Boolean(source="is_active")
    expiresAt = graphene.DateTime(source="expires_at")
    createdAt = graphene.DateTime(source="created_at")
    updatedAt = graphene.DateTime(source="updated_at")

    # Add related fields
    comments = graphene.List(lambda: UpdateCommentType)
    bookmarks = graphene.List(lambda: UpdateBookmarkType)
    likes = graphene.List(lambda: UpdateLikeType)

    # Add computed count fields
    likesCount = graphene.Int()
    dislikesCount = graphene.Int()
    commentsCount = graphene.Int()
    bookmarksCount = graphene.Int()

    # Add user-specific fields
    userLikeStatus = graphene.String()
    isBookmarked = graphene.Boolean()

    def resolve_comments(self, info):
        return self.comments.order_by("-created_at")  # type: ignore

    def resolve_bookmarks(self, info):
        return self.bookmarks

    def resolve_likes(self, info):
        return self.likes

    def resolve_likesCount(self, info):
        return self.get_likes_count()

    def resolve_dislikesCount(self, info):
        return self.get_dislikes_count()

    def resolve_commentsCount(self, info):
        return self.get_comments_count()

    def resolve_bookmarksCount(self, info):
        return self.bookmarks.count()

    def resolve_userLikeStatus(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return None
        like_status = self.user_has_liked(user)
        if like_status is True:
            return "like"
        elif like_status is False:
            return "dislike"
        return None

    def resolve_isBookmarked(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return False
        return self.bookmarks.filter(user=user).exists()


class UpdateCommentType(DjangoObjectType):
    class Meta:
        model = UpdateComment
        fields = (
            "id",
            "update",
            "author",
            "content",
            "parent_comment",
            "is_active",
            "created_at",
            "updated_at",
        )

    # Add camelCase field mappings
    parentComment = graphene.Field(lambda: UpdateCommentType, source="parent_comment")
    isActive = graphene.Boolean(source="is_active")
    createdAt = graphene.DateTime(source="created_at")
    updatedAt = graphene.DateTime(source="updated_at")

    # Add computed fields
    replies = graphene.List(lambda: UpdateCommentType)

    def resolve_replies(self, info):
        return self.replies.filter(is_active=True).order_by("created_at")  # type: ignore


class UpdateBookmarkType(DjangoObjectType):
    class Meta:
        model = UpdateBookmark
        fields = ("id", "update", "user", "created_at")

    createdAt = graphene.DateTime(source="created_at")


class UpdateLikeType(DjangoObjectType):
    class Meta:
        model = UpdateLike
        fields = ("id", "update", "user", "is_like", "created_at")

    isLike = graphene.Boolean(source="is_like")
    createdAt = graphene.DateTime(source="created_at")


# Import UserType at the end to avoid circular imports
from .user_types import UserType
