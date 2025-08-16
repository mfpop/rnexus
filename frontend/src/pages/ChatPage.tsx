import React from "react";
import { ChatRightCard } from "../components/chat";

/**
 * ChatPage - Chat page that renders inside StableLayout
 * This renders the right card content (chat interface) while StableLayout handles the left card
 */
const ChatPage: React.FC = () => {
  return <ChatRightCard />;
};

export default ChatPage;
