import React, { memo } from "react";

interface ChatLoadingSkeletonProps {
  count?: number;
  className?: string;
}

const ChatLoadingSkeleton: React.FC<ChatLoadingSkeletonProps> = memo(({
  count = 3,
  className = "",
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className="max-w-xs lg:max-w-md">
            {/* Avatar skeleton */}
            <div className={`flex items-end space-x-2 ${index % 2 === 0 ? "" : "flex-row-reverse space-x-reverse"}`}>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>

              {/* Message bubble skeleton */}
              <div className={`px-4 py-2 rounded-lg ${
                index % 2 === 0
                  ? "bg-gray-200 rounded-bl-none"
                  : "bg-blue-200 rounded-br-none"
              }`}>
                <div className="space-y-2">
                  {/* Message content skeleton */}
                  <div className="h-4 bg-gray-300 rounded animate-pulse"
                       style={{ width: `${Math.random() * 60 + 40}%` }}></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse"
                       style={{ width: `${Math.random() * 80 + 20}%` }}></div>
                  {Math.random() > 0.5 && (
                    <div className="h-4 bg-gray-300 rounded animate-pulse"
                         style={{ width: `${Math.random() * 40 + 30}%` }}></div>
                  )}
                </div>

                {/* Timestamp skeleton */}
                <div className="flex justify-end mt-2">
                  <div className="h-3 w-12 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Typing indicator skeleton */}
      <div className="flex justify-start">
        <div className="max-w-xs">
          <div className="flex items-end space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="bg-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatLoadingSkeleton.displayName = "ChatLoadingSkeleton";

export default ChatLoadingSkeleton;
