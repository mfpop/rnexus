import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UpdateApiService } from "../../lib/updateApi";
import { Update, UpdateContent, UpdateAttachment, UpdateMedia } from "./MessageTypes";
import { useAuth } from "../../contexts/AuthContext";

interface NewsContextType {
  selectedUpdate: Update | null;
  setSelectedUpdate: (update: Update | null) => void;
  updates: Update[];
  setUpdates: (updates: Update[]) => void;
  loading: boolean;
  error: string | null;
  refreshUpdates: () => Promise<void>;
  filterUpdates: (type: string, status: string, searchQuery: string) => Promise<void>;
  // New functionality
  toggleLike: (updateId: string, isLike: boolean) => Promise<void>;
  createComment: (updateId: string, content: string, parentCommentId?: number) => Promise<void>;
  editComment: (commentId: number, content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  createUpdate: (updateData: any) => Promise<void>;
  editUpdate: (updateId: string, updateData: any) => Promise<void>;
  deleteUpdate: (updateId: string) => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};

interface NewsProviderProps {
  children: ReactNode;
}

export const NewsProvider: React.FC<NewsProviderProps> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [updates, setUpdates] = useState<Update[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [loading, setLoading] = useState(false); // Start with false since we don't load immediately
  const [error, setError] = useState<string | null>(null);

  // Load initial updates only when authenticated
  const loadUpdates = async () => {
    // Check if user is authenticated before making API calls
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { updates: fetchedUpdates } = await UpdateApiService.getUpdatesEnhanced();
      setUpdates(fetchedUpdates);
      if (fetchedUpdates.length > 0) {
        setSelectedUpdate(fetchedUpdates[0] || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load updates');
      console.error('Error loading updates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter updates based on type, status, and search query
  const filterUpdates = async (type: string = 'all', status: string = 'all', searchQuery: string = '') => {
    // Check if user is authenticated before making API calls
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { updates: filteredUpdates } = await UpdateApiService.getUpdatesEnhanced({
        type,
        status,
        searchQuery,
      });
      setUpdates(filteredUpdates);
      if (filteredUpdates.length > 0) {
        setSelectedUpdate(filteredUpdates[0] || null);
      } else {
        setSelectedUpdate(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter updates');
      console.error('Error filtering updates:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh updates
  const refreshUpdates = async () => {
    await loadUpdates();
  };

  // Toggle like/dislike for an update
  const toggleLike = async (updateId: string, isLike: boolean) => {
    try {
      const response = await UpdateApiService.toggleLike(updateId, isLike);
      if (response.success) {
        // Update the local state to reflect the new like counts
        setUpdates(prevUpdates =>
          prevUpdates.map(update =>
            update.id === updateId
              ? {
                  ...update,
                  likes_count: response.likes_count,
                  dislikes_count: response.dislikes_count,
                  user_like_status: response.user_like_status
                }
              : update
          )
        );

        // Update selected update if it's the one being liked
        if (selectedUpdate?.id === updateId) {
          setSelectedUpdate(prev => prev ? {
            ...prev,
            likes_count: response.likes_count,
            dislikes_count: response.dislikes_count,
            user_like_status: response.user_like_status
          } : null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
      console.error('Error toggling like:', err);
    }
  };

  // Create a comment
  const createComment = async (updateId: string, content: string, parentCommentId?: number) => {
    try {
      const response = await UpdateApiService.createComment(updateId, content, parentCommentId);
      if (response.success) {
        // Refresh the updates to get the new comment count
        await refreshUpdates();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
      console.error('Error creating comment:', err);
    }
  };

  // Edit a comment
  const editComment = async (commentId: number, content: string) => {
    try {
      const response = await UpdateApiService.editComment(commentId, content);
      if (response.success) {
        // Refresh the updates to get the updated comment
        await refreshUpdates();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit comment');
      console.error('Error editing comment:', err);
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: number) => {
    try {
      const response = await UpdateApiService.deleteComment(commentId);
      if (response.success) {
        // Refresh the updates to get the updated comment count
        await refreshUpdates();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  // Create a new update
  const createUpdate = async (updateData: any) => {
    try {
      const response = await UpdateApiService.createUpdateNew(updateData);
      if (response.success) {
        // Refresh the updates to include the new one
        await refreshUpdates();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create update');
      console.error('Error creating update:', err);
    }
  };

  // Edit an existing update
  const editUpdate = async (updateId: string, updateData: any) => {
    try {
      const response = await UpdateApiService.editUpdateNew(updateId, updateData);
      if (response.success) {
        // Refresh the updates to get the updated one
        await refreshUpdates();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit update');
      console.error('Error editing update:', err);
    }
  };

  // Delete an update
  const deleteUpdate = async (updateId: string) => {
    try {
      const response = await UpdateApiService.deleteUpdateNew(updateId);
      if (response.success) {
        // Remove the deleted update from local state
        setUpdates(prevUpdates => prevUpdates.filter(update => update.id !== updateId));
        if (selectedUpdate?.id === updateId) {
          setSelectedUpdate(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete update');
      console.error('Error deleting update:', err);
    }
  };

  // Load updates when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      loadUpdates();
    } else {
      // Clear updates when user logs out
      setUpdates([]);
      setSelectedUpdate(null);
      setError(null);
    }
  }, [isAuthenticated]);

  const value: NewsContextType = {
    selectedUpdate,
    setSelectedUpdate,
    updates,
    setUpdates,
    loading,
    error,
    refreshUpdates,
    filterUpdates,
    toggleLike,
    createComment,
    editComment,
    deleteComment,
    createUpdate,
    editUpdate,
    deleteUpdate,
  };

  // Don't render children until authentication is ready
  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // If not authenticated, show a message
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Please log in to view news</div>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
};

export default NewsContext;
export type { Update, UpdateContent, UpdateAttachment, UpdateMedia };
