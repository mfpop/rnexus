import React, { useState } from "react";
import { Search, BarChart3, TrendingUp, Target, Zap } from "lucide-react";
import { useMetricsContext, Metric } from "./MetricsContext";

/**
 * MetricsLeftCardSimple - Simple metrics list for StableLayout integration
 */
const MetricsLeftCardSimple: React.FC = () => {
  const { selectedMetric, setSelectedMetric } = useMetricsContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const metrics: Metric[] = [
    {
      id: "prod_efficiency",
      name: "Overall Equipment Effectiveness",
      description:
        "Comprehensive metric measuring availability, performance, and quality",
      value: 89.2,
      unit: "%",
      trend: 2.1,
      category: "production",
      status: "good",
      target: 90,
      period: "Current Shift",
      lastUpdated: new Date(),
      chartType: "line",
    },
    {
      id: "qual_defect_rate",
      name: "Defect Rate",
      description: "Percentage of products not meeting quality standards",
      value: 1.2,
      unit: "%",
      trend: -8.5,
      category: "quality",
      status: "warning",
      target: 0.5,
      period: "Current Shift",
      lastUpdated: new Date(),
      chartType: "bar",
    },
    {
      id: "perf_cycle_time",
      name: "Average Cycle Time",
      description: "Time required to complete one production cycle",
      value: 42.5,
      unit: "seconds",
      trend: -5.8,
      category: "performance",
      status: "good",
      target: 45,
      period: "Current Hour",
      lastUpdated: new Date(),
      chartType: "line",
    },
    {
      id: "energy_consumption",
      name: "Total Energy Consumption",
      description: "Power consumption across all production lines",
      value: 1250,
      unit: "kWh",
      trend: 4.2,
      category: "energy",
      status: "warning",
      target: 1200,
      period: "Current Day",
      lastUpdated: new Date(),
      chartType: "pie",
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "production":
        return <BarChart3 className="h-4 w-4" />;
      case "quality":
        return <Target className="h-4 w-4" />;
      case "performance":
        return <TrendingUp className="h-4 w-4" />;
      case "energy":
        return <Zap className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? "text-green-600" : "text-red-600";
  };

  const filteredMetrics = metrics.filter((metric) => {
    const matchesSearch = metric.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || metric.category === activeCategory;
    return matchesSearch && matchesCategory;
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
            placeholder="Search metrics..."
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {[
          { key: "all", label: "All" },
          { key: "production", label: "Production" },
          { key: "quality", label: "Quality" },
          { key: "performance", label: "Performance" },
          { key: "energy", label: "Energy" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveCategory(tab.key)}
            className={`flex-shrink-0 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeCategory === tab.key
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-800 border-transparent"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Metrics List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMetrics.map((metric) => (
          <div
            key={metric.id}
            onClick={() => setSelectedMetric(metric)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
              selectedMetric?.id === metric.id
                ? "bg-blue-50 border-blue-200"
                : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getCategoryIcon(metric.category)}
                <h3 className="font-semibold text-gray-900">{metric.name}</h3>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(metric.status)}`}
              >
                {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {metric.value.toLocaleString()}
                <span className="text-sm font-normal text-gray-600 ml-1">
                  {metric.unit}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}
              >
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">{Math.abs(metric.trend)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsLeftCardSimple;
