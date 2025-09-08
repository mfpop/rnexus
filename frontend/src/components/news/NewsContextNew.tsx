// New Optimized News Context Provider
// This provides a clean, efficient data layer for news/updates with improved performance

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_UPDATES } from "../../graphql/updates_new";

// =====================================================
// Type Definitions
// =====================================================

export interface UpdateExtended {
  id: string;
  type: string;
  title: string;
  summary: string;
  body: string;
  timestamp: string;
  status: string;
  tags: string[];
  author: string;
  icon: string;
  priority: string;
  isActive: boolean;
  isExpired: boolean; // Computed field
  timeAgo: string; // Computed field
  readingTime: number; // Computed field
  fullName: string; // Computed from createdBy
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  can_delete?: boolean; // Permission to delete this update
  can_edit?: boolean; // Permission to edit this update
  user_like_status?: string | null; // User's like status: 'like', 'dislike', or null
  likes_count?: number; // Number of likes
  dislikes_count?: number; // Number of dislikes
  comments_count?: number; // Number of comments
  bookmarks_count?: number; // Number of bookmarks
  is_bookmarked?: boolean; // Whether current user has bookmarked this update

  // Optional content properties
  media?: Array<{
    type: string;
    url: string;
    label: string;
    thumbnailUrl?: string;
  }>;
  attachments?: Array<{
    name: string;
    url: string;
    size: string;
    type: string;
    label: string;
  }>;
  related?: string[];

  // User relationship
  createdBy?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    avatarUrl?: string;
  };
}

// Legacy compatibility type
export interface Update {
  id: string;
  type: string;
  title: string;
  summary: string;
  body: string;
  timestamp: string;
  status: string;
  tags: string[];
  author: string;
  icon: string;
  priority: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

// =====================================================
// Context Types
// =====================================================

interface UpdateFilters {
  type?: string;
  status?: string;
  searchQuery?: string;
  activeOnly?: boolean;
}

interface UpdatePagination {
  limit?: number;
  offset?: number;
  hasMore?: boolean;
  total?: number;
}

interface NewsContextType {
  // Data
  updates: UpdateExtended[];
  processedUpdates: UpdateExtended[];
  selectedUpdate: UpdateExtended | null;

  // Legacy compatibility
  legacyUpdates: Update[];
  setUpdates: (updates: Update[]) => void; // For backward compatibility

  // State
  loading: boolean;
  error: string | null;
  filters: UpdateFilters;
  pagination: UpdatePagination;

  // Actions
  setSelectedUpdate: (update: UpdateExtended | null) => void;
  setFilters: (filters: Partial<UpdateFilters>) => void;
  setPagination: (pagination: Partial<UpdatePagination>) => void;
  clearFilters: () => void;

  // Data operations
  refreshUpdates: () => Promise<void>;
  loadMore: () => Promise<void>;
  filterUpdates: (
    type: string,
    status: string,
    searchQuery: string,
  ) => Promise<void>;

  // Filtering helpers
  getUpdatesByType: (type: string) => UpdateExtended[];
  getUpdatesByStatus: (status: string) => UpdateExtended[];
  searchUpdates: (query: string) => UpdateExtended[];
  getNewsUpdates: () => UpdateExtended[];

  // Statistics
  getUpdateStats: () => {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    activeCount: number;
    expiredCount: number;
  };

  // Legacy methods for backward compatibility
  toggleLike: (updateId: string, isLike: boolean) => Promise<void>;
  createComment: (
    updateId: string,
    content: string,
    parentCommentId?: number,
  ) => Promise<void>;
  editComment: (commentId: number, content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  createUpdate: (updateData: any) => Promise<void>;
  editUpdate: (updateId: string, updateData: any) => Promise<void>;
  deleteUpdate: (updateId: string) => Promise<void>;
}

// =====================================================
// Context Creation
// =====================================================

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const useNewsContext = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error("useNewsContext must be used within a NewsProvider");
  }
  return context;
};

// =====================================================
// Provider Component
// =====================================================

interface NewsProviderProps {
  children: ReactNode;
  initialFilters?: UpdateFilters;
  initialPagination?: UpdatePagination;
}

