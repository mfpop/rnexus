import { gql } from "@apollo/client";

export const GET_SYSTEM_MESSAGES = gql`
  query GetSystemMessages($isRead: Boolean) {
    systemMessages(isRead: $isRead) {
      id
      title
      message
      messageType
      link
      isRead
      createdAt
    }
  }
`;

export const MARK_SYSTEM_MESSAGE_AS_READ = gql`
  mutation MarkSystemMessageAsRead($messageId: ID!) {
    markSystemMessageAsRead(messageId: $messageId) {
      ok
      systemMessage {
        id
        isRead
      }
    }
  }
`;
