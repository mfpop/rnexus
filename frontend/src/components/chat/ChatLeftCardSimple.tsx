import React, { useState, useEffect, useRef } from "react";
import { Search, MessageSquare, Users, Filter, ArrowUpDown, Clock, Star, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/bits/DropdownMenu";
import { useChatContext } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";
import { usePagination } from "../../contexts/PaginationContext";

/**
 * ChatLeftCardSimple - Simple chat list for StableLayout integration
 * This is the left card content that appears in StableLayout for the chat page
 */
const ChatLeftCardSimple: React.FC = () => {
  const {
    selectedContact,
    setSelectedContact,
    groups,
    favorites,
    paginatedUsers
  } = useChatContext();
  const { isAuthenticated } = useAuth();
  const { currentPage, setPaginationData, onPageChange } = usePagination();

  // Container ref for height calculation
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "status" | "lastMessage" | "unreadCount">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Dynamically calculate optimal records per page based on container height
  useEffect(() => {
    const calculateOptimalRecords = () => {
      if (!containerRef.current) return;

      const containerHeight = containerRef.current.clientHeight;
      const searchHeight = 80; // Search bar height
      const tabsHeight = 50; // Tabs height
      const padding = 32; // Container padding
      const cardHeight = 48; // Natural card height
      const cardSpacing = 8; // space-y-2 = 8px

      const availableHeight = containerHeight - searchHeight - tabsHeight - padding;
      const optimalRecords = Math.floor(availableHeight / (cardHeight + cardSpacing));

      // Ensure we show at least 6 records and at most 12
      const finalRecords = Math.max(6, Math.min(12, optimalRecords));
      setRecordsPerPage(finalRecords);
    };

    calculateOptimalRecords();
    window.addEventListener('resize', calculateOptimalRecords);
    return () => window.removeEventListener('resize', calculateOptimalRecords);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  // Load chat data when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      // The context will handle loading chat data
    } else {
      setSelectedContact(null);
    }
  }, [isAuthenticated, setSelectedContact]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };



  const getTypeBulletColor = (type: string) => {
    switch (type) {
      case "contact":
        return "bg-blue-500";
      case "group":
        return "bg-green-500";
      case "favorite":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return "";
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleTypeFilter = (type: string) => {
    setActiveType(type);
    onPageChange(1);
  };

  const handleStatusFilter = (status: string) => {
    setActiveStatus(status);
    onPageChange(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onPageChange(1);
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

  const handleSortChange = (newSortBy: "name" | "status" | "lastMessage" | "unreadCount") => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Combine all chat items (contacts, groups, favorites)
  const allChatItems = [
    ...paginatedUsers.map((user: any) => ({ ...user, type: "contact" })),
    ...groups.map((group: any) => ({ ...group, type: "group" })),
    ...favorites.map((favorite: any) => ({ ...favorite, type: "favorite" }))
  ];

  // Filter chat items based on search and filters
  const filteredChatItems = allChatItems.filter((item) => {
    const matchesSearch = searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.department && item.department.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = activeType === "all" || item.type === activeType;
    const matchesStatus = activeStatus === "all" || item.status === activeStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort filtered items
  const sortedChatItems = [...filteredChatItems].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "lastMessage":
        aValue = a.lastMessageTime || "";
        bValue = b.lastMessageTime || "";
        break;
      case "unreadCount":
        aValue = a.unreadCount || 0;
        bValue = b.unreadCount || 0;
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedChatItems.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedChatItems = sortedChatItems.slice(startIndex, endIndex);

  // Update pagination context when data changes
  useEffect(() => {
    setPaginationData({
      currentPage: currentPage > totalPages ? 1 : currentPage,
      totalPages,
      totalRecords: sortedChatItems.length,
      recordsPerPage,
    });
  }, [totalPages, sortedChatItems.length, recordsPerPage, setPaginationData, currentPage]);

  return (
    <div ref={containerRef} className="h-full flex flex-col">
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
                        { key: "contact", icon: Users, label: "Contacts" },
                        { key: "group", icon: MessageSquare, label: "Groups" },
                        { key: "favorite", icon: Star, label: "Favorites" }
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
                        { key: "online", label: "Online" },
                        { key: "away", label: "Away" },
                        { key: "offline", label: "Offline" }
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

            {/* Sort Dropdown (positioned relative to this button) */}
            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2 space-y-1">
                  {[
                    { key: "name", label: "Name" },
                    { key: "status", label: "Status" },
                    { key: "lastMessage", label: "Last Message" },
                    { key: "unreadCount", label: "Unread Count" }
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

          {/* More Options Dropdown for tests - always present */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="chat-left-more-options"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
                  title="Contact options (left)"
                >
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-3 py-2 text-xs text-gray-700">Contact actions</div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search contacts, groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
              className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Type-based Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto bg-gray-50">
        {[
          { key: "all", label: "All", count: filteredChatItems.length, type: "all" },
          { key: "contact", label: "Contacts", count: filteredChatItems.filter(u => u.type === "contact").length, type: "contact" },
          { key: "group", label: "Groups", count: filteredChatItems.filter(u => u.type === "group").length, type: "group" },
          { key: "favorite", label: "Favorites", count: filteredChatItems.filter(u => u.type === "favorite").length, type: "favorite" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTypeFilter(tab.key)}
            className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium transition-all duration-200 border-b-2 flex items-center gap-1.5 ${
              activeType === tab.key
                ? "text-gray-900 border-blue-500 bg-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 border-transparent hover:bg-gray-100 hover:border-gray-300"
            }`}
          >
            {/* Type indicator dot */}
            {tab.type !== "all" && (
              <div
                className={`w-2 h-2 rounded-full ${getTypeBulletColor(tab.type)}`}
                title={`Type: ${tab.type}`}
              />
            )}
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full font-medium ${
                activeType === tab.key
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-600"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>



      {/* Chat Items List */}
      <div className="flex-1 overflow-hidden">
        {paginatedChatItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="h-6 w-6 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="h-3 w-3 text-gray-500" />
            </div>
            <p className="text-xs text-gray-700">
              {searchQuery || activeType !== 'all' || activeStatus !== 'all'
                ? 'No contacts found matching your filters.'
                : 'No contacts available.'
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex flex-col space-y-2 px-1 py-3 flex-1 overflow-y-auto">
              {paginatedChatItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  data-testid="chat-item"
                  onClick={() => setSelectedContact(item)}
                  className={`p-2.5 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-b border-gray-100 flex flex-col justify-center ${
                    selectedContact?.id === item.id
                      ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-sm"
                      : "hover:border-l-4 hover:border-l-gray-300"
                  }`}
                >
                  {/* Avatar and content layout */}
                  <div className="flex items-start gap-2.5">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-xs">
                          {item.type === "group" ? (
                            <Users className="h-4 w-4" />
                          ) : item.type === "favorite" ? (
                            <Star className="h-4 w-4" />
                          ) : (
                            item.avatar || item.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        {/* Status indicator for contacts */}
                        {item.type === "contact" && (
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusColor(item.status)}`}
                            title={`Status: ${item.status}`}
                          />
                        )}
                      </div>
                    </div>

                    {/* Right side content - 2 lines */}
                    <div className="flex-1 min-w-0">
                      {/* Line 1: Name and status */}
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Status indicator */}
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(item.status)}`} title={`Status: ${item.status}`} />
                            <span className="text-xs text-gray-600 capitalize">{item.status}</span>
                          </div>

                          {/* Unread count */}
                          {item.unreadCount > 0 && (
                            <span className="px-1 py-0.5 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                              {item.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Line 2: Title/Department and timestamp */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 min-w-0">
                          {item.title && (
                            <span className="font-medium text-gray-700 truncate">
                              {item.title}
                            </span>
                          )}
                          {item.department && (
                            <>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600 truncate">
                                {item.department}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Timestamp */}
                        {item.lastMessageTime && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(item.lastMessageTime)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLeftCardSimple;
