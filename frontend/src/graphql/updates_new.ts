// GraphQL Queries for News/Updates (Compatible with existing schema)
// This file contains backward-compatible queries using existing GraphQL fields

import { gql } from "@apollo/client";

// =====================================================
// Update Fragments (Compatible with existing schema)
// =====================================================

// Core update fragment with essential fields (compatible with existing schema)
export const UPDATE_CORE_FRAGMENT = gql`
  fragment UpdateCoreFragment on UpdateType {
    id
    type
    title
    summary
    body
    timestamp
    status
    tags
    author
    icon
    priority
    isActive
    createdAt
    updatedAt
    expiresAt
  }
`;

// Extended update fragment with relationships (compatible with existing schema)
export const UPDATE_EXTENDED_FRAGMENT = gql`
  fragment UpdateExtendedNewFragment on UpdateType {
    ...UpdateCoreFragment
    createdBy {
      id
      username
      firstName
      lastName
      avatar
      avatarUrl
    }
    likesCount
    dislikesCount
    commentsCount
    bookmarksCount
    userLikeStatus
    isBookmarked
  }
  ${UPDATE_CORE_FRAGMENT}
`;

// =====================================================
// Update Queries (Compatible with existing schema)
// =====================================================

// Get all updates (using existing allUpdates field without parameters)
export const GET_ALL_UPDATES = gql`
  query GetAllUpdates {
    allUpdates {
      ...UpdateExtendedNewFragment
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// Get single update by ID
export const GET_UPDATE = gql`
  query GetUpdate($id: String!) {
    update(id: $id) {
      ...UpdateExtendedNewFragment
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// Get updates by status (using existing field structure)
export const GET_UPDATES_BY_STATUS = gql`
  query GetUpdatesByStatus {
    allUpdates {
      ...UpdateExtendedNewFragment
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// Get updates by type
export const GET_UPDATES_BY_TYPE = gql`
  query GetUpdatesByType {
    allUpdates {
      ...UpdateExtendedNewFragment
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// Get active updates only
export const GET_ACTIVE_UPDATES = gql`
  query GetActiveUpdates {
    allUpdates {
      ...UpdateExtendedNewFragment
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// =====================================================
// Update Mutations
// =====================================================

// Create new update
export const CREATE_UPDATE = gql`
  mutation CreateUpdate($input: UpdateInputType!) {
    createUpdate(input: $input) {
      update {
        ...UpdateExtendedNewFragment
      }
      success
      errors {
        field
        message
      }
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// Update existing update
export const UPDATE_UPDATE = gql`
  mutation UpdateUpdate($id: String!, $input: UpdateInputType!) {
    updateUpdate(id: $id, input: $input) {
      update {
        ...UpdateExtendedNewFragment
      }
      success
      errors {
        field
        message
      }
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// Delete update
export const DELETE_UPDATE = gql`
  mutation DeleteUpdate($id: String!) {
    deleteUpdate(id: $id) {
      success
      errors {
        field
        message
      }
    }
  }
`;

// Update status
export const UPDATE_STATUS = gql`
  mutation UpdateStatus($id: String!, $status: String!) {
    updateStatus(id: $id, status: $status) {
      update {
        ...UpdateExtendedNewFragment
      }
      success
      errors {
        field
        message
      }
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// =====================================================
// Update Subscriptions
// =====================================================

// Subscribe to update changes
export const UPDATE_UPDATES_SUBSCRIPTION = gql`
  subscription UpdateUpdates {
    updateUpdates {
      update {
        ...UpdateExtendedNewFragment
      }
      action
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// Subscribe to update status changes
export const UPDATE_STATUS_SUBSCRIPTION = gql`
  subscription UpdateStatusUpdates($updateId: String!) {
    updateStatusUpdates(updateId: $updateId) {
      update {
        ...UpdateExtendedNewFragment
      }
      previousStatus
      newStatus
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// =====================================================
// Update Statistics Queries
// =====================================================

// Get update statistics
export const GET_UPDATE_STATS = gql`
  query GetUpdateStats {
    updateStats {
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

// Get update summary
export const GET_UPDATE_SUMMARY = gql`
  query GetUpdateSummary {
    updateSummary {
      totalUpdates
      activeUpdates
      expiredUpdates
      recentUpdates {
        ...UpdateCoreFragment
      }
    }
  }
  ${UPDATE_CORE_FRAGMENT}
`;

// =====================================================
// Legacy Queries (for backward compatibility)
// =====================================================

// Original news updates query
export const GET_NEWS_UPDATES = gql`
  query GetNewsUpdates {
    allUpdates {
      ...UpdateExtendedNewFragment
    }
  }
  ${UPDATE_EXTENDED_FRAGMENT}
`;

// =====================================================
// Export all queries and mutations
// =====================================================

export default {
  // Fragments
  UPDATE_CORE_FRAGMENT,
  UPDATE_EXTENDED_FRAGMENT,

  // Queries
  GET_ALL_UPDATES,
  GET_UPDATE,
  GET_UPDATES_BY_STATUS,
  GET_UPDATES_BY_TYPE,
  GET_ACTIVE_UPDATES,
  GET_UPDATE_STATS,
  GET_UPDATE_SUMMARY,
  GET_NEWS_UPDATES,

  // Mutations
  CREATE_UPDATE,
  UPDATE_UPDATE,
  DELETE_UPDATE,
  UPDATE_STATUS,

  // Subscriptions
  UPDATE_UPDATES_SUBSCRIPTION,
  UPDATE_STATUS_SUBSCRIPTION,
};
