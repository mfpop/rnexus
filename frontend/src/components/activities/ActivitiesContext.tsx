// Consolidated Activities Context Provider
// This provides a clean, efficient data layer for activities with improved performance

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useEffect,
} from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_ACTIVITIES } from "../../graphql/activities_new";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";

// Create a separate Apollo client for activities that doesn't send auth headers
const activitiesHttpLink = createHttpLink({
  uri: "http://localhost:8000/graphql/",
});

const activitiesClient = new ApolloClient({
  link: activitiesHttpLink,
  cache: new InMemoryCache(),
});

// =====================================================
// Type Definitions
// =====================================================

interface ActivityConfig {
  id: string;
  displayName: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
}

interface ActivityUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

// Export Types for External Use
export interface ActivityExtended {
  id: string;
  title: string;
  description: string;
  type: string;
  status: "planned" | "in-progress" | "completed" | "cancelled" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  startTime: Date; // Keep as Date for compatibility
  endTime: Date; // Keep as Date for compatibility
  assignedTo: string;
  assignedBy: string;
  location?: string;
  progress: number;
  estimatedDuration: number;
  actualDuration?: number;
  notes?: string;
  durationHours: number;
  statusDisplay: string;
  priorityDisplay: string;
  fullName: string; // Computed from createdBy
  createdAt: string;
  updatedAt: string;

  // Legacy compatibility fields
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  dependencies?: string[];
  equipment?: string[];

  // Optional enhanced fields
  statusConfig?: ActivityConfig;
  priorityConfig?: ActivityConfig;
  createdBy?: ActivityUser;
}

interface ActivityFilters {
  type?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  searchQuery?: string;
}

interface ActivityPagination {
  limit?: number;
  offset?: number;
  hasMore?: boolean;
  total?: number;
}

interface ActivitiesContextType {
  // Data
  activities: ActivityExtended[];
  selectedActivity: ActivityExtended | null;

  // State
  loading: boolean;
  error: string | null;
  filters: ActivityFilters;
  pagination: ActivityPagination;

  // Actions
  setSelectedActivity: (activity: ActivityExtended | null) => void;
  setFilters: (filters: Partial<ActivityFilters>) => void;
  setPagination: (pagination: Partial<ActivityPagination>) => void;
  clearFilters: () => void;

  // Data operations
  refreshActivities: () => Promise<void>;
  loadMore: () => Promise<void>;

  // Filtering helpers
  getActivitiesByType: (type: string) => ActivityExtended[];
  getActivitiesByStatus: (status: string) => ActivityExtended[];
  getActivitiesByPriority: (priority: string) => ActivityExtended[];
  searchActivities: (query: string) => ActivityExtended[];

  // Statistics
  getActivityStats: () => {
    total: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
  };
}

// =====================================================
// Context Creation
// =====================================================

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(
  undefined,
);

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error("useActivities must be used within an ActivitiesProvider");
  }
  return context;
};

// =====================================================
// Provider Component
// =====================================================

interface ActivitiesProviderProps {
  children: ReactNode;
  initialFilters?: ActivityFilters;
  initialPagination?: ActivityPagination;
}

