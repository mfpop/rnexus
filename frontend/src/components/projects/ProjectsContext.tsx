import React, { createContext, useContext, useState, ReactNode } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "critical";
  progress: number;
  manager: string;
  team: string[];
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    dueDate: Date;
    completed: boolean;
  }>;
  tasks: Array<{
    id: string;
    name: string;
    assignee: string;
    status: "todo" | "in-progress" | "completed";
    dueDate: Date;
  }>;
}

interface ProjectsContextType {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined,
);

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error(
      "useProjectsContext must be used within a ProjectsProvider",
    );
  }
  return context;
};

interface ProjectsProviderProps {
  children: ReactNode;
}

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({
  children,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <ProjectsContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsContext;
export type { Project };
