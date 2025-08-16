import React, { useState, useRef, useEffect } from "react";
import { Search, RefreshCw, ChevronDown, Newspaper, MessageSquare, AlertTriangle, Filter, Clock, CheckCircle, AlertCircle, Trash2, ThumbsUp, ThumbsDown, MessageCircle, FileText, ImageIcon } from "lucide-react";
import { useNewsContext } from "./NewsContext";
import { useAuth } from "../../contexts/AuthContext";

/**
 * NewsLeftCardSimple - Simple news updates list for StableLayout integration
 * This is the left card content that appears in StableLayout for the news page
 */
const NewsLeftCardSimple: React.FC = () => {
  const {
    selectedUpdate,
    setSelectedUpdate,
    updates,
    loading,
    error,
    refreshUpdates,
    filterUpdates,
    deleteUpdate
  } = useNewsContext();
  const { isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setStatusDropdownOpen(false);
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

  const handleDeleteUpdate = async (updateId: string) => {
    if (!confirm('Are you sure you want to delete this update?')) return;

    try {
      await deleteUpdate(updateId);
      if (selectedUpdate?.id === updateId) {
        setSelectedUpdate(null);
      }
    } catch (error) {
      console.error('Error deleting update:', error);
      alert('Failed to delete update');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-100 text-red-800 border-red-200";
      case "news":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "communication":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  // Get status icon for the dropdown button
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return Clock;
      case "read":
        return CheckCircle;
      case "urgent":
        return AlertCircle;
      default:
        return Filter;
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
    setActiveType(type);
    await filterUpdates(type, activeStatus, searchQuery);
  };

  const handleStatusFilter = async (status: string) => {
    setActiveStatus(status);
    await filterUpdates(activeType, status, searchQuery);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await filterUpdates(activeType, activeStatus, query);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">News Updates</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshUpdates}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch((e.target as HTMLInputElement).value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Combined Type and Status Filters */}
        <div className="flex items-center gap-3 mb-3">
          {/* Type Filter Icons */}
          <div className="flex gap-1">
            {[
              { key: "all", icon: Filter, label: "All Types" },
              { key: "news", icon: Newspaper, label: "News" },
              { key: "communication", icon: MessageSquare, label: "Communication" },
              { key: "alert", icon: AlertTriangle, label: "Alerts" }
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => handleTypeFilter(key)}
                title={label}
                className={`p-2 rounded-lg border transition-all duration-150 ${
                  activeType === key
                    ? "bg-blue-100 text-blue-700 border-blue-300 shadow-sm"
                    : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setStatusDropdownOpen(!statusDropdownOpen);
                }
              }}
              aria-haspopup="listbox"
              aria-expanded={statusDropdownOpen}
              aria-label="Filter by status"
              className="flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const StatusIcon = getStatusIcon(activeStatus);
                  return <StatusIcon className="h-4 w-4 text-gray-500" />;
                })()}
                <span className="text-gray-700">
                  {activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${statusDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {statusDropdownOpen && (
              <div
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg transform transition-all duration-200 ease-in-out origin-top"
                role="listbox"
                aria-label="Status options"
              >
                {["all", "new", "read", "urgent"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      handleStatusFilter(status);
                      setStatusDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleStatusFilter(status);
                        setStatusDropdownOpen(false);
                      }
                    }}
                    role="option"
                    aria-selected={activeStatus === status}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-150 ${
                      activeStatus === status
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-l-blue-500"
                        : "text-gray-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Updates List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading updates...</p>
          </div>
        ) : updates.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery || activeType !== 'all' || activeStatus !== 'all'
              ? 'No updates found matching your filters.'
              : 'No updates available.'
            }
          </div>
        ) : (
          updates.map((update) => (
            <div
              key={update.id}
              onClick={() => setSelectedUpdate(update)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedUpdate?.id === update.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
              }`}
            >
              {/* Update Header */}
              <div className="flex items-start gap-3 mb-2">
                <div className="text-2xl">{update.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {update.title}
                    </span>
                    <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(update.status)}`}></span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {update.summary}
                  </p>
                </div>
              </div>

              {/* Update Meta */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span>{update.author}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(update.timestamp)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(update.type)}`}>
                    {update.type}
                  </span>
                </div>
              </div>

              {/* CRUD Operations - Only for author and staff/admin */}
              {update.can_delete && (
                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUpdate(update.id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              )}

              {/* Tags */}
              {update.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {update.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {update.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      +{update.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Metadata: Likes, Comments, Attachments */}
              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                {/* Likes */}
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{update.likes_count || 0}</span>
                  <ThumbsDown className="h-3 w-3" />
                  <span>{update.dislikes_count || 0}</span>
                </div>

                {/* Comments */}
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{update.comments_count || 0}</span>
                </div>

                {/* Attachments */}
                {update.content?.attachments?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{update.content.attachments.length}</span>
                  </div>
                )}

                {/* Media */}
                {update.content?.media?.length > 0 && (
                  <div className="flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    <span>{update.content.media.length}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewsLeftCardSimple;
