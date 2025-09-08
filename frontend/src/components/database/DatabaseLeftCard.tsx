import React from "react";
import {
  Database,
  Server,
  Shield,
  Settings,
  Monitor,
  AlertCircle,
} from "lucide-react";

/**
 * DatabaseLeftCard Component
 *
 * Simple left card for the database settings page
 * Shows database-related quick actions and information
 */
const DatabaseLeftCard: React.FC = () => {
  const databaseFeatures = [
    {
      icon: <Database className="h-5 w-5 text-emerald-600" />,
      title: "Connection Status",
      description: "Monitor database connectivity",
      status: "Active",
    },
    {
      icon: <Server className="h-5 w-5 text-blue-600" />,
      title: "Performance Metrics",
      description: "View query performance",
      status: "Normal",
    },
    {
      icon: <Shield className="h-5 w-5 text-purple-600" />,
      title: "Security Settings",
      description: "Database access control",
      status: "Secure",
    },
    {
      icon: <Monitor className="h-5 w-5 text-orange-600" />,
      title: "Monitoring Tools",
      description: "System health monitoring",
      status: "Active",
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
            <Database className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Database Management
            </h2>
            <p className="text-sm text-gray-600">System administration panel</p>
          </div>
        </div>
      </div>

      {/* Quick Status */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          System Status
        </h3>
        <div className="space-y-3">
          {databaseFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {feature.icon}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {feature.title}
                  </p>
                  <p className="text-xs text-gray-600">{feature.description}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  feature.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : feature.status === "Normal"
                      ? "bg-blue-100 text-blue-800"
                      : feature.status === "Secure"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {feature.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex-1 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Settings className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Test Connection
                </p>
                <p className="text-xs text-gray-600">
                  Verify database connectivity
                </p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Server className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Run Backup</p>
                <p className="text-xs text-gray-600">Create manual backup</p>
              </div>
            </div>
          </button>

          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">View Logs</p>
                <p className="text-xs text-gray-600">Check system logs</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Admin Notice */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-800">
              Administrator Access
            </p>
            <p className="text-xs text-amber-700">
              Database modifications require admin privileges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseLeftCard;
