import React, { useState } from "react";
import {
  Calendar,
  Users,
  MessageSquare,
  Download,
  Settings,
  CheckCircle,
  Play,
  Pause,
  Paperclip,
  Plus,
  Send,
  Star,
  Link,
  X,
} from "lucide-react";
import { Activity, useActivitiesContext } from "./ActivitiesContext";
import { activitiesApi } from "../../lib/activitiesApi";


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

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
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
  const { selectedActivity: contextActivity, setSelectedActivity } = useActivitiesContext();
  const [activeSection, setActiveSection] = useState<
    "participants" | "tasks" | "equipment" | "dependencies" | "notes" | "attachments" | "history"
  >("participants");
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
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

  // Use the activity from context if available, otherwise use the prop
  const currentActivity = contextActivity || selectedActivity;

  // Toast notification functions
  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type, message };
    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Activity action handlers
  const handleStartActivity = async (activityId: string) => {
    if (!currentActivity) return;

    setIsLoading(true);
    try {
      const response = await activitiesApi.startActivity(activityId);
      if (response.success && response.data) {
        // Update the context with the updated activity
        setSelectedActivity(response.data);
        addToast('success', 'Activity started successfully!');
        console.log('Activity started successfully:', response.data);
      } else {
        addToast('error', `Failed to start activity: ${response.message || 'Unknown error'}`);
        console.error('Failed to start activity:', response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addToast('error', `Error starting activity: ${errorMessage}`);
      console.error('Error starting activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePauseActivity = async (activityId: string) => {
    if (!currentActivity) return;

    setIsLoading(true);
    try {
      const response = await activitiesApi.pauseActivity(activityId);
      if (response.success && response.data) {
        // Update the context with the updated activity
        setSelectedActivity(response.data);
        addToast('success', 'Activity paused successfully!');
        console.log('Activity paused successfully:', response.data);
      } else {
        addToast('error', `Failed to pause activity: ${response.message || 'Unknown error'}`);
        console.error('Failed to pause activity:', response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addToast('error', `Error pausing activity: ${errorMessage}`);
      console.error('Error pausing activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteActivity = async (activityId: string) => {
    if (!currentActivity) return;

    setIsLoading(true);
    try {
      const response = await activitiesApi.completeActivity(activityId);
      if (response.success && response.data) {
        // Update the context with the updated activity
        setSelectedActivity(response.data);
        addToast('success', 'Activity completed successfully!');
        console.log('Activity completed successfully:', response.data);
        setShowCompleteConfirm(false); // Close confirmation dialog
      } else {
        addToast('error', `Failed to complete activity: ${response.message || 'Unknown error'}`);
        console.error('Failed to complete activity:', response.message);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addToast('error', `Error completing activity: ${errorMessage}`);
      console.error('Error completing activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteClick = () => {
    setShowCompleteConfirm(true);
  };

  const handleCompleteConfirm = () => {
    if (currentActivity) {
      handleCompleteActivity(currentActivity.id);
    }
  };

  const handleExportActivity = async () => {
    if (!currentActivity) return;

    setIsLoading(true);
    try {
      // Create a comprehensive activity report
      const reportData = {
        title: currentActivity.title,
        description: currentActivity.description,
        type: currentActivity.type,
        status: currentActivity.status,
        priority: currentActivity.priority,
        startTime: currentActivity.startTime,
        endTime: currentActivity.endTime,
        assignedTo: currentActivity.assignedTo,
        assignedBy: currentActivity.assignedBy,
        location: currentActivity.location,
        progress: currentActivity.progress,
        estimatedDuration: currentActivity.estimatedDuration,
        actualDuration: currentActivity.actualDuration,
        notes: currentActivity.notes,
        equipment: currentActivity.equipment,
        dependencies: currentActivity.dependencies,
        exportDate: new Date().toISOString(),
      };

      // Convert to JSON and create downloadable file
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      // Create download link
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activity-${currentActivity.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);

      addToast('success', 'Activity exported successfully!');
      console.log('Activity exported successfully');
    } catch (error) {
      addToast('error', 'Error exporting activity. Please try again.');
      console.error('Error exporting activity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date: Date | undefined) => {
    if (!date) return "Not specified";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (!currentActivity) {
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-100 rounded-lg border border-gray-200">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentActivity.title}
              </h1>

              {/* Activity Status Indicator */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                  currentActivity.status === 'completed'
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : currentActivity.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : currentActivity.status === 'planned'
                    ? 'bg-gray-100 text-gray-800 border-gray-200'
                    : currentActivity.status === 'cancelled'
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {currentActivity.status.charAt(0).toUpperCase() + currentActivity.status.slice(1).replace('-', ' ')}
                </span>
              </div>

              {/* Activity Action Buttons - moved to same line */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => handleStartActivity(currentActivity.id)}
                  disabled={currentActivity.status === 'completed' || currentActivity.status === 'in-progress' || isLoading}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border flex items-center gap-2 ${
                    currentActivity.status === 'completed' || currentActivity.status === 'in-progress' || isLoading
                      ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                      : currentActivity.status === 'planned'
                      ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                      : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                  }`}
                  title={
                    currentActivity.status === 'completed'
                      ? 'Activity already completed'
                      : currentActivity.status === 'in-progress'
                      ? 'Activity already in progress'
                      : 'Start this activity'
                  }
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Start
                </button>
                <button
                  onClick={() => handlePauseActivity(currentActivity.id)}
                  disabled={currentActivity.status !== 'in-progress' || isLoading}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border flex items-center gap-2 ${
                    currentActivity.status !== 'in-progress' || isLoading
                      ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                      : 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200'
                  }`}
                  title={
                    currentActivity.status !== 'in-progress'
                      ? 'Can only pause activities in progress'
                      : 'Pause this activity'
                  }
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Pause className="h-4 w-4" />
                  )}
                  Pause
                </button>
                <button
                  onClick={handleCompleteClick}
                  disabled={currentActivity.status === 'completed' || isLoading}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border flex items-center gap-2 ${
                    currentActivity.status === 'completed' || isLoading
                      ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200'
                  }`}
                  title={
                    currentActivity.status === 'completed'
                      ? 'Activity already completed'
                      : 'Mark this activity as completed'
                  }
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  Complete
                </button>
                <button
                  onClick={() => handleExportActivity()}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border flex items-center gap-2 ${
                    isLoading
                      ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                  }`}
                  title="Export activity data as JSON file"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Export
                </button>
              </div>
            </div>

            {/* Side by Side Cards with 60/40 proportion */}
            <div className="grid grid-cols-5 gap-16 mb-4">
              {/* Activity Overview Card - 60% width (3/5 columns) - LEFT SIDE */}
              <div className="col-span-3 h-full">
                {/* Card Content */}
                <div className="h-full flex flex-col justify-between">
                  {/* Description */}
                  <div>
                    <p className="text-base text-gray-600 leading-relaxed mb-4">
                      {currentActivity.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                        {currentActivity.type}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                        {currentActivity.status}
                      </span>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200">
                        {currentActivity.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Details Card - 40% width (2/5 columns) - RIGHT SIDE */}
              <div className="col-span-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                {/* Card Content - Two columns: left (scheduled, priority, status) and right (start, end, duration) */}
                                  <div className="grid grid-cols-2 gap-x-16">
                  {/* Left Column */}
                  <div className="space-y-2">
                    {/* Scheduled */}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-medium">Scheduled:</span>
                      <span className="text-sm text-gray-900">
                        {formatTimeAgo(currentActivity.startTime)}
                      </span>
                    </div>

                    {/* Priority */}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-medium">Priority:</span>
                      <span className="text-sm text-gray-900 capitalize">
                        {currentActivity.priority}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-medium">Status:</span>
                      <span className="text-sm text-gray-900 capitalize">
                        {currentActivity.status}
                      </span>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    {/* Start Date */}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-medium">Start:</span>
                      <span className="text-sm text-gray-900">
                        {formatDateTime(currentActivity.startTime)}
                      </span>
                    </div>

                    {/* Due Date */}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-medium">Due:</span>
                      <span className="text-sm text-gray-900">
                        {formatDateTime(currentActivity.endTime)}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 font-medium">Duration:</span>
                      <span className="text-sm text-gray-900">
                        {currentActivity.actualDuration ? `${currentActivity.actualDuration} min` : `${currentActivity.estimatedDuration} min`}
                      </span>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Navigation Tabs with Progress Bar */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <div className="flex">
            {[
              {
                key: "participants",
                label: "Participants",
                icon: <Users className="h-4 w-4" />,
              },

              {
                key: "tasks",
                label: "Tasks & Milestones",
                icon: <CheckCircle className="h-4 w-4" />,
              },
              {
                key: "equipment",
                label: "Equipment",
                icon: <Settings className="h-4 w-4" />,
              },
              {
                key: "dependencies",
                label: "Dependencies",
                icon: <Link className="h-4 w-4" />,
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
              {
                key: "history",
                label: "History",
                icon: <Calendar className="h-4 w-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveSection(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeSection === tab.key
                    ? "text-gray-800 border-gray-800 bg-gray-50"
                    : "text-gray-600 hover:text-gray-800 border-transparent"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.key === "participants" && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                    {currentActivity.assignedTo ? 1 : 0}
                  </span>
                )}
                {tab.key === "attachments" && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                    {currentActivity.attachments?.length || 0}
                  </span>
                )}
                {tab.key === "notes" && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 rounded-full">
                    {currentActivity.notes ? 1 : 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 px-4 py-2">
            <span className="text-sm text-gray-600 font-medium">Progress:</span>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentActivity.status === 'completed' ? 'bg-green-500' :
                  currentActivity.status === 'in-progress' ? 'bg-blue-500' :
                  currentActivity.status === 'planned' ? 'bg-gray-300' : 'bg-yellow-500'
                }`}
                style={{ width: `${currentActivity.status === 'completed' ? 100 :
                               currentActivity.status === 'in-progress' ? 65 :
                               currentActivity.status === 'planned' ? 0 : 25}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {currentActivity.status === 'completed' ? '100%' :
               currentActivity.status === 'in-progress' ? '65%' :
               currentActivity.status === 'planned' ? '0%' : '25%'}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto p-6 bg-gray-50" style={{ maxHeight: '60vh' }}>
        {activeSection === "participants" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Assigned Personnel (1)
              </h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add Participant</span>
              </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium">
                    {currentActivity.assignedTo
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {currentActivity.assignedTo}
                    </div>
                    <div className="text-sm text-gray-600">
                      Primary Assignee
                    </div>
                  </div>
                  <Star className="h-5 w-5 text-gray-500 fill-current" />
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium">
                    {currentActivity.assignedBy
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {currentActivity.assignedBy}
                    </div>
                    <div className="text-sm text-gray-600">Assigned By</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {activeSection === "tasks" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Tasks & Milestones
            </h3>

            {/* Sub-tasks and Milestones */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Sub-tasks</h4>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* This would typically come from a related tasks table */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Review Documentation</div>
                      <div className="text-sm text-gray-600">Review and approve related documents</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">In Progress</span>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Equipment Setup</div>
                      <div className="text-sm text-gray-600">Prepare and configure required equipment</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">Planned</span>
                      <span className="text-sm text-gray-600">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-4">Key Milestones</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Planning Complete</div>
                    <div className="text-sm text-gray-600">Initial planning and scheduling completed</div>
                  </div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Execution Phase</div>
                    <div className="text-sm text-gray-600">Main activity execution in progress</div>
                  </div>
                  <div className="text-sm text-gray-500">Current</div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Review & Approval</div>
                    <div className="text-sm text-gray-600">Final review and stakeholder approval</div>
                  </div>
                  <div className="text-sm text-gray-500">Pending</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "equipment" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Equipment & Resources
            </h3>

            {/* Equipment List */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Required Equipment</h4>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Equipment</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentActivity.equipment && currentActivity.equipment.length > 0 ? (
                  currentActivity.equipment.map((equipment, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{equipment}</div>
                          <div className="text-sm text-gray-600">Equipment required for this activity</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Available</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
                    No equipment specified for this activity
                  </div>
                )}
              </div>
            </div>

            {/* Resource Allocation */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-4">Resource Allocation</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Human Resources</div>
                  <div className="font-medium text-gray-900">
                    {currentActivity.assignedTo ? '1 person assigned' : 'No one assigned'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Equipment Resources</div>
                  <div className="font-medium text-gray-900">
                    {currentActivity.equipment ? currentActivity.equipment.length : 0} items
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Time Allocation</div>
                  <div className="font-medium text-gray-900">
                    {currentActivity.estimatedDuration} minutes
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Location</div>
                  <div className="font-medium text-gray-900">
                    {currentActivity.location || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "dependencies" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Dependencies & Relationships
            </h3>

            {/* Activity Dependencies */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Prerequisites</h4>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Dependency</span>
                </button>
              </div>

              <div className="space-y-3">
                {currentActivity.dependencies && currentActivity.dependencies.length > 0 ? (
                  currentActivity.dependencies.map((dependency, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{dependency}</div>
                          <div className="text-sm text-gray-600">Must be completed before this activity</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Completed</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
                    No dependencies specified for this activity
                  </div>
                )}
              </div>
            </div>

            {/* Impact Analysis */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-4">Impact Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Blocking Activities</div>
                  <div className="font-medium text-gray-900">
                    {currentActivity.dependencies ? currentActivity.dependencies.length : 0} activities
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Dependent Activities</div>
                  <div className="font-medium text-gray-900">
                    {/* This would come from a reverse lookup in the database */}
                    '0 activities'
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Critical Path</div>
                  <div className="font-medium text-gray-900">
                    {currentActivity.dependencies && currentActivity.dependencies.length > 0 ? 'Yes' : 'No'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Risk Level</div>
                  <div className="font-medium text-gray-900">
                    {currentActivity.dependencies && currentActivity.dependencies.length > 0 ? 'Medium' : 'Low'}
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
            {currentActivity.notes && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Activity Notes
                </h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{currentActivity.notes}</p>
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
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    MH
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none"
                      placeholder="Add a comment..."
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isLoading}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.author}
                          </span>
                                                   <span className="text-sm text-gray-500">
                           {comment.timestamp.toString()}
                         </span>
                        </div>
                                                 <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "attachments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Files & Attachments
              </h3>
              <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Upload File</span>
              </button>
            </div>

            {currentActivity.attachments && currentActivity.attachments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentActivity.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Paperclip className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {attachment.name}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {attachment.type}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Download
                      </button>
                      <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <Paperclip className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No files uploaded yet
                </h4>
                <p className="text-sm text-gray-400 mb-4">
                  Files will appear here when added
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === "history" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Activity History
            </h3>

            {/* Status Changes */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-4">Status Changes</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Created</div>
                    <div className="text-sm text-gray-600">Activity was created and assigned</div>
                  </div>
                  <div className="text-sm text-gray-500">Initial</div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Scheduled</div>
                    <div className="text-sm text-gray-600">Activity was scheduled for execution</div>
                  </div>
                  <div className="text-sm text-gray-500">Planned</div>
                </div>

                {currentActivity.status === 'in-progress' && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Started</div>
                      <div className="text-sm text-gray-600">Activity execution began</div>
                    </div>
                    <div className="text-sm text-gray-500">In Progress</div>
                  </div>
                )}

                {currentActivity.status === 'completed' && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Completed</div>
                      <div className="text-sm text-gray-600">Activity was successfully completed</div>
                    </div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Efficiency</div>
                  <div className="font-medium text-gray-900">
                    {currentActivity.actualDuration && currentActivity.estimatedDuration
                      ? Math.round((currentActivity.estimatedDuration / currentActivity.actualDuration) * 100)
                      : 'N/A'}%
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">On Time</div>
                  <div className="font-medium text-gray-900">
                    {currentActivity.status === 'completed' ? 'Yes' : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-lg shadow-lg max-w-md transform transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-green-500 text-white border border-green-600'
                : toast.type === 'error'
                ? 'bg-red-500 text-white border border-red-600'
                : 'bg-blue-500 text-white border border-blue-600'
            }`}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog for Complete Action */}
      {showCompleteConfirm && currentActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Activity Completion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to mark this activity as completed? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Complete Activity'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesRightCard;
