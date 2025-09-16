import React, { memo, useState } from "react";
import { Download, Eye, Check, CheckCheck, Clock, Reply as ReplyIcon } from "lucide-react";
import { ImageMessage } from "./MessageTypes";

interface ImageMessageComponentProps {
  message: ImageMessage;
  isCurrentUser: boolean;
  onReply?: (message: ImageMessage) => void;
  showReplyButton?: boolean;
}

const ImageMessageComponent: React.FC<ImageMessageComponentProps> = memo(({
  message,
  isCurrentUser,
  onReply,
  showReplyButton = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = message.imageUrl;
    link.download = message.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-2 group relative`}>
      <div
        className={`max-w-xs lg:max-w-md rounded-lg overflow-hidden ${
          isCurrentUser ? "rounded-br-none" : "rounded-bl-none"
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

        {/* Image container */}
        <div className="relative">
          {!imageError ? (
            <img
              src={message.thumbnailUrl || message.imageUrl}
              alt={message.fileName}
              className={`w-full h-auto max-h-64 object-cover cursor-pointer ${
                !imageLoaded ? "blur-sm" : ""
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              onClick={() => {
                // Open full size image in new tab
                window.open(message.imageUrl, '_blank');
              }}
            />
          ) : (
            <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Eye className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Failed to load image</p>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-500">Loading...</div>
            </div>
          )}

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
            title="Download image"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* Caption */}
        {message.caption && (
          <div className={`px-4 py-2 ${
            isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
          }`}>
            <div className="whitespace-pre-wrap break-words text-sm">
              {message.caption}
            </div>
          </div>
        )}

        {/* Message footer */}
        <div className={`flex items-center justify-between px-4 py-2 ${
          isCurrentUser ? "bg-blue-500 text-blue-100" : "bg-gray-200 text-gray-500"
        }`}>
          <div className="flex items-center space-x-2">
            <span className="text-xs">
              {formatTime(message.timestamp)}
            </span>
            {message.fileSize && (
              <span className="text-xs">
                {formatFileSize(message.fileSize)}
              </span>
            )}
          </div>
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

ImageMessageComponent.displayName = "ImageMessageComponent";

export default ImageMessageComponent;
