import { useState, useCallback, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  GET_USER_CHATS,
  GET_CHAT,
  GET_MESSAGES,
  CREATE_CHAT,
  SEND_MESSAGE,
} from '../graphql/chatQueries';
import { Chat, Message } from '../components/chat/MessageTypes';

interface UseChatGraphQLReturn {
  // State
  chats: Chat[];
  messages: Message[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadUserChats: (userId?: string) => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
  loadMessages: (chatId: string, chatType: string) => Promise<void>;
  createChat: (chatData: CreateChatInput) => Promise<Chat | null>;
  sendMessage: (messageData: SendMessageInput) => Promise<Message | null>;
  clearError: () => void;
}

interface CreateChatInput {
  chatType: 'user' | 'group';
  name?: string;
  description?: string;
  user1Id?: string;
  user2Id?: string;
  memberIds?: string[];
}

interface SendMessageInput {
  chatId: string;
  chatType: string;
  senderId: string;
  senderName: string;
  content?: string;
  messageType: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
}

export const useChatGraphQL = (): UseChatGraphQLReturn => {
  // Local state
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [error, setError] = useState<string | null>(null);

  // GraphQL queries and mutations
  const [loadUserChatsQuery, { loading: chatsLoading, data: chatsData, error: chatsError }] = useLazyQuery(GET_USER_CHATS);

  const [loadChatQuery, { loading: chatLoading, data: chatData, error: chatError }] = useLazyQuery(GET_CHAT);

  const [loadMessagesQuery, { loading: messagesLoading, data: messagesData, error: messagesError }] = useLazyQuery(GET_MESSAGES);

  const [createChatMutation, { loading: createChatLoading, data: createChatData, error: createChatError }] = useMutation(CREATE_CHAT);

  const [sendMessageMutation, { loading: sendMessageLoading, data: sendMessageData, error: sendMessageError }] = useMutation(SEND_MESSAGE);

  // Handle user chats data changes
  useEffect(() => {
    if (chatsData?.userChats) {
      setChats(chatsData.userChats);
    }
  }, [chatsData]);

  // Handle user chats errors
  useEffect(() => {
    if (chatsError) {
      console.error('Error loading user chats:', chatsError);
      setError(chatsError.message);
    }
  }, [chatsError]);

  // Handle chat data changes
  useEffect(() => {
    if (chatData?.chat) {
      setCurrentChat(chatData.chat);
    }
  }, [chatData]);

  // Handle chat errors
  useEffect(() => {
    if (chatError) {
      console.error('Error loading chat:', chatError);
      setError(chatError.message);
    }
  }, [chatError]);

  // Handle messages data changes
  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData]);

  // Handle messages errors
  useEffect(() => {
    if (messagesError) {
      console.error('Error loading messages:', messagesError);
      setError(messagesError.message);
    }
  }, [messagesError]);

  // Handle create chat data changes
  useEffect(() => {
    if (createChatData?.createChat?.ok && createChatData?.createChat?.chat) {
      setChats((prev) => [createChatData.createChat.chat, ...prev]);
      setCurrentChat(createChatData.createChat.chat);
    } else if (createChatData?.createChat?.error) {
      setError(createChatData.createChat.error);
    }
  }, [createChatData]);

  // Handle create chat errors
  useEffect(() => {
    if (createChatError) {
      console.error('Error creating chat:', createChatError);
      setError(createChatError.message);
    }
  }, [createChatError]);

  // Handle send message data changes
  useEffect(() => {
    if (sendMessageData?.createMessage?.ok && sendMessageData?.createMessage?.message) {
      setMessages((prev) => [...prev, sendMessageData.createMessage.message]);

      // Update chat's last message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === sendMessageData.createMessage.message.chatId
            ? { ...chat, lastMessage: sendMessageData.createMessage.message, lastActivity: new Date().toISOString() }
            : chat
        )
      );
    }
  }, [sendMessageData]);

  // Handle send message errors
  useEffect(() => {
    if (sendMessageError) {
      console.error('Error sending message:', sendMessageError);
      setError(sendMessageError.message);
    }
  }, [sendMessageError]);

  // Combined loading state
  const loading = chatsLoading || chatLoading || messagesLoading || createChatLoading || sendMessageLoading;

  // Action functions
  const loadUserChats = useCallback(async (userId?: string) => {
    try {
      setError(null);
      await loadUserChatsQuery({
        variables: { userId },
      });
    } catch (err) {
      console.error('Error in loadUserChats:', err);
    }
  }, [loadUserChatsQuery]);

  const loadChat = useCallback(async (chatId: string) => {
    try {
      setError(null);
      await loadChatQuery({
        variables: { id: chatId },
      });
    } catch (err) {
      console.error('Error in loadChat:', err);
    }
  }, [loadChatQuery]);

  const loadMessages = useCallback(async (chatId: string, chatType: string) => {
    try {
      setError(null);
      await loadMessagesQuery({
        variables: { chatId, chatType },
      });
    } catch (err) {
      console.error('Error in loadMessages:', err);
    }
  }, [loadMessagesQuery]);

  const createChat = useCallback(async (chatData: CreateChatInput): Promise<Chat | null> => {
    try {
      setError(null);
      const result = await createChatMutation({
        variables: chatData,
      });

      if (result.data?.createChat?.ok && result.data?.createChat?.chat) {
        return result.data.createChat.chat;
      }

      return null;
    } catch (err) {
      console.error('Error in createChat:', err);
      return null;
    }
  }, [createChatMutation]);

  const sendMessage = useCallback(async (messageData: SendMessageInput): Promise<Message | null> => {
    try {
      setError(null);
      const result = await sendMessageMutation({
        variables: messageData,
      });

      if (result.data?.createMessage?.ok && result.data?.createMessage?.message) {
        return result.data.createMessage.message;
      }

      return null;
    } catch (err) {
      console.error('Error in sendMessage:', err);
      return null;
    }
  }, [sendMessageMutation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    chats,
    messages,
    currentChat,
    loading,
    error,

    // Actions
    loadUserChats,
    loadChat,
    loadMessages,
    createChat,
    sendMessage,
    clearError,
  };
};
