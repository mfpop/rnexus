import React, { memo } from "react";
import { Download, Check, CheckCheck, Clock, Reply as ReplyIcon } from "lucide-react";
import { DocumentMessage } from "./MessageTypes";

interface DocumentMessageComponentProps {
  message: DocumentMessage;
  isCurrentUser: boolean;
  onReply?: (message: DocumentMessage) => void;
  showReplyButton?: boolean;
}

const DocumentMessageComponent: React.FC<DocumentMessageComponentProps> = memo(({
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return '📄';
    if (type.includes('doc') || type.includes('word')) return '📝';
    if (type.includes('xls') || type.includes('excel')) return '📊';
    if (type.includes('ppt') || type.includes('powerpoint')) return '📽️';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    if (type.includes('txt')) return '📄';
    return '📄';
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = message.documentUrl;
    link.download = message.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2 group relative`}>
      <div
        className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
          isCurrentUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
      >
        {/* Reply indicator */}
        {message.replyTo && (
          <div className={`mb-3 p-2 rounded border-l-2 ${
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

        {/* Document preview */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="text-2xl">
            {getFileIcon(message.fileType)}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-medium text-sm truncate ${
              isCurrentUser ? "text-white" : "text-gray-900"
            }`}>
              {message.fileName}
            </div>
            <div className={`text-xs ${
              isCurrentUser ? "text-blue-100" : "text-gray-500"
            }`}>
              {formatFileSize(message.fileSize)} • {message.fileType.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            isCurrentUser
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
          }`}
        >
          <Download className="h-4 w-4" />
          <span className="text-sm font-medium">Download</span>
        </button>

        {/* Message footer */}
        <div className={`flex items-center justify-end mt-3 space-x-1 ${
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

DocumentMessageComponent.displayName = "DocumentMessageComponent";

export default DocumentMessageComponent;