export const ActivitiesProvider = ({
  children,
  initialFilters = {},
  initialPagination = { limit: 50, offset: 0 },
}: ActivitiesProviderProps) => {
  // ===== State =====
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityExtended | null>(null);
  const [filters, setFiltersState] = useState<ActivityFilters>(initialFilters);
  const [pagination, setPaginationState] =
    useState<ActivityPagination>(initialPagination);

  // ===== GraphQL Query =====
  // Use the simplified query without parameters (client-side filtering will handle filters)
  const { data, loading, error, refetch } = useQuery(GET_ALL_ACTIVITIES, {
    client: activitiesClient, // Use separate client without auth headers
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  // Handle query completion and errors with useEffect
  useEffect(() => {
    if (data) {
      console.log("DEBUG: Activities query completed successfully");
      console.log("DEBUG: Activities data:", data);
      console.log(
        "DEBUG: Number of activities:",
        data?.allActivities?.length || 0,
      );
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error("DEBUG: Activities query error:", error);
      console.error("DEBUG: Error details:", error.graphQLErrors, error.networkError);
    }
  }, [error]);

  // ===== Data Processing =====
  // Transform raw GraphQL data to our extended format
  const processedActivities: ActivityExtended[] = useMemo(() => {
    const result = (data?.allActivities || []).map((activity: any) => ({
      ...activity,
      startTime: new Date(activity.startTime),
      endTime: new Date(activity.endTime),
      // Add computed fields for backward compatibility
      durationHours: activity.estimatedDuration / 60, // Convert minutes to hours
      statusDisplay:
        activity.status.charAt(0).toUpperCase() +
        activity.status.slice(1).replace("-", " "),
      priorityDisplay:
        activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1),
      // Add user full name if available
      fullName: activity.createdBy
        ? `${activity.createdBy.firstName} ${activity.createdBy.lastName}`.trim()
        : "",
    }));
    console.log("DEBUG: Processed activities:", result.length);
    console.log("DEBUG: First activity sample:", result[0]);
    return result;
  }, [data?.allActivities]);

  // Apply all filters client-side
  const filteredActivities = useMemo(() => {
    let filtered = [...processedActivities];

    // Type filter
    if (filters.type) {
      filtered = filtered.filter((activity) => activity.type === filters.type);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(
        (activity) => activity.status === filters.status,
      );
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(
        (activity) => activity.priority === filters.priority,
      );
    }

    // Assigned to filter
    if (filters.assignedTo) {
      filtered = filtered.filter(
        (activity) =>
          activity.assignedTo === filters.assignedTo ||
          activity.fullName
            .toLowerCase()
            .includes(filters.assignedTo!.toLowerCase()),
      );
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(query) ||
          activity.description.toLowerCase().includes(query) ||
          activity.assignedTo.toLowerCase().includes(query) ||
          activity.fullName.toLowerCase().includes(query) ||
          (activity.location &&
            activity.location.toLowerCase().includes(query)),
      );
    }

    return filtered;
  }, [processedActivities, filters]);

  // ===== Actions =====
  const setFilters = useCallback((newFilters: Partial<ActivityFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
    setPaginationState((prev) => ({ ...prev, offset: 0 })); // Reset pagination when filtering
  }, []);

  const setPagination = useCallback(
    (newPagination: Partial<ActivityPagination>) => {
      setPaginationState((prev) => ({ ...prev, ...newPagination }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFiltersState({});
    setPaginationState({ limit: 50, offset: 0 });
  }, []);

  const refreshActivities = useCallback(async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Error refreshing activities:", err);
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
      console.error("Error loading more activities:", err);
    }
  }, [loading, pagination]);

  // ===== Filtering Helpers =====
  const getActivitiesByType = useCallback(
    (type: string): ActivityExtended[] => {
      return filteredActivities.filter((activity) => activity.type === type);
    },
    [filteredActivities],
  );

  const getActivitiesByStatus = useCallback(
    (status: string): ActivityExtended[] => {
      return filteredActivities.filter(
        (activity) => activity.status === status,
      );
    },
    [filteredActivities],
  );

  const getActivitiesByPriority = useCallback(
    (priority: string): ActivityExtended[] => {
      return filteredActivities.filter(
        (activity) => activity.priority === priority,
      );
    },
    [filteredActivities],
  );

  const searchActivities = useCallback(
    (query: string): ActivityExtended[] => {
      if (!query.trim()) return filteredActivities;

      const searchTerm = query.toLowerCase();
      return filteredActivities.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchTerm) ||
          activity.description.toLowerCase().includes(searchTerm) ||
          activity.assignedTo.toLowerCase().includes(searchTerm) ||
          (activity.location &&
            activity.location.toLowerCase().includes(searchTerm)) ||
          activity.type.toLowerCase().includes(searchTerm),
      );
    },
    [filteredActivities],
  );

  // ===== Statistics =====
  const getActivityStats = useCallback(() => {
    const stats = {
      total: filteredActivities.length,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    };

    filteredActivities.forEach((activity) => {
      // Count by type
      stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;

      // Count by status
      stats.byStatus[activity.status] =
        (stats.byStatus[activity.status] || 0) + 1;

      // Count by priority
      stats.byPriority[activity.priority] =
        (stats.byPriority[activity.priority] || 0) + 1;
    });

    return stats;
  }, [filteredActivities]);

  // ===== Error Handling =====
  const errorMessage = error ? error.message : null;

  // ===== Context Value =====
  const contextValue: ActivitiesContextType = {
    // Data
    activities: filteredActivities,
    selectedActivity,

    // State
    loading,
    error: errorMessage,
    filters,
    pagination,

    // Actions
    setSelectedActivity,
    setFilters,
    setPagination,
    clearFilters,

    // Data operations
    refreshActivities,
    loadMore,

    // Filtering helpers
    getActivitiesByType,
    getActivitiesByStatus,
    getActivitiesByPriority,
    searchActivities,

    // Statistics
    getActivityStats,
  };

  return (
    <ActivitiesContext.Provider value={contextValue}>
      {children}
    </ActivitiesContext.Provider>
  );
};

// =====================================================

export type { ActivityFilters, ActivityPagination };
export default ActivitiesContext;
