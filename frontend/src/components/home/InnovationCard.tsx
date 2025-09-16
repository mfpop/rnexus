import React from "react";
import { InnovationCardProps } from "./types";

/**
 * InnovationCard - Optimized individual innovation card component
 * Displays innovation features with badges and descriptions
 */
const InnovationCard: React.FC<InnovationCardProps> = ({ innovation, className = "", onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(innovation);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
            {innovation.icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {innovation.title}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${innovation.badgeColor}`}>
              {innovation.badge}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {innovation.description}
          </p>
          {innovation.status && (
            <div className="mt-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                innovation.status === 'active' ? 'bg-green-100 text-green-800' :
                innovation.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {innovation.status.charAt(0).toUpperCase() + innovation.status.slice(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InnovationCard;
