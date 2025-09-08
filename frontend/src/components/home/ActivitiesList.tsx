import React, { useState } from "react";
import ActivityItem from "./ActivityItem";
import { useHomeActivities } from "./hooks";
import { ActivityItem as ActivityItemType } from "./types";
import { Filter, RefreshCw } from "lucide-react";

/**
 * ActivitiesList - Optimized activities section component
 * Displays recent activities with filtering and refresh capabilities
 */
interface ActivitiesListProps {
  className?: string;
  maxItems?: number;
  onActivityClick?: (activity: ActivityItemType) => void;
  showFilters?: boolean;
}

const ActivitiesList: React.FC<ActivitiesListProps> = ({
  className = "",
  maxItems = 6,
  onActivityClick,
  showFilters = true
}) => {
  const allActivities = useHomeActivities();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Apply filters
  const filteredActivities = allActivities.filter(activity => {
    if (statusFilter !== "all" && activity.status !== statusFilter) return false;
    if (priorityFilter !== "all" && activity.priority !== priorityFilter) return false;
    return true;
  }).slice(0, maxItems);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
        <div className="flex items-center space-x-2">
          {showFilters && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          )}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            title="Refresh activities"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              onClick={onActivityClick}
              className="transform hover:scale-102 transition-transform duration-200"
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No activities match the current filters</p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {filteredActivities.length === maxItems && allActivities.length > maxItems && (
        <div className="text-center pt-2">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all {allActivities.length} activities →
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivitiesList;
