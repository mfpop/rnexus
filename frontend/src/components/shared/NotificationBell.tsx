import React from "react";
import { Bell } from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";

interface NotificationBellProps {
  onClick: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onClick }) => {
  const { systemMessages } = useNotification();
  const unreadCount = systemMessages.filter((msg) => !msg.isRead).length;

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
