import React, { useState } from "react";
import {
  Database,
  Server,
  CheckCircle,
  AlertCircle,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DatabaseSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "testing"
  >("connected");
  const [autoBackup, setAutoBackup] = useState(true);
  const [queryLogging, setQueryLogging] = useState(false);

  const handleTestConnection = () => {
    setConnectionStatus("testing");
    // Simulate connection test
    setTimeout(() => {
      setConnectionStatus("connected");
    }, 2000);
  };

  const handleManualBackup = () => {
    // Implement manual backup logic
    alert("Manual backup initiated!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
              <Database className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Database Settings
              </h1>
              <p className="text-gray-600">
                Configure database connections and manage your data
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Connection Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Connection Status
            </h2>

            <div
              className={`flex items-center justify-between p-4 rounded-lg border ${
                connectionStatus === "connected"
                  ? "bg-green-50 border-green-200"
                  : connectionStatus === "disconnected"
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {connectionStatus === "connected" && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {connectionStatus === "disconnected" && (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                {connectionStatus === "testing" && (
                  <Settings className="h-5 w-5 text-yellow-600 animate-spin" />
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    PostgreSQL Database
                  </p>
                  <p className="text-xs text-gray-500">
                    {connectionStatus === "connected" &&
                      "Connected to nexus_db on localhost:5432"}
                    {connectionStatus === "disconnected" && "Connection failed"}
                    {connectionStatus === "testing" && "Testing connection..."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    connectionStatus === "connected"
                      ? "bg-green-100 text-green-800"
                      : connectionStatus === "disconnected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {connectionStatus === "connected" && "Active"}
                  {connectionStatus === "disconnected" && "Offline"}
                  {connectionStatus === "testing" && "Testing"}
                </span>

                <button
                  onClick={handleTestConnection}
                  disabled={connectionStatus === "testing"}
                  className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Test Connection
                </button>
              </div>
            </div>
          </div>

          {/* Database Configuration */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Database Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Database Host
                </label>
                <input
                  type="text"
                  defaultValue="localhost"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Database Port
                </label>
                <input
                  type="text"
                  defaultValue="5432"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Database Name
                </label>
                <input
                  type="text"
                  defaultValue="nexus_db"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Database User
                </label>
                <input
                  type="text"
                  defaultValue="nexus_user"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Performance Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Pool Size
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="5">5 connections</option>
                  <option value="10" selected>
                    10 connections
                  </option>
                  <option value="20">20 connections</option>
                  <option value="50">50 connections</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Query Timeout
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="30">30 seconds</option>
                  <option value="60" selected>
                    60 seconds
                  </option>
                  <option value="120">2 minutes</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Enable Query Logging
                  </label>
                  <p className="text-xs text-gray-500">
                    Log all database queries for debugging
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={queryLogging}
                    onChange={(e) => setQueryLogging(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Backup & Maintenance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Backup & Maintenance
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Auto Backup
                  </label>
                  <p className="text-xs text-gray-500">
                    Automatically backup database daily at 2:00 AM
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={autoBackup}
                    onChange={(e) => setAutoBackup(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Retention Period
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="7">7 days</option>
                  <option value="30" selected>
                    30 days
                  </option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleManualBackup}
                  className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Server className="h-4 w-4" />
                  Run Manual Backup
                </button>

                <button className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                  <Database className="h-4 w-4" />
                  View Backup History
                </button>
              </div>
            </div>
          </div>

          {/* Database Statistics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Database Statistics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">2.4 GB</div>
                <div className="text-sm text-gray-600">Database Size</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">1,247</div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">15ms</div>
                <div className="text-sm text-gray-600">Avg Query Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSettingsPage;
