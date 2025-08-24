import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { activitiesApi } from "../../lib/activitiesApi";
import AuthService from "../../lib/authService";

interface Activity {
  id: string;
  title: string;
  description: string;
  type: "Production" | "Maintenance" | "Inspection & Audit" | "Engineering" | "Logistics" | "Quality" | "Meetings" | "Projects" | "Training" | "Admin & Systems";
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

export const useActivitiesContext = () => {
  const context = useContext(ActivitiesContext);
  if (context === undefined) {
    throw new Error(
      "useActivitiesContext must be used within a ActivitiesProvider",
    );
  }
  return context;
};

interface ActivitiesProviderProps {
  children: ReactNode;
}

export const ActivitiesProvider: React.FC<ActivitiesProviderProps> = ({
  children,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async (): Promise<Activity[] | void> => {
    setLoading(true);
    setError(null);

    console.log('🔍 ActivitiesContext - Starting fetchActivities');
    console.log('🔍 ActivitiesContext - AuthService.isAuthenticated():', AuthService.isAuthenticated());
    console.log('🔍 ActivitiesContext - AuthService.getToken():', AuthService.getToken() ? 'Token exists' : 'No token');

    try {
      console.log('🔍 ActivitiesContext - Calling activitiesApi.getActivities()');
      const response = await activitiesApi.getActivities();
      console.log('🔍 ActivitiesContext - API response received:', response);

      // Check if the response has the expected structure
      if (response.success && response.activities) {
        const apiActivities = response.activities;

        if (!Array.isArray(apiActivities)) {
          console.warn('API response activities is not an array:', response);
          setActivities([]);
          return [];
        }

        if (apiActivities.length === 0) {
          console.log('No activities found in API response');
          setActivities([]);
          return [];
        }

        // Convert the API response to match our Activity interface
        const convertedActivities = apiActivities.map((apiActivity: any) => convertApiActivity(apiActivity));
        setActivities(convertedActivities);

        // If a selected activity exists, try to rehydrate it from the fresh list
        setSelectedActivity((prev) => {
          if (!prev) return prev;
          const rehydrated = convertedActivities.find((a: any) => a.id === prev.id);
          if (rehydrated) {
            console.debug('ActivitiesContext - Rehydrated selected activity:', rehydrated.id);
            return rehydrated;
          } else {
            console.warn('ActivitiesContext - Could not find selected activity in refreshed list:', prev.id);
            return prev; // Keep the previous selection if not found
          }
        });

        return convertedActivities as Activity[];
      } else {
        // Handle error response from backend
        const errorMessage = response.error || 'Failed to fetch activities';
        setError(errorMessage);
        console.error('API error response:', response);
        return [];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching activities';
      setError(errorMessage);
      console.error('Error fetching activities:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const refreshActivities = async (): Promise<Activity[] | void> => {
    // Return the fresh, converted activities so callers can act on them immediately
    return await fetchActivities();
  };

  // Helper to normalize an API activity object into our Activity shape
  const convertApiActivity = (apiActivity: any) => ({
    id: apiActivity.id,
    title: apiActivity.title,
    description: apiActivity.description,
    type: apiActivity.type,
    status: apiActivity.status,
    priority: apiActivity.priority,
    startTime: apiActivity.startTime ? new Date(apiActivity.startTime) : new Date(),
    endTime: apiActivity.endTime ? new Date(apiActivity.endTime) : new Date(),
    assignedTo: apiActivity.assignedTo,
    assignedBy: apiActivity.assignedBy,
    location: apiActivity.location,
    progress: apiActivity.progress ?? 0,
    estimatedDuration: apiActivity.estimatedDuration ?? 0,
    actualDuration: apiActivity.actualDuration,
    notes: apiActivity.notes,
    attachments: apiActivity.attachments || [],
    dependencies: apiActivity.dependencies || [],
    equipment: apiActivity.equipment || [],
  });

  // Fetch activities on component mount
  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        selectedActivity,
        setSelectedActivity,
        loading,
        error,
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
