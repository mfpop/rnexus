import React, { createContext, useContext, useState, ReactNode } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_PROJECTS } from "../../graphql/projects";

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
  projects: Project[];
  loading: boolean;
  error: any;
  refetchProjects: () => void;
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

  // Use GraphQL query for projects
  const { data, loading, error, refetch } = useQuery(GET_ALL_PROJECTS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Convert GraphQL data to our Project interface
  const convertGraphQLProject = (gqlProject: any): Project => ({
    id: gqlProject.id,
    name: gqlProject.title,
    description: gqlProject.description,
    status: gqlProject.status as Project["status"],
    priority: gqlProject.priority as Project["priority"],
    progress: gqlProject.progress,
    manager: gqlProject.assignedBy || "Unknown Manager",
    team: gqlProject.assignedTo ? [gqlProject.assignedTo] : [],
    startDate: new Date(gqlProject.startTime),
    endDate: new Date(gqlProject.endTime),
    budget: 50000, // Default budget - would need to be added to backend model
    spent: Math.floor(Math.random() * 40000), // Mock data for now
    milestones: [], // Would need to be added to backend model
    tasks: [], // Would need to be added to backend model
  });

  const projects = data?.allProjects
    ? data.allProjects.map(convertGraphQLProject)
    : [];

  const refetchProjects = () => {
    refetch();
  };

  return (
    <ProjectsContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        projects,
        loading,
        error,
        refetchProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsContext;
export type { Project };
