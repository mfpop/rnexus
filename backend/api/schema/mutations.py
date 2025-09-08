import graphene

from .activity_mutations import (
    ClearAllFavorites,
    CreateComment,
    DeleteComment,
    ToggleBlock,
    ToggleBookmark,
    ToggleFavorite,
    ToggleLike,
    UpdateCommentMutation,
)
from .chat_schema import ArchiveChat, CreateMessage, UnarchiveChat
from .user_mutations import (
    ChangePassword,
    RegisterUser,
    UpdateUserProfile,
    UploadAvatar,
)


class Mutation(graphene.ObjectType):
    # User mutations
    register_user = RegisterUser.Field()
    upload_avatar = UploadAvatar.Field()
    update_user_profile = UpdateUserProfile.Field()
    change_password = ChangePassword.Field()

    # Chat mutations
    create_message = CreateMessage.Field()
    archive_chat = ArchiveChat.Field()
    unarchive_chat = UnarchiveChat.Field()

    # Update interaction mutations
    toggle_like = ToggleLike.Field()
    toggle_bookmark = ToggleBookmark.Field()
    create_comment = CreateComment.Field()
    update_comment = UpdateCommentMutation.Field()
    delete_comment = DeleteComment.Field()

    # Favorite mutations
    toggle_favorite = ToggleFavorite.Field()
    clear_all_favorites = ClearAllFavorites.Field()

    # Block mutations
    toggle_block = ToggleBlock.Field()
