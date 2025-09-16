import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Activity,
  RefreshCw,
  Download,
  Share2,
  Settings,
  AlertTriangle,
  CheckCircle,
  Eye,
  Filter,
} from "lucide-react";
import { Metric } from "./MetricsContext";

interface MetricsRightCardProps {
  selectedMetric: Metric | null;
}

/**
 * MetricsRightCard - Metrics page specific right card content component
 * Detail component - contains the metric dashboard and analysis for the selected metric
 * Related to the metric selection in the left card (master-detail relationship)
 * Comprehensive metric visualization and analysis interface
 */
const MetricsRightCard: React.FC<MetricsRightCardProps> = ({
  selectedMetric,
}) => {
  const [isRealTime, setIsRealTime] = useState(true);
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">(
    "24h",
  );
  // const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    if (!selectedMetric || !isRealTime) return;

    // Placeholder for real-time update logic if needed in the future

    return () => {};
  }, [selectedMetric, isRealTime]);

  const formatValue = (value: number, unit: string) => {
    return `${value.toLocaleString()}${unit}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "critical":
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Activity className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-5 w-5" />;
    if (trend < 0) return <TrendingDown className="h-5 w-5" />;
    return null;
  };

  const calculatePerformanceVsTarget = (value: number, target?: number) => {
    if (!target) return null;
    const percentage = (value / target) * 100;
    return {
      percentage,
      status:
        percentage >= 100 ? "good" : percentage >= 90 ? "warning" : "critical",
    };
  };

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color?: string;
  }> = ({ title, value, icon, color = "blue" }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 bg-${color}-100 text-${color}-600 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (!selectedMetric) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Select a Metric
          </h2>
          <p className="text-gray-600">
            Choose a metric from the left to view its detailed analysis
          </p>
        </div>
      </div>
    );
  }

  const performance = calculatePerformanceVsTarget(
    selectedMetric.value,
    selectedMetric.target,
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(selectedMetric.status)}
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedMetric.name}
              </h1>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedMetric.status)}`}
              >
                {selectedMetric.status.charAt(0).toUpperCase() +
                  selectedMetric.status.slice(1)}
              </span>
            </div>

            <p className="text-gray-600 mb-3">{selectedMetric.description}</p>

            {/* Current Value */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-900 mb-1">
                    {formatValue(selectedMetric.value, selectedMetric.unit)}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-blue-700">
                      Period: {selectedMetric.period}
                    </span>
                    <span className="text-blue-600">•</span>
                    <span className="text-blue-700">
                      Updated: {formatDate(selectedMetric.lastUpdated)}
                    </span>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 ${getTrendColor(selectedMetric.trend)}`}
                >
                  {getTrendIcon(selectedMetric.trend)}
                  <span className="text-lg font-semibold">
                    {Math.abs(selectedMetric.trend)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setIsRealTime(!isRealTime)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isRealTime
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>{isRealTime ? "Live" : "Paused"}</span>
            </button>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <RefreshCw className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Current Value"
            value={formatValue(selectedMetric.value, selectedMetric.unit)}
            icon={<BarChart3 className="h-5 w-5" />}
            color="blue"
          />

          {selectedMetric.target && (
            <StatCard
              title="Target"
              value={formatValue(selectedMetric.target, selectedMetric.unit)}
              icon={<Target className="h-5 w-5" />}
              color="purple"
            />
          )}

          <StatCard
            title="Trend"
            value={`${selectedMetric.trend > 0 ? "+" : ""}${selectedMetric.trend}%`}
            icon={
              selectedMetric.trend >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )
            }
            color={selectedMetric.trend >= 0 ? "green" : "red"}
          />

          <StatCard
            title="Chart Type"
            value={
              selectedMetric.chartType.charAt(0).toUpperCase() +
              selectedMetric.chartType.slice(1)
            }
            icon={<Eye className="h-5 w-5" />}
            color="gray"
          />
        </div>

        {/* Performance vs Target */}
        {performance && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Performance vs Target
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Achievement</span>
                  <span className="text-sm font-medium">
                    {performance.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 w-[var(--metric-width)] ${
                      performance.status === "good"
                        ? "bg-green-500"
                        : performance.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={
                      {
                        "--metric-width": `${Math.min(performance.percentage, 100)}%`,
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div
                  className={`px-4 py-2 rounded-lg border ${getStatusColor(performance.status)}`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {performance.percentage >= 100
                        ? "Target Achieved"
                        : performance.percentage >= 90
                          ? "Near Target"
                          : "Below Target"}
                    </div>
                    <div className="text-sm">
                      {Math.abs(
                        selectedMetric.target! - selectedMetric.value,
                      ).toLocaleString()}
                      {selectedMetric.unit}
                      {performance.percentage >= 100 ? " above" : " below"}{" "}
                      target
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart Visualization Placeholder */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedMetric.chartType.charAt(0).toUpperCase() +
                selectedMetric.chartType.slice(1)}{" "}
              Chart
            </h3>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                {selectedMetric.chartType.charAt(0).toUpperCase() +
                  selectedMetric.chartType.slice(1)}{" "}
                chart visualization
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Real-time data: {isRealTime ? "Enabled" : "Disabled"} • Range:{" "}
                {timeRange}
              </p>
            </div>
          </div>
        </div>

        {/* Historical Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Historical Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Best Performance</span>
                <span className="font-medium text-gray-900">
                  {(selectedMetric.value * 1.15).toFixed(1)}
                  {selectedMetric.unit}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Average (30d)</span>
                <span className="font-medium text-gray-900">
                  {(selectedMetric.value * 0.95).toFixed(1)}
                  {selectedMetric.unit}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Improvement Rate</span>
                <span
                  className={`font-medium ${getTrendColor(selectedMetric.trend)}`}
                >
                  {selectedMetric.trend > 0 ? "+" : ""}
                  {selectedMetric.trend}% / month
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Metric Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {selectedMetric.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Update Frequency:</span>
                <span className="font-medium text-gray-900">Real-time</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data Source:</span>
                <span className="font-medium text-gray-900">
                  Production Systems
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calculation:</span>
                <span className="font-medium text-gray-900">Automated</span>
              </div>
              {selectedMetric.target && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Target Review:</span>
                  <span className="font-medium text-gray-900">Quarterly</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Last updated: {formatDate(selectedMetric.lastUpdated)}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
              <span>Configure</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsRightCard;
