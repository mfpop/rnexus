import React from "react";
import MainContainerTemplate from "../templates/MainContainerTemplate";
import ChatLeftCard from "./ChatLeftCard";
import ChatRightCard from "./ChatRightCard";
import { useChatContext } from "../../contexts/ChatContext";

export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: Date;
  type: "text";
}

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;

interface ChatMainContainerProps {
  expandedCard?: ExpandedCardState;
  onExpandClick?: (side: "left" | "right") => void;
  className?: string;
}

/**
 * ChatMainContainer - Chat page specific main container component
 * Based on MainContainerTemplate with MASTER-DETAIL content relationship
 * Left card: Contact/group selection (master)
 * Right card: Chat window for selected contact (detail)
 */
const ChatMainContainer: React.FC<ChatMainContainerProps> = ({
  expandedCard,
  onExpandClick,
  className = "",
}) => {
  const { selectedContact } = useChatContext();

  // Chat page configuration
  const chatPageConfig = {
    leftTitle: "Team Communication",
    leftSubtitle: "Contacts, groups, and favorites",
    leftFooter: "", // Remove footer to let ChatLeftCard handle its own pagination
    rightTitle: selectedContact ? selectedContact.name : "Chat Window",
    rightSubtitle: selectedContact
      ? selectedContact.isGroup
        ? `${selectedContact.members} members`
        : selectedContact.title
      : "Select a conversation to start messaging",
    rightFooter:
      "Be respectful, clear, and professional in all team communications. Use appropriate language and maintain a positive work environment.",
  };

  return (
    <MainContainerTemplate
      // Use master-detail content relationship for chat page
      contentRelationship="master-detail"
      // Left Card Configuration (Master - Contact List)
      leftTitle={chatPageConfig.leftTitle}
      leftSubtitle={chatPageConfig.leftSubtitle}
      leftFooter={chatPageConfig.leftFooter}
      leftContent={<ChatLeftCard />}
      // Right Card Configuration (Detail - Chat Window)
      rightTitle={chatPageConfig.rightTitle}
      rightSubtitle={chatPageConfig.rightSubtitle}
      rightFooter={chatPageConfig.rightFooter}
      rightContent={<ChatRightCard />}
      // Expansion State
      expandedCard={expandedCard}
      onExpandClick={onExpandClick}
      // Container Styling
      className={className}
      gap="gap-4"
      padding="p-4"
    />
  );
};

export default ChatMainContainer;
