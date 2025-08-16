import React, { useState, useEffect } from "react";
import {
  Calendar,
  Share2,
  Bookmark,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  Reply,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
} from "lucide-react";
import { useNewsContext } from "./NewsContext";
import { useAuth } from "../../contexts/AuthContext";
import { UpdateComment } from "./MessageTypes";
import { Tag, TagApiService } from "../../lib/updateApi";

/**
 * NewsRightCard - News page specific right card content component
 * Detail component - contains the update reader and comments for the selected update
 * Related to the update selection in the left card (master-detail relationship)
 * Full-featured update reader with comments and interactions
 */
const NewsRightCard: React.FC = () => {
  const {
    selectedUpdate,
    toggleLike,
    createComment,
    editComment,
    deleteComment,
    createUpdate,
    editUpdate,
    deleteUpdate
  } = useNewsContext();
  const { user } = useAuth();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<any>(null);
  const [comments, setComments] = useState<UpdateComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Tag-related state
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  // Form states for create/edit
  const [formData, setFormData] = useState({
    title: '',
    type: 'news' as 'news' | 'communication' | 'alert',
    summary: '',
    body: '',
    tags: [] as number[], // Now stores tag IDs instead of strings
    icon: '📰',
    priority: 0
  });

  // Load available tags on component mount (only if authenticated)
  useEffect(() => {
    const loadTags = async () => {
      try {
        await loadAvailableTags();
      } catch (error) {
        // Initial tag loading failed, will retry when user is available
      }
    };

    loadTags();
  }, []);

  // Retry loading tags when user becomes available
  useEffect(() => {
    if (user && availableTags.length === 0) {
      loadAvailableTags();
    }
  }, [user, availableTags.length]);

  // Filter tags based on search query
  useEffect(() => {
    if (tagSearchQuery.trim()) {
      const filtered = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase()) ||
        tag.description.toLowerCase().includes(tagSearchQuery.toLowerCase()) ||
        tag.category.toLowerCase().includes(tagSearchQuery.toLowerCase())
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(availableTags);
    }
  }, [tagSearchQuery, availableTags]);

  // Handle clicking outside tag selector to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showTagSelector && !target.closest('.tag-selector')) {
        setShowTagSelector(false);
        setTagSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTagSelector]);

  // Update bookmark state when selectedUpdate changes
  useEffect(() => {
    setIsBookmarked(false);
    setShowComments(false);
    setNewComment("");
    setEditingComment(null);
    setEditCommentContent("");
    setReplyingTo(null);
    setReplyContent("");
    setShowCreateForm(false);
    setShowEditForm(false);
    setEditingUpdate(null);
    setComments([]);
  }, [selectedUpdate]);

  // Reset form when editing update changes
  useEffect(() => {
    if (editingUpdate) {
      setFormData({
        title: editingUpdate.title || '',
        type: editingUpdate.type || 'news',
        summary: editingUpdate.summary || '',
        body: editingUpdate.content?.body || '',
        tags: editingUpdate.tags || [], // This should now be an array of tag IDs
        icon: editingUpdate.icon || '📰',
        priority: editingUpdate.priority || 0
      });
    }
  }, [editingUpdate]);

  // Load comments when selectedUpdate changes
  useEffect(() => {
    if (selectedUpdate && showComments) {
      loadComments();
    }
  }, [selectedUpdate, showComments]);

  // Listen for button events from StableLayout
  useEffect(() => {
    const handleCreateEvent = () => {
      setShowCreateForm(true);
    };

    const handleEditEvent = () => {
      if (selectedUpdate && selectedUpdate.can_edit) {
        setEditingUpdate(selectedUpdate);
        setShowEditForm(true);
      } else {
        alert('No update selected or you do not have permission to edit');
      }
    };

    const handleSaveEvent = () => {
      // Handle save based on current form state
      if (showCreateForm) {
        // Submit the create form
        const form = document.querySelector('form');
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      } else if (showEditForm && editingUpdate) {
        // Submit the edit form
        const form = document.querySelector('form');
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      }
    };

    const handleCancelEvent = () => {
      resetForm();
    };

    const handleDeleteEvent = () => {
      if (selectedUpdate && selectedUpdate.can_delete) {
        if (confirm('Are you sure you want to delete this update?')) {
          deleteUpdate(selectedUpdate.id);
        }
      } else {
        alert('No update selected or you do not have permission to delete');
      }
    };

    // Add event listeners
    window.addEventListener('news:create', handleCreateEvent);
    window.addEventListener('news:edit', handleEditEvent);
    window.addEventListener('news:save', handleSaveEvent);
    window.addEventListener('news:cancel', handleCancelEvent);
    window.addEventListener('news:delete', handleDeleteEvent);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('news:create', handleCreateEvent);
      window.removeEventListener('news:edit', handleEditEvent);
      window.removeEventListener('news:save', handleSaveEvent);
      window.removeEventListener('news:cancel', handleCancelEvent);
      window.removeEventListener('news:delete', handleDeleteEvent);
    };
  }, [selectedUpdate, deleteUpdate]);

  const loadComments = async () => {
    if (!selectedUpdate) return;

    try {
      setLoadingComments(true);
      // This would call the API to get comments
      // For now, we'll use mock data
      setComments([
        {
          id: 1,
          content: "This is important information. Thanks for sharing!",
          author: "Mike Davis",
          created_at: new Date(Date.now() - 1800000).toISOString(),
          can_edit: user?.username === "Mike Davis" || user?.is_staff || false,
          can_delete: user?.username === "Mike Davis" || user?.is_staff || false,
          replies: []
        },
        {
          id: 2,
          content: "Great update! Looking forward to more details.",
          author: "Lisa Chen",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          can_edit: user?.username === "Lisa Chen" || user?.is_staff || false,
          can_delete: user?.username === "Lisa Chen" || user?.is_staff || false,
          replies: [
            {
              id: 3,
              content: "Thanks Lisa! We'll keep everyone updated.",
              author: "Sarah Johnson",
              created_at: new Date(Date.now() - 2700000).toISOString(),
                              can_edit: user?.username === "Sarah Johnson" || user?.is_staff || false,
                can_delete: user?.username === "Sarah Johnson" || user?.is_staff || false,
              replies: []
            }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const loadAvailableTags = async () => {
    try {
      setLoadingTags(true);
      const tags = await TagApiService.getTags('', '', true);
      setAvailableTags(tags);
      setFilteredTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
      // Set some default tags if loading fails
      const defaultTags = [
        { id: 1, name: 'efficiency', description: 'Production efficiency', category: 'production', color: '#10B981', is_active: true, usage_count: 0, created_at: '', updated_at: '' },
        { id: 2, name: 'quality', description: 'Quality control', category: 'production', color: '#3B82F6', is_active: true, usage_count: 0, created_at: '', updated_at: '' },
        { id: 3, name: 'safety', description: 'Safety protocols', category: 'production', color: '#EF4444', is_active: true, usage_count: 0, created_at: '', updated_at: '' },
      ];
      setAvailableTags(defaultTags);
      setFilteredTags(defaultTags);
    } finally {
      setLoadingTags(false);
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
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

  const handleLike = async (isLike: boolean) => {
    if (!selectedUpdate) return;
    await toggleLike(selectedUpdate.id, isLike);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedUpdate) return;

    try {
      await createComment(selectedUpdate.id, newComment.trim());
      setNewComment("");
      await loadComments(); // Refresh comments
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleReplySubmit = async (parentCommentId: number) => {
    if (!replyContent.trim() || !selectedUpdate) return;

    try {
      await createComment(selectedUpdate.id, replyContent.trim(), parentCommentId);
      setReplyContent("");
      setReplyingTo(null);
      await loadComments(); // Refresh comments
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  const handleCommentEdit = async (commentId: number) => {
    if (!editCommentContent.trim()) return;

    try {
      await editComment(commentId, editCommentContent.trim());
      setEditingComment(null);
      setEditCommentContent("");
      await loadComments(); // Refresh comments
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment(commentId);
      await loadComments(); // Refresh comments
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-100 text-red-800 border-red-200";
      case "news":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "communication":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-500";
      case "new":
        return "bg-blue-500";
      case "read":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "new":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "read":
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'news',
      summary: '',
      body: '',
      tags: [],
      icon: '📰',
      priority: 0
    });
    setShowCreateForm(false);
    setShowEditForm(false);
    setEditingUpdate(null);
    setShowTagSelector(false);
    setTagSearchQuery("");
    setIsLoading(false);
  };

  const handleCreateUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim() || !formData.body.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await createUpdate({
        ...formData,
        author: user?.username || 'Unknown',
        tags: formData.tags // Now passes array of tag IDs
      });
      resetForm();
    } catch (error) {
      console.error('Error creating update:', error);
      alert('Failed to create update');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpdate || !formData.title.trim() || !formData.summary.trim() || !formData.body.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await editUpdate(editingUpdate.id, {
        ...formData,
        tags: formData.tags // Now passes array of tag IDs
      });
      resetForm();
    } catch (error) {
      console.error('Error editing update:', error);
      alert('Failed to edit update');
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = (tagId: number) => {
    if (!formData.tags.includes(tagId)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagId]
      }));
    }
    setShowTagSelector(false);
    setTagSearchQuery("");
  };

  const removeTag = (tagIdToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tagId => tagId !== tagIdToRemove)
    }));
  };

  const getTagById = (tagId: number): Tag | undefined => {
    return availableTags.find(tag => tag.id === tagId);
  };

  const renderComment = (comment: UpdateComment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-8 mt-3" : "mb-6"}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {comment.author.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{comment.author}</span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(comment.created_at)}
            </span>
            {comment.can_edit && (
              <button
                onClick={() => {
                  setEditingComment(comment.id);
                  setEditCommentContent(comment.content);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                Edit
              </button>
            )}
            {comment.can_delete && (
              <button
                onClick={() => handleCommentDelete(comment.id)}
                className="text-xs text-red-600 hover:text-red-800 transition-colors"
              >
                Delete
              </button>
            )}
          </div>

          {editingComment === comment.id ? (
            <div className="mb-2">
              <textarea
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleCommentEdit(comment.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditCommentContent("");
                  }}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mb-2">{comment.content}</p>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <Reply className="h-3 w-3" />
              Reply
            </button>
          </div>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleReplySubmit(comment.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  Reply
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.map((reply) => renderComment(reply, true))}
    </div>
  );

  if (!selectedUpdate) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Select an Update
          </h2>
          <p className="text-gray-600">
            Choose an update from the left to start reading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">{selectedUpdate.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {selectedUpdate.title}
              </h1>
              <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor(selectedUpdate.status)}`}></span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(selectedUpdate.type)}`}>
                {selectedUpdate.type}
              </span>
              <span>•</span>
              <span>{selectedUpdate.author}</span>
              <span>•</span>
              <span>{formatDate(selectedUpdate.timestamp)}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                {getStatusIcon(selectedUpdate.status)}
                <span className="capitalize">{selectedUpdate.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Like/Dislike Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleLike(true)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedUpdate.user_like_status === true
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${selectedUpdate.user_like_status === true ? "fill-current" : ""}`} />
              <span>{selectedUpdate.likes_count || 0}</span>
            </button>
            <button
              onClick={() => handleLike(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedUpdate.user_like_status === false
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
              }`}
            >
              <ThumbsDown className={`h-4 w-4 ${selectedUpdate.user_like_status === false ? "fill-current" : ""}`} />
              <span>{selectedUpdate.dislikes_count || 0}</span>
            </button>
          </div>

          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              isBookmarked
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            <span>Bookmark</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>


        </div>
      </div>

      {/* Create/Edit Forms */}
      {(showCreateForm || showEditForm) && (
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium text-gray-900">
              {showCreateForm ? 'Create New Update' : 'Edit Update'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={showCreateForm ? handleCreateUpdate : handleEditUpdate} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Title *"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="news">News</option>
                <option value="communication">Communication</option>
                <option value="alert">Alert</option>
              </select>
            </div>

            <textarea
              placeholder="Summary *"
              value={formData.summary}
              onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              required
            />

            <textarea
              placeholder="Body *"
              value={formData.body}
              onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Icon (emoji)"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Priority"
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="relative tag-selector">
                <button
                  type="button"
                  onClick={() => setShowTagSelector(!showTagSelector)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  {formData.tags.length > 0 ? `${formData.tags.length} tag(s) selected` : 'Select tags...'}
                </button>

                {/* Tag Selector Dropdown */}
                {showTagSelector && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search tags..."
                            value={tagSearchQuery}
                            onChange={(e) => setTagSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={loadAvailableTags}
                          disabled={loadingTags}
                          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                          title="Refresh tags"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Tags List */}
                    <div className="p-2">
                      {loadingTags ? (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            <span>Loading tags...</span>
                          </div>
                        </div>
                      ) : filteredTags.length > 0 ? (
                        filteredTags.map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => addTag(tag.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              formData.tags.includes(tag.id)
                                ? 'bg-blue-100 text-blue-800'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: tag.color }}
                              />
                              <span className="font-medium">{tag.name}</span>
                              {tag.category && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {tag.category}
                                </span>
                              )}
                            </div>
                            {tag.description && (
                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {tag.description}
                              </p>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          {tagSearchQuery ? (
                            'No tags found matching your search'
                          ) : availableTags.length === 0 ? (
                            <div className="space-y-2">
                              <p>No tags available</p>
                              <button
                                type="button"
                                onClick={loadAvailableTags}
                                className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs transition-colors"
                              >
                                Retry Loading Tags
                              </button>
                            </div>
                          ) : (
                            'No tags match your current filters'
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags display */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tagId, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {getTagById(tagId)?.name}
                    <button
                      type="button"
                      onClick={() => removeTag(tagId)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <span>Use the sidebar buttons to save or cancel</span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Summary</h2>
          <p className="text-gray-700 leading-relaxed">{selectedUpdate.summary}</p>
        </div>

        {/* Main Content */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Details</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedUpdate.content.body}
            </p>
          </div>
        </div>

        {/* Media */}
        {selectedUpdate.content.media.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedUpdate.content.media.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.label}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 flex items-center justify-center h-48">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-700 font-medium">{item.label}</p>
                    {item.thumbnailUrl && (
                      <p className="text-xs text-gray-500">Thumbnail available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments */}
        {selectedUpdate.content.attachments.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Attachments</h2>
            <div className="space-y-2">
              {selectedUpdate.content.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{attachment.label}</p>
                      <p className="text-xs text-gray-500">{attachment.type.toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <a
                      href={attachment.url}
                      download
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {selectedUpdate.tags.length > 0 && (
          <div className="mb-6">
                          <h2 className="text-lg font-medium text-gray-900 mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {selectedUpdate.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {typeof tag === 'number' ? getTagById(tag)?.name : tag}
                  </span>
                ))}
              </div>
          </div>
        )}

        {/* Related Updates */}
        {selectedUpdate.content.related.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Related Updates</h2>
            <div className="space-y-2">
              {selectedUpdate.content.related.map((relatedId, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <p className="text-sm text-gray-700">Related Update: {relatedId}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-gray-900">Comments</h2>
              <span className="text-sm text-gray-500">({selectedUpdate.comments_count || 0})</span>
            </div>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showComments ? (
                <>
                  <span>Hide Comments</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Show Comments</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {showComments && (
            <>
              {/* Add Comment */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {loadingComments ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading comments...</p>
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((comment) => renderComment(comment))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsRightCard;
