import { gql } from "@apollo/client";

// Fragment for Update data
export const UPDATE_FRAGMENT = gql`
  fragment UpdatesUpdateFragment on UpdateType {
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
    isActive
    priority
    expiresAt
    createdAt
    updatedAt
    createdBy {
      id
      username
      firstName
      lastName
    }
  }
`;

// Query to get all updates
export const GET_ALL_UPDATES = gql`
  query GetAllUpdates {
    allUpdates {
      ...UpdatesUpdateFragment
    }
  }
  ${UPDATE_FRAGMENT}
`;

// Query to get news updates specifically
export const GET_NEWS_UPDATES = gql`
  query GetNewsUpdates {
    newsUpdates {
      ...UpdatesUpdateFragment
    }
  }
  ${UPDATE_FRAGMENT}
`;

// Query to get updates by type
export const GET_UPDATES_BY_TYPE = gql`
  query GetUpdatesByType($type: String!) {
    updatesByType(type: $type) {
      ...UpdatesUpdateFragment
    }
  }
  ${UPDATE_FRAGMENT}
`;

// Query to get updates by status
export const GET_UPDATES_BY_STATUS = gql`
  query GetUpdatesByStatus($status: String!) {
    updatesByStatus(status: $status) {
      ...UpdatesUpdateFragment
    }
  }
  ${UPDATE_FRAGMENT}
`;

// Query to get a single update
export const GET_UPDATE = gql`
  query GetUpdate($id: String!) {
    update(id: $id) {
      ...UpdatesUpdateFragment
    }
  }
  ${UPDATE_FRAGMENT}
`;
