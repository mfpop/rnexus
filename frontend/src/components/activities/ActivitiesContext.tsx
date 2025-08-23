import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { activitiesApi } from "../../lib/activitiesApi";

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
  fetchActivities: () => Promise<void>;
  refreshActivities: () => Promise<void>;
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

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await activitiesApi.getActivities();
      if (response.success && response.data && response.data.activities) {
        // Convert the API response to match our Activity interface
        const convertedActivities = response.data.activities.map((apiActivity: any) => ({
          id: apiActivity.id,
          title: apiActivity.title,
          description: apiActivity.description,
          type: apiActivity.type,
          status: apiActivity.status,
          priority: apiActivity.priority,
          startTime: new Date(apiActivity.startTime),
          endTime: new Date(apiActivity.endTime),
          assignedTo: apiActivity.assignedTo,
          assignedBy: apiActivity.assignedBy,
          location: apiActivity.location,
          progress: apiActivity.progress,
          estimatedDuration: apiActivity.estimatedDuration,
          actualDuration: apiActivity.actualDuration,
          notes: apiActivity.notes,
          attachments: apiActivity.attachments || [],
          dependencies: apiActivity.dependencies || [],
          equipment: apiActivity.equipment || [],
        }));
        setActivities(convertedActivities);
      } else {
        setError(response.message || 'Failed to fetch activities');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching activities');
    } finally {
      setLoading(false);
    }
  };

  const refreshActivities = async () => {
    await fetchActivities();
  };

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
