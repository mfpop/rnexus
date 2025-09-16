import React from "react";
import StatCard from "./StatCard";
import { useHomeStats } from "./hooks";
import { StatCard as StatCardType } from "./types";

/**
 * StatsGrid - Optimized stats grid section component
 * Displays performance metrics in a responsive grid layout
 */
interface StatsGridProps {
  className?: string;
  onStatClick?: (stat: StatCardType) => void;
}

const StatsGrid: React.FC<StatsGridProps> = ({ className = "", onStatClick }) => {
  const stats = useHomeStats();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Performance Metrics</h2>
        <span className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            stat={stat}
            onClick={onStatClick}
            className="transform hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>
    </div>
  );
};

export default StatsGrid;
