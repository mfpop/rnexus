import { useState, useEffect, useCallback, useRef } from "react";
import { Message } from "./MessageTypes";

interface UseChatStateProps {
  selectedContact: any;
}

interface UseChatStateReturn {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  isTyping: boolean;
  setIsTyping: React.Dispatch<React.SetStateAction<boolean>>;
  replyToMessage: Message | null;
  setReplyToMessage: React.Dispatch<React.SetStateAction<Message | null>>;
  selectedMessages: Set<number>;
  setSelectedMessages: React.Dispatch<React.SetStateAction<Set<number>>>;
  isSelectionMode: boolean;
  setIsSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  messageOptionsOpen: number | null;
  setMessageOptionsOpen: React.Dispatch<React.SetStateAction<number | null>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filteredMessages: Message[];
  handleSearch: (query: string) => void;
  handleClearSearch: () => void;
  handleReply: (message: Message) => void;
  handleMessageSelect: (messageId: number) => void;
  clearSelection: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  scrollToBottom: () => void;
}

export const useChatState = ({
  selectedContact,
}: UseChatStateProps): UseChatStateReturn => {
  // Core state
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [messageOptionsOpen, setMessageOptionsOpen] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtered messages based on search
  const filteredMessages = searchQuery.trim()
    ? messages.filter(
        (msg) =>
          msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : messages;

  // Search handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Reply handler
  const handleReply = useCallback((message: Message) => {
    setReplyToMessage(message);
    setMessageOptionsOpen(null);
  }, []);

  // Message selection handlers
  const handleMessageSelect = useCallback((messageId: number) => {
    setSelectedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }

      // Update selection mode based on whether any messages are selected
      setIsSelectionMode(newSet.size > 0);

      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
  }, []);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Clear reply when switching contacts
  useEffect(() => {
    setReplyToMessage(null);
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
    setMessageOptionsOpen(null);
    setSearchQuery("");
  }, [selectedContact]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return {
    messages,
    setMessages,
    message,
    setMessage,
    isTyping,
    setIsTyping,
    replyToMessage,
    setReplyToMessage,
    selectedMessages,
    setSelectedMessages,
    isSelectionMode,
    setIsSelectionMode,
    messageOptionsOpen,
    setMessageOptionsOpen,
    searchQuery,
    setSearchQuery,
    filteredMessages,
    handleSearch,
    handleClearSearch,
    handleReply,
    handleMessageSelect,
    clearSelection,
    messagesEndRef,
    scrollToBottom,
  };
};
