import React, { memo } from "react";
import {
  Message,
  TextMessage,
  ImageMessage,
  DocumentMessage,
} from "./MessageTypes";
import TextMessageComponent from "./TextMessageComponent";
import ImageMessageComponent from "./ImageMessageComponent";
import DocumentMessageComponent from "./DocumentMessageComponent";

interface MessageRendererProps {
  message: Message;
  isCurrentUser: boolean;
  onReply?: (message: Message) => void;
  showReplyButton?: boolean;
}

const MessageRenderer: React.FC<MessageRendererProps> = memo(({
  message,
  isCurrentUser,
  onReply,
  showReplyButton = true,
}) => {
  // Render different message types
  switch (message.type) {
    case "text":
      return (
        <TextMessageComponent
          message={message as TextMessage}
          isCurrentUser={isCurrentUser}
          onReply={onReply}
          showReplyButton={showReplyButton}
        />
      );

    case "image":
      return (
        <ImageMessageComponent
          message={message as ImageMessage}
          isCurrentUser={isCurrentUser}
          onReply={onReply}
          showReplyButton={showReplyButton}
        />
      );

    case "document":
      return (
        <DocumentMessageComponent
          message={message as DocumentMessage}
          isCurrentUser={isCurrentUser}
          onReply={onReply}
          showReplyButton={showReplyButton}
        />
      );

    default:
      // Fallback for unsupported message types
      return (
        <TextMessageComponent
          message={{
            ...message,
            type: "text",
            content: `Unsupported message type: ${message.type}`,
          } as TextMessage}
          isCurrentUser={isCurrentUser}
          onReply={onReply}
          showReplyButton={showReplyButton}
        />
      );
  }
});

MessageRenderer.displayName = "MessageRenderer";

export default MessageRenderer;
