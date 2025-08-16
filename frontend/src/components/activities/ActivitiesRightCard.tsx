import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Users,
  FileText,
  MessageSquare,
  Edit,
  Share2,
  Download,
  Settings,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Tag,
  Paperclip,
  Plus,
  Send,
  Star,
} from "lucide-react";
import { Activity } from "./ActivitiesContext";
import { SimpleProgress } from "../ui/bits/SimpleProgress";

interface ActivitiesRightCardProps {
  selectedActivity: Activity | null;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  avatar: string;
}

/**
 * ActivitiesRightCard - Activities page specific right card content component
 * Detail component - contains the activity details and management for the selected activity
 * Related to the activity selection in the left card (master-detail relationship)
 * Comprehensive activity management interface
 */
const ActivitiesRightCard: React.FC<ActivitiesRightCardProps> = ({
  selectedActivity,
}) => {
  const [activeSection, setActiveSection] = useState<
    "details" | "participants" | "notes" | "attachments"
  >("details");
  const [newComment, setNewComment] = useState("");
  const [comments] = useState<Comment[]>([
    {
      id: "c1",
      author: "Sarah Johnson",
      content:
        "Equipment inspection completed. Minor oil leak detected and repaired.",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      avatar: "SJ",
    },
    {
      id: "c2",
      author: "Tom Anderson",
      content:
        "Calibration process is taking longer than expected due to sensor sensitivity issues.",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      avatar: "TA",
    },
  ]);

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return "Not specified";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (date: Date | undefined) => {
    if (!date) return "Not specified";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (
    startTime: Date | undefined,
    endTime: Date | undefined,
  ) => {
    if (!startTime || !endTime) return "Duration not specified";
    const diffInMinutes = Math.floor(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60),
    );
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in-progress":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <Calendar className="h-6 w-6 text-blue-500" />;
      case "in-progress":
        return <Play className="h-6 w-6 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-6 w-6 text-purple-500" />;
      case "cancelled":
        return <AlertTriangle className="h-6 w-6 text-gray-500" />;
      case "overdue":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Here you would typically submit the comment to your backend

    setNewComment("");
  };

  const formatTimeAgo = (date: Date | undefined) => {
    if (!date) return "Unknown";
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!selectedActivity) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Select an Activity
          </h2>
          <p className="text-gray-600">
            Choose an activity from the left to view its details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(selectedActivity.status)}
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedActivity.title}
              </h1>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedActivity.status)}`}
              >
                {selectedActivity.status.charAt(0).toUpperCase() +
                  selectedActivity.status.slice(1)}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedActivity.priority)}`}
              >
                {selectedActivity.priority.charAt(0).toUpperCase() +
                  selectedActivity.priority.slice(1)}{" "}
                Priority
              </span>
            </div>

            <p className="text-gray-600 mb-4">{selectedActivity.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(selectedActivity.startTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  Duration:{" "}
                  {formatDuration(
                    selectedActivity.startTime,
                    selectedActivity.endTime,
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span>Assigned to: {selectedActivity.assignedTo}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{selectedActivity.location}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 ml-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Progress for in-progress activities */}
        {selectedActivity.status === "in-progress" && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-900 font-medium">
                Activity Progress
              </span>
              <span className="text-green-700 text-lg font-semibold">
                {selectedActivity.progress}%
              </span>
            </div>
            <SimpleProgress
              value={selectedActivity.progress}
              variant="success"
              size="lg"
              className="bg-green-200"
              indicatorClassName="bg-gradient-to-r from-green-500 to-green-600"
            />
            <div className="flex items-center justify-between mt-2 text-sm text-green-700">
              <span>Started {formatTime(selectedActivity.startTime)}</span>
              <span>
                Expected completion: {formatTime(selectedActivity.endTime)}
              </span>
            </div>
          </div>
        )}

        {/* Type and Tags */}
        <div className="mt-4 flex items-center gap-3">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(selectedActivity.type)}`}
          >
            {selectedActivity.type.charAt(0).toUpperCase() +
              selectedActivity.type.slice(1)}
          </span>
          {selectedActivity.equipment &&
            selectedActivity.equipment.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex gap-1">
                  {selectedActivity.equipment.slice(0, 4).map((equipment) => (
                    <span
                      key={equipment}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                    >
                      {equipment}
                    </span>
                  ))}
                  {selectedActivity.equipment.length > 4 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                      +{selectedActivity.equipment.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            {
              key: "details",
              label: "Details",
              icon: <FileText className="h-4 w-4" />,
            },
            {
              key: "participants",
              label: "Participants",
              icon: <Users className="h-4 w-4" />,
            },
            {
              key: "notes",
              label: "Notes",
              icon: <MessageSquare className="h-4 w-4" />,
            },
            {
              key: "attachments",
              label: "Files",
              icon: <Paperclip className="h-4 w-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeSection === tab.key
                  ? "text-blue-600 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-800 border-transparent"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.key === "participants" && (
                <span className="px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                  {selectedActivity.assignedTo ? 1 : 0}
                </span>
              )}
              {tab.key === "attachments" && (
                <span className="px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                  {selectedActivity.attachments?.length || 0}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeSection === "details" && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Activity Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Type</div>
                  <div className="font-medium text-gray-900 capitalize">
                    {selectedActivity.type}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Department</div>
                  <div className="font-medium text-gray-900">
                    {selectedActivity.department}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Assigned By</div>
                  <div className="font-medium text-gray-900">
                    {selectedActivity.assignedBy}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Start Time</div>
                  <div className="font-medium text-gray-900">
                    {formatDateTime(selectedActivity.startTime)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">End Time</div>
                  <div className="font-medium text-gray-900">
                    {formatDateTime(selectedActivity.endTime)}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Start Time</div>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(selectedActivity.startTime)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">End Time</div>
                    <div className="text-sm text-gray-600">
                      {formatDateTime(selectedActivity.endTime)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Duration</div>
                    <div className="text-sm text-gray-600">
                      {selectedActivity.estimatedDuration} minutes estimated
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "participants" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Assigned Personnel (1)
              </h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Participant</span>
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {selectedActivity.assignedTo
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {selectedActivity.assignedTo}
                    </div>
                    <div className="text-sm text-gray-600">
                      Primary Assignee
                    </div>
                  </div>
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                    {selectedActivity.assignedBy
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {selectedActivity.assignedBy}
                    </div>
                    <div className="text-sm text-gray-600">Assigned By</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "notes" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Activity Notes & Comments
            </h3>

            {/* Existing Notes */}
            {selectedActivity.notes && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Activity Notes
                </h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{selectedActivity.notes}</p>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Comments ({comments.length})
              </h4>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    MH
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Add a comment..."
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-4 w-4" />
                        <span>Post Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {comment.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.author}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "attachments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Attachments ({selectedActivity.attachments?.length || 0})
              </h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add File</span>
              </button>
            </div>

            {selectedActivity.attachments &&
            selectedActivity.attachments.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200">
                {selectedActivity.attachments.map((attachment, index) => (
                  <div
                    key={attachment.id}
                    className={`p-4 ${index < selectedActivity.attachments.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {attachment.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            Type: {attachment.type}
                          </div>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Paperclip className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No attachments yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Files will appear here when added
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Scheduled: {formatTimeAgo(selectedActivity.startTime)}
          </div>
          <div className="flex items-center gap-2">
            {selectedActivity.status === "planned" && (
              <button className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors">
                <Play className="h-4 w-4" />
                <span>Start</span>
              </button>
            )}
            {selectedActivity.status === "in-progress" && (
              <>
                <button className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors">
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors">
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete</span>
                </button>
              </>
            )}
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesRightCard;
