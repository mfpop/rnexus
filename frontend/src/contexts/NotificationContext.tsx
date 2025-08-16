import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { NotificationType } from "../components/ui/Notification";
import {
  useSystemMessages,
  useMarkSystemMessageAsRead,
} from "../lib/systemMessageApi";
import useSystemMessageWebSocket from "../lib/systemMessageWebsocket";
import { ApolloClient, useApolloClient } from "@apollo/client";
import { GET_SYSTEM_MESSAGES } from "../graphql/systemMessages";

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface SystemMessage {
  id: string;
  title?: string;
  message: string;
  messageType: "info" | "warning" | "error" | "success";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: NotificationData[];
  systemMessages: SystemMessage[];
  showNotification: (notification: Omit<NotificationData, "id">) => void;
  showSuccess: (
    title: string,
    message: string,
    action?: NotificationData["action"],
  ) => void;
  showError: (
    title: string,
    message: string,
    action?: NotificationData["action"],
  ) => void;
  showWarning: (
    title: string,
    message: string,
    action?: NotificationData["action"],
  ) => void;
  showInfo: (
    title: string,
    message: string,
    action?: NotificationData["action"],
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  markSystemMessageAsRead: (messageId: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const client = useApolloClient(); // Get Apollo Client instance
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const { systemMessages, refetchSystemMessages } = useSystemMessages(); // systemMessages is now directly from hook
  const { markSystemMessageAsRead: markSystemMessageAsReadMutation } =
    useMarkSystemMessageAsRead();

  const showNotification = useCallback(
    (notification: Omit<NotificationData, "id">) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification: NotificationData = { ...notification, id };

      setNotifications((prev) => [...prev, newNotification]);
    },
    [],
  );

  // Memoize the WebSocket message handler to prevent recreation on every render
  const handleWebSocketMessage = useCallback(
    (newMessage: SystemMessage) => {
      // Update Apollo cache directly for new messages
      client.cache.updateQuery(
        { query: GET_SYSTEM_MESSAGES, variables: { isRead: false } }, // Query for unread messages
        (data) => {
          if (data) {
            return {
              ...data,
              systemMessages: [
                newMessage,
                ...data.systemMessages.filter(
                  (msg: SystemMessage) => msg.id !== newMessage.id,
                ),
              ],
            };
          }
          return data;
        },
      );
      client.cache.updateQuery(
        { query: GET_SYSTEM_MESSAGES, variables: { isRead: true } }, // Query for read messages
        (data) => {
          if (data) {
            return {
              ...data,
              systemMessages: data.systemMessages.filter(
                (msg: SystemMessage) => msg.id !== newMessage.id,
              ),
            };
          }
          return data;
        },
      );
      client.cache.updateQuery(
        { query: GET_SYSTEM_MESSAGES }, // Query for all messages
        (data) => {
          if (data) {
            return {
              ...data,
              systemMessages: [
                newMessage,
                ...data.systemMessages.filter(
                  (msg: SystemMessage) => msg.id !== newMessage.id,
                ),
              ],
            };
          }
          return data;
        },
      );

      // Also show a temporary toast for new system messages
      showNotification({
        type: newMessage.messageType,
        title: newMessage.title || "New System Message",
        message: newMessage.message,
        duration: 5000, // Show for 5 seconds
        action: newMessage.link
          ? {
              label: "View",
              onClick: () => window.open(newMessage.link, "_blank"),
            }
          : undefined,
      });
    },
    [showNotification, client],
  );

  // WebSocket for real-time system messages
  useSystemMessageWebSocket(
    handleWebSocketMessage,
    undefined, // onOpen
    undefined, // onClose
    (event) => {
      // Log WebSocket errors but keep them minimal in development
      console.warn("System Message WebSocket Error:", event);
    }
  );

  const showSuccess = useCallback(
    (title: string, message: string, action?: NotificationData["action"]) => {
      showNotification({ type: "success", title, message, action });
    },
    [showNotification],
  );

  const showError = useCallback(
    (title: string, message: string, action?: NotificationData["action"]) => {
      showNotification({ type: "error", title, message, action });
    },
    [showNotification],
  );

  const showWarning = useCallback(
    (title: string, message: string, action?: NotificationData["action"]) => {
      showNotification({ type: "warning", title, message, action });
    },
    [showNotification],
  );

  const showInfo = useCallback(
    (title: string, message: string, action?: NotificationData["action"]) => {
      showNotification({ type: "info", title, message, action });
    },
    [showNotification],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const markSystemMessageAsRead = useCallback(
    async (messageId: string) => {
      const success = await markSystemMessageAsReadMutation(messageId);
      // Apollo cache update in useMarkSystemMessageAsRead handles re-render
      return success;
    },
    [markSystemMessageAsReadMutation],
  );

  const value: NotificationContextType = {
    notifications,
    systemMessages: systemMessages || [], // Ensure it's always an array
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll,
    markSystemMessageAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render temporary notifications (toasts) */}
      {notifications.map((notification) => (
        <div key={notification.id}>
          {/* Import and render Notification component here */}
          {/* For now, we'll use a simple div as placeholder */}
          <div className="fixed top-4 right-4 z-50 w-80 bg-white border rounded-lg shadow-lg p-3">
            <div className="flex items-start gap-2.5">
              <div className="flex-1">
                <h4 className="text-xs font-semibold mb-1 text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {notification.message}
                </p>
                {notification.action && (
                  <button
                    onClick={notification.action.onClick}
                    className="mt-1.5 text-xs font-medium text-blue-600 underline hover:no-underline"
                  >
                    {notification.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ))}
    </NotificationContext.Provider>
  );
};
