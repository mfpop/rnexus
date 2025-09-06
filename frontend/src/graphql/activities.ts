import { gql } from '@apollo/client';

// Fragment for Activity data
export const ACTIVITY_FRAGMENT = gql`
  fragment ActivitiesActivityFragment on ActivityType {
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

// Query to get all activities
export const GET_ALL_ACTIVITIES = gql`
  query GetAllActivities {
    allActivities {
      ...ActivitiesActivityFragment
    }
  }
  ${ACTIVITY_FRAGMENT}
`;

// Query to get activities by status
export const GET_ACTIVITIES_BY_STATUS = gql`
  query GetActivitiesByStatus($status: String!) {
    activitiesByStatus(status: $status) {
      ...ActivitiesActivityFragment
    }
  }
  ${ACTIVITY_FRAGMENT}
`;

// Query to get activities by priority
export const GET_ACTIVITIES_BY_PRIORITY = gql`
  query GetActivitiesByPriority($priority: String!) {
    activitiesByPriority(priority: $priority) {
      ...ActivitiesActivityFragment
    }
  }
  ${ACTIVITY_FRAGMENT}
`;

// Query to get activities by type
export const GET_ACTIVITIES_BY_TYPE = gql`
  query GetActivitiesByType($type: String!) {
    activitiesByType(type: $type) {
      ...ActivitiesActivityFragment
    }
  }
  ${ACTIVITY_FRAGMENT}
`;

// Query to get a single activity
export const GET_ACTIVITY = gql`
  query GetActivity($id: String!) {
    activity(id: $id) {
      ...ActivitiesActivityFragment
    }
  }
  ${ACTIVITY_FRAGMENT}
`;
