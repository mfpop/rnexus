import React, { memo, useCallback } from "react";
import StatsGrid from "./StatsGrid";
import ActivitiesList from "./ActivitiesList";
import InnovationsSection from "./InnovationsSection";
import { StatCard, ActivityItem, InnovationCard } from "./types";

/**
 * OptimizedHomeRightCard - Optimized home page right card component
 * Uses modular sections with better performance and event handling
 */
interface OptimizedHomeRightCardProps {
  className?: string;
}

const OptimizedHomeRightCard: React.FC<OptimizedHomeRightCardProps> = memo(({
  className = ""
}) => {
  // Event handlers with useCallback for performance optimization
  const handleStatClick = useCallback((stat: StatCard) => {
    console.log("Stat clicked:", stat);
    // Here you could navigate to detailed stat view, show modal, etc.
  }, []);

  const handleActivityClick = useCallback((activity: ActivityItem) => {
    console.log("Activity clicked:", activity);
    // Here you could navigate to activity details, show modal, etc.
  }, []);

  const handleInnovationClick = useCallback((innovation: InnovationCard) => {
    console.log("Innovation clicked:", innovation);
    // Here you could navigate to innovation details, show modal, etc.
  }, []);

  return (
    <div className={`h-full overflow-y-auto ${className}`}>
      <div className="p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Nexus LMD
          </h1>
          <p className="text-lg text-gray-600">
            Your comprehensive platform for managing and monitoring your production environment
          </p>
        </div>

        {/* Stats Section */}
        <StatsGrid
          onStatClick={handleStatClick}
          className="bg-gray-50 rounded-xl p-6"
        />

        {/* Activities Section */}
        <ActivitiesList
          maxItems={6}
          onActivityClick={handleActivityClick}
          showFilters={true}
          className="bg-white rounded-xl border border-gray-200 p-6"
        />

        {/* Innovations Section */}
        <InnovationsSection
          itemsPerPage={3}
          onInnovationClick={handleInnovationClick}
          showPagination={true}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6"
        />

        {/* Footer */}
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2025 Nexus LMD. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
});

OptimizedHomeRightCard.displayName = "OptimizedHomeRightCard";

export default OptimizedHomeRightCard;
