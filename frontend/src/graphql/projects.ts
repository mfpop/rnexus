import { gql } from "@apollo/client";

// Project fragment for reusability
export const PROJECT_FRAGMENT = gql`
  fragment ProjectsProjectFragment on ActivityType {
    id
    title
    description
    type
    status
    priority
    startTime
    endTime
    assignedTo
    assignedBy
    location
    progress
    estimatedDuration
    actualDuration
    notes
    createdAt
    updatedAt
    statusConfig {
      id
      status
      displayName
      colorBg
      colorText
      colorBorder
      description
    }
    priorityConfig {
      id
      priority
      displayName
      colorBg
      colorText
      colorBorder
      description
    }
  }
`;

// Get all projects
export const GET_ALL_PROJECTS = gql`
  ${PROJECT_FRAGMENT}
  query GetAllProjects {
    allProjects {
      ...ProjectsProjectFragment
    }
  }
`;

// Get projects by status
export const GET_PROJECTS_BY_STATUS = gql`
  ${PROJECT_FRAGMENT}
  query GetProjectsByStatus($status: String!) {
    projectsByStatus(status: $status) {
      ...ProjectsProjectFragment
    }
  }
`;

// Get projects by priority
export const GET_PROJECTS_BY_PRIORITY = gql`
  ${PROJECT_FRAGMENT}
  query GetProjectsByPriority($priority: String!) {
    projectsByPriority(priority: $priority) {
      ...ProjectsProjectFragment
    }
  }
`;

// Get single project
export const GET_PROJECT = gql`
  ${PROJECT_FRAGMENT}
  query GetProject($id: String!) {
    project(id: $id) {
      ...ProjectsProjectFragment
    }
  }
`;
