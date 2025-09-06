import React, { useState, useEffect, useRef } from "react";
import { Search, Newspaper, MessageSquare, AlertTriangle, Filter, Clock, ArrowUpDown } from "lucide-react";
import { useNewsContext } from "./NewsContextNew";
import { useAuth } from "../../contexts/AuthContext";
import { usePagination } from "../../contexts/PaginationContext";

/**
 * NewsLeftCardSimple - Simple news updates list for StableLayout integration
 * This is the left card content that appears in StableLayout for the news page
 */
const NewsLeftCardSimple: React.FC = () => {
  console.log('NewsLeftCardSimple component rendering');

  const {
    selectedUpdate,
    setSelectedUpdate,
    updates,
    loading,
    error,
    refreshUpdates,
    filterUpdates,
    deleteUpdate,
    processedUpdates
  } = useNewsContext();
  const { isAuthenticated } = useAuth();
  const {
    currentPage,
    totalPages,
    recordsPerPage,
    goToPage,
    setRecordsPerPage,
    updatePagination
  } = usePagination();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "type" | "priority" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const debugRef = useRef<{ lastAvailable?: number; lastCardHeight?: number }>({});
  const [debug, setDebug] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close filter and sort dropdowns when clicking outside
      const target = event.target as Element;
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



  // Load updates when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      refreshUpdates(); // Use refreshUpdates from context
    } else {
      // Clear updates when user logs out
      // The context will handle clearing updates
      setSelectedUpdate(null);
    }
  }, [isAuthenticated]); // Removed refreshUpdates from dependency array to prevent infinite loop

  // Listen for button events from StableLayout
  useEffect(() => {
    const handleDeleteEvent = () => {
      if (selectedUpdate && selectedUpdate.can_delete) {
        if (confirm('Are you sure you want to delete this update?')) {
          deleteUpdate(selectedUpdate.id);
        }
      } else {
        alert('No update selected or you do not have permission to delete');
      }
    };

    // Add event listeners
    window.addEventListener('news:delete', handleDeleteEvent);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('news:delete', handleDeleteEvent);
    };
  }, [selectedUpdate, deleteUpdate]);

  // Dynamically calculate optimal records per page based on actual DOM measurements
  useEffect(() => {
    if (!containerRef.current) return;

    let ro: ResizeObserver | null = null;
    let rafId: number | null = null;

    const DEFAULT_CARD_HEIGHT = 84; // fallback when there are no rendered cards yet

    const calculate = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const listEl = listRef.current;

      // Use bounding client rects for robust measurements across positioned elements
      let available = container.clientHeight;
      if (listEl) {
        const containerRect = container.getBoundingClientRect();
        const listRect = listEl.getBoundingClientRect();
        const listTop = Math.max(0, listRect.top - containerRect.top);

        // Try to measure tabs height if present (keep tabs outside scroll area ideally)
        const tabsEl = container.querySelector('.news-tabs') as HTMLElement | null;
        const tabsHeight = tabsEl ? tabsEl.getBoundingClientRect().height : 0;

        // Subtract listTop (distance from top of container to list), tabsHeight and extra bottom padding
        available = Math.max(0, container.clientHeight - listTop - tabsHeight - 12);
      }

      // Try to measure a rendered card height
      const sample = container.querySelector('.news-card') as HTMLElement | null;
      const cardHeight = sample ? sample.offsetHeight : DEFAULT_CARD_HEIGHT;

      // Compute how many can fit
      const computed = Math.max(1, Math.floor(available / cardHeight));

      debugRef.current.lastAvailable = available;
      debugRef.current.lastCardHeight = cardHeight;

      // Only update when it actually changes to avoid rerenders
      setRecordsPerPage(computed);
    };

    const scheduleCalc = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        calculate();
        rafId = null;
      });
    };

    // Use ResizeObserver to watch the container size and recalculate
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => scheduleCalc());
      ro.observe(containerRef.current);
      if (listRef.current) ro.observe(listRef.current);
    }

    // Also listen to window resize as fallback
    window.addEventListener('resize', scheduleCalc);

    // Run once after mount and after a short delay to allow content to render
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

  console.log('After useEffect, recordsPerPage:', recordsPerPage);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "text-gray-800";
      case "news":
        return "text-gray-700";
      case "communication":
        return "text-gray-600";
      default:
        return "text-gray-700";
    }
  };

  const getTypeBulletColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-500";
      case "news":
        return "bg-blue-500";
      case "communication":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "bg-red-500";
      case "new":
        return "bg-blue-500";
      case "read":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };



  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const updateTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - updateTime.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleTypeFilter = async (type: string) => {
    console.log('=== TAB CLICKED ===');
    console.log('Filtering by type:', type);
    console.log('Current activeType:', activeType);
    console.log('Current activeStatus:', activeStatus);
    console.log('Current searchQuery:', searchQuery);
    setActiveType(type);
    await filterUpdates(type, activeStatus, searchQuery);
    // Reset to first page when filter changes
    goToPage(1);
  };

  const handleStatusFilter = async (status: string) => {
    setActiveStatus(status);
    await filterUpdates(activeType, status, searchQuery);
    // Reset to first page when filter changes
    goToPage(1);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await filterUpdates(activeType, activeStatus, query);
    // Reset to first page when search changes
    goToPage(1);
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

  const handleSortChange = (newSortBy: "date" | "type" | "priority" | "title") => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
    // Apply sorting logic here
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    // Apply sorting logic here
  };

  // Filter updates based on search and filters
  const filteredUpdates = updates.filter((update) => {
    const matchesSearch = searchQuery === "" ||
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === "all" || update.type === activeType;
    const matchesStatus = activeStatus === "all" || update.status === activeStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Debug data for tabs
  console.log('NewsLeftCardSimple - updates:', updates.length, 'filteredUpdates:', filteredUpdates.length);

  // Pagination logic
  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedUpdates = filteredUpdates.slice(startIndex, endIndex);

  // Debug pagination
  console.log('Pagination debug:', {
    filteredUpdatesLength: filteredUpdates.length,
    currentPage,
    recordsPerPage,
    startIndex,
    endIndex,
    paginatedUpdatesLength: paginatedUpdates.length
  });

  // Update pagination context when data changes
  useEffect(() => {
    updatePagination({
      totalRecords: filteredUpdates.length,
      totalPages: Math.max(1, Math.ceil(filteredUpdates.length / recordsPerPage)),
    });
  }, [filteredUpdates.length, recordsPerPage, updatePagination]);

  return (
    <div ref={containerRef} className="flex flex-col h-full relative">
      {/* Search with Filter and Sort Icons */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          {/* Filter Icon Button */}
          <div className="relative filter-dropdown">
            <button
              onClick={handleFilterClick}
              className={`p-1.5 rounded-lg transition-all duration-200 border ${
                activeType !== "all" || activeStatus !== "all"
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
              title={`Filter${activeType !== "all" || activeStatus !== "all" ? ` (active)` : ''}`}
            >
              <div className="relative">
                <Filter className="h-4 w-4" />
                {(activeType !== "all" || activeStatus !== "all") && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full text-xs text-white flex items-center justify-center">
                    •
                  </span>
                )}
              </div>
            </button>

            {/* Filter Dropdown */}
            {showFilterDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-3 space-y-3">
                  {/* Type Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Type</label>
                    <div className="space-y-1">
                      {[
                        { key: "all", icon: Filter, label: "All Types" },
                        { key: "news", icon: Newspaper, label: "News" },
                        { key: "communication", icon: MessageSquare, label: "Communication" },
                        { key: "alert", icon: AlertTriangle, label: "Alerts" }
                      ].map(({ key, icon: Icon, label }) => (
                        <button
                          key={key}
                          onClick={() => {
                            handleTypeFilter(key);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors flex items-center gap-2 ${
                            activeType === key
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                    <div className="space-y-1">
                      {[
                        { key: "all", label: "All Statuses" },
                        { key: "published", label: "Published" },
                        { key: "draft", label: "Draft" },
                        { key: "archived", label: "Archived" }
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          onClick={() => {
                            handleStatusFilter(key);
                            setShowFilterDropdown(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
                            activeStatus === key
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
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
              <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2 space-y-1">
                  {[
                    { key: "date", label: "Date" },
                    { key: "type", label: "Type" },
                    { key: "priority", label: "Priority" },
                    { key: "title", label: "Title" }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleSortChange(option.key as any)}
                      className={`w-full text-left px-2 py-1.5 text-xs rounded-md transition-colors ${
                        sortBy === option.key
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}

                  {/* Sort Order Toggle */}
                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button
                      onClick={handleSortOrderToggle}
                      className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
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
              placeholder="Search updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
              className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Debug toggle */}
      <div className="absolute top-3 right-3 z-30">
        <button
          onClick={() => setDebug((d) => !d)}
          className="text-xs px-2 py-1 bg-white border rounded shadow-sm"
        >
          {debug ? 'Hide debug' : 'Show debug'}
        </button>
        {debug && (
          <div className="mt-2 w-44 p-2 text-xs bg-white border rounded shadow">
            <div>available: {debugRef.current.lastAvailable ?? '—'}</div>
            <div>cardH: {debugRef.current.lastCardHeight ?? '—'}</div>
            <div>recordsPerPage: {recordsPerPage}</div>
            <div className="mt-1 text-[10px] text-gray-500">Tip: Resize container to recalc</div>
          </div>
        )}
      </div>

      {/* Type-based Tabs */}
      <div className="news-tabs border-b border-gray-200 bg-gray-50 min-h-[40px]">
        <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-2">
          {[
            { key: "all", label: "All", count: processedUpdates.length, type: "all" },
            { key: "news", label: "News", count: processedUpdates.filter(u => u.type === "news").length, type: "news" },
            { key: "communication", label: "Communications", count: processedUpdates.filter(u => u.type === "communication").length, type: "communication" },
            { key: "alert", label: "Alerts", count: processedUpdates.filter(u => u.type === "alert").length, type: "alert" },
          ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTypeFilter(tab.key)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out border-b-2 flex items-center gap-2 relative overflow-hidden ${
              activeType === tab.key
                ? "text-gray-900 border-blue-500 bg-white shadow-md"
                : "text-gray-600 hover:text-gray-900 border-transparent hover:bg-white/80 hover:border-gray-300 hover:shadow-sm"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
        </div>
      </div>


      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Updates List - Modified for better space usage */}
      <div className="overflow-visible flex-1 flex flex-col">
        {loading ? (
          <div className="p-6 text-center text-gray-500 flex-1 flex flex-col justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-700">Loading updates...</p>
          </div>
        ) : paginatedUpdates.length === 0 ? (
          <div className="p-6 text-center text-gray-500 flex-1 flex flex-col justify-center">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              {searchQuery || activeType !== 'all' || activeStatus !== 'all'
                ? 'No updates found matching your filters.'
                : 'No updates available.'
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div ref={(el) => { listRef.current = el; }} className="flex flex-col space-y-2 px-1 py-3 flex-1 overflow-y-auto">
              {paginatedUpdates.map((update) => (
                <div
                  key={update.id}
                  onClick={() => setSelectedUpdate(update)}
                  className={`news-card p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-b border-gray-100 flex flex-col justify-center ${
                    selectedUpdate?.id === update.id
                      ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-sm"
                      : "hover:border-l-4 hover:border-l-gray-300"
                  }`}
                >
                  {/* Type indicator and title row */}
                  <div className="flex items-start gap-2 mb-2">
                    {/* Compact type indicator */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${getTypeBulletColor(update.type)}`}
                        title={`Type: ${update.type}`}
                      />
                    </div>

                    {/* Title with compact typography */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                        {update.title}
                      </h3>
                    </div>
                  </div>

                  {/* Author, type, status, and timestamp row with compact typography */}
                  <div className="flex items-center justify-between">
                    {/* Author info with compact hierarchy */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span className="font-medium text-gray-700">Author:</span>
                        <span className="font-semibold text-gray-800 truncate">
                          {update.author}
                        </span>
                      </div>
                    </div>

                    {/* Right side: Type badge, status, and timestamp */}
                    <div className="flex-shrink-0 ml-2 flex items-center gap-2">
                      {/* Type badge with compact styling */}
                      <span
                        className={`inline-flex items-center text-xs font-medium ${getTypeColor(update.type)}`}
                      >
                        {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                      </span>

                      {/* Status indicator */}
                      {update.status && (
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(update.status)}`} title={`Status: ${update.status}`} />
                          <span className="text-xs text-gray-600 capitalize">{update.status}</span>
                        </div>
                      )}

                      {/* Timestamp */}
                      {update.timestamp && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(update.timestamp)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="mt-auto">
              <div className="text-xs text-center text-gray-500 py-2">
                Page {currentPage} of {totalPages} • {filteredUpdates.length} total records
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsLeftCardSimple;
