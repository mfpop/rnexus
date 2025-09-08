import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_CHATS, GET_USER_FAVORITES, GET_ALL_USERS_WITH_AVATARS } from "../graphql/chatQueries";
import { useAuth } from "./AuthContext";
import { usePagination } from "./PaginationContext";

// Contact interface for chat
export interface Contact {
  id: number;
  name: string;
  title: string;
  department?: string;
  status: "online" | "away" | "offline" | "group";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar: string;
  avatarUrl?: string;
  isGroup?: boolean;
  members?: number;
  email?: string;
  chatId?: string; // Store the actual chat ID for archiving
}

// Chat context interface
interface ChatContextType {
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  contacts: Contact[];
  groups: Contact[];
  favorites: Contact[];
  archived: Contact[];
  allUsers: Contact[];
  paginatedUsers: Contact[];
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setRecordsPerPage: (recordsPerPage: number) => void;
  updatePagination: (
    data: Partial<{
      currentPage: number;
      totalPages: number;
      totalRecords: number;
      recordsPerPage: number;
    }>,
  ) => void;
  resetPagination: () => void;
  activeTab: "contacts" | "groups" | "favorites" | "blocked" | "archived";
  setActiveTab: (tab: "contacts" | "groups" | "favorites" | "blocked" | "archived") => void;
  // Profile view state
  showProfileView: boolean;
  setShowProfileView: (show: boolean) => void;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Sample data removed - all data now comes from database

// All users in the system - now comes from database only
// This will be set dynamically in the context provider

// Sample groups data removed - all data now comes from database

// Sample favorites data removed - all data now comes from database

// ChatProvider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  console.log("🔍 ChatProvider rendering");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<
    "contacts" | "groups" | "favorites" | "blocked" | "archived"
  >("contacts");
  const [showProfileView, setShowProfileView] = useState(false);

  // Get current user from auth context
  const { user: currentUser } = useAuth();
  console.log("🔍 Current user from useAuth:", currentUser);

  // Use pagination context instead of local state
  const {
    currentPage,
    totalPages,
    totalRecords,
    recordsPerPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setRecordsPerPage,
    updatePagination,
    resetPagination,
  } = usePagination();

