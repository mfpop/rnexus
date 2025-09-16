import { gql } from "@apollo/client";

// Fragment for Chat data
export const CHAT_FRAGMENT = gql`
  fragment ChatChatFragment on ChatType {
    id
    chatType
    name
    description
    user1 {
      id
      username
      email
      firstName
      lastName
      avatar
      avatarUrl
    }
    user2 {
      id
      username
      email
      firstName
      lastName
      avatar
      avatarUrl
    }
    members
    latestMessage {
      id
      senderId
      senderName
      content
      messageType
      timestamp
      status
    }
    lastActivity
    isActive
    isArchived
    archivedAt
    createdAt
  }
`;

// Fragment for Message data
export const MESSAGE_FRAGMENT = gql`
  fragment ChatMessageFragment on MessageType {
    id
    chatId
    chatType
    senderId
    senderName
    content
    messageType
    status
    replyTo {
      id
      senderId
      senderName
      content
      messageType
      timestamp
    }
    forwarded
    forwardedFrom
    edited
    editedAt
    fileName
    fileSize
    fileUrl
    thumbnailUrl
    caption
    duration
    waveform
    latitude
    longitude
    locationName
    contactName
    contactPhone
    contactEmail
    timestamp
  }
`;

// Query to get all chats for a user
export const GET_USER_CHATS = gql`
  query GetUserChats($userId: ID) {
    userChats(userId: $userId) {
      ...ChatChatFragment
    }
  }
  ${CHAT_FRAGMENT}
`;

// Query to get all users with avatar information
export const GET_ALL_USERS_WITH_AVATARS = gql`
  query GetAllUsersWithAvatars {
    allUsers {
      id
      username
      email
      firstName
      lastName
      isActive
      avatar
      avatarUrl
      position
      department
    }
  }
`;

// Query to get a specific chat
export const GET_CHAT = gql`
  query GetChat($id: String!) {
    chat(id: $id) {
      ...ChatChatFragment
    }
  }
  ${CHAT_FRAGMENT}
`;

// Query to get messages for a chat
export const GET_MESSAGES = gql`
  query GetMessages($chatId: String!, $chatType: String!) {
    messages(chatId: $chatId, chatType: $chatType) {
      ...ChatMessageFragment
    }
  }
  ${MESSAGE_FRAGMENT}
`;

// Mutation to create a new chat
export const CREATE_CHAT = gql`
  mutation CreateChat(
    $chatType: String!
    $name: String
    $description: String
    $user1Id: ID
    $user2Id: ID
    $memberIds: [ID]
  ) {
    createChat(
      chatType: $chatType
      name: $name
      description: $description
      user1Id: $user1Id
      user2Id: $user2Id
      memberIds: $memberIds
    ) {
      ok
      chat {
        ...ChatChatFragment
      }
      error
    }
  }
  ${CHAT_FRAGMENT}
`;

// Mutation to send a message
export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $chatId: String!
    $chatType: String!
    $senderId: String!
    $senderName: String!
    $content: String
    $messageType: String!
    $fileName: String
    $fileSize: String
    $fileUrl: String
  ) {
    createMessage(
      chatId: $chatId
      chatType: $chatType
      senderId: $senderId
      senderName: $senderName
      content: $content
      messageType: $messageType
      fileName: $fileName
      fileSize: $fileSize
      fileUrl: $fileUrl
    ) {
      ok
      message {
        ...ChatMessageFragment
      }
    }
  }
  ${MESSAGE_FRAGMENT}
`;

// Favorite and Block mutations
export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($favoriteUserId: String!) {
    toggleFavorite(favoriteUserId: $favoriteUserId) {
      success
      message
      isFavorite
    }
  }
`;

export const GET_USER_FAVORITES = gql`
  query GetUserFavorites {
    userFavorites {
      id
      user {
        id
        username
        firstName
        lastName
        avatar
      }
      favoriteUser {
        id
        username
        firstName
        lastName
        avatar
      }
      createdAt
    }
  }
`;

export const CLEAR_ALL_FAVORITES = gql`
  mutation ClearAllFavorites {
    clearAllFavorites {
      success
      message
      clearedCount
    }
  }
`;

export const TOGGLE_BLOCK = gql`
  mutation ToggleBlock($blockedUserId: String!) {
    toggleBlock(blockedUserId: $blockedUserId) {
      success
      message
      isBlocked
    }
  }
`;

export const GET_USER_BLOCKS = gql`
  query GetUserBlocks {
    userBlocks {
      id
      user {
        id
        username
        firstName
        lastName
        avatar
      }
      blockedUser {
        id
        username
        firstName
        lastName
        avatar
      }
      createdAt
    }
  }
`;

// Query to get all chats (groups)
export const GET_ALL_CHATS = gql`
  query GetAllChats {
    allChats {
      id
      chatType
      name
      description
      user1 {
        id
        username
        firstName
        lastName
        avatar
        avatarUrl
      }
      user2 {
        id
        username
        firstName
        lastName
        avatar
        avatarUrl
      }
      members
      latestMessage {
        id
        senderId
        senderName
        content
        messageType
        timestamp
        status
      }
      lastActivity
      isActive
      isArchived
      archivedAt
      createdAt
    }
  }
`;

// Query to get archived chats




// Simple Archive Chat Mutation
export const ARCHIVE_CHAT = gql`
  mutation ArchiveChat($userId: Int!) {
    archiveChat(userId: $userId) {
      success
      message
    }
  }
`;

// Simple Unarchive Chat Mutation
export const UNARCHIVE_CHAT = gql`
  mutation UnarchiveChat($userId: Int!) {
    unarchiveChat(userId: $userId) {
      success
      message
    }
  }
`;
