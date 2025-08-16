import React, { useState } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  Play,
  CheckCircle,
  AlertCircle,
  Pause,
} from "lucide-react";
import { SimpleProgress } from "../ui/bits/SimpleProgress";
import { useActivitiesContext, Activity } from "./ActivitiesContext";

/**
 * ActivitiesLeftCardSimple - Simple activities list for StableLayout integration
 */
const ActivitiesLeftCardSimple: React.FC = () => {
  const { selectedActivity, setSelectedActivity } = useActivitiesContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "today" | "upcoming" | "overdue"
  >("all");

  const activities: Activity[] = [
    {
      id: "act-001",
      title: "Weekly Production Review Meeting",
      description:
        "Weekly review of production performance and planning for next week",
      type: "meeting",
      status: "planned",
      priority: "high",
      startTime: new Date(Date.now() + 3600000),
      endTime: new Date(Date.now() + 3600000 + 1800000), // 30 minutes
      assignedTo: "Sarah Johnson",
      assignedBy: "Production Manager",
      location: "Conference Room A",
      progress: 0,
      estimatedDuration: 30,
      notes: "Review KPIs and discuss improvement initiatives",
    },
    {
      id: "act-002",
      title: "Equipment Maintenance - Line A",
      description: "Scheduled maintenance for Assembly Line A equipment",
      type: "maintenance",
      status: "in-progress",
      priority: "medium",
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() + 3600000), // 2 hours total
      assignedTo: "Tom Anderson",
      assignedBy: "Maintenance Supervisor",
      location: "Production Floor - Line A",
      progress: 65,
      estimatedDuration: 120,
      actualDuration: 90,
      equipment: ["Conveyor Belt", "Pneumatic Systems"],
      notes: "Replacing worn parts and calibrating sensors",
    },
    {
      id: "act-003",
      title: "Quality Inspection - Batch #789",
      description: "Quality control inspection for production batch #789",
      type: "inspection",
      status: "completed",
      priority: "high",
      startTime: new Date(Date.now() - 14400000),
      endTime: new Date(Date.now() - 12600000), // 30 minutes
      assignedTo: "Alice Chen",
      assignedBy: "QC Manager",
      location: "Quality Lab",
      progress: 100,
      estimatedDuration: 30,
      actualDuration: 30,
      notes: "All tests passed - batch approved for shipment",
    },
    {
      id: "act-004",
      title: "Safety Training - New Employees",
      description: "Comprehensive safety training for newly hired employees",
      type: "training",
      status: "planned",
      priority: "high",
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 86400000 + 7200000), // 2 hours
      assignedTo: "Jennifer Liu",
      assignedBy: "HR Manager",
      location: "Training Room B",
      progress: 0,
      estimatedDuration: 120,
      notes:
        "Covers equipment safety, emergency procedures, and company policies",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "task":
        return "bg-blue-100 text-blue-800";
      case "meeting":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-orange-100 text-orange-800";
      case "training":
        return "bg-purple-100 text-purple-800";
      case "inspection":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <Calendar className="h-4 w-4" />;
      case "in-progress":
        return <Play className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      case "overdue":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isUpcoming = (date: Date) => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 86400000);
    const nextWeek = new Date(now.getTime() + 86400000 * 7);
    return date > tomorrow && date <= nextWeek;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "today" && isToday(activity.startTime)) ||
      (activeTab === "upcoming" && isUpcoming(activity.startTime)) ||
      (activeTab === "overdue" && activity.status === "overdue");

    return matchesSearch && matchesTab;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            placeholder="Search activities..."
          />
        </div>
      </div>

      {/* Time-based Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "today", label: "Today" },
          { key: "upcoming", label: "Upcoming" },
          { key: "overdue", label: "Overdue" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-800 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            onClick={() => setSelectedActivity(activity)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
              selectedActivity?.id === activity.id
                ? "bg-blue-50 border-blue-200"
                : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {activity.title}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(activity.type)}`}
              >
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(activity.status)}
                  <span>
                    {activity.status.charAt(0).toUpperCase() +
                      activity.status.slice(1)}
                  </span>
                </div>
              </span>
            </div>

            <div className="space-y-1 text-sm mb-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Assigned to:</span>
                <span className="font-medium">{activity.assignedTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span>{formatTime(activity.startTime)}</span>
              </div>
            </div>

            {activity.status === "in-progress" && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{activity.progress}%</span>
                </div>
                <SimpleProgress
                  value={activity.progress}
                  variant="success"
                  size="sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitiesLeftCardSimple;
