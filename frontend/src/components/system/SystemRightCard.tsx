import React, { useState, useEffect } from "react";
import {
  Cpu,
  HardDrive,
  Wifi,
  Database,
  Users,
  AlertTriangle,
  TrendingUp,
  Zap,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Server,
  MemoryStick,
  Globe,
} from "lucide-react";
import { useSystemContext } from "./SystemContext";

const SystemRightCard: React.FC = () => {
  const { selectedSection } = useSystemContext();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  };

  const renderSystemContent = (section: string) => {
    const systemContent: Record<string, React.JSX.Element> = {
      overview: (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                System Overview
              </h2>
              <p className="text-gray-600">
                Real-time system health and performance metrics
              </p>
            </div>
            <button
              onClick={handleRefresh}
              className={`bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 ${isRefreshing ? "opacity-75" : ""}`}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">
                    CPU Usage
                  </span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">23.4%</div>
              <div className="text-xs text-gray-500">4 cores, 2.8 GHz</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Memory
                  </span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">67.8%</div>
              <div className="text-xs text-gray-500">8.2 GB / 12 GB</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Disk Usage
                  </span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600">45.2%</div>
              <div className="text-xs text-gray-500">226 GB / 500 GB</div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Active Users
                  </span>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-orange-600">142</div>
              <div className="text-xs text-gray-500">+12 from yesterday</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                System Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Web Server</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Connected</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-gray-700">External API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-yellow-600">
                      Slow Response
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wifi className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">Network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Stable</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Alerts
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-2 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      High Memory Usage
                    </p>
                    <p className="text-xs text-yellow-600">
                      Memory usage above 80% threshold
                    </p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      System Update
                    </p>
                    <p className="text-xs text-blue-600">
                      Security patches applied successfully
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Backup Completed
                    </p>
                    <p className="text-xs text-green-600">
                      Daily backup finished successfully
                    </p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <span>Auto-refresh: Every 30 seconds</span>
            </div>
          </div>
        </div>
      ),

      performance: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Performance Metrics
            </h2>
            <p className="text-gray-600">
              Detailed performance analysis and resource utilization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                CPU Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Load</span>
                  <span className="font-medium">23.4%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-[23.4%]"></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Average (24h)</span>
                  <span className="font-medium">18.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-[18.7%]"></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Peak (24h)</span>
                  <span className="font-medium">67.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full w-[67.2%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Memory Usage
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used Memory</span>
                  <span className="font-medium">8.2 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full w-[68%]"></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available</span>
                  <span className="font-medium">3.8 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-[32%]"></div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cache</span>
                  <span className="font-medium">2.1 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full w-[18%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Network Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Download className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Download</span>
                      <span className="font-medium">1.2 MB/s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div className="bg-green-600 h-1 rounded-full w-[45%]"></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Upload className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Upload</span>
                      <span className="font-medium">350 KB/s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div className="bg-blue-600 h-1 rounded-full w-[25%]"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Latency: 12ms</span>
                    <span>Packet Loss: 0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),

      database: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
              <Database className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Database Status
            </h2>
            <p className="text-gray-600">
              Database performance and connection monitoring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Connection Pool
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Active Connections
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    12 / 50
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full w-[24%]"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      847ms
                    </div>
                    <div className="text-xs text-gray-500">Avg Query Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      1,247
                    </div>
                    <div className="text-xs text-gray-500">Queries/min</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Queries
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-gray-700 font-mono text-xs">
                    SELECT * FROM users WHERE...
                  </span>
                  <span className="text-green-600">125ms</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-gray-700 font-mono text-xs">
                    UPDATE production_data SET...
                  </span>
                  <span className="text-blue-600">89ms</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span className="text-gray-700 font-mono text-xs">
                    INSERT INTO activity_log...
                  </span>
                  <span className="text-yellow-600">2.1s</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-gray-700 font-mono text-xs">
                    SELECT COUNT(*) FROM...
                  </span>
                  <span className="text-green-600">45ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),

      alerts: (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <Zap className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              System Alerts
            </h2>
            <p className="text-gray-600">
              Critical alerts and system notifications
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-red-800">
                      Critical: High Error Rate
                    </h3>
                    <span className="text-xs text-red-600">2 min ago</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Error rate has exceeded 5% threshold. Immediate attention
                    required.
                  </p>
                  <div className="mt-2">
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                      Production
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-yellow-800">
                      Warning: Memory Usage High
                    </h3>
                    <span className="text-xs text-yellow-600">15 min ago</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Memory usage is at 85%. Consider scaling up resources.
                  </p>
                  <div className="mt-2">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Performance
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-blue-800">
                      Info: Scheduled Maintenance
                    </h3>
                    <span className="text-xs text-blue-600">1 hour ago</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    System maintenance completed successfully. All services
                    restored.
                  </p>
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Maintenance
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    };

    return systemContent[section] || systemContent["overview"];
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        {renderSystemContent(selectedSection)}
      </div>
    </div>
  );
};

export default SystemRightCard;
