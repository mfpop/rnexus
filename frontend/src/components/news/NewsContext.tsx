import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from '@apollo/client';
import { GET_ALL_UPDATES } from '../../graphql/updates';
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
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use GraphQL query for updates
  const { data, loading, error: graphqlError, refetch } = useQuery(GET_ALL_UPDATES, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // Convert GraphQL data to our Update interface
  const convertGraphQLUpdate = (gqlUpdate: any): Update => ({
    id: gqlUpdate.id,
    type: gqlUpdate.type.toLowerCase(),
    title: gqlUpdate.title,
    summary: gqlUpdate.summary,
    timestamp: gqlUpdate.timestamp,
    status: gqlUpdate.status.toLowerCase(),
    tags: [],
    author: gqlUpdate.author,
    icon: 'newspaper',
    content: {
      body: gqlUpdate.summary,
      attachments: [],
      media: [],
      related: [],
    },
  });

  // Transform GraphQL data
  const updates = data?.allUpdates ? data.allUpdates.map(convertGraphQLUpdate) : [];

  // No auto-selection - let user manually select a record

  // Load initial updates only when authenticated
  const loadUpdates = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load updates');
      console.error('Error loading updates:', err);
    }
  };

  // Filter updates based on type, status, and search query
  const filterUpdates = async (_type: string = 'all', _status: string = 'all', _searchQuery: string = '') => {
    // For now, we'll just refetch all updates since GraphQL filtering would require backend changes
    // In a real implementation, you'd want to add filtering parameters to the GraphQL query
    await loadUpdates();
  };

  // Refresh updates
  const refreshUpdates = async () => {
    await loadUpdates();
  };

  // Toggle like/dislike for an update
  const toggleLike = async (_updateId: string, _isLike: boolean) => {
    // TODO: Implement GraphQL mutation for toggling likes
    console.log('Toggle like not implemented yet for GraphQL');
  };

  // Create a comment
  const createComment = async (_updateId: string, _content: string, _parentCommentId?: number) => {
    // TODO: Implement GraphQL mutation for creating comments
    console.log('Create comment not implemented yet for GraphQL');
  };

  // Edit a comment
  const editComment = async (_commentId: number, _content: string) => {
    // TODO: Implement GraphQL mutation for editing comments
    console.log('Edit comment not implemented yet for GraphQL');
  };

  // Delete a comment
  const deleteComment = async (_commentId: number) => {
    // TODO: Implement GraphQL mutation for deleting comments
    console.log('Delete comment not implemented yet for GraphQL');
  };

  // Create a new update
  const createUpdate = async (_updateData: any) => {
    // TODO: Implement GraphQL mutation for creating updates
    console.log('Create update not implemented yet for GraphQL');
  };

  // Edit an existing update
  const editUpdate = async (_updateId: string, _updateData: any) => {
    // TODO: Implement GraphQL mutation for editing updates
    console.log('Edit update not implemented yet for GraphQL');
  };

  // Delete an update
  const deleteUpdate = async (_updateId: string) => {
    // TODO: Implement GraphQL mutation for deleting updates
    console.log('Delete update not implemented yet for GraphQL');
  };

  // Load updates when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      loadUpdates();
    } else {
      // Clear updates when user logs out
      setSelectedUpdate(null);
      setError(null);
    }
  }, [isAuthenticated]);

  // Set error from GraphQL if present
  useEffect(() => {
    if (graphqlError) {
      setError(graphqlError.message);
    }
  }, [graphqlError]);

  const value: NewsContextType = {
    selectedUpdate,
    setSelectedUpdate,
    updates,
    setUpdates: () => {}, // Not needed for GraphQL
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
