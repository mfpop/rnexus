import React, { memo } from "react";
import NavigationSection from "./NavigationSection";

/**
 * OptimizedHomeLeftCard - Optimized home page left card component
 * Uses new modular navigation system with better performance
 */
interface OptimizedHomeLeftCardProps {
  className?: string;
}

const OptimizedHomeLeftCard: React.FC<OptimizedHomeLeftCardProps> = memo(({
  className = ""
}) => {
  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      <div className="p-4">
        <NavigationSection
          showSearch={true}
          showLayoutToggle={true}
          defaultLayout="list"
        />
      </div>
    </div>
  );
});

OptimizedHomeLeftCard.displayName = "OptimizedHomeLeftCard";

export default OptimizedHomeLeftCard;
