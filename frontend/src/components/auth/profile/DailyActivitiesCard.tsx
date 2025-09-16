import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Plus,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../ui/bits";
import { GET_ALL_ACTIVITIES } from "../../../graphql/activities";

interface DailyActivitiesCardProps {
  position?: string;
  department?: string;
  assignedTo?: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  status: "planned" | "in-progress" | "completed" | "cancelled" | "overdue";
  priority: "low" | "medium" | "high" | "critical";
  startTime: string;
  endTime: string;
  assignedTo: string;
  assignedBy: string;
  location?: string;
  progress: number;
  estimatedDuration: number;
  actualDuration?: number;
  notes?: string;
  statusConfig?: {
    colorBg: string;
    colorText: string;
    colorBorder: string;
  };
  priorityConfig?: {
    colorBg: string;
    colorText: string;
    colorBorder: string;
  };
}

const DailyActivitiesCard: React.FC<DailyActivitiesCardProps> = ({
  position,
  department,
  assignedTo,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"today" | "week">("today");

  const { data, loading, error, refetch } = useQuery(GET_ALL_ACTIVITIES, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Filter activities based on position, department, and assigned user
  const getFilteredActivities = (): Activity[] => {
    if (!data?.allActivities) return [];

    let filtered = data.allActivities.filter((activity: Activity) => {
      // Filter by assigned user if provided
      if (
        assignedTo &&
        !activity.assignedTo.toLowerCase().includes(assignedTo.toLowerCase())
      ) {
        return false;
      }

      // Enhanced filtering by position/department keywords
      if (position || department) {
        const positionKeywords = position
          ? position.toLowerCase().split(/\s+/)
          : [];
        const departmentKeywords = department
          ? department.toLowerCase().split(/\s+/)
          : [];
        const allKeywords = [...positionKeywords, ...departmentKeywords];

        const activityText =
          `${activity.title} ${activity.description} ${activity.type} ${activity.location || ""}`.toLowerCase();

        // Check if any keyword matches
        const hasKeywordMatch = allKeywords.some(
          (keyword) => keyword.length > 2 && activityText.includes(keyword),
        );

        // Also check for common role-related terms
        const roleTerms = [
          "manager",
          "director",
          "supervisor",
          "lead",
          "senior",
          "junior",
          "assistant",
          "coordinator",
          "specialist",
          "analyst",
          "engineer",
          "developer",
          "designer",
        ];
        const hasRoleMatch = roleTerms.some(
          (term) =>
            (position &&
              position.toLowerCase().includes(term) &&
              activityText.includes(term)) ||
            (department &&
              department.toLowerCase().includes(term) &&
              activityText.includes(term)),
        );

        if (allKeywords.length > 0 && !hasKeywordMatch && !hasRoleMatch) {
          return false;
        }
      }

      return true;
    });

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (activity: Activity) => activity.status === filterStatus,
      );
    }

    // Apply priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter(
        (activity: Activity) => activity.priority === filterPriority,
      );
    }

    // Sort by start time
    return filtered.sort(
      (a: Activity, b: Activity) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    );
  };

  const activities = getFilteredActivities();
  const today = new Date();
  const todayActivities = activities.filter((activity: Activity) => {
    const activityDate = new Date(activity.startTime);
    return activityDate.toDateString() === today.toDateString();
  });

  // Get this week's activities for better context
  const thisWeekActivities = activities.filter((activity: Activity) => {
    const activityDate = new Date(activity.startTime);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return activityDate >= weekStart && activityDate <= weekEnd;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "cancelled":
        return <PauseCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          <p>Error loading activities</p>
          <Button
            onClick={() => refetch()}
            className="mt-2"
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Activities & Tasks
            </h3>
            {position && (
              <span className="text-sm text-gray-500">
                for {position}
                {department && ` • ${department}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Filters:
              </span>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Time Range Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex bg-gray-200 rounded-lg p-1">
              <button
                onClick={() => setTimeRange("today")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === "today"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeRange("week")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === "week"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                This Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="p-4">
        {(() => {
          const displayActivities =
            timeRange === "today" ? todayActivities : thisWeekActivities;
          const timeLabel = timeRange === "today" ? "today" : "this week";

          return displayActivities.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No activities {timeLabel}
              </h4>
              <p className="text-gray-500 mb-4">
                {position || department
                  ? `No activities found for ${position || department} ${timeLabel}.`
                  : `No activities scheduled for ${timeLabel}.`}
              </p>
              {position && (
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Activity
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {displayActivities.map((activity: Activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(activity.status)}
                        <h4 className="font-medium text-gray-900">
                          {activity.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(activity.status)}`}
                        >
                          {activity.status.replace("-", " ")}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${getPriorityColor(activity.priority)}`}
                        ></div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {activity.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {timeRange === "week" && (
                              <span className="font-medium">
                                {new Date(
                                  activity.startTime,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}{" "}
                                -
                              </span>
                            )}
                            {formatTime(activity.startTime)} -{" "}
                            {formatTime(activity.endTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            Duration:{" "}
                            {formatDuration(activity.estimatedDuration)}
                          </span>
                        </div>
                        {activity.location && (
                          <div className="flex items-center gap-1">
                            <span>📍 {activity.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span>Type: {activity.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 text-right">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {activity.progress}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${activity.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Summary Stats */}
      {(() => {
        const displayActivities =
          timeRange === "today" ? todayActivities : thisWeekActivities;
        const timeLabel = timeRange === "today" ? "today" : "this week";

        return displayActivities.length > 0 ? (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Summary for {timeLabel}
              </h4>
              <span className="text-xs text-gray-500">
                {displayActivities.length} total activities
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {displayActivities.length}
                </div>
                <div className="text-xs text-gray-500">Total Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {
                    displayActivities.filter(
                      (a: Activity) => a.status === "completed",
                    ).length
                  }
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {
                    displayActivities.filter(
                      (a: Activity) => a.status === "in-progress",
                    ).length
                  }
                </div>
                <div className="text-xs text-gray-500">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {
                    displayActivities.filter(
                      (a: Activity) => a.status === "overdue",
                    ).length
                  }
                </div>
                <div className="text-xs text-gray-500">Overdue</div>
              </div>
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
};

export default DailyActivitiesCard;
