import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  RefreshCw,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import CreateActivityModal from "./CreateActivityModal";

import { useActivitiesContext } from "./ActivitiesContext";
import { usePagination } from "../../contexts/PaginationContext";

/**
 * ActivitiesLeftCardSimple - Simple activities list for StableLayout integration
 */
const ActivitiesLeftCardSimple: React.FC = () => {
  const {
    activities = [],
    selectedActivity,
    setSelectedActivity = () => {},
    loading = false,
    error
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
  const { setPaginationData } = usePagination();
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const debugRef = useRef<{ lastAvailable?: number; lastCardHeight?: number }>({});
  const [debug, setDebug] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Dynamically calculate optimal records per page based on actual DOM measurements
  useEffect(() => {
    if (!containerRef.current) return;

    let ro: ResizeObserver | null = null;
    let rafId: number | null = null;

    const DEFAULT_CARD_HEIGHT = 64;

    const calculate = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const listEl = listRef.current;

      let available = container.clientHeight;
      if (listEl) {
        const listTop = listEl.offsetTop - container.offsetTop;
        available = Math.max(0, container.clientHeight - listTop - 8);
      }

      const sample = container.querySelector('.activity-card') as HTMLElement | null;
      const cardHeight = sample ? sample.offsetHeight : DEFAULT_CARD_HEIGHT;

      const computed = Math.max(1, Math.floor(available / cardHeight));

      debugRef.current.lastAvailable = available;
      debugRef.current.lastCardHeight = cardHeight;

      setRecordsPerPage((prev) => (prev !== computed ? computed : prev));
    };

    const scheduleCalc = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        calculate();
        rafId = null;
      });
    };

    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => scheduleCalc());
      ro.observe(containerRef.current);
      if (listRef.current) ro.observe(listRef.current);
    }

    window.addEventListener('resize', scheduleCalc);
    scheduleCalc();
    const t = setTimeout(scheduleCalc, 300);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', scheduleCalc);
      if (ro) {
        ro.disconnect();
        ro = null;
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedActivities.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedActivities = filteredAndSortedActivities.slice(startIndex, endIndex);

  // Update pagination context when data changes
  React.useEffect(() => {
    setPaginationData({
      currentPage,
      totalPages,
      totalRecords: filteredAndSortedActivities.length,
      recordsPerPage,
    });
  }, [currentPage, totalPages, filteredAndSortedActivities.length, recordsPerPage, setPaginationData]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, selectedType, selectedStatus, selectedPriority]);




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
    <div ref={containerRef} className="h-full flex flex-col relative">
      {/* Search with Filter and Sort Icons */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          {/* Filter Icon Button */}
          <div className="relative filter-dropdown">
            <button
              onClick={handleFilterClick}
              className={`p-1.5 rounded-lg transition-all duration-200 border ${
                getActiveFiltersCount() > 0
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
              title={`Filter${getActiveFiltersCount() > 0 ? ` (${getActiveFiltersCount()} active)` : ''}`}
            >
              <div className="relative">
                <Filter className="h-4 w-4" />
                {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
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

                  {/* Tags Filter */}
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

          {/* Sort Icon Button */}
          <div className="relative sort-dropdown">
            <button
              onClick={handleSortClick}
              className="p-1.5 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              title={`Sort by ${sortBy} (${sortOrder === 'asc' ? 'ascending' : 'descending'})`}
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>

            {/* Sort Dropdown */}
            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
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

          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm placeholder-gray-500"
              placeholder="Search activities..."
            />
          </div>

          {/* Create Activity button */}
          <div>
            <button
              data-testid="leftcard-create-activity"
              onClick={() => setShowCreateModal(true)}
              className="ml-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Create Activity
            </button>
          </div>
        </div>
      </div>
      {/* Create Activity Modal */}
      <CreateActivityModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* Debug toggle */}
      <div className={`absolute top-3 right-3 z-30 ${debug ? '' : 'pointer-events-none'}`}>
        <button onClick={() => setDebug((d) => !d)} className="text-xs px-2 py-1 bg-white border rounded shadow-sm">
          {debug ? 'Hide debug' : 'Show debug'}
        </button>
        {debug && (
          <div className="mt-2 w-44 p-2 text-xs bg-white border rounded shadow">
            <div>available: {debugRef.current.lastAvailable ?? '—'}</div>
            <div>cardH: {debugRef.current.lastCardHeight ?? '—'}</div>
            <div>recordsPerPage: {recordsPerPage}</div>
          </div>
        )}
      </div>

      {/* Time-based Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
        {[
          { key: "all", label: "All", count: filteredAndSortedActivities.length },
          { key: "today", label: "Today", count: filteredAndSortedActivities.filter(a => isToday(a.startTime)).length },
          { key: "upcoming", label: "Upcoming", count: filteredAndSortedActivities.filter(a => isUpcoming(a.startTime)).length },
          { key: "overdue", label: "Overdue", count: filteredAndSortedActivities.filter(a => a.status === "overdue").length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium transition-all duration-200 border-b-2 flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "text-gray-900 border-blue-500 bg-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 border-transparent hover:bg-gray-100 hover:border-gray-300"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full font-medium ${
                activeTab === tab.key
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

  {/* Activities List */}
  <div ref={(el) => { listRef.current = el; }} className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            <RefreshCw className="h-8 w-8 text-blue-500 mb-3 animate-spin" />
            <p className="text-sm font-medium text-gray-700">Loading activities...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-700">Error: {error}</p>
          </div>
        ) : paginatedActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">No activities found matching your criteria.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 px-1 py-3 flex-1 overflow-y-auto">
            {paginatedActivities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => setSelectedActivity(activity)}
              className={`activity-card p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-b border-gray-100 flex flex-col justify-center ${
                selectedActivity?.id === activity.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-sm"
                  : "hover:border-l-4 hover:border-l-gray-300"
              }`}
            >
              {/* Status indicator and title row */}
              <div className="flex items-start gap-2 mb-2">
                {/* Compact status indicator */}
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${getStatusBulletColor(activity.status)}`}
                    title={`Status: ${activity.status}`}
                  />
                </div>

                {/* Title with compact typography */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                    {activity.title}
                  </h3>
                </div>
              </div>

              {/* Assignment and category row with compact typography */}
              <div className="flex items-center justify-between">
                {/* Assignment info with compact hierarchy */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="font-medium text-gray-700">Assigned to:</span>
                    <span className="font-semibold text-gray-800 truncate">
                      {activity.assignedTo}
                    </span>
                  </div>
                </div>

                {/* Category badge with compact styling */}
                <div className="flex-shrink-0 ml-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(activity.type)}`}
                  >
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>


    </div>
  );
};

export default ActivitiesLeftCardSimple;
