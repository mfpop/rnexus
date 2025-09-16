/**
 * @fileoverview Enhanced GraphQL queries and mutations for Activities (Compatible with existing schema)
 * Provides comprehensive activity management capabilities using existing GraphQL fields
 */

import { gql } from "@apollo/client";

// =====================================================
// Activity Fragments
// =====================================================

// Core activity fragment with essential fields (compatible with existing schema)
export const ACTIVITY_CORE_FRAGMENT = gql`
  fragment ActivityCoreFragment on ActivityType {
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
  }
`;

// Extended activity fragment with relationships (compatible with existing schema)
export const ACTIVITY_EXTENDED_FRAGMENT = gql`
  fragment ActivityExtendedFragment on ActivityType {
    ...ActivityCoreFragment
    createdBy {
      id
      username
      firstName
      lastName
    }
  }
  ${ACTIVITY_CORE_FRAGMENT}
`;

// =====================================================
// Activity Queries (Compatible with existing schema)
// =====================================================

// Get all activities (using existing allActivities field without parameters)
export const GET_ALL_ACTIVITIES = gql`
  query GetAllActivities {
    allActivities {
      ...ActivityExtendedFragment
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// Get single activity by ID
export const GET_ACTIVITY = gql`
  query GetActivity($id: String!) {
    activity(id: $id) {
      ...ActivityExtendedFragment
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// Get activities by status (using existing field structure)
export const GET_ACTIVITIES_BY_STATUS = gql`
  query GetActivitiesByStatus {
    allActivities {
      ...ActivityExtendedFragment
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// Get activities by type
export const GET_ACTIVITIES_BY_TYPE = gql`
  query GetActivitiesByType {
    allActivities {
      ...ActivityExtendedFragment
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// Get activities by priority
export const GET_ACTIVITIES_BY_PRIORITY = gql`
  query GetActivitiesByPriority {
    allActivities {
      ...ActivityExtendedFragment
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// Get activities by assigned user
export const GET_ACTIVITIES_BY_ASSIGNED_TO = gql`
  query GetActivitiesByAssignedTo {
    allActivities {
      ...ActivityExtendedFragment
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// =====================================================
// Activity Mutations
// =====================================================

// Create new activity
export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($input: ActivityInputType!) {
    createActivity(input: $input) {
      activity {
        ...ActivityExtendedFragment
      }
      success
      errors {
        field
        message
      }
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// Update existing activity
export const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($id: String!, $input: ActivityInputType!) {
    updateActivity(id: $id, input: $input) {
      activity {
        ...ActivityExtendedFragment
      }
      success
      errors {
        field
        message
      }
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// Delete activity
export const DELETE_ACTIVITY = gql`
  mutation DeleteActivity($id: String!) {
    deleteActivity(id: $id) {
      success
      errors {
        field
        message
      }
    }
  }
`;

// Update activity status
export const UPDATE_ACTIVITY_STATUS = gql`
  mutation UpdateActivityStatus($id: String!, $status: String!) {
    updateActivityStatus(id: $id, status: $status) {
      activity {
        ...ActivityExtendedFragment
      }
      success
      errors {
        field
        message
      }
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// Update activity progress
export const UPDATE_ACTIVITY_PROGRESS = gql`
  mutation UpdateActivityProgress($id: String!, $progress: Int!) {
    updateActivityProgress(id: $id, progress: $progress) {
      activity {
        ...ActivityExtendedFragment
      }
      success
      errors {
        field
        message
      }
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// =====================================================
// Activity Subscriptions
// =====================================================

// Subscribe to activity updates
export const ACTIVITY_UPDATES_SUBSCRIPTION = gql`
  subscription ActivityUpdates {
    activityUpdates {
      activity {
        ...ActivityExtendedFragment
      }
      action
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// Subscribe to activity status changes
export const ACTIVITY_STATUS_SUBSCRIPTION = gql`
  subscription ActivityStatusUpdates($activityId: String!) {
    activityStatusUpdates(activityId: $activityId) {
      activity {
        ...ActivityExtendedFragment
      }
      previousStatus
      newStatus
    }
  }
  ${ACTIVITY_EXTENDED_FRAGMENT}
`;

// =====================================================
// Activity Statistics Queries
// =====================================================

// Get activity statistics
export const GET_ACTIVITY_STATS = gql`
  query GetActivityStats {
    activityStats {
      totalCount
      statusCounts {
        status
        count
      }
      typeCounts {
        type
        count
      }
      priorityCounts {
        priority
        count
      }
    }
  }
`;

// Get activity summary
export const GET_ACTIVITY_SUMMARY = gql`
  query GetActivitySummary {
    activitySummary {
      totalActivities
      completedActivities
      pendingActivities
      overdueActivities
      averageProgress
      recentActivities {
        ...ActivityCoreFragment
      }
    }
  }
  ${ACTIVITY_CORE_FRAGMENT}
`;

// =====================================================
// Export all queries and mutations
// =====================================================

export default {
  // Fragments
  ACTIVITY_CORE_FRAGMENT,
  ACTIVITY_EXTENDED_FRAGMENT,

  // Queries
  GET_ALL_ACTIVITIES,
  GET_ACTIVITY,
  GET_ACTIVITIES_BY_STATUS,
  GET_ACTIVITIES_BY_TYPE,
  GET_ACTIVITIES_BY_PRIORITY,
  GET_ACTIVITIES_BY_ASSIGNED_TO,
  GET_ACTIVITY_STATS,
  GET_ACTIVITY_SUMMARY,

  // Mutations
  CREATE_ACTIVITY,
  UPDATE_ACTIVITY,
  DELETE_ACTIVITY,
  UPDATE_ACTIVITY_STATUS,
  UPDATE_ACTIVITY_PROGRESS,

  // Subscriptions
  ACTIVITY_UPDATES_SUBSCRIPTION,
  ACTIVITY_STATUS_SUBSCRIPTION,
};
