import graphene

from api.models import (
    UpdateBookmark,
    UpdateComment,
    UpdateLike,
    UserBlock,
    UserFavorite,
)

from .activity_schema import UpdateCommentType, UpdateType
from .user_types import UserType


class ToggleLike(graphene.Mutation):
    """Toggle like/dislike on an update"""

    class Arguments:
        update_id = graphene.String(required=True)

    ok = graphene.Boolean()
    liked = graphene.Boolean()
    like_count = graphene.Int()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, update_id):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.liked = False
            result.like_count = 0
            result.errors = ["Authentication required"]
            return result

        try:
            # Get or create like
            like, created = UpdateLike.objects.get_or_create(  # type: ignore
                update_id=update_id, user=user, defaults={"is_active": True}
            )

            if not created:
                # Toggle the like
                like.is_active = not like.is_active
                like.save()

            # Get updated like count
            like_count = UpdateLike.objects.filter(  # type: ignore
                update_id=update_id, is_active=True
            ).count()

            result = cls()
            result.ok = True
            result.liked = like.is_active if not created else True
            result.like_count = like_count
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.liked = False
            result.like_count = 0
            result.errors = [str(e)]
            return result


class ToggleBookmark(graphene.Mutation):
    """Toggle bookmark on an update"""

    class Arguments:
        update_id = graphene.String(required=True)

    ok = graphene.Boolean()
    bookmarked = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, update_id):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.bookmarked = False
            result.errors = ["Authentication required"]
            return result

        try:
            # Get or create bookmark
            bookmark, created = UpdateBookmark.objects.get_or_create(  # type: ignore
                update_id=update_id, user=user, defaults={"is_active": True}
            )

            if not created:
                # Toggle the bookmark
                bookmark.is_active = not bookmark.is_active
                bookmark.save()

            result = cls()
            result.ok = True
            result.bookmarked = bookmark.is_active if not created else True
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.bookmarked = False
            result.errors = [str(e)]
            return result


class CreateComment(graphene.Mutation):
    """Create a comment on an update"""

    class Arguments:
        update_id = graphene.String(required=True)
        content = graphene.String(required=True)
        parent_comment_id = graphene.Int()

    ok = graphene.Boolean()
    comment = graphene.Field(UpdateCommentType)
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, update_id, content, parent_comment_id=None):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.comment = None
            result.errors = ["Authentication required"]
            return result

        try:
            # Create comment
            comment = UpdateComment.objects.create(  # type: ignore
                update_id=update_id,
                author=user,
                content=content,
                parent_comment_id=parent_comment_id,
                is_active=True,
            )

            result = cls()
            result.ok = True
            result.comment = comment
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.comment = None
            result.errors = [str(e)]
            return result


class UpdateCommentMutation(graphene.Mutation):
    """Update a comment"""

    class Arguments:
        comment_id = graphene.Int(required=True)
        content = graphene.String(required=True)

    ok = graphene.Boolean()
    comment = graphene.Field(UpdateCommentType)
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, comment_id, content):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.comment = None
            result.errors = ["Authentication required"]
            return result

        try:
            # Get comment
            comment = UpdateComment.objects.get(id=comment_id)  # type: ignore

            # Check if user owns the comment
            if comment.author != user:
                result = cls()
                result.ok = False
                result.comment = None
                result.errors = ["You can only edit your own comments"]
                return result

            # Update comment
            comment.content = content
            comment.save()

            result = cls()
            result.ok = True
            result.comment = comment
            result.errors = []
            return result

        except UpdateComment.DoesNotExist:  # type: ignore
            result = cls()
            result.ok = False
            result.comment = None
            result.errors = ["Comment not found"]
            return result
        except Exception as e:
            result = cls()
            result.ok = False
            result.comment = None
            result.errors = [str(e)]
            return result


class DeleteComment(graphene.Mutation):
    """Delete a comment"""

    class Arguments:
        comment_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, comment_id):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.errors = ["Authentication required"]
            return result

        try:
            # Get comment
            comment = UpdateComment.objects.get(id=comment_id)  # type: ignore

            # Check if user owns the comment
            if comment.author != user:
                result = cls()
                result.ok = False
                result.errors = ["You can only delete your own comments"]
                return result

            # Soft delete comment
            comment.is_active = False
            comment.save()

            result = cls()
            result.ok = True
            result.errors = []
            return result

        except UpdateComment.DoesNotExist:  # type: ignore
            result = cls()
            result.ok = False
            result.errors = ["Comment not found"]
            return result
        except Exception as e:
            result = cls()
            result.ok = False
            result.errors = [str(e)]
            return result


class ToggleFavorite(graphene.Mutation):
    """Toggle favorite status for a user"""

    class Arguments:
        favorite_user_id = graphene.Int(required=True)

    ok = graphene.Boolean()
    favorited = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, favorite_user_id):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.favorited = False
            result.errors = ["Authentication required"]
            return result

        try:
            # Get or create favorite
            favorite, created = UserFavorite.objects.get_or_create(  # type: ignore
                user=user,
                favorite_user_id=favorite_user_id,
                defaults={"is_active": True},
            )

            if not created:
                # Toggle the favorite
                favorite.is_active = not favorite.is_active
                favorite.save()

            result = cls()
            result.ok = True
            result.favorited = favorite.is_active if not created else True
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.favorited = False
            result.errors = [str(e)]
            return result


class ClearAllFavorites(graphene.Mutation):
    """Clear all favorites for the current user"""

    ok = graphene.Boolean()
    cleared_count = graphene.Int()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.cleared_count = 0
            result.errors = ["Authentication required"]
            return result

        try:
            # Deactivate all favorites
            favorites = UserFavorite.objects.filter(user=user, is_active=True)  # type: ignore
            cleared_count = favorites.update(is_active=False)

            result = cls()
            result.ok = True
            result.cleared_count = cleared_count
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.cleared_count = 0
            result.errors = [str(e)]
            return result


class ToggleBlock(graphene.Mutation):
    """Toggle block status for a user"""

    class Arguments:
        blocked_user_id = graphene.Int(required=True)
        reason = graphene.String()

    ok = graphene.Boolean()
    blocked = graphene.Boolean()
    errors = graphene.List(graphene.String)

    @classmethod
    def mutate(cls, root, info, blocked_user_id, reason=None):
        user = info.context.user
        if not user.is_authenticated:
            result = cls()
            result.ok = False
            result.blocked = False
            result.errors = ["Authentication required"]
            return result

        try:
            # Get or create block
            block, created = UserBlock.objects.get_or_create(  # type: ignore
                user=user,
                blocked_user_id=blocked_user_id,
                defaults={"is_active": True, "reason": reason},
            )

            if not created:
                # Toggle the block
                block.is_active = not block.is_active
                if reason:
                    block.reason = reason
                block.save()

            result = cls()
            result.ok = True
            result.blocked = block.is_active if not created else True
            result.errors = []
            return result

        except Exception as e:
            result = cls()
            result.ok = False
            result.blocked = False
            result.errors = [str(e)]
            return result
