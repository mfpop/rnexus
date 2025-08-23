import React, { useState } from "react";
import {
  Search,
  RefreshCw,
} from "lucide-react";

import { useActivitiesContext } from "./ActivitiesContext";

/**
 * ActivitiesLeftCardSimple - Simple activities list for StableLayout integration
 */
const ActivitiesLeftCardSimple: React.FC = () => {
  const {
    activities,
    selectedActivity,
    setSelectedActivity,
    loading,
    error,
    refreshActivities
  } = useActivitiesContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "today" | "upcoming" | "overdue"
  >("all");

  const [sortBy, setSortBy] = useState<"title" | "status" | "priority" | "startTime" | "assignedTo">("startTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);

  // Manufacturing activity types from the JSON file
  const manufacturingActivityTypes = [
    { type: "Production", examples: ["Assembly", "Setup", "Trials"] },
    { type: "Maintenance", examples: ["Preventive", "Corrective", "Calibration"] },
    { type: "Inspection & Audit", examples: ["Quality checks", "ISO", "Safety audits"] },
    { type: "Engineering", examples: ["Tooling", "Layout", "Process changes"] },
    { type: "Logistics", examples: ["Material flow", "Inventory", "Warehouse"] },
    { type: "Quality", examples: ["RCA", "CAPA", "FMEA", "Control plans"] },
    { type: "Meetings", examples: ["Stand-ups", "Reviews", "Calls"] },
    { type: "Projects", examples: ["NPI", "Automation", "Lean/Six Sigma"] },
    { type: "Training", examples: ["Safety", "Technical", "Onboarding"] },
    { type: "Admin & Systems", examples: ["Reports", "ERP/MES", "Documentation"] }
  ];

  // Filter and sort activities based on current state
  const filteredAndSortedActivities = React.useMemo(() => {
    let filtered = activities;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filters
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    switch (activeTab) {
      case "today":
        filtered = filtered.filter(activity => {
          const startDate = new Date(activity.startTime);
          return startDate >= today && startDate < tomorrow;
        });
        break;
      case "upcoming":
        filtered = filtered.filter(activity => {
          const startDate = new Date(activity.startTime);
          return startDate >= tomorrow;
        });
        break;
      case "overdue":
        filtered = filtered.filter(activity => {
          const endDate = new Date(activity.endTime);
          return endDate < now && activity.status !== 'completed';
        });
        break;
      default:
        break;
    }

    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(activity => activity.type === selectedType);
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(activity => activity.status === selectedStatus);
    }

    // Apply priority filter
    if (selectedPriority) {
      filtered = filtered.filter(activity => activity.priority === selectedPriority);
    }

    // Sort activities
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "priority":
          aValue = a.priority;
          bValue = b.priority;
          break;
        case "startTime":
          aValue = new Date(a.startTime).getTime();
          bValue = new Date(b.startTime).getTime();
          break;
        case "assignedTo":
          aValue = a.assignedTo.toLowerCase();
          bValue = b.assignedTo.toLowerCase();
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [activities, searchQuery, activeTab, selectedType, selectedStatus, selectedPriority, sortBy, sortOrder]);


  const getStatusBulletColor = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-blue-500";
      case "in-progress":
        return "bg-amber-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "overdue":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Production":
        return "text-gray-800";
      case "Maintenance":
        return "text-gray-700";
      case "Inspection & Audit":
        return "text-gray-600";
      case "Engineering":
        return "text-gray-500";
      case "Logistics":
        return "text-gray-400";
      case "Quality":
        return "text-gray-300";
      case "Meetings":
        return "text-gray-200";
      case "Projects":
        return "text-gray-100";
      case "Training":
        return "text-gray-800";
      case "Admin & Systems":
        return "text-gray-700";
      default:
        return "text-gray-700";
    }
  };



  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isUpcoming = (date: Date) => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 86400000);
    const nextWeek = new Date(now.getTime() + 86400000 * 7);
    return date > tomorrow && date <= nextWeek;
  };







  // Button handlers
  const handleFilterClick = () => {
    setShowFilterDropdown(!showFilterDropdown);
    setShowSortDropdown(false);
  };

  const handleSortClick = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowFilterDropdown(false);
  };

  const clearFilters = () => {
    setSelectedProject(null);
    setSelectedType(null);
    setSelectedStatus(null);
    setSelectedPriority(null);
    setSelectedTags([]);
  };

  const getActiveFiltersCount = () => {
    return [selectedProject, selectedType, selectedStatus, selectedPriority].filter(Boolean).length + selectedTags.length;
  };



  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Don't close if clicking inside the dropdown or button
      if (target.closest('.filter-dropdown') || target.closest('.sort-dropdown') || target.closest('.tags-dropdown')) {
        return;
      }

      if (showFilterDropdown || showSortDropdown || showTagsDropdown) {
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
        setShowTagsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown, showSortDropdown, showTagsDropdown]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Activities</h2>
          <button
            onClick={() => refreshActivities()}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh activities"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

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
            placeholder="Search activities..."
          />
        </div>
      </div>

      {/* Filter and Action Buttons */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* Filter Button with Dropdown */}
          <div className="relative filter-dropdown">
            <button
              onClick={handleFilterClick}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
                getActiveFiltersCount() > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>Filter</span>
                {getActiveFiltersCount() > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                    {getActiveFiltersCount()}
                  </span>
                )}
                <svg className={`w-4 h-4 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="absolute top-full left-0 mt-1 flex flex-wrap gap-1 max-w-xs">
                {selectedTags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                    {tag}
                  </span>
                ))}
                {selectedTags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                    +{selectedTags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="filter-dropdown absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-4 space-y-4">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                                              <select
                       value={selectedType || ''}
                       onChange={(e) => setSelectedType(e.target.value || null)}
                       onClick={(e) => e.stopPropagation()}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     >
                       <option value="">All Types</option>
                       {manufacturingActivityTypes.map((activityType) => (
                         <option key={activityType.type} value={activityType.type}>
                           {activityType.type}
                         </option>
                       ))}
                     </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                         <select
                       value={selectedStatus || ''}
                       onChange={(e) => setSelectedStatus(e.target.value || null)}
                       onClick={(e) => e.stopPropagation()}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     >
                      <option value="">All Statuses</option>
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                                         <select
                       value={selectedPriority || ''}
                       onChange={(e) => setSelectedPriority(e.target.value || null)}
                       onClick={(e) => e.stopPropagation()}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     >
                      <option value="">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Tags Filter Dropdown */}
                  <div className="relative tags-dropdown">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTagsDropdown(!showTagsDropdown);
                      }}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border flex items-center justify-between ${
                        selectedTags.length > 0
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span>
                        {selectedTags.length === 0
                          ? "Select tags to filter..."
                          : `${selectedTags.length} tag${selectedTags.length === 1 ? '' : 's'} selected`
                        }
                      </span>
                      <svg className={`w-4 h-4 transition-transform ${showTagsDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Tags Dropdown */}
                    {showTagsDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-96 overflow-y-auto">
                        <div className="p-4 space-y-3">
                          {/* Available tags for selection */}
                          {[
                            { value: "Kaizen", label: "Kaizen", color: "bg-green-100 text-green-700", purpose: "Continuous improvement initiative" },
                            { value: "RCA", label: "RCA", color: "bg-blue-100 text-blue-700", purpose: "Root cause analysis required" },
                            { value: "CAPA", label: "CAPA", color: "bg-purple-100 text-purple-700", purpose: "Corrective/preventive action" },
                            { value: "Blocked", label: "Blocked", color: "bg-red-100 text-red-700", purpose: "Activity is waiting on input or dependency" },
                            { value: "Recurring", label: "Recurring", color: "bg-indigo-100 text-indigo-700", purpose: "Happens regularly (daily, weekly, etc.)" },
                            { value: "Training", label: "Training", color: "bg-emerald-100 text-emerald-700", purpose: "Involves skill-building or onboarding" },
                            { value: "Audit", label: "Audit", color: "bg-yellow-100 text-yellow-700", purpose: "Related to compliance or certification" },
                            { value: "Gemba", label: "Gemba", color: "bg-orange-100 text-orange-700", purpose: "Requires shop floor observation" },
                            { value: "5S", label: "5S", color: "bg-teal-100 text-teal-700", purpose: "Workplace organization or cleanup" },
                            { value: "Documentation", label: "Documentation", color: "bg-gray-100 text-gray-700", purpose: "Involves updating or creating documents" }
                          ].map((tag) => (
                            <label key={tag.value} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition-colors">
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(tag.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTags([...selectedTags, tag.value]);
                                  } else {
                                    setSelectedTags(selectedTags.filter(t => t !== tag.value));
                                  }
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <div className="flex flex-col flex-1">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${tag.color} inline-block`}>
                                  {tag.label}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                  {tag.purpose}
                                </span>
                              </div>
                            </label>
                          ))}

                          {/* Clear Tags Button */}
                          {selectedTags.length > 0 && (
                            <div className="border-t border-gray-100 pt-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTags([]);
                                }}
                                className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
                              >
                                Clear All Tags
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Clear Filters */}
                  {getActiveFiltersCount() > 0 && (
                                         <button
                       onClick={(e) => {
                         e.stopPropagation();
                         clearFilters();
                       }}
                       className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                     >
                       Clear All Filters
                     </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sort Button with Dropdown */}
          <div className="relative sort-dropdown">
            <button
              onClick={handleSortClick}
              className="px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <span>Sort by {sortBy}</span>
                <svg className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Sort Dropdown */}
            {showSortDropdown && (
              <div className="sort-dropdown absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2 space-y-1">
                  {[
                    { key: "startTime", label: "Start Time" },
                    { key: "title", label: "Title" },
                    { key: "status", label: "Status" },
                    { key: "priority", label: "Priority" },
                    { key: "assignedTo", label: "Assigned To" }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        setSortBy(option.key as any);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        sortBy === option.key
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}

                  {/* Sort Order Toggle */}
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Time-based Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
        {[
          { key: "all", label: "All", count: activities.length },
          { key: "today", label: "Today", count: activities.filter(a => isToday(a.startTime)).length },
          { key: "upcoming", label: "Upcoming", count: activities.filter(a => isUpcoming(a.startTime)).length },
          { key: "overdue", label: "Overdue", count: activities.filter(a => a.status === "overdue").length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === tab.key
                ? "text-gray-800 border-gray-600 bg-white"
                : "text-gray-600 hover:text-gray-800 border-transparent hover:bg-gray-100"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <RefreshCw className="h-12 w-12 text-blue-500 mb-4 animate-spin" />
            Loading activities...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : filteredAndSortedActivities.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No activities found matching your criteria.</div>
        ) : (
          filteredAndSortedActivities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => setSelectedActivity(activity)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                selectedActivity?.id === activity.id
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
            >
              {/* Line 1: Title */}
              <div className="flex items-start mb-2">
                <div className="flex items-center gap-2 flex-1">
                  {/* Status-colored bullet */}
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${getStatusBulletColor(activity.status)}`}
                    title={`Status: ${activity.status}`}
                  />
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {activity.title}
                  </h3>
                </div>
              </div>

              {/* Line 2: Type and Assigned to */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Assigned to: <span className="font-medium">{activity.assignedTo}</span>
                </span>
                <span
                  className={`text-xs font-medium flex-shrink-0 ${getTypeColor(activity.type)}`}
                >
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </span>
              </div>


            </div>
          ))
        )}
      </div>


    </div>
  );
};

export default ActivitiesLeftCardSimple;
