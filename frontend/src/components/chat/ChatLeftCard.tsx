import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  Star,
  Users,
  MoreVertical,
  UserPlus,
  Plus,
  Heart,
  FileText,
  Download,
  Bell,
  Pin,
  Archive,
  Trash2,
  AlertTriangle,
  Shield,
  Search as SearchIcon,
  Eye,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { useChatContext } from "../../contexts/ChatContext";
import { useNotification } from "../../contexts/NotificationContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/bits/DropdownMenu";

/**
 * ChatLeftCard - Chat page specific left card content component
 * Master component - contains contacts, groups, and favorites for selection
 * Related to the chat window in the right card (master-detail relationship)
 * WhatsApp-style contact management
 */
const ChatLeftCard: React.FC = () => {
  const {
    selectedContact,
    setSelectedContact,
    contacts,
    groups,
    favorites,
    activeTab,
    setActiveTab,
    setShowProfileView,
    currentPage,
    totalPages,
    totalRecords,
    recordsPerPage,
    goToPage,
    setRecordsPerPage,
    updatePagination,
    allUsers,
  } = useChatContext();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();

  // Debug data
  console.log('🔍 ChatLeftCard Debug:', {
    contacts: contacts?.length,
    allUsers: allUsers?.length,
    groups: groups?.length,
    favorites: favorites?.length,
    activeTab,
    currentPage,
    totalPages: totalPages || 1,
    totalRecords,
    recordsPerPage,
    shouldShowPagination: totalPages > 1,
    calculatedPages: Math.ceil(totalRecords / recordsPerPage),
    paginationFooterData: {
      currentPage,
      totalPages: totalPages || 1,
      totalRecords,
      recordsPerPage
    }
  });

  // Debug avatar data
  if (allUsers && allUsers.length > 0) {
    console.log('🔍 ChatLeftCard - Sample users with avatars:', allUsers.slice(0, 3).map((user: any) => ({
      name: user.name,
      avatarUrl: user.avatarUrl,
      hasAvatarUrl: !!user.avatarUrl,
      isImageUrl: user.avatarUrl?.includes('http'),
      isPngUrl: user.avatarUrl?.includes('.png'),
      isJpegUrl: user.avatarUrl?.includes('.jpeg')
    })));
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [contextMenuTarget, setContextMenuTarget] = useState<any>(null);
  const [newContactData, setNewContactData] = useState({
    name: "",
    title: "",
    department: "",
    email: "",
  });
  const [newGroupData, setNewGroupData] = useState({
    name: "",
    description: "",
    department: "",
    members: [] as string[],
  });

  // Refs for measuring space
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // total counts are computed in-place for pagination footer

  // Dynamic height calculation to prevent scrollbars and footer invasion
  useEffect(() => {
    const calculateOptimalHeight = () => {
      if (!containerRef.current) return;

      const containerHeight = containerRef.current.clientHeight;
      const searchHeight = 80; // Search bar height
      const tabsHeight = 60; // Tabs height
      const footerHeight = 0; // No footer in this component, but reserved space
      const availableHeight =
        containerHeight - searchHeight - tabsHeight - footerHeight;

      // Each contact item is approximately 64px tall (16px padding + 48px content)
      const itemHeight = 64;
      const maxItems = Math.floor(availableHeight / itemHeight);

      // Ensure we show at least 3 items and at most 12 to prevent footer invasion
      const optimalItems = Math.max(3, Math.min(12, maxItems));

      // Apply height constraint to content area
      if (contentRef.current) {
        const maxContentHeight = optimalItems * itemHeight;
        contentRef.current.style.maxHeight = `${maxContentHeight}px`;
      }
    };

    calculateOptimalHeight();

    // Recalculate on window resize
    window.addEventListener("resize", calculateOptimalHeight);
    return () => window.removeEventListener("resize", calculateOptimalHeight);
  }, []);

  // Dynamically compute recordsPerPage (number of visible items) based on available height
  useEffect(() => {
    const calculateRecords = () => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const listEl = contentRef.current;

      let available = container.clientHeight;
      if (listEl) {
        const listTop = (listEl as HTMLElement).offsetTop - container.offsetTop;
        available = Math.max(0, container.clientHeight - listTop - 8);
      }

      const DEFAULT_CARD_HEIGHT = 64;
      // Try to sample a card to get accurate height
      const sample = container.querySelector('.h-16') as HTMLElement | null;
      const cardHeight = sample ? sample.offsetHeight : DEFAULT_CARD_HEIGHT;

      const computed = Math.max(3, Math.min(10, Math.floor(available / cardHeight))); // Reduced max from 12 to 10 to ensure pagination shows

      console.log('🔍 ChatLeftCard - Dynamic records calculation:', {
        containerHeight: container.clientHeight,
        available,
        cardHeight,
        computed,
        currentRecordsPerPage: recordsPerPage,
        totalUsers: usersSource?.length || 0,
        willShowPagination: (usersSource?.length || 0) > computed
      });

      // Only update if the computed value is different to avoid infinite loops
      if (computed !== recordsPerPage) {
        console.log('🔍 ChatLeftCard - Updating recordsPerPage:', computed);
        setRecordsPerPage(computed);
      }
    };

    calculateRecords();
    window.addEventListener('resize', calculateRecords);
    return () => window.removeEventListener('resize', calculateRecords);
  }, [recordsPerPage, setRecordsPerPage]);

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

  const handleAddContact = () => {
    if (!newContactData.name.trim() || !newContactData.title.trim()) {
      showWarning(
        "Missing Information",
        "Please fill in at least the name and title for the new contact.",
      );
      return;
    }

    // Create new contact
    const newContact = {
      id: Date.now(), // Simple ID generation
      name: newContactData.name.trim(),
      title: newContactData.title.trim(),
      department: newContactData.department.trim() || undefined,
      status: "offline" as const,
      lastMessage: "",
      lastMessageTime: "",
      unreadCount: 0,
      avatar: newContactData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      email: newContactData.email.trim() || undefined,
    };

    // Add to contacts (this would normally update the context)
    showSuccess(
      "Contact Added",
      `Contact "${newContact.name}" added successfully! You can now start a conversation.`,
    );

    // Reset form and close modal
    setNewContactData({ name: "", title: "", department: "", email: "" });
    setShowAddContactModal(false);

    // Switch to contacts tab to show the new contact
    setActiveTab("contacts");
  };

  const handleCreateGroup = () => {
    if (!newGroupData.name.trim()) {
      showWarning("Missing Information", "Please enter a group name");
      return;
    }

    // Create new group
    const newGroup = {
      id: Date.now(), // Simple ID generation
      name: newGroupData.name.trim(),
      description: newGroupData.description.trim() || undefined,
      department: newGroupData.department.trim() || undefined,
      status: "online" as const,
      lastMessage: "",
      lastMessageTime: "",
      unreadCount: 0,
      avatar: newGroupData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase(),
      memberCount: newGroupData.members.length || 1, // At least 1 member (creator)
      isGroup: true,
    };

    // Add to groups (this would normally update the context)
    showSuccess(
      "Group Created",
      `Group "${newGroup.name}" created successfully! You can now start a group conversation.`,
    );

    // Reset form and close modal
    setNewGroupData({ name: "", description: "", department: "", members: [] });
    setShowCreateGroupModal(false);

    // Switch to groups tab to show the new group
    setActiveTab("groups");
  };

  // Use full users list when available; fall back to paginatedUsers from context
  // Use complete allUsers list for proper pagination, not pre-paginated data
  const usersSource = contacts || allUsers || [];

  console.log('🔍 ChatLeftCard - Data source debug:', {
    contactsLength: contacts?.length,
    allUsersLength: allUsers?.length,
    usersSourceLength: usersSource.length,
    usersSource: usersSource.slice(0, 3) // Show first 3 items
  });

  // Filter all users for the Contacts tab
  const filteredAllUsers = usersSource.filter(
    (user: any) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department &&
        user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.title &&
        user.title.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Debug pagination to check for duplicates
  console.log('🔍 ChatLeftCard - Pagination debug:', {
    usersSourceLength: usersSource.length,
    filteredLength: filteredAllUsers.length,
    currentPage,
    recordsPerPage,
    startIndex: (currentPage - 1) * recordsPerPage,
    endIndex: (currentPage - 1) * recordsPerPage + recordsPerPage,
    activeTab
  });

  const filteredGroups = groups.filter(
    (group: any) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.department &&
        group.department.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const filteredFavorites = favorites.filter((favorite: any) =>
    favorite.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Prepare paginated lists per tab so rendering matches footer
  const contactsItems = filteredAllUsers;
  const groupsItems = filteredGroups;
  const favoritesItems = filteredFavorites;

  // total pages are computed on-the-fly where needed

  const startContacts = (currentPage - 1) * recordsPerPage;
  const startGroups = (currentPage - 1) * recordsPerPage;
  const startFavorites = (currentPage - 1) * recordsPerPage;

  const paginatedContacts = contactsItems.slice(startContacts, startContacts + recordsPerPage);
  const paginatedGroups = groupsItems.slice(startGroups, startGroups + recordsPerPage);
  const paginatedFavorites = favoritesItems.slice(startFavorites, startFavorites + recordsPerPage);

  // Reset to first page when filters change or activeTab changes
  useEffect(() => {
    goToPage(1);
  }, [searchQuery, activeTab, goToPage]);

  // Update pagination context when data changes
  useEffect(() => {
    const itemsForTab = activeTab === 'contacts'
      ? contactsItems
      : activeTab === 'groups'
        ? groupsItems
        : favoritesItems;

    const totalPagesLocal = Math.max(1, Math.ceil(itemsForTab.length / recordsPerPage));

    console.log('🔍 ChatLeftCard - Updating pagination:', {
      activeTab,
      itemsLength: itemsForTab.length,
      recordsPerPage,
      totalPagesLocal,
      currentPage
    });

    updatePagination({
      totalPages: totalPagesLocal,
      totalRecords: itemsForTab.length,
    });

    // Reset to page 1 if current page is beyond the new total pages
    if (currentPage > totalPagesLocal) {
      console.log('🔍 ChatLeftCard - Resetting to page 1, current page exceeded total pages');
      goToPage(1);
    }
  }, [contactsItems.length, groupsItems.length, favoritesItems.length, recordsPerPage, activeTab, updatePagination, currentPage, goToPage]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showContextMenu &&
        contextMenuTarget &&
        !contextMenuTarget.contains(e.target as Node)
      ) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showContextMenu, contextMenuTarget]);

  // Context menu handlers
  const handleContextMenu = (e: React.MouseEvent, contact: any) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuTarget(contact);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenuTarget) return;

    switch (action) {
      case "view-info":
        setSelectedContact(contextMenuTarget);
        setShowProfileView(true);
        break;
      case "search-chat":
        showInfo(
          "Search Chat",
          `This would open a search interface within the chat with ${contextMenuTarget.name}.`,
        );
        break;
      case "view-media":
        showInfo(
          "View Media & Files",
          `This would show all shared media from ${contextMenuTarget.name}.`,
        );
        break;
      case "export-chat":
        showSuccess(
          "Chat Exported",
          `The chat history with ${contextMenuTarget.name} has been exported.`,
        );
        break;
      case "share-contact":
        showSuccess(
          "Contact Shared",
          `${contextMenuTarget.name}'s contact information has been shared.`,
        );
        break;
      case "mute-notifications":
        showSuccess(
          "Notifications Muted",
          `You will no longer receive notifications from ${contextMenuTarget.name}.`,
        );
        break;
      case "add-favorites":
        showSuccess(
          "Added to Favorites",
          `${contextMenuTarget.name} has been added to your favorites.`,
        );
        break;
      case "pin-chat":
        showSuccess(
          "Chat Pinned",
          `The chat with ${contextMenuTarget.name} has been pinned.`,
        );
        break;
      case "archive-chat":
        showSuccess(
          "Chat Archived",
          `The chat with ${contextMenuTarget.name} has been archived.`,
        );
        break;
      case "clear-chat":
        if (
          confirm(
            `Are you sure you want to clear all messages with ${contextMenuTarget.name}?`,
          )
        ) {
          showSuccess(
            "Chat Cleared",
            `Chat history with ${contextMenuTarget.name} has been cleared.`,
          );
        }
        break;
      case "report-contact":
        showWarning(
          "Contact Reported",
          `A report against ${contextMenuTarget.name} has been filed.`,
        );
        break;
      case "block-contact":
        if (
          confirm(`Are you sure you want to block ${contextMenuTarget.name}?`)
        ) {
          showError(
            "Contact Blocked",
            `${contextMenuTarget.name} has been blocked.`,
          );
        }
        break;
    }
    setShowContextMenu(false);
  };

  const renderContactItem = (item: any) => {
    // Debug avatar URL
    console.log(`🔍 Rendering contact ${item.name}:`, {
      id: item.id,
      avatarUrl: item.avatarUrl,
      avatar: item.avatar,
      hasAvatarUrl: !!item.avatarUrl
    });

    return (
    <div
      key={item.id}
      onClick={() => setSelectedContact(item)}
      onContextMenu={(e) => handleContextMenu(e, item)}
      className={`p-2 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 h-16 ${
        selectedContact?.id === item.id ? "bg-blue-50 border-blue-200" : ""
      }`}
    >
      <div className="flex items-center gap-2.5 h-full">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-8 h-8">
            {item.avatarUrl && <AvatarImage src={item.avatarUrl} alt={item.name} />}
            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-semibold text-xs">
              {item.avatar ||
                item.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusColor(item.status)}`}
          ></div>
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800 truncate text-sm">
              {item.name}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {item.lastMessageTime || "2 min ago"}
            </span>
          </div>
          <p className="text-xs text-gray-600 truncate">
            {item.department || item.title || "Team Member"}
          </p>
        </div>

        {/* Unread Badge */}
        {item.unreadCount > 0 && (
          <div className="w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">
            {item.unreadCount}
          </div>
        )}
      </div>
    </div>
    );
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col overflow-hidden">
  {/* Search and Actions */}
  <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
              placeholder="Search team members, conversations, or groups..."
            />
          </div>

          {/* More Options Dropdown (existing) */}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 rounded-lg transition-all duration-200 border bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  data-testid="chat-left-more-options"
                  title="Contact options (left)"
                  aria-label="Contact options menu (left)"
                >
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 bg-white border-2 border-blue-300 shadow-xl left-dropdown-menu"
                style={{
                  zIndex: 9999,
                  position: "absolute",
                  right: "calc(100% + 8px)",
                  left: "auto",
                  top: "100%",
                  transform: "none",
                }}
              >
                {/* Header */}
                <div className="px-4 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-800">
                    Contact Actions
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Manage contacts and groups
                  </p>
                </div>
                <div className="py-2">
                  {/* View Profile */}
                  <DropdownMenuItem
                    className="px-3 py-3 text-left text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 flex items-center gap-3 rounded-lg group"
                    onClick={() => {
                      if (selectedContact) {
                        setShowProfileView(true);
                      } else {
                        showWarning(
                          "No Contact Selected",
                          "Please select a contact to view their profile.",
                        );
                      }
                    }}
                  >
                    <div className="p-1.5 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-all duration-200">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm">View Profile</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        See contact details
                      </p>
                    </div>
                  </DropdownMenuItem>
                  {/* Star Current User */}
                  <DropdownMenuItem
                    className="px-3 py-3 text-left text-xs text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 flex items-center gap-3 rounded-lg group"
                    onClick={() => {
                      if (selectedContact) {
                        showSuccess(
                          "User Starred",
                          `${selectedContact.name} has been added to your favorites.`,
                        );
                      } else {
                        showWarning(
                          "No Contact Selected",
                          "Please select a contact to star them.",
                        );
                      }
                    }}
                  >
                    <div className="p-1.5 bg-red-100 group-hover:bg-red-200 rounded-lg transition-all duration-200">
                      <Heart className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm">Star User</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Add to favorites
                      </p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* Group Management */}
                  <DropdownMenuLabel className="px-3 py-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Group Management
                    </h4>
                  </DropdownMenuLabel>
                  {/* New Group */}
                  <DropdownMenuItem
                    className="px-3 py-3 text-left text-xs text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 flex items-center gap-3 rounded-lg group"
                    onClick={() => {
                      setShowCreateGroupModal(true);
                    }}
                  >
                    <div className="p-1.5 bg-green-100 group-hover:bg-green-200 rounded-lg transition-all duration-200">
                      <Plus className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm">New Group</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Create a new chat group
                      </p>
                    </div>
                  </DropdownMenuItem>
                  {/* Add Contact to Group */}
                  <DropdownMenuItem
                    className="px-3 py-3 text-left text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 flex items-center gap-3 rounded-lg group"
                    onClick={() => {
                      if (selectedContact && selectedContact.isGroup) {
                        // setShowAddContactToGroupModal(true)
                      } else {
                        showWarning(
                          "No Group Selected",
                          "Please select a group to add contacts to.",
                        );
                      }
                    }}
                  >
                    <div className="p-1.5 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-all duration-200">
                      <UserPlus className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm">
                        Add Contact to Group
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Invite users to group
                      </p>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "contacts"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <User className="h-4 w-4" />
            <span>Members</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("groups")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "groups"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Users className="h-4 w-4" />
            <span>Groups</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "favorites"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Star className="h-4 w-4" />
            <span>Starred</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div ref={contentRef} className="flex-1 min-h-0 overflow-hidden">
    {/* Debug Info removed for production UI */}

        {activeTab === "contacts" && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Search Results Counter */}
            {searchQuery && (
              <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
                <p className="text-sm text-blue-700">
                  Found {filteredAllUsers.length} result
                  {filteredAllUsers.length !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              </div>
            )}

            {contactsItems.length > 0 ? (
              <div className="flex flex-col space-y-0 overflow-hidden">
                {paginatedContacts.map((user) => renderContactItem(user))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>
                  {searchQuery
                    ? "No users found matching your search"
                    : "No users found"}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "groups" && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Search Results Counter */}
            {searchQuery && (
              <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
                <p className="text-sm text-blue-700">
                  Found {filteredGroups.length} result
                  {filteredGroups.length !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              </div>
            )}

            {groupsItems.length > 0 ? (
              <div className="flex flex-col space-y-0 overflow-hidden">
                {paginatedGroups.map((group) => renderContactItem(group))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>
                  {searchQuery
                    ? "No groups found matching your search"
                    : "No groups found"}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Search Results Counter */}
            {searchQuery && (
              <div className="px-4 py-2 bg-blue-50 border-b border-blue-200">
                <p className="text-sm text-blue-700">
                  Found {filteredFavorites.length} result
                  {filteredFavorites.length !== 1 ? "s" : ""} for "{searchQuery}
                  "
                </p>
              </div>
            )}

            {favoritesItems.length > 0 ? (
              <div className="flex flex-col space-y-0 overflow-hidden">
                {paginatedFavorites.map((favorite) =>
                  renderContactItem(favorite),
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>
                  {searchQuery
                    ? "No favorites found matching your search"
                    : "No favorites yet"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 min-w-[200px] transform transition-all duration-200 ease-out"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y,
            transform: "translate(0, 0)",
          }}
        >
          {/* First Section */}
          <div className="px-2.5 py-1.5">
            <button
              onClick={() => handleContextMenuAction("view-info")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 group"
            >
              <div className="p-1.5 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-all duration-200">
                <Eye className="h-4 w-4 text-blue-500" />
              </div>
              <span className="font-medium text-xs">View Contact Info</span>
            </button>
            <button
              onClick={() => handleContextMenuAction("search-chat")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all duration-200 group mt-1"
            >
              <div className="p-1.5 bg-green-100 group-hover:bg-green-200 rounded-lg transition-all duration-200">
                <SearchIcon className="h-4 w-4 text-green-500" />
              </div>
              <span className="font-medium text-xs">Search in Chat</span>
            </button>
            <button
              onClick={() => handleContextMenuAction("view-media")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-all duration-200 group mt-1"
            >
              <div className="p-1.5 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-all duration-200">
                <FileText className="h-4 w-4 text-purple-500" />
              </div>
              <span className="font-medium text-xs">View Media & Files</span>
            </button>
            <button
              onClick={() => handleContextMenuAction("export-chat")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 group mt-1"
            >
              <div className="p-1.5 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-all duration-200">
                <Download className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-xs">Export Chat</span>
            </button>
            <button
              onClick={() => handleContextMenuAction("share-contact")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all duration-200 group mt-1"
            >
              <div className="p-1.5 bg-green-100 group-hover:bg-green-200 rounded-lg transition-all duration-200">
                <SearchIcon className="h-4 w-4 text-green-500" />
              </div>
              <span className="font-medium text-xs">Share Contact</span>
            </button>
          </div>

          <hr className="my-1 border-gray-100" />

          {/* Second Section */}
          <div className="px-2.5 py-1.5">
            <button
              onClick={() => handleContextMenuAction("mute-notifications")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 rounded-lg transition-all duration-200 group"
            >
              <div className="p-1.5 bg-yellow-100 group-hover:bg-yellow-200 rounded-lg transition-all duration-200">
                <Bell className="h-4 w-4 text-yellow-500" />
              </div>
              <span className="font-medium text-xs">Mute Notifications</span>
            </button>
            <button
              onClick={() => handleContextMenuAction("add-favorites")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group mt-1"
            >
              <div className="p-1.5 bg-red-100 group-hover:bg-red-200 rounded-lg transition-all duration-200">
                <Heart className="h-4 w-4 text-red-500" />
              </div>
              <span className="font-medium text-xs">Add to Favorites</span>
            </button>
            <button
              onClick={() => handleContextMenuAction("pin-chat")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200 group mt-1"
            >
              <div className="p-1.5 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-all duration-200">
                <Pin className="h-4 w-4 text-blue-500" />
              </div>
              <span className="font-medium text-xs">Pin Chat</span>
            </button>
            <button
              onClick={() => handleContextMenuAction("archive-chat")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-all duration-200 group mt-1"
            >
              <div className="p-1.5 bg-gray-100 group-hover:bg-gray-200 rounded-lg transition-all duration-200">
                <Archive className="h-4 w-4 text-gray-500" />
              </div>
              <span className="font-medium text-xs">Archive Chat</span>
            </button>
            <button
              onClick={() => handleContextMenuAction("clear-chat")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 group mt-1"
            >
              <div className="p-1.5 bg-red-100 group-hover:bg-red-200 rounded-lg transition-all duration-200">
                <Trash2 className="h-4 w-4 text-red-500" />
              </div>
              <span className="font-medium text-xs">Clear Chat</span>
            </button>
          </div>

          <hr className="my-1 border-gray-100" />

          {/* Third Section */}
          <div className="px-2.5 py-1.5">
            <button
              onClick={() => handleContextMenuAction("report-contact")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
            >
              <div className="p-1.5 bg-orange-100 group-hover:bg-orange-200 rounded-lg transition-all duration-200">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </div>
              <span className="font-medium text-xs">Report Contact</span>
            </button>
            <button
              onClick={() => handleContextMenuAction("block-contact")}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
            >
              <div className="p-1.5 bg-red-100 group-hover:bg-red-200 rounded-lg transition-all duration-200">
                <Shield className="h-4 w-4 text-red-500" />
              </div>
              <span className="font-medium text-xs">Block Contact</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Add New Contact
              </h3>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newContactData.name}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={newContactData.title}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Production Manager"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newContactData.department}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Manufacturing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newContactData.email}
                  onChange={(e) =>
                    setNewContactData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@company.com"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddContactModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Create New Group
              </h3>
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newGroupData.name}
                  onChange={(e) =>
                    setNewGroupData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter group name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newGroupData.description}
                  onChange={(e) =>
                    setNewGroupData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="What is this group about?"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newGroupData.department}
                  onChange={(e) =>
                    setNewGroupData((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Manufacturing, Sales, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Members
                </label>
                <div className="text-sm text-gray-500 mb-2">
                  You'll be added as the first member. You can add more members
                  after creating the group.
                </div>
                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                      You
                    </div>
                    <span className="text-sm text-gray-700">
                      You (Group Creator)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateGroupModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLeftCard;
