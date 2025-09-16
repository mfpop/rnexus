// GraphQL Queries and Mutations for News/Update Interactions
// Like, Bookmark, Share, and Comments functionality

import { gql } from "@apollo/client";

// =====================================================
// Fragments
// =====================================================

export const UPDATE_INTERACTION_FRAGMENT = gql`
  fragment UpdateInteractionFragment on UpdateType {
    id
    likes_count
    dislikes_count
    comments_count
    bookmarks_count
    user_like_status
    is_bookmarked
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFragment on UpdateCommentType {
    id
    content
    createdAt
    updatedAt
    can_edit
    can_delete
    author {
      id
      username
      firstName
      lastName
    }
    parentComment {
      id
    }
    replies {
      id
      content
      createdAt
      updatedAt
      can_edit
      can_delete
      author {
        id
        username
        firstName
        lastName
      }
    }
  }
`;

// =====================================================
// Queries
// =====================================================

// Get update with interaction data
export const GET_UPDATE_WITH_INTERACTIONS = gql`
  query GetUpdateWithInteractions($id: String!) {
    update(id: $id) {
      ...UpdateInteractionFragment
    }
  }
  ${UPDATE_INTERACTION_FRAGMENT}
`;

// Get comments for an update
export const GET_UPDATE_COMMENTS = gql`
  query GetUpdateComments($updateId: String!) {
    update_comments(update_id: $updateId) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Get a specific comment
export const GET_COMMENT = gql`
  query GetComment($id: Int!) {
    comment(id: $id) {
      ...CommentFragment
    }
  }
  ${COMMENT_FRAGMENT}
`;

// =====================================================
// Mutations
// =====================================================

// Toggle like/dislike
export const TOGGLE_LIKE = gql`
  mutation ToggleLike($updateId: String!, $isLike: Boolean!) {
    toggle_like(update_id: $updateId, is_like: $isLike) {
      success
      message
      like_status
      likes_count
      dislikes_count
    }
  }
`;

// Toggle bookmark
export const TOGGLE_BOOKMARK = gql`
  mutation ToggleBookmark($updateId: String!) {
    toggle_bookmark(update_id: $updateId) {
      success
      message
      is_bookmarked
      bookmarks_count
    }
  }
`;

// Create comment
export const CREATE_COMMENT = gql`
  mutation CreateComment(
    $updateId: String!
    $content: String!
    $parentCommentId: Int
  ) {
    create_comment(
      update_id: $updateId
      content: $content
      parent_comment_id: $parentCommentId
    ) {
      success
      message
      comment {
        ...CommentFragment
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Update comment
export const UPDATE_COMMENT = gql`
  mutation UpdateComment($commentId: Int!, $content: String!) {
    update_comment(comment_id: $commentId, content: $content) {
      success
      message
      comment {
        ...CommentFragment
      }
    }
  }
  ${COMMENT_FRAGMENT}
`;

// Delete comment
export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: Int!) {
    delete_comment(comment_id: $commentId) {
      success
      message
    }
  }
`;

// =====================================================
// Export all queries and mutations
// =====================================================

export default {
  // Fragments
  UPDATE_INTERACTION_FRAGMENT,
  COMMENT_FRAGMENT,

  // Queries
  GET_UPDATE_WITH_INTERACTIONS,
  GET_UPDATE_COMMENTS,
  GET_COMMENT,

  // Mutations
  TOGGLE_LIKE,
  TOGGLE_BOOKMARK,
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
};
