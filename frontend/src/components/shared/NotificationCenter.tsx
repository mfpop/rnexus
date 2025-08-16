import React from "react";
import { X } from "lucide-react";
import {
  useNotification,
  SystemMessage,
} from "../../contexts/NotificationContext";

interface NotificationCenterProps {
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { systemMessages, markSystemMessageAsRead } = useNotification();

  const getMessageTypeStyles = (type: SystemMessage["messageType"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-lg flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {systemMessages.length === 0 ? (
            <p className="text-gray-500 text-center mt-8">
              No notifications yet.
            </p>
          ) : (
            systemMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg border ${getMessageTypeStyles(msg.messageType)} ${msg.isRead ? "opacity-60" : ""}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm">
                    {msg.title || "System Message"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm mt-1">{msg.message}</p>
                <div className="flex justify-end mt-2 space-x-2">
                  {msg.link && (
                    <a
                      href={msg.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                      onClick={async () => {
                        await markSystemMessageAsRead(msg.id);
                        onClose();
                      }}
                    >
                      View
                    </a>
                  )}
                  {!msg.isRead && (
                    <button
                      onClick={() => markSystemMessageAsRead(msg.id)}
                      className="text-gray-600 hover:underline text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
