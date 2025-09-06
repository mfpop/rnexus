import React, { useState } from "react";
import {
  Calendar,
  User,
  DollarSign,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Play,
  Pause,
  Edit,
  Share2,
  Download,
  Plus,
} from "lucide-react";
import { Project } from "./ProjectsContext";
import { SimpleProgress } from "../ui/bits/SimpleProgress";
import { Button } from "../ui/bits/Button";
import { SimpleSelect } from "../ui/bits/SimpleSelect";

interface ProjectsRightCardProps {
  selectedProject: Project | null;
}

/**
 * ProjectsRightCard - Projects page specific right card content component
 * Detail component - contains the project dashboard and management for the selected project
 * Related to the project selection in the left card (master-detail relationship)
 * Comprehensive project management interface
 */
const ProjectsRightCard: React.FC<ProjectsRightCardProps> = ({
  selectedProject,
}) => {
  const [activeSection, setActiveSection] = useState<
    "overview" | "milestones" | "team" | "risks" | "budget"
  >("overview");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not specified";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "planning":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-6 w-6 text-green-500" />;
      case "planning":
        return <Calendar className="h-6 w-6 text-blue-500" />;
      case "on-hold":
        return <Pause className="h-6 w-6 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="h-6 w-6 text-purple-500" />;
      case "cancelled":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
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

  const calculateBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage > 90) return { status: "critical", color: "text-red-600" };
    if (percentage > 75) return { status: "warning", color: "text-yellow-600" };
    return { status: "good", color: "text-green-600" };
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color?: string;
    trend?: number;
  }> = ({ title, value, icon, color = "blue", trend }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-600 text-sm">{title}</div>
        <div className={`text-${color}-500`}>{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <div className="text-xl font-semibold text-gray-900">{value}</div>
        {trend !== undefined && (
          <div
            className={`flex items-center text-sm ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {trend >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  if (!selectedProject) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-1/4 -left-16 w-32 h-32 bg-pink-100 rounded-full opacity-30 animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-1/4 -right-12 w-24 h-24 bg-blue-100 rounded-full opacity-25 animate-ping" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-10 left-1/4 w-16 h-16 bg-indigo-100 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-orange-100 rounded-full opacity-30 animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-teal-100 rounded-full opacity-25 animate-ping" style={{ animationDuration: '3s', animationDelay: '1.5s' }}></div>
        </div>

        <div className="text-center max-w-md relative z-10">
          {/* Large Icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Target className="h-16 w-16 text-purple-600 animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pink-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
          </div>

          {/* Main Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Select a Project
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Choose a project from the left to view its dashboard
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Track Progress</h3>
              <p className="text-xs text-gray-600">Monitor milestones</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Team Management</h3>
              <p className="text-xs text-gray-600">Coordinate team members</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Budget Tracking</h3>
              <p className="text-xs text-gray-600">Monitor expenses</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Risk Management</h3>
              <p className="text-xs text-gray-600">Identify & mitigate risks</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
            Strategic • Organized • Results-Driven
          </div>
        </div>
      </div>
    );
  }

  const budgetStatus = calculateBudgetStatus(
    selectedProject.spent,
    selectedProject.budget,
  );
  const daysRemaining = Math.ceil(
    (selectedProject.endDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(selectedProject.status)}
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedProject.name}
              </h1>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedProject.status)}`}
              >
                {selectedProject.status.charAt(0).toUpperCase() +
                  selectedProject.status.slice(1)}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedProject.priority)}`}
              >
                {selectedProject.priority.charAt(0).toUpperCase() +
                  selectedProject.priority.slice(1)}{" "}
                Priority
              </span>
            </div>

            <p className="text-gray-600 mb-4">{selectedProject.description}</p>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Manager: {selectedProject.manager}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(selectedProject.startDate)} -{" "}
                  {formatDate(selectedProject.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{selectedProject.team.length} team members</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 ml-4">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Edit</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Share</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Settings</span>
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-900 font-medium">Project Progress</span>
            <span className="text-blue-700 text-lg font-semibold">
              {selectedProject.progress}%
            </span>
          </div>
          <SimpleProgress
            value={selectedProject.progress}
            variant="default"
            size="lg"
            className="bg-blue-200"
            indicatorClassName="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <div className="flex items-center justify-between mt-2 text-sm text-blue-700">
            <span>Started {formatDate(selectedProject.startDate)}</span>
            <span>
              {daysRemaining > 0
                ? `${daysRemaining} days remaining`
                : "Overdue"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {[
            {
              key: "overview",
              label: "Overview",
              icon: <Target className="h-4 w-4" />,
            },
            {
              key: "milestones",
              label: "Milestones",
              icon: <CheckCircle className="h-4 w-4" />,
            },
            { key: "team", label: "Team", icon: <Users className="h-4 w-4" /> },
            {
              key: "risks",
              label: "Risks",
              icon: <AlertTriangle className="h-4 w-4" />,
            },
            {
              key: "budget",
              label: "Budget",
              icon: <DollarSign className="h-4 w-4" />,
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
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {activeSection === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Progress"
                value={`${selectedProject.progress}%`}
                icon={<TrendingUp className="h-5 w-5" />}
                color="blue"
                trend={2.5}
              />
              <StatCard
                title="Budget Used"
                value={`${Math.round((selectedProject.spent / selectedProject.budget) * 100)}%`}
                icon={<DollarSign className="h-5 w-5" />}
                color="green"
              />
              <StatCard
                title="Days Remaining"
                value={daysRemaining > 0 ? daysRemaining.toString() : "Overdue"}
                icon={<Clock className="h-5 w-5" />}
                color={daysRemaining > 0 ? "blue" : "red"}
              />
              <StatCard
                title="Team Size"
                value={selectedProject.team.length.toString()}
                icon={<Users className="h-5 w-5" />}
                color="purple"
              />
            </div>

            {/* Project Tags */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Team
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.team.map((member) => (
                  <span
                    key={member}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>

            {/* Category and Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Priority</div>
                  <div className="font-medium text-gray-900 capitalize">
                    {selectedProject.priority}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Progress</div>
                  <div className="font-medium text-gray-900">
                    {selectedProject.progress}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "milestones" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Project Milestones
              </h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Milestone
              </Button>
            </div>
            {selectedProject.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {milestone.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                      <h4 className="font-semibold text-gray-900">
                        {milestone.name}
                      </h4>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {milestone.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      Due: {formatDate(milestone.dueDate)}
                      {milestone.completed && (
                        <span className="ml-4 text-green-600">Completed</span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      milestone.completed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {milestone.completed ? "Completed" : "In Progress"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "team" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Project Team
              </h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Member
              </Button>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Project Manager
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                      {selectedProject.manager
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="font-medium text-gray-900">
                      {selectedProject.manager}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Team Members ({selectedProject.team.length})
                  </div>
                  <div className="space-y-2">
                    {selectedProject.team.map((member) => (
                      <div key={member} className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs">
                          {member
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-gray-700">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "risks" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Project Tasks
              </h3>
              <div className="flex items-center gap-2">
                <SimpleSelect className="w-32">
                  <option value="all">All Tasks</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </SimpleSelect>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </div>
            </div>
            {selectedProject.tasks.length > 0 ? (
              selectedProject.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {task.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Assigned to: {task.assignee}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          Due: {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                <p className="text-gray-500">
                  No tasks defined for this project
                </p>
              </div>
            )}
          </div>
        )}

        {activeSection === "budget" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Budget Analysis
            </h3>

            {/* Budget Overview */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedProject.budget)}
                  </div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(selectedProject.spent)}
                  </div>
                  <div className="text-sm text-gray-600">Amount Spent</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${budgetStatus.color}`}>
                    {formatCurrency(
                      selectedProject.budget - selectedProject.spent,
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Budget Utilization</span>
                  <span>
                    {Math.round(
                      (selectedProject.spent / selectedProject.budget) * 100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 w-[var(--budget-width)] ${
                      budgetStatus.status === "critical"
                        ? "bg-red-500"
                        : budgetStatus.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={
                      {
                        "--budget-width": `${(selectedProject.spent / selectedProject.budget) * 100}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Controls */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Status:{" "}
            {selectedProject.status.charAt(0).toUpperCase() +
              selectedProject.status.slice(1)}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              Comments
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-1" />
              Reports
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsRightCard;
