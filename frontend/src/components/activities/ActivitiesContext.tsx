import React, { createContext, useContext, useState, ReactNode } from "react";

interface Activity {
  id: string;
  title: string;
  description: string;
  type: "task" | "meeting" | "maintenance" | "training" | "inspection";
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
  selectedActivity: Activity | null;
  setSelectedActivity: (activity: Activity | null) => void;
}

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(
  undefined,
);

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
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  return (
    <ActivitiesContext.Provider
      value={{ selectedActivity, setSelectedActivity }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export default ActivitiesContext;
export type { Activity };
