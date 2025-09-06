import { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from '@apollo/client';
import { GET_ALL_ACTIVITIES } from '../../graphql/activities';

interface Activity {
  id: string;
  title: string;
  description: string;
  type: string; // Accept any string from backend
  status: "planned" | "in-progress" | "completed" | "cancelled" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  startTime: Date;
  endTime: Date;
  assignedTo: string;
  assignedBy: string;
  location?: string;
  progress: number;
  estimatedDuration: number;
  actualDuration?: number;
  notes?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  dependencies?: string[];
  equipment?: string[];
}

interface ActivitiesContextType {
  activities: Activity[];
  selectedActivity: Activity | null;
  setSelectedActivity: (activity: Activity | null) => void;
  loading: boolean;
  error: string | null;
  fetchActivities: () => Promise<Activity[] | void>;
  refreshActivities: () => Promise<Activity[] | void>;
}

const ActivitiesContext = createContext<ActivitiesContextType>({
  activities: [],
  selectedActivity: null,
  setSelectedActivity: () => {},
  loading: false,
  error: null,
  fetchActivities: async () => {},
  refreshActivities: async () => {}
});

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (context === undefined) {
    throw new Error("useActivities must be used within an ActivitiesProvider");
  }
  return context;
};

export const ActivitiesProvider = ({ children }: { children: ReactNode }) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Use GraphQL query for activities
  const { data, loading, error, refetch } = useQuery(GET_ALL_ACTIVITIES, {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  // Convert GraphQL data to our Activity interface
  const convertGraphQLActivity = (gqlActivity: any): Activity => ({
    id: gqlActivity.id,
    title: gqlActivity.title,
    description: gqlActivity.description,
    type: gqlActivity.type, // Use the type as-is from backend
    status: gqlActivity.status.toLowerCase().replace('_', '-') as Activity['status'],
    priority: gqlActivity.priority.toLowerCase() as Activity['priority'],
    startTime: new Date(gqlActivity.startTime),
    endTime: new Date(gqlActivity.endTime),
    assignedTo: gqlActivity.assignedTo,
    assignedBy: gqlActivity.assignedBy,
    location: gqlActivity.location,
    progress: gqlActivity.progress ?? 0,
    estimatedDuration: gqlActivity.estimatedDuration ?? 0,
    actualDuration: gqlActivity.actualDuration,
    notes: gqlActivity.notes,
    attachments: [],
    dependencies: [],
    equipment: [],
  });

  // Transform GraphQL data
  const activities = data?.allActivities ? data.allActivities.map(convertGraphQLActivity) : [];

  const fetchActivities = async (): Promise<Activity[] | void> => {
    try {
      console.log('🔍 ActivitiesContext - Fetching activities via GraphQL');
      const result = await refetch();
      const fetchedActivities = result.data?.allActivities ? result.data.allActivities.map(convertGraphQLActivity) : [];
      console.log('🔍 ActivitiesContext - GraphQL activities fetched:', fetchedActivities.length);
      return fetchedActivities;
    } catch (err) {
      console.error('Error fetching activities via GraphQL:', err);
      return [];
    }
  };

  const refreshActivities = async (): Promise<Activity[] | void> => {
    return await fetchActivities();
  };

  const errorMessage = error ? error.message : null;

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        selectedActivity,
        setSelectedActivity,
        loading,
        error: errorMessage,
        fetchActivities,
        refreshActivities
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export default ActivitiesContext;
export type { Activity };
