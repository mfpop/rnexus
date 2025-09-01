import React from "react";
import MainContainerTemplate from "../templates/MainContainerTemplate";
import ChatLeftCard from "./ChatLeftCard";
import ChatRightCard from "./ChatRightCard";
import { useChatContext } from "../../contexts/ChatContext";
import PaginationFooterWrapper from "../shared/PaginationFooterWrapper";

export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  timestamp: string; // GraphQL returns ISO string timestamps
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
    leftFooter: <PaginationFooterWrapper />, // Use shared pagination footer
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
      // Use independent content relationship since we're providing custom content for both cards
      contentRelationship="independent"
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
      // Container Styling - Improved spacing and layout
      className={`${className} chat-interface-container`}
      gap="gap-6"
      padding="p-6"
      // Chat-specific grid proportions (left card smaller, right card larger)
      gridProportions="1fr 3fr"
    />
  );
};

export default ChatMainContainer;
