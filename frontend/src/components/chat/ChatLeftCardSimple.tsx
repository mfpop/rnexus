import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  Star,
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  Plus,
  UserPlus,
  User,
  Heart,
} from "lucide-react";
import { useChatContext } from "../../contexts/ChatContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/bits/DropdownMenu";

/**
 * ChatLeftCardSimple - Simplified left card for chat page when used with StableLayout
 * This component renders inside StableLayout's left card area
 * Uses ChatContext for communication with the right card
 */
const ChatLeftCardSimple: React.FC = () => {
  const {
    selectedContact,
    setSelectedContact,
    contacts,
    groups,
    favorites,
    allUsers,
    activeTab,
    setActiveTab,
  } = useChatContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const [newContactData, setNewContactData] = useState({
    name: "",
    title: "",
    department: "",
    email: "",
  });

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

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.department &&
        contact.department.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredFavorites = favorites.filter((favorite) =>
    favorite.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter all users for the Contacts tab
  const filteredAllUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department &&
        user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.title &&
        user.title.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      // No custom dropdown state to manage
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleAddContact = () => {
    if (!newContactData.name.trim() || !newContactData.title.trim()) {
      alert("Please fill in at least name and title");
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

    alert(
      `Contact "${newContact.name}" added successfully! You can now start a conversation.`,
    );

    // Reset form and close modal
    setNewContactData({ name: "", title: "", department: "", email: "" });
    setShowAddContactModal(false);

    // Switch to contacts tab to show the new contact
    setActiveTab("contacts");
  };

  const renderContactItem = (item: any, isGroup = false) => (
    <div
      key={item.id}
      onClick={() => setSelectedContact(item)}
      className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
        selectedContact?.id === item.id
          ? "bg-blue-50 border-r-2 border-r-blue-500"
          : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {isGroup ? <Users className="h-5 w-5" /> : item.avatar}
        </div>
        {!isGroup && item.status !== "group" && (
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(item.status)}`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-gray-800 truncate text-sm">
            {item.name}
          </h4>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {item.lastMessageTime || "Now"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 truncate">
            {item.lastMessage || item.title}
          </p>
          {item.unreadCount > 0 && (
            <div className="bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 ml-2">
              {item.unreadCount}
            </div>
          )}
        </div>
        {item.department && !isGroup && (
          <p className="text-xs text-gray-500">{item.department}</p>
        )}
        {isGroup && item.members && (
          <p className="text-xs text-gray-500">{item.members} members</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Messages</h2>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowAddContactModal(true)}
              title="Add new contact"
            >
              <UserPlus className="h-4 w-4 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => alert("New conversation feature coming soon!")}
              title="Start new conversation"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
            {/* More Options Dropdown */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    title="Contact options"
                    aria-label="Contact options menu"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-600" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-64" align="end">
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
                          alert(
                            `👤 ${selectedContact.name}'s Profile\n\nTitle: ${selectedContact.title || "N/A"}\nDepartment: ${selectedContact.department || "N/A"}\nStatus: ${selectedContact.status || "N/A"}`,
                          );
                        } else {
                          alert(
                            "Please select a contact first to view their profile.",
                          );
                        }
                      }}
                    >
                      <div className="p-1.5 bg-blue-100 group-hover:bg-blue-200 rounded-lg transition-all duration-200">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-sm">
                          View Profile
                        </span>
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
                          alert(
                            `⭐ ${selectedContact.name} has been starred!\n\nThey are now in your favorites list.`,
                          );
                        } else {
                          alert("Please select a contact first to star them.");
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
                        alert("👥 Creating new group...");
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
                        if (selectedContact) {
                          alert(
                            `👥 Adding ${selectedContact.name} to group...`,
                          );
                        } else {
                          alert(
                            "Please select a contact first to add them to a group.",
                          );
                        }
                      }}
                    >
                      <div className="p-1.5 bg-purple-100 group-hover:bg-purple-200 rounded-lg transition-all duration-200">
                        <UserPlus className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-sm">
                          Add to Group
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Add contact to group
                        </p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
            placeholder="Search conversations..."
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
            activeTab === "contacts"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <User className="h-3 w-3" />
            <span>Contacts</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
            activeTab === "contacts"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>Chats</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
            activeTab === "groups"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <Users className="h-3 w-3" />
            <span>Groups</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
            activeTab === "favorites"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            <Star className="h-3 w-3" />
            <span>Favorites</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "contacts" && (
          <div>
            {/* Search Results Counter */}
            {searchQuery && (
              <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
                <p className="text-sm text-blue-700">
                  Found {filteredContacts.length} result
                  {filteredContacts.length !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              </div>
            )}

            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  All Users ({filteredAllUsers.length})
                </span>
                <button
                  onClick={() => setShowAddContactModal(true)}
                  className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                >
                  Add Contact
                </button>
              </div>
            </div>
            {filteredAllUsers.length > 0 ? (
              filteredAllUsers.map((user) => renderContactItem(user))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {searchQuery
                    ? "No users found matching your search"
                    : "No users found"}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "contacts" && (
          <div>
            {/* Search Results Counter */}
            {searchQuery && (
              <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
                <p className="text-sm text-blue-700">
                  Found {filteredContacts.length} result
                  {filteredContacts.length !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              </div>
            )}

            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => renderContactItem(contact))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {searchQuery
                    ? "No conversations found matching your search"
                    : "No conversations found"}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "groups" && (
          <div>
            {/* Search Results Counter */}
            {searchQuery && (
              <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
                <p className="text-sm text-blue-700">
                  Found {filteredGroups.length} result
                  {filteredGroups.length !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              </div>
            )}

            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => renderContactItem(group, true))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {searchQuery
                    ? "No groups found matching your search"
                    : "No groups found"}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            {/* Search Results Counter */}
            {searchQuery && (
              <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
                <p className="text-sm text-blue-700">
                  Found {filteredFavorites.length} result
                  {filteredFavorites.length !== 1 ? "s" : ""} for "{searchQuery}
                  "
                </p>
              </div>
            )}

            {filteredFavorites.length > 0 ? (
              filteredFavorites.map((favorite) =>
                renderContactItem(favorite, favorite.isGroup),
              )
            ) : (
              <div className="p-6 text-center text-gray-500">
                <Star className="h-4 w-4 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">
                  {searchQuery
                    ? "No favorites found matching your search"
                    : "No favorites yet"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {activeTab === "contacts" && `${filteredAllUsers.length} users`}
            {activeTab === "contacts" &&
              `${filteredContacts.length} conversations`}
            {activeTab === "groups" && `${filteredGroups.length} groups`}
            {activeTab === "favorites" &&
              `${filteredFavorites.length} favorites`}
          </span>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-1 hover:text-gray-700 transition-colors"
              onClick={() => alert("Voice call feature coming soon!")}
              title="Start voice call"
            >
              <Phone className="h-3 w-3" />
              <span>Call</span>
            </button>
            <button
              className="flex items-center gap-1 hover:text-gray-700 transition-colors"
              onClick={() => alert("Video call feature coming soon!")}
              title="Start video call"
            >
              <Video className="h-3 w-3" />
              <span>Video</span>
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default ChatLeftCardSimple;
