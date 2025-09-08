import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationItem from "./NavigationItem";
import { useHomeNavigation } from "./hooks";
import { NavigationItem as NavigationItemType } from "./types";
import { Search, Grid, List } from "lucide-react";

/**
 * NavigationSection - Optimized navigation section component
 * Displays navigation items with search, grouping, and layout options
 */
interface NavigationSectionProps {
  className?: string;
  showSearch?: boolean;
  showLayoutToggle?: boolean;
  defaultLayout?: 'grid' | 'list';
}

const NavigationSection: React.FC<NavigationSectionProps> = ({
  className = "",
  showSearch = true,
  showLayoutToggle = true,
  defaultLayout = 'list'
}) => {
  const navigate = useNavigate();
  const allNavItems = useHomeNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [layout, setLayout] = useState<'grid' | 'list'>(defaultLayout);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter navigation items
  const filteredNavItems = allNavItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(allNavItems.map(item => item.category).filter(Boolean)));

  const handleNavClick = (item: NavigationItemType) => {
    navigate(item.path);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Quick Navigation</h2>
          <p className="text-sm text-gray-600 mt-1">
            Access key platform features and modules
          </p>
        </div>

        {showLayoutToggle && (
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded ${layout === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded ${layout === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              title="Grid view"
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      {showSearch && (
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Category Filter */}
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category ? category.charAt(0).toUpperCase() + category.slice(1) : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Items */}
      <div className={`${
        layout === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 gap-3'
          : 'space-y-3'
      }`}>
        {filteredNavItems.length > 0 ? (
          filteredNavItems.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              onClick={handleNavClick}
              className={layout === 'grid' ? 'h-full' : ''}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No navigation items match your search</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear search and filters
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 pt-3 border-t border-gray-100 text-center">
        Showing {filteredNavItems.length} of {allNavItems.length} navigation items
      </div>
    </div>
  );
};

export default NavigationSection;