export const NewsProvider = ({
  children,
  initialFilters = { activeOnly: true },
  initialPagination = { limit: 50, offset: 0 },
}: NewsProviderProps) => {
  console.log("NewsProvider rendering with props:", {
    initialFilters,
    initialPagination,
  });

  // ===== State =====
  const [selectedUpdate, setSelectedUpdate] = useState<UpdateExtended | null>(
    null,
  );
  const [filters, setFiltersState] = useState<UpdateFilters>(initialFilters);
  const [pagination, setPaginationState] =
    useState<UpdatePagination>(initialPagination);

  // ===== GraphQL Query =====
  // Use the simplified query without parameters (client-side filtering will handle filters)
  const { data, loading, error, refetch } = useQuery(GET_ALL_UPDATES, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  // Debug GraphQL query
  console.log("NewsProvider GraphQL state:", { data, loading, error });
  console.log("Raw allUpdates data:", data?.allUpdates);
  console.log("Number of raw updates:", data?.allUpdates?.length || 0);

  // If there's a critical error, still provide a minimal context to prevent crashes
  if (error && !data) {
    console.error(
      "NewsProvider critical error, providing fallback context:",
      error,
    );
  }

  // ===== Data Processing =====
  // Transform raw GraphQL data to our extended format
  const processedUpdates: UpdateExtended[] = useMemo(() => {
    console.log(
      "Processing updates from raw data:",
      data?.allUpdates?.length || 0,
    );
    const processed = (data?.allUpdates || []).map((rawUpdate: any) => ({
      id: rawUpdate.id,
      type: (rawUpdate.type || "news").toLowerCase(),
      title: rawUpdate.title || "",
      summary: rawUpdate.summary || "",
      body: rawUpdate.body || "",
      timestamp: rawUpdate.timestamp || rawUpdate.createdAt || "",
      status: (rawUpdate.status || "active").toLowerCase(),
      tags: Array.isArray(rawUpdate.tags) ? rawUpdate.tags : [],
      author: rawUpdate.author || "",
      icon: rawUpdate.icon || "info",
      priority: rawUpdate.priority || 0,
      isActive: rawUpdate.isActive ?? true,
      // Add computed fields for backward compatibility
      isExpired: rawUpdate.expiresAt
        ? new Date(rawUpdate.expiresAt) < new Date()
        : false,
      timeAgo: rawUpdate.createdAt
        ? Math.floor(
            (Date.now() - new Date(rawUpdate.createdAt).getTime()) / 60000,
          ) + " min ago"
        : "",
      readingTime: Math.max(
        1,
        Math.ceil((rawUpdate.body || "").split(" ").length / 200),
      ), // Approx reading time
      fullName: rawUpdate.createdBy
        ? `${rawUpdate.createdBy.firstName} ${rawUpdate.createdBy.lastName}`.trim()
        : rawUpdate.author || "",
      createdAt: rawUpdate.createdAt || "",
      updatedAt: rawUpdate.updatedAt || "",
      expiresAt: rawUpdate.expiresAt,
      createdBy: rawUpdate.createdBy
        ? {
            id: rawUpdate.createdBy.id,
            username: rawUpdate.createdBy.username,
            firstName: rawUpdate.createdBy.firstName,
            lastName: rawUpdate.createdBy.lastName,
            avatar: rawUpdate.createdBy.avatar,
            avatarUrl: rawUpdate.createdBy.avatarUrl,
          }
        : undefined,
      // Permission fields
      can_delete: rawUpdate.can_delete ?? false,
      can_edit: rawUpdate.can_edit ?? false,
      // Like/engagement fields
      user_like_status: rawUpdate.userLikeStatus ?? null,
      likes_count: rawUpdate.likesCount ?? 0,
      dislikes_count: rawUpdate.dislikesCount ?? 0,
      comments_count: rawUpdate.commentsCount ?? 0,
      bookmarks_count: rawUpdate.bookmarksCount ?? 0,
      is_bookmarked: rawUpdate.isBookmarked ?? false,
      // Optional content properties with array validation
      media: Array.isArray(rawUpdate.media) ? rawUpdate.media : [],
      attachments: Array.isArray(rawUpdate.attachments)
        ? rawUpdate.attachments
        : [],
      related: Array.isArray(rawUpdate.related) ? rawUpdate.related : [],
    }));
    console.log("Processed updates result:", processed.length);
    console.log(
      "Processed update types:",
      processed.map((u: UpdateExtended) => u.type),
    );
    return processed;
  }, [data?.allUpdates]);

  // Apply all filters client-side
  const filteredUpdates = useMemo(() => {
    console.log("Filtering updates with filters:", filters);
    console.log("Total processed updates:", processedUpdates.length);
    console.log(
      "Update types:",
      processedUpdates.map((u) => u.type),
    );

    let filtered = [...processedUpdates];

    // Type filter
    if (filters.type) {
      console.log("Applying type filter:", filters.type);
      const beforeCount = filtered.length;
      filtered = filtered.filter((update) => update.type === filters.type);
      console.log(`Type filter: ${beforeCount} -> ${filtered.length} updates`);
    }

    // Status filter
    if (filters.status) {
      console.log("Applying status filter:", filters.status);
      const beforeCount = filtered.length;
      filtered = filtered.filter((update) => update.status === filters.status);
      console.log(
        `Status filter: ${beforeCount} -> ${filtered.length} updates`,
      );
    }

    // Active only filter
    if (filters.activeOnly) {
      console.log("Applying active only filter");
      const beforeCount = filtered.length;
      filtered = filtered.filter((update) => update.isActive);
      console.log(
        `Active filter: ${beforeCount} -> ${filtered.length} updates`,
      );
    }

    // Search query filter
    if (filters.searchQuery) {
      console.log("Applying search filter:", filters.searchQuery);
      const beforeCount = filtered.length;
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (update) =>
          update.title.toLowerCase().includes(query) ||
          update.summary.toLowerCase().includes(query) ||
          update.body.toLowerCase().includes(query) ||
          update.author.toLowerCase().includes(query) ||
          update.fullName.toLowerCase().includes(query) ||
          update.tags.some((tag: string) => tag.toLowerCase().includes(query)),
      );
      console.log(
        `Search filter: ${beforeCount} -> ${filtered.length} updates`,
      );
    }

    console.log("Final filtered updates:", filtered.length);
    return filtered;
  }, [processedUpdates, filters]);

  // Convert to legacy format for backward compatibility
  const convertToLegacyUpdate = useCallback(
    (update: UpdateExtended): Update => ({
      id: update.id,
      type: update.type,
      title: update.title,
      summary: update.summary,
      body: update.body,
      timestamp: update.timestamp,
      status: update.status,
      tags: update.tags,
      author: update.author,
      icon: update.icon,
      priority: update.priority,
      isActive: update.isActive,
      createdAt: update.createdAt,
      updatedAt: update.updatedAt,
      expiresAt: update.expiresAt,
    }),
    [],
  );

  // Legacy format for backward compatibility
  const legacyUpdates: Update[] = filteredUpdates.map(convertToLegacyUpdate);

  // ===== No auto-selection =====
  // Let user manually select a record instead of auto-selecting the first one

  // ===== Actions =====
  const setFilters = useCallback((newFilters: Partial<UpdateFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setPaginationState((prev) => ({ ...prev, offset: 0 })); // Reset pagination when filtering
  }, []);

  const setPagination = useCallback(
    (newPagination: Partial<UpdatePagination>) => {
      setPaginationState((prev) => ({ ...prev, ...newPagination }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFiltersState({ activeOnly: true });
    setPaginationState({ limit: 50, offset: 0 });
  }, []);

  const refreshUpdates = useCallback(async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Error refreshing updates:", err);
    }
  }, [refetch]);

  const loadMore = useCallback(async () => {
    if (!pagination.limit || loading) return;

    try {
      // Since we're using client-side filtering, we can't do server-side pagination
      // In a real implementation, you'd need to implement server-side pagination
      // or handle this differently. For now, we'll just log that more data is requested.
      console.log("Load more requested - implementing client-side pagination");

      setPaginationState((prev) => ({
        ...prev,
        offset: (prev.offset || 0) + (prev.limit || 50),
        hasMore: false, // Disable infinite loading for now
      }));
    } catch (err) {
      console.error("Error loading more updates:", err);
    }
  }, [loading, pagination]);

  const filterUpdates = useCallback(
    async (type: string, status: string, searchQuery: string) => {
      console.log("filterUpdates called with:", { type, status, searchQuery });
      const newFilters = {
        type: type === "all" ? undefined : type,
        status: status === "all" ? undefined : status,
        searchQuery: searchQuery.trim() || undefined,
      };
      console.log("Setting filters to:", newFilters);
      setFilters(newFilters);
    },
    [setFilters],
  );

  // Legacy setter for backward compatibility
  const setUpdates = useCallback((_newUpdates: Update[]) => {
    // This is a no-op since we're using GraphQL data
    console.warn("setUpdates is deprecated. Use refreshUpdates() instead.");
  }, []);

  // ===== Filtering Helpers =====
  const getUpdatesByType = useCallback(
    (type: string): UpdateExtended[] => {
      return filteredUpdates.filter((update) => update.type === type);
    },
    [filteredUpdates],
  );

  const getUpdatesByStatus = useCallback(
    (status: string): UpdateExtended[] => {
      return filteredUpdates.filter((update) => update.status === status);
    },
    [filteredUpdates],
  );

  const searchUpdates = useCallback(
    (query: string): UpdateExtended[] => {
      if (!query.trim()) return filteredUpdates;

      const searchTerm = query.toLowerCase();
      return filteredUpdates.filter(
        (update) =>
          update.title.toLowerCase().includes(searchTerm) ||
          update.summary.toLowerCase().includes(searchTerm) ||
          update.body.toLowerCase().includes(searchTerm) ||
          update.author.toLowerCase().includes(searchTerm) ||
          update.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
      );
    },
    [filteredUpdates],
  );

  const getNewsUpdates = useCallback((): UpdateExtended[] => {
    return filteredUpdates.filter((update) => update.type === "news");
  }, [filteredUpdates]);

  // ===== Statistics =====
  const getUpdateStats = useCallback(() => {
    const stats = {
      total: filteredUpdates.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      activeCount: 0,
      expiredCount: 0,
    };

    filteredUpdates.forEach((update) => {
      // Count by type
      stats.byType[update.type] = (stats.byType[update.type] || 0) + 1;

      // Count by status
      stats.byStatus[update.status] = (stats.byStatus[update.status] || 0) + 1;

      // Count active/expired
      if (update.isActive) stats.activeCount++;
      if (update.isExpired) stats.expiredCount++;
    });

    return stats;
  }, [filteredUpdates]);

  // ===== Legacy Methods (Placeholder implementations) =====
  const toggleLike = useCallback(
    async (_updateId: string, _isLike: boolean) => {
      console.warn("toggleLike not implemented in new context");
    },
    [],
  );

  const createComment = useCallback(
    async (_updateId: string, _content: string, _parentCommentId?: number) => {
      console.warn("createComment not implemented in new context");
    },
    [],
  );

  const editComment = useCallback(
    async (_commentId: number, _content: string) => {
      console.warn("editComment not implemented in new context");
    },
    [],
  );

  const deleteComment = useCallback(async (_commentId: number) => {
    console.warn("deleteComment not implemented in new context");
  }, []);

  const createUpdate = useCallback(async (_updateData: any) => {
    console.warn("createUpdate not implemented in new context");
  }, []);

  const editUpdate = useCallback(
    async (_updateId: string, _updateData: any) => {
      console.warn("editUpdate not implemented in new context");
    },
    [],
  );

  const deleteUpdate = useCallback(async (_updateId: string) => {
    console.warn("deleteUpdate not implemented in new context");
  }, []);

  // ===== Error Handling =====
  const errorMessage = error ? error.message : null;

  // ===== Context Value =====
  const contextValue: NewsContextType = {
    // Data
    updates: filteredUpdates,
    processedUpdates,
    selectedUpdate,

    // Legacy compatibility
    legacyUpdates,
    setUpdates,

    // State
    loading,
    error: errorMessage,
    filters,
    pagination,

    // Actions
    setSelectedUpdate,
    setFilters,
    setPagination,
    clearFilters,

    // Data operations
    refreshUpdates,
    loadMore,
    filterUpdates,

    // Filtering helpers
    getUpdatesByType,
    getUpdatesByStatus,
    searchUpdates,
    getNewsUpdates,

    // Statistics
    getUpdateStats,

    // Legacy methods
    toggleLike,
    createComment,
    editComment,
    deleteComment,
    createUpdate,
    editUpdate,
    deleteUpdate,
  };

  console.log("NewsProvider providing context with value:", contextValue);

  // If there's a GraphQL error, show error state but still provide context
  if (error) {
    console.error("NewsProvider GraphQL error:", error);
  }

  // Always provide context, even during loading or errors
  return (
    <NewsContext.Provider value={contextValue}>{children}</NewsContext.Provider>
  );
};

// =====================================================

export default NewsContext;
