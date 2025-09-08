import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  MessageCircle,
  BookmarkCheck,
} from "lucide-react";
import { TOGGLE_LIKE, TOGGLE_BOOKMARK } from "../../graphql/newsInteractions";
import { useAuth } from "../../contexts/AuthContext";

interface UpdateActionButtonsProps {
  updateId: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  userLikeStatus: string | null;
  isBookmarked: boolean;
  onLikeChange?: (
    likesCount: number,
    dislikesCount: number,
    userLikeStatus: string | null,
  ) => void;
  onBookmarkChange?: (isBookmarked: boolean, bookmarksCount: number) => void;
  onCommentsClick?: () => void;
  className?: string;
}

const UpdateActionButtons: React.FC<UpdateActionButtonsProps> = ({
  updateId,
  likesCount,
  dislikesCount,
  commentsCount,
  bookmarksCount,
  userLikeStatus,
  isBookmarked,
  onLikeChange,
  onBookmarkChange,
  onCommentsClick,
  className = "",
}) => {
  const { user } = useAuth();
  const [isLiking, setIsLiking] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const [toggleLike] = useMutation(TOGGLE_LIKE);
  const [toggleBookmark] = useMutation(TOGGLE_BOOKMARK);

  const handleLike = async (isLike: boolean) => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      const { data } = await toggleLike({
        variables: {
          updateId,
          isLike,
        },
      });

      if (data?.toggle_like?.success) {
        onLikeChange?.(
          data.toggle_like.likes_count,
          data.toggle_like.dislikes_count,
          data.toggle_like.like_status,
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleBookmark = async () => {
    if (!user || isBookmarking) return;

    setIsBookmarking(true);
    try {
      const { data } = await toggleBookmark({
        variables: {
          updateId,
        },
      });

      if (data?.toggle_bookmark?.success) {
        onBookmarkChange?.(
          data.toggle_bookmark.is_bookmarked,
          data.toggle_bookmark.bookmarks_count,
        );
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this update",
          text: "Look at this interesting update",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!user) {
    return null; // Don't show action buttons for non-authenticated users
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Like/Dislike Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleLike(true)}
          disabled={isLiking}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
            userLikeStatus === "like"
              ? "bg-blue-100 text-blue-600 border border-blue-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
          } ${isLiking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <ThumbsUp size={16} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => handleLike(false)}
          disabled={isLiking}
          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
            userLikeStatus === "dislike"
              ? "bg-red-100 text-red-600 border border-red-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
          } ${isLiking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <ThumbsDown size={16} />
          <span>{dislikesCount}</span>
        </button>
      </div>

      {/* Bookmark Button */}
      <button
        onClick={handleBookmark}
        disabled={isBookmarking}
        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
          isBookmarked
            ? "bg-yellow-100 text-yellow-600 border border-yellow-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
        } ${isBookmarking ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        <span>{bookmarksCount}</span>
      </button>

      {/* Comments Button */}
      <button
        onClick={onCommentsClick}
        className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 cursor-pointer transition-colors"
      >
        <MessageCircle size={16} />
        <span>{commentsCount}</span>
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 cursor-pointer transition-colors"
      >
        <Share2 size={16} />
        <span>Share</span>
      </button>
    </div>
  );
};

export default UpdateActionButtons;