  // Fetch all users from GraphQL
  const { data: allUsersData } = useQuery(GET_ALL_USERS_WITH_AVATARS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Fetch groups data from GraphQL
  const { data: groupsData } = useQuery(GET_ALL_CHATS, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Fetch favorites data from GraphQL
  const { data: favoritesData } = useQuery(GET_USER_FAVORITES, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  // Fetch blocks data from GraphQL (for future use)
  // const { data: blocksData } = useQuery(GET_USER_BLOCKS, {
  //   fetchPolicy: "cache-and-network",
  //   errorPolicy: "all",
  // });

  // Debug GraphQL data
  console.log("🔍 GraphQL Debug:", {
    allUsersData: allUsersData?.allUsers?.length || 0,
    currentUser: currentUser?.id,
    currentUserFull: currentUser,
    hasAllUsersData: !!allUsersData,
    hasCurrentUser: !!currentUser,
  });

  // Transform all users data to Contact format
  const realUsers: Contact[] = React.useMemo(() => {
    console.log("🔍 realUsers useMemo triggered:", {
      allUsersData: allUsersData?.allUsers?.length || 0,
      currentUser: currentUser?.id,
      hasAllUsersData: !!allUsersData,
      hasCurrentUser: !!currentUser
    });

    // Process all users data
    if (allUsersData?.allUsers && allUsersData.allUsers.length > 0) {
      console.log("🔍 Using all users data:", allUsersData.allUsers.length);

      const transformedUsers = allUsersData.allUsers
        .filter((user: any) => {
          const shouldInclude = String(user.id) !== String(currentUser?.id);
          console.log("🔍 Filtering user:", {
            userId: user.id,
            userIdType: typeof user.id,
            currentUserId: currentUser?.id,
            currentUserIdType: typeof currentUser?.id,
            shouldInclude
          });
          return shouldInclude;
        }) // Exclude current user
        .map((user: any) => {
          console.log("🔍 Processing user:", {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          });

          return {
            id: parseInt(user.id),
            name: user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.username,
            title: user.position || "Team Member",
            department: user.department || "General",
            status: "online" as const,
            lastMessage: "",
            lastMessageTime: "",
            unreadCount: 0,
            avatar: user.username[0].toUpperCase(),
            avatarUrl: user.avatarUrl,
            email: user.email,
            chatId: `chat_${Math.min(parseInt(user.id), currentUser?.id || 0)}_${Math.max(parseInt(user.id), currentUser?.id || 0)}`,
          };
        });

      console.log(`🔍 Transformed users from all users: ${transformedUsers.length}`);
      return transformedUsers;
    }

    // Fallback to empty array if no users data
    console.log("🔍 No users data available");
    return [];
  }, [allUsersData, currentUser]);

  // Transform GraphQL groups data to Contact format
  const realGroups: Contact[] = React.useMemo(() => {
    if (groupsData?.allChats && groupsData.allChats.length > 0) {
      console.log("🔍 Using GraphQL groups:", groupsData.allChats.length);

      return groupsData.allChats
        .filter((chat: any) => chat.chatType === 'group' && chat.isActive)
        .map((chat: any) => ({
          id: parseInt(chat.id),
          name: chat.name || 'Unnamed Group',
          title: chat.description || 'Group Chat',
          department: 'Groups',
          status: 'group' as const,
          lastMessage: chat.lastMessage?.content || '',
          lastMessageTime: chat.lastMessage?.timestamp || chat.lastActivity || '',
          unreadCount: 0, // TODO: Implement unread count for groups
          avatar: chat.name?.[0] || 'G',
          avatarUrl: chat.avatarUrl,
          isGroup: true,
          members: chat.members?.length || 0,
          chatId: chat.id, // For groups, use the chat ID directly
        }));
    }

    // Fallback to empty array
    console.log("🔍 No GraphQL groups data, returning empty array");
    return [];
  }, [groupsData]);

    // Transform GraphQL favorites data to Contact format
  const realFavorites: Contact[] = React.useMemo(() => {
    console.log("🔍 Favorites Debug:", {
      favoritesData,
      hasFavoritesData: !!favoritesData,
      userFavorites: favoritesData?.userFavorites,
      userFavoritesLength: favoritesData?.userFavorites?.length,
    });

    if (favoritesData?.userFavorites && favoritesData.userFavorites.length > 0) {
      console.log("🔍 Using GraphQL favorites:", favoritesData.userFavorites.length);

      return favoritesData.userFavorites.map((fav: any) => {
        const user = fav.favoriteUser;
        return {
          id: parseInt(user.id),
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username,
          title: 'Team Member', // Default title
          department: 'General', // Default department
          status: 'online' as const, // Default status
          lastMessage: '',
          lastMessageTime: '',
          unreadCount: 0,
          avatar: user.avatar || user.firstName?.[0] || user.username[0],
          avatarUrl: null, // Favorites don't have avatarUrl in the query
          email: user.email,
          chatId: `chat_${Math.min(parseInt(user.id), currentUser?.id || 0)}_${Math.max(parseInt(user.id), currentUser?.id || 0)}`,
        };
      });
    }

    // Fallback to empty array
    console.log("🔍 No GraphQL favorites data, returning empty array");
    return [];
  }, [favoritesData]);

  // Debug realUsers after it's defined
  console.log("🔍 realUsers length:", realUsers.length);
  console.log("🔍 realGroups length:", realGroups.length);
  console.log("🔍 realFavorites length:", realFavorites.length);
  console.log("🔍 realFavorites items:", realFavorites.map(f => f.name));
  console.log(
    "🔍 Sample realUsers with avatars:",
    realUsers.slice(0, 3).map((u) => ({
      name: u.name,
      avatar: u.avatar,
      avatarUrl: u.avatarUrl,
    })),
  );

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "contacts":
        return realUsers;
      case "groups":
        return realGroups;
      case "favorites":
        return realFavorites;
      case "archived":
        return []; // Archived contacts are managed locally in ChatLeftCard
      default:
        return realUsers;
    }
  };

  const currentData = getCurrentData();

  const paginatedUsers = currentData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  // Debug logging to see pagination values
  console.log("ChatContext - Pagination Debug:", {
    currentDataLength: currentData.length,
    currentPage,
    recordsPerPage,
    totalPages,
    paginatedUsersLength: paginatedUsers.length,
    sliceStart: (currentPage - 1) * recordsPerPage,
    sliceEnd: currentPage * recordsPerPage,
  });

  // Update pagination context when data changes
  useEffect(() => {
    console.log("🔍 Pagination update effect:", {
      currentDataLength: currentData.length,
      currentData: currentData.slice(0, 3), // Show first 3 items
      recordsPerPage,
      activeTab,
    });

    if (currentData.length > 0) {
      updatePagination({
        totalRecords: currentData.length,
        totalPages: Math.max(1, Math.ceil(currentData.length / recordsPerPage)),
      });
    }
  }, [currentData.length, recordsPerPage, updatePagination, activeTab]);

  // Debug the final values
  console.log("🔍 Context value debug:", {
    realUsersLength: realUsers.length,
    realUsers: realUsers.slice(0, 2), // Show first 2 users
    currentUser: currentUser?.id,
  });

  const value: ChatContextType = {
    selectedContact,
    setSelectedContact,
    contacts: realUsers,
    groups: realGroups,
    favorites: realFavorites,
    archived: [], // Archived contacts are managed locally in ChatLeftCard
    allUsers: realUsers,
    paginatedUsers,
    currentPage,
    totalPages,
    totalRecords,
    recordsPerPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setRecordsPerPage,
    updatePagination,
    resetPagination,
    activeTab,
    setActiveTab,
    showProfileView,
    setShowProfileView,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// useChatContext hook
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
