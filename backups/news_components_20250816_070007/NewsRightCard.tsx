import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  ArrowLeft,
  Clock,
  Tag,
  ChevronDown,
  ChevronUp,
  Send,
  MoreVertical,
  ExternalLink,
  Download,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { useNewsContext, NewsArticle } from "./NewsContext";

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  replies?: Comment[];
  avatar: string;
}

/**
 * NewsRightCard - News page specific right card content component
 * Detail component - contains the article reader and comments for the selected article
 * Related to the article selection in the left card (master-detail relationship)
 * Full-featured article reader with comments and interactions
 */
const NewsRightCard: React.FC = () => {
  const { selectedArticle } = useNewsContext();
  const [isBookmarked, setIsBookmarked] = useState(
    selectedArticle?.isBookmarked || false,
  );
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [fontSize, setFontSize] = useState("text-base");

  // Update bookmark state when selectedArticle changes
  useEffect(() => {
    setIsBookmarked(selectedArticle?.isBookmarked || false);
    setIsLiked(false); // Reset like state for new article
  }, [selectedArticle]);

  // Sample comments for the article
  const comments: Comment[] = [
    {
      id: 1,
      author: "Mike Davis",
      content:
        "This is excellent news! The efficiency improvements are really paying off.",
      timestamp: new Date(Date.now() - 1800000),
      likes: 5,
      avatar: "MD",
    },
    {
      id: 2,
      author: "Lisa Chen",
      content:
        "Great work by the production team. Looking forward to seeing how this impacts our quarterly goals.",
      timestamp: new Date(Date.now() - 3600000),
      likes: 3,
      avatar: "LC",
      replies: [
        {
          id: 3,
          author: "Sarah Johnson",
          content:
            "Thanks Lisa! The team has been working really hard on this.",
          timestamp: new Date(Date.now() - 2700000),
          likes: 2,
          avatar: "SJ",
        },
      ],
    },
    {
      id: 4,
      author: "David Park",
      content:
        "Would love to see the detailed metrics behind these improvements.",
      timestamp: new Date(Date.now() - 7200000),
      likes: 1,
      avatar: "DP",
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Note: In a real application, you would also update the article's bookmark state
    // in the context or backend here
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Here you would typically submit the comment to your backend

    setNewComment("");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "company":
        return "bg-blue-100 text-blue-800";
      case "industry":
        return "bg-green-100 text-green-800";
      case "technology":
        return "bg-purple-100 text-purple-800";
      case "safety":
        return "bg-red-100 text-red-800";
      case "production":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-8 mt-3" : "mb-6"}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {comment.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{comment.author}</span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.timestamp)}
            </span>
          </div>
          <p className="text-gray-700 mb-2">{comment.content}</p>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
              <ThumbsUp className="h-4 w-4" />
              <span>{comment.likes}</span>
            </button>
            <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
              Reply
            </button>
          </div>
        </div>
      </div>
      {comment.replies &&
        comment.replies.map((reply) => renderComment(reply, true))}
    </div>
  );

  if (!selectedArticle) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Select an Article
          </h2>
          <p className="text-gray-600">
            Choose an article from the left to start reading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Article Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Category and Date */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(selectedArticle.category)}`}
              >
                {selectedArticle.category.charAt(0).toUpperCase() +
                  selectedArticle.category.slice(1)}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedArticle.publishDate)}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {selectedArticle.title}
            </h1>

            {/* Author and Meta */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>By {selectedArticle.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{selectedArticle.readTime} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{selectedArticle.views} views</span>
              </div>
            </div>
          </div>

          {/* Reading Controls */}
          <div className="flex items-center gap-2 ml-4">
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1"
            >
              <option value="text-sm">Small</option>
              <option value="text-base">Medium</option>
              <option value="text-lg">Large</option>
            </select>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {selectedArticle.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? "bg-red-50 text-red-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{selectedArticle.likes + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isBookmarked
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
            />
            <span>Bookmark</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Comments ({selectedArticle.comments})</span>
            {showComments ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Summary */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-blue-800 font-medium">Summary</p>
            <p className="text-blue-700 mt-1">{selectedArticle.summary}</p>
          </div>

          {/* Content */}
          <div className={`prose max-w-none ${fontSize}`}>
            <p className="text-gray-700 leading-relaxed">
              {selectedArticle.content}
            </p>

            {/* Extended content for demo */}
            <p className="text-gray-700 leading-relaxed mt-4">
              This achievement represents months of dedicated work by our
              cross-functional teams. The implementation of lean manufacturing
              principles, combined with advanced monitoring systems, has enabled
              us to identify and eliminate inefficiencies across our production
              lines.
            </p>

            <p className="text-gray-700 leading-relaxed mt-4">
              Key factors contributing to this success include:
            </p>

            <ul className="list-disc list-inside mt-2 text-gray-700 space-y-1">
              <li>
                Predictive maintenance scheduling reducing unexpected downtime
              </li>
              <li>Enhanced quality control processes</li>
              <li>Improved workflow optimization</li>
              <li>Team training and skill development programs</li>
              <li>Real-time monitoring and analytics</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mt-4">
              Moving forward, we plan to expand these improvements to additional
              production lines and continue our journey toward operational
              excellence. The lessons learned from this initiative will serve as
              a foundation for future efficiency improvements across all our
              facilities.
            </p>
          </div>

          {/* Article Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ExternalLink className="h-4 w-4" />
                <span>Open in new tab</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(selectedArticle.publishDate)}
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    MH
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Add a comment..."
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        <span>Post Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div>{comments.map((comment) => renderComment(comment))}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsRightCard;
