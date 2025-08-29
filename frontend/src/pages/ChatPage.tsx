import React from "react";
import ChatMainContainer from "../components/chat/ChatMainContainer";

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;

interface ChatPageProps {
  expandedCard?: ExpandedCardState;
  onExpandClick?: (side: "left" | "right") => void;
}

/**
 * ChatPage - Chat page that renders inside StableLayout
 * This renders the complete chat interface with both left and right cards
 * using ChatMainContainer for proper layout coordination
 */
const ChatPage: React.FC<ChatPageProps> = ({ expandedCard, onExpandClick }) => {
  return (
    <ChatMainContainer
      expandedCard={expandedCard}
      onExpandClick={onExpandClick}
    />
  );
};

export default ChatPage;
