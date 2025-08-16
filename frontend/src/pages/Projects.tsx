import React from "react";
import { ProjectsRightCard, useProjectsContext } from "../components/projects";

/**
 * ProjectsPage - Projects page right-side content for StableLayout integration
 * This component renders only the right-side content as StableLayout handles the overall structure
 * Left-side content is handled by ProjectsLeftCard in StableLayout
 * Uses ProjectsContext to communicate with the left card
 */
const Projects: React.FC = () => {
  const { selectedProject } = useProjectsContext();
  return <ProjectsRightCard selectedProject={selectedProject} />;
};

export default Projects;
