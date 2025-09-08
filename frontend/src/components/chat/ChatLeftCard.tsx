import React, { useState, useEffect, useRef, useMemo } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Search,
  MessageSquare,
  Users,
  Star,
  MoreVertical,
  Filter,
  ArrowUpDown,
  Clock,
  Trash2,
  CheckCircle,
  Circle,
  X,
  User,
  UserX,
  UserCheck,
  Archive,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { useChatContext, Contact } from "../../contexts/ChatContext";
import { useNotification } from "../../contexts/NotificationContext";
import { usePagination } from "../../contexts/PaginationContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "../ui/bits/DropdownMenu";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { TOGGLE_FAVORITE, GET_USER_FAVORITES, CLEAR_ALL_FAVORITES, TOGGLE_BLOCK, GET_USER_BLOCKS, ARCHIVE_CHAT, UNARCHIVE_CHAT } from "../../graphql/chatQueries";

/**
 * ChatLeftCard - Modern, feature-rich chat left card component
 *
 * Features:
 * - Advanced search with filters
 * - Tab system (Contacts, Groups, Favorites)
 * - Real-time status indicators
 * - Context menus for actions
 * - Drag & drop favorites
 * - Group management
 * - Modern UI with animations
 */
const ChatLeftCard: React.FC = () => {
  const {
    selectedContact,
    setSelectedContact,
    groups,
    favorites,
    activeTab,
    setActiveTab,
    setShowProfileView,
    allUsers,
  } = useChatContext();

  const { showSuccess, showError, showInfo } = useNotification();
  const { user: currentUser } = useAuth();

  // Use the existing pagination context
  const {
    currentPage,
    recordsPerPage,
    updatePagination,
  } = usePagination();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchFilters, setShowSearchFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    status: "all" as "all" | "online" | "away" | "offline" | "group",
    department: "all" as string,
    hasUnread: false,
    isFavorite: false,
  });
  const [sortBy, setSortBy] = useState<"name" | "status" | "lastMessage" | "unreadCount">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [blockedContacts, setBlockedContacts] = useState<Set<number>>(new Set());
  const [favoriteContacts, setFavoriteContacts] = useState<Set<number>>(new Set());
  const [archivedContacts, setArchivedContacts] = useState<Set<number>>(new Set());
  const [contextMenuTarget, setContextMenuTarget] = useState<Contact | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);

  // GraphQL mutations and queries
  const [toggleFavorite] = useMutation(TOGGLE_FAVORITE);
  const { data: favoritesData, refetch: refetchFavorites } = useQuery(GET_USER_FAVORITES);
  const [clearAllFavorites] = useMutation(CLEAR_ALL_FAVORITES);
  const [toggleBlock] = useMutation(TOGGLE_BLOCK);
  const { data: blocksData, refetch: refetchBlocks } = useQuery(GET_USER_BLOCKS);
  const [archiveChat] = useMutation(ARCHIVE_CHAT);
  const [unarchiveChat] = useMutation(UNARCHIVE_CHAT);


  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    allUsers.forEach(user => {
      if (user.department) deptSet.add(user.department);
    });
    return Array.from(deptSet).sort();
  }, [allUsers]);

  // Helper functions to check contact states
  const isContactFavorite = (contactId: number) => favoriteContacts.has(contactId);

  const isContactBlocked = (contactId: number) => blockedContacts.has(contactId);

  // Debug logging for favoriteContacts state
  useEffect(() => {
    console.log("🔍 favoriteContacts state changed:", {
      size: favoriteContacts.size,
      ids: Array.from(favoriteContacts)
    });
  }, [favoriteContacts]);

  // Debug logging for blockedContacts state
  useEffect(() => {
    console.log("🔍 blockedContacts state changed:", {
      size: blockedContacts.size,
      ids: Array.from(blockedContacts)
    });
  }, [blockedContacts]);

  // Debug logging for activeTab changes
  useEffect(() => {
    console.log("🔍 activeTab changed to:", activeTab);
  }, [activeTab]);

  // Load user's favorites and blocks on component mount
  useEffect(() => {
    console.log("🔍 Data Loading Debug - useEffect triggered:", {
      favoritesData,
      hasFavoritesData: !!favoritesData,
      userFavorites: favoritesData?.userFavorites,
      userFavoritesLength: favoritesData?.userFavorites?.length,
      blocksData,
      hasBlocksData: !!blocksData,
      userBlocks: blocksData?.userBlocks,
      userBlocksLength: blocksData?.userBlocks?.length,
    });

    if (favoritesData?.userFavorites) {
      const favoriteIds = new Set<number>(
        favoritesData.userFavorites.map((fav: any) => {
          const id = parseInt(fav.favoriteUser.id, 10);
          console.log("🔍 Processing favorite:", {
            fav,
            favoriteUser: fav.favoriteUser,
            parsedId: id
          });
          return id;
        })
      );
      console.log("🔍 Setting favoriteContacts:", Array.from(favoriteIds));
      setFavoriteContacts(favoriteIds);
    } else {
      console.log("🔍 No favorites data available");
    }

    if (blocksData?.userBlocks) {
      console.log("🔍 Blocks Debug - Loading blocks data:", {
        blocksData,
        userBlocks: blocksData.userBlocks,
        userBlocksLength: blocksData.userBlocks.length
      });
      const blockedIds = new Set<number>(
        blocksData.userBlocks.map((block: any) => {
          const id = parseInt(block.blockedUser.id, 10);
          console.log("🔍 Processing blocked user:", {
            block,
            blockedUser: block.blockedUser,
            parsedId: id
          });
          return id;
        })
      );
      console.log("🔍 Setting blockedContacts:", Array.from(blockedIds));
      setBlockedContacts(blockedIds);
    } else {
      console.log("🔍 No blocks data available");
    }

  }, [favoritesData, blocksData, currentUser]);

  // Handler functions for toggling favorites and blocks
  const handleToggleFavorite = async (contactId: number) => {
    try {
      const { data } = await toggleFavorite({
        variables: { favoriteUserId: contactId.toString() }
      });

      if (data?.toggleFavorite?.success) {
        setFavoriteContacts(prev => {
          const newFavorites = new Set(prev);
          if (data.toggleFavorite.isFavorite) {
            newFavorites.add(contactId);
          } else {
            newFavorites.delete(contactId);
          }
          return newFavorites;
        });
        // Refetch GraphQL data to ensure consistency
        await refetchFavorites();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleToggleBlock = async (contactId: number) => {
    try {
      const { data } = await toggleBlock({
        variables: { blockedUserId: contactId.toString() }
      });

      if (data?.toggleBlock?.success) {
        setBlockedContacts(prev => {
          const newBlocked = new Set(prev);
          if (data.toggleBlock.isBlocked) {
            newBlocked.add(contactId);
          } else {
            newBlocked.delete(contactId);
          }
          return newBlocked;
        });
        // Refetch GraphQL data to ensure consistency
        await refetchBlocks();
      }
    } catch (error) {
      console.error('Error toggling block:', error);
    }
  };

  // Handler for clearing all favorites
  const handleClearAllFavorites = async () => {
    try {
      const { data } = await clearAllFavorites();

      if (data?.clearAllFavorites?.success) {
        // Clear local state
        setFavoriteContacts(new Set());
        // Refetch GraphQL data to ensure consistency
        await refetchFavorites();
        showSuccess("Favorites Cleared", `Successfully cleared ${data.clearAllFavorites.clearedCount} favorites`);
      } else {
        showError("Error", "Failed to clear favorites");
      }
    } catch (error) {
      console.error('Error clearing all favorites:', error);
      showError("Error", "Failed to clear favorites");
    }
  };

  // Simple Archive Handler
  const handleArchiveChat = async (contactId: number) => {
    try {
      const { data } = await archiveChat({
        variables: { userId: contactId }
      });

      if (data?.archiveChat?.success) {
        setArchivedContacts(prev => new Set([...prev, contactId]));
        showSuccess("Chat Archived", `Chat with contact archived successfully`);
      } else {
        showError("Error", data?.archiveChat?.message || "Failed to archive chat");
      }
    } catch (error) {
      console.error('Error archiving chat:', error);
      showError("Error", "Failed to archive chat");
    }
  };

  // Simple Unarchive Handler
  const handleUnarchiveChat = async (contactId: number) => {
    try {
      const { data } = await unarchiveChat({
        variables: { userId: contactId }
      });

      if (data?.unarchiveChat?.success) {
        setArchivedContacts(prev => {
          const newSet = new Set(prev);
          newSet.delete(contactId);
          return newSet;
        });
        showSuccess("Chat Unarchived", `Chat with contact unarchived successfully`);
      } else {
        showError("Error", data?.unarchiveChat?.message || "Failed to unarchive chat");
      }
    } catch (error) {
      console.error('Error unarchiving chat:', error);
      showError("Error", "Failed to unarchive chat");
    }
  };

  // Helper function to check if contact is archived
  const isContactArchived = (contactId: number) => archivedContacts.has(contactId);

  // Filter and sort data based on search and filters
  const filteredAndSortedData = useMemo(() => {
    let data: Contact[] = [];

    switch (activeTab) {
      case "contacts":
        data = [...allUsers];
        break;
      case "groups":
        data = [...groups];
        break;
      case "favorites":
        // Filter allUsers to show only favorites
        data = allUsers.filter(contact => favoriteContacts.has(contact.id));
        break;
      case "blocked":
        // Filter allUsers to show only blocked contacts
        data = allUsers.filter(contact => blockedContacts.has(contact.id));
        break;
      case "archived":
        // Filter allUsers to show only archived contacts
        data = allUsers.filter(contact => archivedContacts.has(contact.id));
        break;
      default:
        data = [...allUsers];
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.title.toLowerCase().includes(query) ||
        contact.department?.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (searchFilters.status !== "all") {
      data = data.filter(contact => contact.status === searchFilters.status);
    }

    // Apply department filter
    if (searchFilters.department !== "all") {
      data = data.filter(contact => contact.department === searchFilters.department);
    }

    // Apply unread filter
    if (searchFilters.hasUnread) {
      data = data.filter(contact => contact.unreadCount > 0);
    }

    // Apply favorite filter
    if (searchFilters.isFavorite) {
      data = data.filter(contact => isContactFavorite(contact.id));
    }

    // Filter out blocked contacts by default (except when viewing blocked tab)
    if (activeTab !== "blocked") {
      data = data.filter(contact => !isContactBlocked(contact.id));
    }



    // Sort data
    data.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "status":
          const statusOrder = { online: 0, away: 1, offline: 2, group: 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case "lastMessage":
          comparison = a.lastMessageTime.localeCompare(b.lastMessageTime);
          break;
        case "unreadCount":
          comparison = a.unreadCount - b.unreadCount;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return data;
  }, [allUsers, groups, favorites, activeTab, searchQuery, searchFilters, sortBy, sortOrder, favoriteContacts, blockedContacts, archivedContacts]);

  // Get display data (showing paginated filtered and sorted data)
  const displayData = useMemo(() => {
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage, recordsPerPage]);

  // Update pagination context when filtered data changes
  useEffect(() => {
    const newTotalRecords = filteredAndSortedData.length;
    const newTotalPages = Math.ceil(newTotalRecords / recordsPerPage);
    updatePagination({
      totalRecords: newTotalRecords,
      totalPages: newTotalPages,
    });
  }, [filteredAndSortedData.length, recordsPerPage, updatePagination]);

  // Handle contact selection
  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, contact: Contact) => {
    e.preventDefault();
    e.stopPropagation();

    setContextMenuTarget(contact);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation support\n  useEffect(() => {\n    const handleKeyDown = (event: KeyboardEvent) => {\n      // Close context menu on Escape\n      if (event.key === "Escape" && showContextMenu) {\n        setShowContextMenu(false);\n      }\n      \n      // Quick actions with keyboard shortcuts\n      if (event.ctrlKey || event.metaKey) {\n        switch (event.key) {\n          case "f":\n            event.preventDefault();\n            searchInputRef.current?.focus();\n            break;\n          case "k":\n            event.preventDefault();\n            setShowSearchFilters(!showSearchFilters);\n            break;\n        }\n      }\n    };\n\n    document.addEventListener("keydown", handleKeyDown);\n    return () => document.removeEventListener("keydown", handleKeyDown);\n  }, [showContextMenu, showSearchFilters]);

  // Context menu actions
  const handleContextMenuAction = async (action: string, contact: Contact) => {
    setShowContextMenu(false);

    switch (action) {
      case "start_chat":
        handleContactSelect(contact);
        break;
      case "view_profile":
        setSelectedContact(contact);
        console.log("Setting profile view to true for contact:", contact.name);
        setShowProfileView(true);
        break;
      case "add_to_favorites":
        await handleToggleFavorite(contact.id);
        showSuccess("Added to Favorites", `Added ${contact.name} to favorites`);
        break;
      case "remove_from_favorites":
        await handleToggleFavorite(contact.id);
        showSuccess("Removed from Favorites", `Removed ${contact.name} from favorites`);
        break;

      break;
      case "archive_chat":
        await handleArchiveChat(contact.id);
        break;
      case "unarchive_chat":
        await handleUnarchiveChat(contact.id);
        break;
      case "delete_chat":
        if (window.confirm(`Are you sure you want to delete the chat with ${contact.name}?`)) {
          showError("Chat Deleted", `Deleted chat with ${contact.name}`);
        }
        break;
      case "block_contact":
        if (window.confirm(`Are you sure you want to block ${contact.name}?`)) {
          await handleToggleBlock(contact.id);
          showError("Contact Blocked", `Blocked ${contact.name}`);
        }
        break;
      case "unblock_contact":
        await handleToggleBlock(contact.id);
        showInfo("Contact Unblocked", `Unblocked ${contact.name}`);
        break;
      case "clear_all_favorites":
        if (window.confirm("Are you sure you want to clear all favorites?")) {
          await handleClearAllFavorites();
        }
        break;
      case "unblock_all_contacts":
        if (window.confirm("Are you sure you want to unblock all contacts?")) {
          // Unblock all contacts by clearing the blocked set
          setBlockedContacts(new Set());
          showSuccess("All Contacts Unblocked", "All blocked contacts have been unblocked");
        }
        break;

      default:
        break;
    }
  };

  // Get status icon and color
  const getStatusInfo = (status: Contact["status"]) => {
    switch (status) {
      case "online":
        return { icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-500" };
      case "away":
        return { icon: Clock, color: "text-yellow-500", bgColor: "bg-yellow-500" };
      case "offline":
        return { icon: Circle, color: "text-gray-400", bgColor: "bg-gray-400" };
      case "group":
        return { icon: Users, color: "text-blue-500", bgColor: "bg-blue-500" };
      default:
        return { icon: Circle, color: "text-gray-400", bgColor: "bg-gray-400" };
    }
  };

  // Format last message time
  const formatLastMessageTime = (timeString: string) => {
    if (!timeString) return "";

    const now = new Date();
    const messageTime = new Date(timeString);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchFilters(false);
    setSearchFilters({
      status: "all",
      department: "all",
      hasUnread: false,
      isFavorite: false,
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchFilters({
      status: "all",
      department: "all",
      hasUnread: false,
      isFavorite: false,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white" ref={containerRef}>
      {/* Header with Search */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search contacts, groups..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearchFilters(!showSearchFilters)}
            className="px-3"
          >
            <Filter className="w-4 h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="px-3">
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortBy === "name"}
                onCheckedChange={() => setSortBy("name")}
              >
                Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "status"}
                onCheckedChange={() => setSortBy("status")}
              >
                Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "lastMessage"}
                onCheckedChange={() => setSortBy("lastMessage")}
              >
                Last Message
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === "unreadCount"}
                onCheckedChange={() => setSortBy("unreadCount")}
              >
                Unread Count
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={sortOrder === "asc"}
                onCheckedChange={() => setSortOrder("asc")}
              >
                Ascending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortOrder === "desc"}
                onCheckedChange={() => setSortOrder("desc")}
              >
                Descending
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Filters */}
        {showSearchFilters && (
          <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Filters</h4>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Status</label>
                <select
                  value={searchFilters.status}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="away">Away</option>
                  <option value="offline">Offline</option>
                  <option value="group">Groups</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">Department</label>
                <select
                  value={searchFilters.department}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={searchFilters.hasUnread}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, hasUnread: e.target.checked }))}
                  className="rounded"
                />
                Has Unread
              </label>

              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={searchFilters.isFavorite}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, isFavorite: e.target.checked }))}
                  className="rounded"
                />
                Favorites Only
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "contacts"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
          title={`Contacts (${allUsers.length})`}
        >
          <div className="flex items-center justify-center gap-2">
            <User className="w-5 h-5" />
            <Badge variant="secondary" className="text-xs">
              {allUsers.length}
            </Badge>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("groups")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "groups"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
          title={`Groups (${groups.length})`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="w-5 h-5" />
            <Badge variant="secondary" className="text-xs">
              {groups.length}
            </Badge>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "favorites"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
          title={`Favorites (${favoriteContacts.size})`}
        >
          <div className="flex items-center justify-center gap-2">
            <Star className="w-5 h-5" />
            <Badge variant="secondary" className="text-xs">
              {favoriteContacts.size}
            </Badge>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("blocked")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "blocked"
              ? "text-red-600 border-b-2 border-red-600 bg-red-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
          title={`Blocked (${blockedContacts.size})`}
        >
          <div className="flex items-center justify-center gap-2">
            <UserX className="w-5 h-5" />
            <Badge variant="secondary" className="text-xs">
              {blockedContacts.size}
            </Badge>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("archived")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "archived"
              ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
          title={`Archived (${archivedContacts.size})`}
        >
          <div className="flex items-center justify-center gap-2">
            <Archive className="w-5 h-5" />
            <Badge variant="secondary" className="text-xs">
              {archivedContacts.size}
            </Badge>
          </div>
        </button>
      </div>

      {/* Sort and Actions Bar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {/* Sort functionality moved to search section */}
        </div>


      </div>

      {/* Favorites Header */}
      {activeTab === "favorites" && (
        <div className="flex items-center justify-between px-3 py-2 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              {favoriteContacts.size} Favorite{favoriteContacts.size !== 1 ? 's' : ''}
            </span>
          </div>
          {favoriteContacts.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleContextMenuAction("clear_all_favorites", {} as Contact)}
              className="text-xs text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Blocked Header */}
      {activeTab === "blocked" && (
        <div className="flex items-center justify-between px-3 py-2 bg-red-50 border-b border-red-200">
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              {blockedContacts.size} Blocked Contact{blockedContacts.size !== 1 ? 's' : ''}
            </span>
          </div>
          {blockedContacts.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleContextMenuAction("unblock_all_contacts", {} as Contact)}
              className="text-xs text-green-600 border-green-300 hover:bg-green-50"
            >
              <UserCheck className="w-3 h-3 mr-1" />
              Unblock All
            </Button>
          )}
        </div>
      )}



      {/* Contact/Group List */}
      <div className="flex-1 overflow-y-auto">
        {displayData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-sm font-medium">No {activeTab} found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchQuery ? "Try adjusting your search" : `No ${activeTab} available`}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5 p-2">
            {displayData.map((contact) => {
              const statusInfo = getStatusInfo(contact.status);
              const StatusIcon = statusInfo.icon;
              const isSelected = selectedContact?.id === contact.id;
              const isFavorite = isContactFavorite(contact.id);

              return (
                <div
                  key={contact.id}
                  className={`group relative flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                    isSelected ? "bg-blue-50 border border-blue-200" : ""
                  }`}
                  onClick={() => handleContactSelect(contact)}
                  onContextMenu={(e) => handleContextMenu(e, contact)}
                >
                  {/* Avatar */}
                  <div className="relative mr-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                        {contact.avatar}
                      </AvatarFallback>
                    </Avatar>

                    {/* Status Indicator */}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusInfo.bgColor}`}>
                      <StatusIcon className={`w-2.5 h-2.5 ${statusInfo.color} absolute top-0.5 left-0.5`} />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        {isFavorite && (
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        )}
                        {contact.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 truncate">
                        {contact.title}
                        {contact.department && (
                          <span className="ml-1">• {contact.department}</span>
                        )}
                      </p>
                      {contact.lastMessageTime && (
                        <span className="text-xs text-gray-400 ml-2">
                          {formatLastMessageTime(contact.lastMessageTime)}
                        </span>
                      )}
                    </div>

                    {contact.lastMessage && (
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {contact.lastMessage}
                      </p>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContextMenuAction("start_chat", contact);
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleContextMenuAction("start_chat", contact)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Start Chat
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleContextMenuAction("view_profile", contact)}>
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isFavorite ? (
                          <DropdownMenuItem onClick={() => handleContextMenuAction("remove_from_favorites", contact)}>
                            <Star className="w-4 h-4 mr-2" />
                            Remove from Favorites
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleContextMenuAction("add_to_favorites", contact)}>
                            <Star className="w-4 h-4 mr-2" />
                            Add to Favorites
                          </DropdownMenuItem>
                        )}

                        {isContactBlocked(contact.id) ? (
                          <DropdownMenuItem onClick={() => handleContextMenuAction("unblock_contact", contact)}>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Unblock Contact
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleContextMenuAction("block_contact", contact)}>
                            <UserX className="w-4 h-4 mr-2" />
                            Block Contact
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {isContactArchived(contact.id) ? (
                          <DropdownMenuItem onClick={() => handleContextMenuAction("unarchive_chat", contact)}>
                            <Archive className="w-4 h-4 mr-2" />
                            Unarchive Chat
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleContextMenuAction("archive_chat", contact)}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive Chat
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleContextMenuAction("delete_chat", contact)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {showContextMenu && contextMenuTarget && (
        <div
          ref={contextMenuRef}
          className={`fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[200px] left-[${contextMenuPosition.x}px] top-[${contextMenuPosition.y}px]`}
        >
          <DropdownMenuContent className="w-full">
            <DropdownMenuItem onClick={() => handleContextMenuAction("start_chat", contextMenuTarget)}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleContextMenuAction("view_profile", contextMenuTarget)}>
              <User className="w-4 h-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isContactFavorite(contextMenuTarget.id) ? (
              <DropdownMenuItem onClick={() => handleContextMenuAction("remove_from_favorites", contextMenuTarget)}>
                <Star className="w-4 h-4 mr-2" />
                Remove from Favorites
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleContextMenuAction("add_to_favorites", contextMenuTarget)}>
                <Star className="w-4 h-4 mr-2" />
                Add to Favorites
              </DropdownMenuItem>
            )}

            {isContactBlocked(contextMenuTarget.id) ? (
              <DropdownMenuItem onClick={() => handleContextMenuAction("unblock_contact", contextMenuTarget)}>
                <UserCheck className="w-4 h-4 mr-2" />
                Unblock Contact
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleContextMenuAction("block_contact", contextMenuTarget)}>
                <UserX className="w-4 h-4 mr-2" />
                Block Contact
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {isContactArchived(contextMenuTarget.id) ? (
              <DropdownMenuItem onClick={() => handleContextMenuAction("unarchive_chat", contextMenuTarget)}>
                <Archive className="w-4 h-4 mr-2" />
                Unarchive Chat
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleContextMenuAction("archive_chat", contextMenuTarget)}>
                <Archive className="w-4 h-4 mr-2" />
                Archive Chat
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleContextMenuAction("delete_chat", contextMenuTarget)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      )}
    </div>
  );
};

export default ChatLeftCard;
