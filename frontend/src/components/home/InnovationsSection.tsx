import React, { useState } from "react";
import InnovationCard from "./InnovationCard";
import { useHomeInnovations } from "./hooks";
import { InnovationCard as InnovationCardType } from "./types";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * InnovationsSection - Optimized innovations section component
 * Displays latest innovations with pagination and category filtering
 */
interface InnovationsSectionProps {
  className?: string;
  itemsPerPage?: number;
  onInnovationClick?: (innovation: InnovationCardType) => void;
  showPagination?: boolean;
}

const InnovationsSection: React.FC<InnovationsSectionProps> = ({
  className = "",
  itemsPerPage = 3,
  onInnovationClick,
  showPagination = true
}) => {
  const allInnovations = useHomeInnovations();
  const [currentPage, setCurrentPage] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Apply category filter
  const filteredInnovations = allInnovations.filter(innovation => {
    if (categoryFilter !== "all" && innovation.category !== categoryFilter) return false;
    return true;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredInnovations.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleInnovations = filteredInnovations.slice(startIndex, endIndex);

  // Get unique categories
  const categories = Array.from(new Set(allInnovations.map(i => i.category).filter(Boolean)));

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-bold text-gray-900">Latest Innovations</h2>
        </div>

        <div className="flex items-center space-x-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(0); // Reset to first page when filtering
            }}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category ? category.charAt(0).toUpperCase() + category.slice(1) : ''}
              </option>
            ))}
          </select>

          {/* Pagination Controls */}
          {showPagination && totalPages > 1 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 px-2">
                {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {visibleInnovations.length > 0 ? (
          visibleInnovations.map((innovation) => (
            <InnovationCard
              key={innovation.id}
              innovation={innovation}
              onClick={onInnovationClick}
              className="transform hover:scale-102 transition-transform duration-200"
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No innovations match the current category filter</p>
            <button
              onClick={() => setCategoryFilter("all")}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Show all innovations
            </button>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
        <span>
          Showing {visibleInnovations.length} of {filteredInnovations.length} innovations
        </span>
        <span>
          {allInnovations.filter(i => i.status === 'active').length} active projects
        </span>
      </div>
    </div>
  );
};

export default InnovationsSection;
