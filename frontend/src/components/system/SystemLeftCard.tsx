import React from "react";
import {
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Activity,
  Database,
  Users,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Zap,
  Clock,
  ChevronRight,
} from "lucide-react";
import { useSystemContext } from "./SystemContext";

const SystemLeftCard: React.FC = () => {
  const { selectedSection, setSelectedSection } = useSystemContext();

  const handleSectionClick = (sectionId: string) => {
    setSelectedSection(sectionId);
  };

  const systemSections = [
    {
      id: "overview",
      title: "System Overview",
      icon: <Monitor className="h-5 w-5" />,
      description: "General system health and status",
      status: "healthy",
    },
    {
      id: "performance",
      title: "Performance Metrics",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "CPU, memory, and application performance",
      status: "healthy",
    },
    {
      id: "database",
      title: "Database Status",
      icon: <Database className="h-5 w-5" />,
      description: "Database connections and query performance",
      status: "healthy",
    },
    {
      id: "network",
      title: "Network & Connectivity",
      icon: <Wifi className="h-5 w-5" />,
      description: "Network latency and API response times",
      status: "warning",
    },
    {
      id: "storage",
      title: "Storage & Disk Usage",
      icon: <HardDrive className="h-5 w-5" />,
      description: "Disk space and file system health",
      status: "healthy",
    },
    {
      id: "users",
      title: "Active Users",
      icon: <Users className="h-5 w-5" />,
      description: "Current user sessions and activity",
      status: "healthy",
    },
    {
      id: "errors",
      title: "Error Monitoring",
      icon: <AlertTriangle className="h-5 w-5" />,
      description: "Application errors and exception tracking",
      status: "warning",
    },
    {
      id: "analytics",
      title: "Usage Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Application usage patterns and statistics",
      status: "healthy",
    },
    {
      id: "processes",
      title: "Background Processes",
      icon: <Cpu className="h-5 w-5" />,
      description: "Running processes and scheduled tasks",
      status: "healthy",
    },
    {
      id: "alerts",
      title: "System Alerts",
      icon: <Zap className="h-5 w-5" />,
      description: "Critical alerts and notifications",
      status: "critical",
    },
  ];

  // status color helper was unused; kept status dot generator only

  const getStatusDot = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4 p-4 h-full overflow-hidden flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Monitor className="h-6 w-6 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-800">System Monitor</h1>
        </div>
        <p className="text-sm text-gray-600">
          Real-time application performance and system health monitoring
        </p>
      </div>

      <div className="space-y-3 flex-1 overflow-auto">
        {systemSections.map((section) => (
          <div
            key={section.id}
            className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all ${
              selectedSection === section.id
                ? "ring-2 ring-orange-500 bg-orange-50"
                : ""
            }`}
            onClick={() => handleSectionClick(section.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    selectedSection === section.id
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {section.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`font-semibold ${
                        selectedSection === section.id
                          ? "text-orange-700"
                          : "text-gray-800"
                      }`}
                    >
                      {section.title}
                    </h3>
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusDot(section.status)}`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{section.description}</p>
                </div>
              </div>
              <ChevronRight
                className={`h-4 w-4 ${
                  selectedSection === section.id
                    ? "text-orange-600"
                    : "text-gray-400"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-700">System Status</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-700">
              All systems operational
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">Last check: Just now</p>
        </div>

        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>Auto-refresh: Every 30 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemLeftCard;
