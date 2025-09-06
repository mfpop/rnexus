import React, { useState, useRef, useEffect } from "react";
import { Search, ArrowUpDown, Filter } from "lucide-react";
import { useProjectsContext, Project } from "./ProjectsContext";
import { usePagination } from "../../contexts/PaginationContext";

/**
 * ProjectsLeftCardSimple - Simple projects list for StableLayout integration
 * Redesigned to match the activities page design
 */
const ProjectsLeftCardSimple: React.FC = () => {
  const {
    selectedProject,
    setSelectedProject,
    projects: projectsData,
    loading,
    error
  } = useProjectsContext();
  const {
    currentPage,
    goToPage,
    setRecordsPerPage,
    updatePagination
  } = usePagination();

  const recordsPerPage = 10; // Default records per page
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "active" | "planning" | "completed"
  >("all");
  const [sortBy, setSortBy] = useState<
    "name" | "progress" | "priority" | "deadline"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const debugRef = useRef<{ lastAvailable?: number; lastCardHeight?: number }>({});
  const [debug, setDebug] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Close filter and sort dropdowns when clicking outside
      if (!target.closest('.filter-dropdown') && !target.closest('.sort-dropdown')) {
        setShowFilterDropdown(false);
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dynamically calculate optimal records per page based on actual DOM measurements
  useEffect(() => {
    if (!containerRef.current) return;

    let ro: ResizeObserver | null = null;
    let rafId: number | null = null;
    const DEFAULT_CARD_HEIGHT = 80;

    const calculate = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const listEl = listRef.current;

      let available = container.clientHeight;
      if (listEl) {
        const listTop = listEl.offsetTop - container.offsetTop;
        available = Math.max(0, container.clientHeight - listTop - 8);
      }

      const sample = container.querySelector('.project-card') as HTMLElement | null;
      const cardHeight = sample ? sample.offsetHeight : DEFAULT_CARD_HEIGHT;

      const computed = Math.max(1, Math.floor(available / cardHeight));

      debugRef.current.lastAvailable = available;
      debugRef.current.lastCardHeight = cardHeight;

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

  const projects: Project[] = projectsData || []; // Use real data from GraphQL

  // Filter projects based on active tab and search
  const filteredProjects = projects.filter((project) => {
    const matchesTab = activeTab === "all" || project.status === activeTab;
    const matchesSearch = searchQuery === "" ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = !selectedPriority || project.priority === selectedPriority;
    const matchesStatus = !selectedStatus || project.status === selectedStatus;

    return matchesTab && matchesSearch && matchesPriority && matchesStatus;
  });

  // Sort projects
  const sortedAndFilteredProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "progress":
        comparison = a.progress - b.progress;
        break;
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        comparison = (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) -
                    (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
        break;
      case "deadline":
        comparison = a.endDate.getTime() - b.endDate.getTime();
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Reset to first page when filters change
  useEffect(() => {
    goToPage(1);
  }, [searchQuery, activeTab, selectedPriority, selectedStatus, goToPage]);

  // Update pagination context when data changes
  useEffect(() => {
    updatePagination({
      totalRecords: sortedAndFilteredProjects.length,
      totalPages: Math.max(1, Math.ceil(sortedAndFilteredProjects.length / recordsPerPage)),
    });
  }, [sortedAndFilteredProjects.length, recordsPerPage, updatePagination]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading projects: {error.message}</div>
      </div>
    );
  }

  const getStatusBulletColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "planning":
        return "bg-blue-500";
      case "completed":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      case "on-hold":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-gray-800";
      case "high":
        return "text-gray-700";
      case "medium":
        return "text-gray-600";
      case "low":
        return "text-gray-500";
      default:
        return "text-gray-700";
    }
  };

  // status icon intentionally omitted here - ProjectsRightCard handles selected project display

  const getActiveFiltersCount = () => {
    return [selectedPriority, selectedStatus].filter(Boolean).length;
  };

  const clearFilters = () => {
    setSelectedPriority(null);
    setSelectedStatus(null);
  };

  // Filter and sort handlers
  const handleFilterClick = () => {
    setShowFilterDropdown(!showFilterDropdown);
    setShowSortDropdown(false);
  };

  const handleSortClick = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowFilterDropdown(false);
  };

  const handleSortChange = (newSortBy: "name" | "progress" | "priority" | "deadline") => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedProjects = sortedAndFilteredProjects.slice(startIndex, endIndex);

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
                      <option value="active">Active</option>
                      <option value="planning">Planning</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="on-hold">On Hold</option>
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
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
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
                    { key: "name", label: "Name" },
                    { key: "progress", label: "Progress" },
                    { key: "priority", label: "Priority" },
                    { key: "deadline", label: "Deadline" }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => {
                        handleSortChange(option.key as any);
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
                      onClick={handleSortOrderToggle}
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Debug toggle */}
      <div className="absolute top-3 right-3 z-30">
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

      {/* Status-based Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
        {[
          { key: "all", label: "All", count: sortedAndFilteredProjects.length },
          { key: "active", label: "Active", count: sortedAndFilteredProjects.filter(p => p.status === "active").length },
          { key: "planning", label: "Planning", count: sortedAndFilteredProjects.filter(p => p.status === "planning").length },
          { key: "completed", label: "Completed", count: sortedAndFilteredProjects.filter(p => p.status === "completed").length },
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

  {/* Projects List */}
  <div ref={(el) => { listRef.current = el; }} className="flex-1 overflow-y-auto">
        {paginatedProjects.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              {searchQuery || selectedPriority || selectedStatus
                ? 'No projects found matching your filters.'
                : 'No projects available.'
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 px-1 py-3 flex-1 overflow-y-auto">
            {paginatedProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`project-card p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-b border-gray-100 flex flex-col justify-center ${
                selectedProject?.id === project.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-sm"
                  : "hover:border-l-4 hover:border-l-gray-300"
              }`}
            >
              {/* Status indicator and title row */}
              <div className="flex items-start gap-2 mb-2">
                {/* Compact status indicator */}
                <div className="flex-shrink-0 mt-0.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${getStatusBulletColor(project.status)}`}
                    title={`Status: ${project.status}`}
                  />
                </div>

                {/* Title with compact typography */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                    {project.name}
                  </h3>
                </div>
              </div>

              {/* Manager and priority row with compact typography */}
              <div className="flex items-center justify-between">
                {/* Manager info with compact hierarchy */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <span className="font-medium text-gray-700">Manager:</span>
                    <span className="font-semibold text-gray-800 truncate">
                      {project.manager}
                    </span>
                  </div>
                </div>

                {/* Priority badge with compact styling */}
                <div className="flex-shrink-0 ml-2">
                  <span
                    className={`inline-flex items-center text-xs font-medium ${getPriorityColor(project.priority)}`}
                  >
                    {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
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

export default ProjectsLeftCardSimple;
