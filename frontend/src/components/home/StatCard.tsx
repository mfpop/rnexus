import React from "react";
import { StatCardProps } from "./types";

/**
 * StatCard - Optimized individual stat card component
 * Displays key metrics with trend indicators and proper styling
 */
const StatCard: React.FC<StatCardProps> = ({ stat, className = "", onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(stat);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 ${stat.color}`}>
            {stat.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 truncate">
              {stat.title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div className={`text-sm font-medium ${
            stat.trend === 'up' ? 'text-green-600' :
            stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {stat.change}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
