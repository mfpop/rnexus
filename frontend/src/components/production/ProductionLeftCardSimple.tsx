import React, { useState } from "react";
import {
  Search,
  Factory,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
} from "lucide-react";
import { useProductionContext, ProductionLine } from "./ProductionContext";

/**
 * ProductionLeftCardSimple - Simple production lines list for StableLayout integration
 * This is the left card content that appears in StableLayout for the production page
 */
const ProductionLeftCardSimple: React.FC = () => {
  const { selectedLine, setSelectedLine } = useProductionContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "running" | "issues">(
    "all",
  );

  const productionLines: ProductionLine[] = [
    {
      id: 1,
      name: "Assembly Line A",
      location: "Building 1 - Floor 2",
      status: "running",
      efficiency: 94.5,
      currentProduct: "Product X-100",
      operator: "John Smith",
      shift: "Morning Shift",
      lastMaintenance: new Date(Date.now() - 86400000 * 3),
      nextMaintenance: new Date(Date.now() + 86400000 * 7),
      metrics: {
        oee: 89.2,
        availability: 95.1,
        performance: 94.5,
        quality: 99.2,
      },
      currentRun: {
        startTime: new Date(Date.now() - 3600000 * 4),
        targetQuantity: 1000,
        actualQuantity: 780,
        cycleTime: 45.2,
      },
    },
    {
      id: 2,
      name: "Assembly Line B",
      location: "Building 1 - Floor 2",
      status: "warning",
      efficiency: 78.3,
      currentProduct: "Product Y-200",
      operator: "Sarah Johnson",
      shift: "Afternoon Shift",
      lastMaintenance: new Date(Date.now() - 86400000 * 5),
      nextMaintenance: new Date(Date.now() + 86400000 * 5),
      metrics: {
        oee: 75.8,
        availability: 87.2,
        performance: 78.3,
        quality: 98.1,
      },
      currentRun: {
        startTime: new Date(Date.now() - 3600000 * 2),
        targetQuantity: 800,
        actualQuantity: 520,
        cycleTime: 52.1,
      },
    },
    {
      id: 3,
      name: "Packaging Line C",
      location: "Building 2 - Floor 1",
      status: "maintenance",
      efficiency: 0,
      currentProduct: "N/A",
      operator: "Mike Davis",
      shift: "Night Shift",
      lastMaintenance: new Date(),
      nextMaintenance: new Date(Date.now() + 86400000 * 14),
      metrics: {
        oee: 0,
        availability: 0,
        performance: 0,
        quality: 0,
      },
      currentRun: {
        startTime: new Date(),
        targetQuantity: 0,
        actualQuantity: 0,
        cycleTime: 0,
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "maintenance":
        return "bg-blue-100 text-blue-800";
      case "stopped":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "maintenance":
        return <Settings className="h-4 w-4" />;
      case "stopped":
        return <Clock className="h-4 w-4" />;
      default:
        return <Factory className="h-4 w-4" />;
    }
  };

  const filteredLines = productionLines.filter((line) => {
    const matchesSearch =
      line.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      line.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "running" && line.status === "running") ||
      (activeTab === "issues" &&
        (line.status === "warning" || line.status === "stopped"));

    return matchesSearch && matchesTab;
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
            placeholder="Search production lines..."
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: "all", label: "All", icon: <Factory className="h-4 w-4" /> },
          {
            key: "running",
            label: "Running",
            icon: <CheckCircle className="h-4 w-4" />,
          },
          {
            key: "issues",
            label: "Issues",
            icon: <AlertTriangle className="h-4 w-4" />,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-800 border-transparent"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {tab.icon}
              <span>{tab.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Production Lines List */}
      <div className="flex-1 overflow-y-auto">
        {filteredLines.map((line) => (
          <div
            key={line.id}
            onClick={() => setSelectedLine(line)}
            className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
              selectedLine?.id === line.id ? "bg-blue-50 border-blue-200" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{line.name}</h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(line.status)}`}
              >
                <div className="flex items-center gap-1">
                  {getStatusIcon(line.status)}
                  <span>
                    {line.status.charAt(0).toUpperCase() + line.status.slice(1)}
                  </span>
                </div>
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-2">{line.location}</p>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium">{line.currentProduct}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Operator:</span>
                <span>{line.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Efficiency:</span>
                <span
                  className={`font-semibold ${line.efficiency > 90 ? "text-green-600" : line.efficiency > 75 ? "text-yellow-600" : "text-red-600"}`}
                >
                  {line.efficiency}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionLeftCardSimple;
