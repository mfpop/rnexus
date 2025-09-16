import React, { useState, useRef, useEffect } from "react";
import { Search, RefreshCw, Filter, ArrowUpDown } from "lucide-react";
import CreateActivityModal from "./CreateActivityModal";

import { useActivities } from "./ActivitiesContext";
import { usePagination } from "../../contexts/PaginationContext";

/**
 * ActivitiesLeftCard - Consolidated activities list component
 */
const ActivitiesLeftCard: React.FC = () => {
  const {
    activities = [],
    selectedActivity,
    setSelectedActivity = () => {},
    loading = false,
    error,
  } = useActivities();

  // Helper function to convert backend types to display types
  const getDisplayType = (backendType: string): string => {
    const typeMap: Record<string, string> = {
      PROJECTS: "Projects",
      TRAINING: "Training",
      ADMIN_SYSTEMS: "Admin & Systems",
      ENGINEERING: "Engineering",
      QUALITY: "Quality",
      PRODUCTION: "Production",
      MAINTENANCE: "Maintenance",
      LOGISTICS: "Logistics",
      MEETINGS: "Meetings",
      INSPECTION_AUDIT: "Inspection & Audit",
    };
    return typeMap[backendType] || backendType;
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "today" | "upcoming" | "overdue"
  >("all");

  const [sortBy, setSortBy] = useState<
    "title" | "status" | "priority" | "startTime" | "assignedTo"
  >("startTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const {
    currentPage,
    recordsPerPage,
    goToPage,
    setRecordsPerPage,
    updatePagination,
  } = usePagination();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
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

      const sample = container.querySelector(
        ".activity-card",
      ) as HTMLElement | null;
      const cardHeight = sample ? sample.offsetHeight : DEFAULT_CARD_HEIGHT;

      const computed = Math.max(1, Math.floor(available / cardHeight));


      setRecordsPerPage(computed);
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

    window.addEventListener("resize", scheduleCalc);
    scheduleCalc();
    const t = setTimeout(scheduleCalc, 300);

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", scheduleCalc);
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
    {
      type: "Maintenance",
      examples: ["Preventive", "Corrective", "Calibration"],
    },
    {
      type: "Inspection & Audit",
      examples: ["Quality checks", "ISO", "Safety audits"],
    },
    { type: "Engineering", examples: ["Tooling", "Layout", "Process changes"] },
    {
      type: "Logistics",
      examples: ["Material flow", "Inventory", "Warehouse"],
    },
    {
      type: "Quality",
      examples: ["RCA", "CAPA", "FMEA", "Control plans"],
    },
    { type: "Meetings", examples: ["Stand-ups", "Reviews", "Calls"] },
    { type: "Projects", examples: ["NPI", "Automation", "Lean/Six Sigma"] },
    { type: "Training", examples: ["Safety", "Technical", "Onboarding"] },
    {
      type: "Admin & Systems",
      examples: ["Reports", "ERP/MES", "Documentation"],
    },
  ];

  // Filter and sort activities based on current state
  const filteredAndSortedActivities = React.useMemo(() => {
    let filtered = activities;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (activity) =>
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          activity.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Apply tab filters
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    switch (activeTab) {
      case "today":
        filtered = filtered.filter((activity) => {
          const startDate = new Date(activity.startTime);
          return startDate >= today && startDate < tomorrow;
        });
        break;
      case "upcoming":
        filtered = filtered.filter((activity) => {
          const startDate = new Date(activity.startTime);
          return startDate >= tomorrow;
        });
        break;
      case "overdue":
        filtered = filtered.filter((activity) => {
          const endDate = new Date(activity.endTime);
          return endDate < now && activity.status !== "completed";
        });
        break;
      default:
        break;
    }

    // Apply type filter
    if (selectedType) {
      // Map display type back to backend type for comparison
      const backendType = Object.keys({
        PROJECTS: "Projects",
        TRAINING: "Training",
        ADMIN_SYSTEMS: "Admin & Systems",
        ENGINEERING: "Engineering",
        QUALITY: "Quality",
        PRODUCTION: "Production",
        MAINTENANCE: "Maintenance",
        LOGISTICS: "Logistics",
        MEETINGS: "Meetings",
        INSPECTION_AUDIT: "Inspection & Audit",
      }).find(key => ({
        PROJECTS: "Projects",
        TRAINING: "Training",
        ADMIN_SYSTEMS: "Admin & Systems",
        ENGINEERING: "Engineering",
        QUALITY: "Quality",
        PRODUCTION: "Production",
        MAINTENANCE: "Maintenance",
        LOGISTICS: "Logistics",
        MEETINGS: "Meetings",
        INSPECTION_AUDIT: "Inspection & Audit",
      } as Record<string, string>)[key] === selectedType);

      if (backendType) {
        filtered = filtered.filter((activity) => activity.type === backendType);
      }
    }

    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter((activity) => activity.status === selectedStatus);
    }

    // Apply priority filter
    if (selectedPriority) {
      filtered = filtered.filter((activity) => activity.priority === selectedPriority);
    }

    // Apply project filter (if implemented)
    if (selectedProject) {
      filtered = filtered.filter((activity) => activity.title.includes(selectedProject));
    }

    // Apply tags filter (if implemented)
    if (selectedTags.length > 0) {
      filtered = filtered.filter((activity) =>
        selectedTags.some(tag => activity.notes?.includes(tag))
      );
    }

    // Sort activities
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

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

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    activities,
    searchQuery,
    activeTab,
    selectedType,
    selectedStatus,
    selectedPriority,
    selectedProject,
    selectedTags,
    sortBy,
    sortOrder,
  ]);

  // Pagination logic
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedActivities = filteredAndSortedActivities.slice(
    startIndex,
    endIndex,
  );

  // Update pagination context when data changes
  React.useEffect(() => {
    updatePagination({
      totalRecords: filteredAndSortedActivities.length,
      totalPages: Math.max(
        1,
        Math.ceil(filteredAndSortedActivities.length / recordsPerPage),
      ),
    });
  }, [filteredAndSortedActivities.length, recordsPerPage, updatePagination]);

  // Reset to first page when filters change
  React.useEffect(() => {
    goToPage(1);
  }, [
    searchQuery,
    activeTab,
    selectedType,
    selectedStatus,
    selectedPriority,
    goToPage,
  ]);

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

  // Button handlers
  const handleFilterClick = () => {
    setShowFilterDropdown(!showFilterDropdown);
    setShowSortDropdown(false);
  };

  const handleSortClick = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowFilterDropdown(false);
  }

  const clearFilters = () => {
    setSelectedProject(null);
    setSelectedType(null);
    setSelectedStatus(null);
    setSelectedPriority(null);
    setSelectedTags([]);
  };

  const getActiveFiltersCount = () => {
    return (
      [selectedProject, selectedType, selectedStatus, selectedPriority].filter(
        Boolean,
      ).length + selectedTags.length
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-900">Activities</h2>
        <div className="flex items-center gap-2">
          {/* Filter Button */}
          <div className="relative filter-dropdown">
            <button
              onClick={handleFilterClick}
              className={`p-1.5 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ${
                getActiveFiltersCount() > 0
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : ""
              }`}
              title={`Filter activities (${getActiveFiltersCount()} active)`}
            >
              <Filter className="h-4 w-4" />
              {getActiveFiltersCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-4 space-y-3">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={selectedType || ""}
                      onChange={(e) =>
                        setSelectedType(e.target.value || null)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Types</option>
                      {manufacturingActivityTypes.map((activityType) => (
                        <option
                          key={activityType.type}
                          value={activityType.type}
                        >
                          {activityType.type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus || ""}
                      onChange={(e) =>
                        setSelectedStatus(e.target.value || null)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="planned">Planned</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={selectedPriority || ""}
                      onChange={(e) =>
                        setSelectedPriority(e.target.value || null)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  {/* Tags Filter */}
                  <div className="relative tags-dropdown">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTagsDropdown(!showTagsDropdown);
                      }}
                      className={`w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 border flex items-center justify-between ${
                        selectedTags.length > 0
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span>
                        {selectedTags.length === 0
                          ? "Select tags to filter..."
                          : `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"} selected`}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${showTagsDropdown ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Tags Dropdown */}
                    {showTagsDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-h-96 overflow-y-auto">
                        <div className="p-4 space-y-3">
                          {/* Available tags for selection */}
                          {[
                            {
                              value: "Kaizen",
                              label: "Kaizen",
                              color: "bg-green-100 text-green-700",
                              purpose: "Continuous improvement initiative",
                            },
                            {
                              value: "RCA",
                              label: "RCA",
                              color: "bg-blue-100 text-blue-700",
                              purpose: "Root cause analysis required",
                            },
                            {
                              value: "CAPA",
                              label: "CAPA",
                              color: "bg-purple-100 text-purple-700",
                              purpose: "Corrective/preventive action",
                            },
                            {
                              value: "Blocked",
                              label: "Blocked",
                              color: "bg-red-100 text-red-700",
                              purpose:
                                "Activity is waiting on input or dependency",
                            },
                            {
                              value: "Recurring",
                              label: "Recurring",
                              color: "bg-indigo-100 text-indigo-700",
                              purpose:
                                "Happens regularly (daily, weekly, etc.)",
                            },
                            {
                              value: "Training",
                              label: "Training",
                              color: "bg-orange-100 text-orange-700",
                              purpose: "Training or skill development",
                            },
                          ].map((tag) => (
                            <div
                              key={tag.value}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="checkbox"
                                id={`tag-${tag.value}`}
                                checked={selectedTags.includes(tag.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedTags([...selectedTags, tag.value]);
                                  } else {
                                    setSelectedTags(
                                      selectedTags.filter((t) => t !== tag.value),
                                    );
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label
                                htmlFor={`tag-${tag.value}`}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-gray-900">
                                    {tag.label}
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${tag.color}`}
                                  >
                                    {tag.purpose}
                                  </span>
                                </div>
                              </label>
                            </div>
                          ))}

                          {/* Clear Tags Button */}
                          {selectedTags.length > 0 && (
                            <button
                              onClick={() => setSelectedTags([])}
                              className="w-full mt-3 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                            >
                              Clear all tags
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Clear Filters Button */}
                  {getActiveFiltersCount() > 0 && (
                    <button
                      onClick={clearFilters}
                      className="w-full mt-3 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors text-sm font-medium"
                    >
                      Clear all filters ({getActiveFiltersCount()})
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
              title={`Sort by ${sortBy} (${sortOrder === "asc" ? "ascending" : "descending"})`}
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
                    { key: "assignedTo", label: "Assigned To" },
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        setSortBy(option.key as any);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        sortBy === option.key
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}

                  {/* Sort Order Toggle */}
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <button
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
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
      <CreateActivityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />


      {/* Time-based Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
        {[
          {
            key: "all",
            label: "All",
            count: filteredAndSortedActivities.length,
          },
          {
            key: "today",
            label: "Today",
            count: filteredAndSortedActivities.filter((activity) => {
              const startDate = new Date(activity.startTime);
              const today = new Date();
              return (
                startDate.toDateString() === today.toDateString()
              );
            }).length,
          },
          {
            key: "upcoming",
            label: "Upcoming",
            count: filteredAndSortedActivities.filter((activity) => {
              const startDate = new Date(activity.startTime);
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              return startDate >= tomorrow;
            }).length,
          },
          {
            key: "overdue",
            label: "Overdue",
            count: filteredAndSortedActivities.filter((activity) => {
              const endDate = new Date(activity.endTime);
              const now = new Date();
              return endDate < now && activity.status !== "completed";
            }).length,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? "text-blue-600 border-blue-600 bg-blue-50"
                : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Activities List */}
      <div
        ref={listRef as any}
        className="flex-1 overflow-y-auto"
      >
        {loading ? (
          <div className="p-6 text-center text-gray-500">
            <RefreshCw className="h-8 w-8 text-blue-500 mb-3 animate-spin" />
            <p className="text-sm font-medium text-gray-700">
              Loading activities...
            </p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="h-4 w-4 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-700">Error: {error}</p>
          </div>
        ) : paginatedActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                className="h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              No activities found matching your criteria.
            </p>
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
                      <span className="font-medium text-gray-700">
                        Assigned to:
                      </span>
                      <span className="font-semibold text-gray-800 truncate">
                        {activity.assignedTo}
                      </span>
                    </div>
                  </div>

                  {/* Category badge with compact styling */}
                  <div className="flex-shrink-0 ml-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(getDisplayType(activity.type))}`}
                    >
                      {getDisplayType(activity.type)}
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

export default ActivitiesLeftCard;
