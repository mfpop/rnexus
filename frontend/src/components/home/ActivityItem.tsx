import React from "react";
import { ActivityItemProps, STATUS_COLORS, PRIORITY_COLORS } from "./types";

/**
 * ActivityItem - Optimized individual activity item component
 * Displays activity with status, priority, and timestamp
 */
const ActivityItem: React.FC<ActivityItemProps> = ({ activity, className = "", onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(activity);
    }
  };

  const statusColor = STATUS_COLORS[activity.status];
  const priorityColor = PRIORITY_COLORS[activity.priority];

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0 text-gray-400 mt-1">
            {activity.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {activity.title}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                {activity.status.charAt(0).toUpperCase() + activity.status.slice(1).replace('-', ' ')}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor}`}>
                {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)} Priority
              </span>
            </div>
            {activity.description && (
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {activity.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          <span className="text-xs text-gray-500">
            {activity.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
