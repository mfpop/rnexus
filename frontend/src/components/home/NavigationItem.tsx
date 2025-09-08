import React from "react";
import { NavigationItemProps } from "./types";
import { ChevronRight } from "lucide-react";

/**
 * NavigationItem - Optimized individual navigation item component
 * Displays navigation options with icons and descriptions
 */
const NavigationItem: React.FC<NavigationItemProps> = ({ item, className = "", onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 hover:-translate-y-1 transition-all duration-200 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600">
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-800 truncate">
            {item.title}
          </h3>
          <p className="text-gray-600 text-xs line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0 ml-2">
        <ChevronRight className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
      </div>
    </div>
  );
};

export default NavigationItem;
