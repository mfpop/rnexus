import React, { useState, useEffect } from "react";
import {
  Activity,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  Settings,
  TrendingUp,
  TrendingDown,
  Pause,
  Play,
  Square,
  RefreshCw,
  Thermometer,
  Zap,
  Package,
  Users,
  Calendar,
  MapPin,
  Wrench,
} from "lucide-react";
import { ProductionLine } from "./ProductionContext";

interface ProductionRightCardProps {
  selectedLine: ProductionLine | null;
}

interface RealTimeData {
  timestamp: Date;
  cycleTime: number;
  temperature: number;
  pressure: number;
  speed: number;
  vibration: number;
}

/**
 * ProductionRightCard - Production page specific right card content component
 * Detail component - contains the production dashboard and controls for the selected line
 * Related to the production line selection in the left card (master-detail relationship)
 * Real-time production monitoring and control interface
 */
const ProductionRightCard: React.FC<ProductionRightCardProps> = ({
  selectedLine,
}) => {
  const [realTimeData, setRealTimeData] = useState<RealTimeData[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "1h" | "4h" | "24h" | "7d"
  >("4h");

  // Simulate real-time data updates
  useEffect(() => {
    if (!selectedLine || !isLiveMode) return;

    const interval = setInterval(() => {
      const newDataPoint: RealTimeData = {
        timestamp: new Date(),
        cycleTime:
          selectedLine.currentRun.cycleTime + (Math.random() - 0.5) * 5,
        temperature: 75 + (Math.random() - 0.5) * 10,
        pressure: 150 + (Math.random() - 0.5) * 20,
        speed: 100 + (Math.random() - 0.5) * 15,
        vibration: 2.5 + (Math.random() - 0.5) * 1,
      };

      setRealTimeData((prev) => {
        const updated = [...prev, newDataPoint];
        return updated.slice(-50); // Keep last 50 data points
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [selectedLine, isLiveMode]);

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - startTime.getTime()) / (1000 * 60),
    );
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "maintenance":
        return <Settings className="h-6 w-6 text-blue-500" />;
      case "stopped":
        return <Clock className="h-6 w-6 text-red-500" />;
      default:
        return <Activity className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "maintenance":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "stopped":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    unit?: string;
    trend?: number;
    icon: React.ReactNode;
  }> = ({ title, value, unit, trend, icon }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-600 text-sm">{title}</div>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <div className="text-2xl font-semibold text-gray-900">
          {value}
          {unit && <span className="text-lg text-gray-600">{unit}</span>}
        </div>
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

  if (!selectedLine) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Select a Production Line
          </h2>
          <p className="text-gray-600">
            Choose a production line from the left to view its dashboard
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
              {getStatusIcon(selectedLine.status)}
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedLine.name}
              </h1>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedLine.status)}`}
              >
                {selectedLine.status.charAt(0).toUpperCase() +
                  selectedLine.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{selectedLine.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{selectedLine.operator}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{selectedLine.shift}</span>
              </div>
            </div>

            {/* Current Product */}
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  Current Product: {selectedLine.currentProduct}
                </span>
              </div>
              {selectedLine.status === "running" && (
                <div className="mt-2 text-sm text-blue-700">
                  Running for{" "}
                  {formatDuration(selectedLine.currentRun.startTime)}
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isLiveMode
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>{isLiveMode ? "Live" : "Paused"}</span>
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>

            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1"
            >
              <option value="1h">Last Hour</option>
              <option value="4h">Last 4 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Overall Equipment Effectiveness"
            value={selectedLine.metrics.oee}
            unit="%"
            trend={2.1}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <MetricCard
            title="Efficiency"
            value={selectedLine.efficiency}
            unit="%"
            trend={selectedLine.status === "running" ? 1.5 : -2.3}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <MetricCard
            title="Quality Rate"
            value={selectedLine.metrics.quality}
            unit="%"
            trend={0.8}
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <MetricCard
            title="Cycle Time"
            value={selectedLine.currentRun.cycleTime}
            unit="s"
            trend={selectedLine.status === "running" ? -1.2 : 0}
            icon={<Clock className="h-5 w-5" />}
          />
        </div>

        {/* Production Progress */}
        {selectedLine.status === "running" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Current Production Run
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Target Quantity
                </div>
                <div className="text-2xl font-semibold text-gray-900">
                  {selectedLine.currentRun.targetQuantity.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Actual Quantity
                </div>
                <div className="text-2xl font-semibold text-blue-600">
                  {selectedLine.currentRun.actualQuantity.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Completion</div>
                <div className="text-2xl font-semibold text-green-600">
                  {Math.round(
                    (selectedLine.currentRun.actualQuantity /
                      selectedLine.currentRun.targetQuantity) *
                      100,
                  )}
                  %
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>
                  {selectedLine.currentRun.actualQuantity}/
                  {selectedLine.currentRun.targetQuantity}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300 w-[var(--production-width)]"
                  style={
                    {
                      "--production-width": `${(selectedLine.currentRun.actualQuantity / selectedLine.currentRun.targetQuantity) * 100}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              OEE Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Availability</span>
                  <span className="text-sm font-medium">
                    {selectedLine.metrics.availability}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full w-[var(--availability-width)]"
                    style={
                      {
                        "--availability-width": `${selectedLine.metrics.availability}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Performance</span>
                  <span className="text-sm font-medium">
                    {selectedLine.metrics.performance}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full w-[var(--performance-width)]"
                    style={
                      {
                        "--performance-width": `${selectedLine.metrics.performance}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">Quality</span>
                  <span className="text-sm font-medium">
                    {selectedLine.metrics.quality}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full w-[var(--quality-width)]"
                    style={
                      {
                        "--quality-width": `${selectedLine.metrics.quality}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Real-time Sensors
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Thermometer className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                <div className="text-sm text-gray-600">Temperature</div>
                <div className="text-lg font-semibold">
                  {realTimeData.length > 0
                    ? `${realTimeData[realTimeData.length - 1].temperature.toFixed(1)}°C`
                    : "75.0°C"}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Zap className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <div className="text-sm text-gray-600">Pressure</div>
                <div className="text-lg font-semibold">
                  {realTimeData.length > 0
                    ? `${realTimeData[realTimeData.length - 1].pressure.toFixed(0)} PSI`
                    : "150 PSI"}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Activity className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <div className="text-sm text-gray-600">Speed</div>
                <div className="text-lg font-semibold">
                  {realTimeData.length > 0
                    ? `${realTimeData[realTimeData.length - 1].speed.toFixed(0)} RPM`
                    : "100 RPM"}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Activity className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                <div className="text-sm text-gray-600">Vibration</div>
                <div className="text-lg font-semibold">
                  {realTimeData.length > 0
                    ? `${realTimeData[realTimeData.length - 1].vibration.toFixed(1)} mm/s`
                    : "2.5 mm/s"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Maintenance Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-900">
                  Last Maintenance
                </span>
              </div>
              <div className="text-gray-600">
                {formatDate(selectedLine.lastMaintenance)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span className="font-medium text-gray-900">
                  Next Scheduled
                </span>
              </div>
              <div className="text-gray-600">
                {formatDate(selectedLine.nextMaintenance)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      {selectedLine.status === "running" && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Line Controls</div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg transition-colors">
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors">
                <Square className="h-4 w-4" />
                <span>Stop</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionRightCard;
