import React, { memo } from "react";
import { Check, CheckCheck, Clock, Reply as ReplyIcon } from "lucide-react";
import { TextMessage } from "./MessageTypes";

interface TextMessageComponentProps {
  message: TextMessage;
  isCurrentUser: boolean;
  onReply?: (message: TextMessage) => void;
  showReplyButton?: boolean;
}

const TextMessageComponent: React.FC<TextMessageComponentProps> = memo(({
  message,
  isCurrentUser,
  onReply,
  showReplyButton = true,
}) => {
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

      if (diffInMinutes < 1) return "now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400" />;
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isCurrentUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {/* Reply indicator */}
        {message.replyTo && (
          <div className={`mb-2 p-2 rounded border-l-2 ${
            isCurrentUser ? "border-blue-300 bg-blue-400" : "border-gray-300 bg-gray-100"
          }`}>
            <div className="text-xs opacity-70">
              Replying to {message.replyTo.senderName}
            </div>
            <div className="text-sm truncate">
              {message.replyTo.content}
            </div>
          </div>
        )}

        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">
          {message.content}
        </div>

        {/* Message footer */}
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          isCurrentUser ? "text-blue-100" : "text-gray-500"
        }`}>
          <span className="text-xs">
            {formatTime(message.timestamp)}
          </span>
          {isCurrentUser && getStatusIcon()}
        </div>

        {/* Reply button */}
        {showReplyButton && onReply && (
          <button
            onClick={() => onReply(message)}
            className={`absolute -left-8 top-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
              isCurrentUser ? "hover:bg-blue-600" : "hover:bg-gray-300"
            }`}
          >
            <ReplyIcon className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
});

TextMessageComponent.displayName = "TextMessageComponent";

export default TextMessageComponent;
