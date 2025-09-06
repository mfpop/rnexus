import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS_WITH_AVATARS } from '../graphql/chatQueries';
import { useAuth } from './AuthContext';
import { usePagination } from './PaginationContext';

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
}

// Chat context interface
interface ChatContextType {
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  contacts: Contact[];
  groups: Contact[];
  favorites: Contact[];
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
  updatePagination: (data: Partial<{currentPage: number; totalPages: number; totalRecords: number; recordsPerPage: number}>) => void;
  resetPagination: () => void;
  activeTab: "contacts" | "groups" | "favorites";
  setActiveTab: (tab: "contacts" | "groups" | "favorites") => void;
  // Profile view state
  showProfileView: boolean;
  setShowProfileView: (show: boolean) => void;
}

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Sample chat data - existing contacts with chat history
const sampleContacts: Contact[] = [
  {
    id: 1,
    name: "John Smith",
    title: "Production Manager",
    department: "Manufacturing",
    status: "online" as const,
    lastMessage: "Can we discuss the production schedule?",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    avatar: "JS",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    title: "Quality Control",
    department: "QC",
    status: "online" as const,
    lastMessage: "Quality report is ready for review",
    lastMessageTime: "5 min ago",
    unreadCount: 0,
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Mike Davis",
    title: "Maintenance Lead",
    department: "Maintenance",
    status: "away" as const,
    lastMessage: "Equipment maintenance completed",
    lastMessageTime: "1 hour ago",
    unreadCount: 1,
    avatar: "MD",
  },
  {
    id: 4,
    name: "Emily Wilson",
    title: "Operations Director",
    department: "Operations",
    status: "offline" as const,
    lastMessage: "Thanks for the update!",
    lastMessageTime: "3 hours ago",
    unreadCount: 0,
    avatar: "EW",
  },
].sort((a, b) => a.name.localeCompare(b.name));

// All users in the system (including those without chat history)
const allUsers: Contact[] = [
  // Existing contacts with chat history
  ...sampleContacts,

  // Additional users without chat history
  {
    id: 7,
    name: "Alex Rodriguez",
    title: "Supply Chain Manager",
    department: "Logistics",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "AR",
    email: "alex.rodriguez@company.com",
  },
  {
    id: 8,
    name: "Lisa Chen",
    title: "HR Specialist",
    department: "Human Resources",
    status: "away" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "LC",
    email: "lisa.chen@company.com",
  },
  {
    id: 9,
    name: "David Thompson",
    title: "IT Administrator",
    department: "Information Technology",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "DT",
    email: "david.thompson@company.com",
  },
  {
    id: 10,
    name: "Maria Garcia",
    title: "Financial Analyst",
    department: "Finance",
    status: "offline" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "MG",
    email: "maria.garcia@company.com",
  },
  {
    id: 11,
    name: "James Wilson",
    title: "Safety Officer",
    department: "Health & Safety",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "JW",
    email: "james.wilson@company.com",
  },
  {
    id: 12,
    name: "Jennifer Lee",
    title: "Marketing Coordinator",
    department: "Marketing",
    status: "away" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "JL",
    email: "jennifer.lee@company.com",
  },
  {
    id: 13,
    name: "Robert Brown",
    title: "Research Engineer",
    department: "R&D",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "RB",
    email: "robert.brown@company.com",
  },
  {
    id: 14,
    name: "Amanda Taylor",
    title: "Customer Service Lead",
    department: "Customer Support",
    status: "offline" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "AT",
    email: "amanda.taylor@company.com",
  },
  {
    id: 15,
    name: "Kevin Martinez",
    title: "Warehouse Supervisor",
    department: "Warehousing",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "KM",
    email: "kevin.martinez@company.com",
  },
  {
    id: 16,
    name: "Rachel Green",
    title: "Legal Counsel",
    department: "Legal",
    status: "away" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "RG",
    email: "rachel.green@company.com",
  },
  {
    id: 17,
    name: "Thomas Anderson",
    title: "Data Scientist",
    department: "Analytics",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "TA",
    email: "thomas.anderson@company.com",
  },
  {
    id: 18,
    name: "Sophie Williams",
    title: "Product Manager",
    department: "Product Development",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "SW",
    email: "sophie.williams@company.com",
  },
  {
    id: 19,
    name: "Michael Chang",
    title: "Sales Director",
    department: "Sales",
    status: "away" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "MC",
    email: "michael.chang@company.com",
  },
  {
    id: 20,
    name: "Emma Davis",
    title: "UX Designer",
    department: "Design",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "ED",
    email: "emma.davis@company.com",
  },
  {
    id: 21,
    name: "Christopher Lee",
    title: "Network Engineer",
    department: "IT Infrastructure",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "CL",
    email: "christopher.lee@company.com",
  },
  {
    id: 22,
    name: "Isabella Rodriguez",
    title: "Content Strategist",
    department: "Marketing",
    status: "offline" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "IR",
    email: "isabella.rodriguez@company.com",
  },
  {
    id: 23,
    name: "Daniel Kim",
    title: "Business Analyst",
    department: "Strategy",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "DK",
    email: "daniel.kim@company.com",
  },
  {
    id: 24,
    name: "Olivia Taylor",
    title: "Event Coordinator",
    department: "Events",
    status: "away" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "OT",
    email: "olivia.taylor@company.com",
  },
  {
    id: 28,
    name: "Robert Chen",
    title: "IT Support Specialist",
    department: "IT",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "RC",
    email: "robert.chen@company.com",
  },
  {
    id: 29,
    name: "Lisa Martinez",
    title: "HR Coordinator",
    department: "Human Resources",
    status: "away" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "LM",
    email: "lisa.martinez@company.com",
  },
  {
    id: 30,
    name: "David Wilson",
    title: "Safety Officer",
    department: "Safety",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "DW",
    email: "david.wilson@company.com",
  },
  {
    id: 31,
    name: "Jennifer Brown",
    title: "Training Coordinator",
    department: "Training",
    status: "offline" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "JB",
    email: "jennifer.brown@company.com",
  },
  {
    id: 32,
    name: "Michael Thompson",
    title: "Facilities Manager",
    department: "Facilities",
    status: "online" as const,
    lastMessage: "",
    lastMessageTime: "",
    unreadCount: 0,
    avatar: "MT",
    email: "michael.thompson@company.com",
  },
].sort((a, b) => a.name.localeCompare(b.name));

// Sample groups data
const sampleGroups: Contact[] = [
  {
    id: 101,
    name: "Production Team",
    title: "Production Team",
    department: "Manufacturing",
    status: "group" as const,
    lastMessage: "Team meeting scheduled for tomorrow",
    lastMessageTime: "1 hour ago",
    unreadCount: 3,
    avatar: "PT",
    isGroup: true,
    members: 12,
  },
  {
    id: 102,
    name: "Quality Assurance",
    title: "Quality Assurance",
    department: "QC",
    status: "group" as const,
    lastMessage: "New quality standards implemented",
    lastMessageTime: "2 hours ago",
    unreadCount: 1,
    avatar: "QA",
    isGroup: true,
    members: 8,
  },
  {
    id: 103,
    name: "Maintenance Crew",
    title: "Maintenance Crew",
    department: "Maintenance",
    status: "group" as const,
    lastMessage: "Equipment inspection completed",
    lastMessageTime: "3 hours ago",
    unreadCount: 0,
    avatar: "MC",
    isGroup: true,
    members: 6,
  },
];

// Sample favorites data
const sampleFavorites: Contact[] = [
  sampleContacts[0]!, // John Smith
  sampleContacts[1]!, // Sarah Johnson
  sampleGroups[0]!, // Production Team
];

// ChatProvider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<
    "contacts" | "groups" | "favorites"
  >("contacts");
  const [showProfileView, setShowProfileView] = useState(false);

  // Get current user from auth context
  const { user: currentUser } = useAuth();

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
    resetPagination
  } = usePagination();

  // Fetch real user data from GraphQL
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_ALL_USERS_WITH_AVATARS, {
    fetchPolicy: 'cache-and-network', // Always try to fetch fresh data
    errorPolicy: 'all'
  });

  // Debug GraphQL data
  console.log('🔍 GraphQL Debug:', {
    usersData,
    usersLoading,
    usersError,
    allUsersLength: allUsers.length,
    currentUser: currentUser?.id,
    currentUserFull: currentUser,
    sampleRawUser: usersData?.allUsers?.[0] ? {
      id: usersData.allUsers[0].id,
      username: usersData.allUsers[0].username,
      firstName: usersData.allUsers[0].firstName,
      lastName: usersData.allUsers[0].lastName,
      avatar: usersData.allUsers[0].avatar,
      avatarUrl: usersData.allUsers[0].avatarUrl,
      position: usersData.allUsers[0].position,
      department: usersData.allUsers[0].department
    } : null
  });

  // Debug avatar data specifically
  if (usersData?.allUsers) {
    console.log('🔍 Sample GraphQL users with avatars:', usersData.allUsers.slice(0, 3).map((u: any) => ({
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName,
      avatar: u.avatar,
      avatarUrl: u.avatarUrl
    })));
  }



  // Transform GraphQL user data to Contact format
  const realUsers: Contact[] = React.useMemo(() => {
    // First try to use GraphQL data
    if (usersData?.allUsers && usersData.allUsers.length > 0) {
      console.log('🔍 Using GraphQL users:', usersData.allUsers.length);

      const transformedUsers = usersData.allUsers.map((user: any) => {
        const result = {
          id: parseInt(user.id),
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
          title: user.position || 'Team Member',
          department: user.department || 'General',
          status: 'online' as const, // Default status for now
          lastMessage: '',
          lastMessageTime: '',
          unreadCount: 0,
          avatar: user.avatar || user.firstName?.[0] || user.username[0], // Fallback initials
          avatarUrl: user.avatarUrl, // Actual avatar URL from database
          email: user.email,
        };

        // Debug each user's avatar data
        console.log(`🔍 User ${result.name}:`, {
          rawAvatarUrl: user.avatarUrl,
          finalAvatarUrl: result.avatarUrl,
          hasAvatarUrl: !!result.avatarUrl,
          avatarUrlType: typeof result.avatarUrl,
          isImageUrl: result.avatarUrl?.includes('http'),
          isPngUrl: result.avatarUrl?.includes('.png'),
          isJpegUrl: result.avatarUrl?.includes('.jpeg')
        });

        return result;
      });

      // Remove duplicates based on ID and name to prevent pagination issues
      const uniqueUsers = transformedUsers.filter((user: Contact, index: number, self: Contact[]) =>
        index === self.findIndex((u: Contact) => u.id === user.id && u.name === user.name)
      );

      // Filter out the current user from the members list
      const filteredUsers = uniqueUsers.filter((user: Contact) => {
        if (!currentUser) return true; // If no current user, show all users
        const shouldInclude = user.id !== currentUser.id;
        console.log(`🔍 User ${user.name} (ID: ${user.id}) - Current user ID: ${currentUser.id} - Include: ${shouldInclude}`);
        return shouldInclude;
      });

      // TEMPORARY: Show all users for debugging
      console.log('🔍 TEMPORARY: Showing all users without filtering for debugging');
      const debugUsers = uniqueUsers; // Use this instead of filteredUsers for debugging

      // Also log the current user info
      console.log('🔍 Current user debug:', {
        currentUser,
        currentUserId: currentUser?.id,
        currentUserType: typeof currentUser?.id
      });

      console.log('🔍 ChatContext - GraphQL User data debug:', {
        originalCount: usersData.allUsers.length,
        transformedCount: transformedUsers.length,
        uniqueCount: uniqueUsers.length,
        filteredCount: filteredUsers.length,
        currentUserId: currentUser?.id,
        hasDuplicates: transformedUsers.length !== uniqueUsers.length,
        sampleUser: transformedUsers[0] ? {
          id: transformedUsers[0].id,
          name: transformedUsers[0].name,
          avatar: transformedUsers[0].avatar,
          avatarUrl: transformedUsers[0].avatarUrl,
          title: transformedUsers[0].title,
          department: transformedUsers[0].department
        } : null,
        allUsersWithAvatars: transformedUsers.filter((u: Contact) => u.avatarUrl).length,
        allUsersWithInitials: transformedUsers.filter((u: Contact) => !u.avatarUrl && u.avatar).length
      });

      return debugUsers; // TEMPORARY: Use debugUsers instead of filteredUsers
    }

    // If no GraphQL data, use sample data with proper fallback avatars
    console.log('🔍 No GraphQL data, using sample data');
    return [
      { id: 1, name: "John Doe", title: "Software Engineer", department: "Engineering", status: "online", lastMessage: "Hey, how's the project going?", lastMessageTime: "2 min ago", unreadCount: 1, avatar: "JD", avatarUrl: null, email: "john@company.com" },
      { id: 2, name: "Jane Smith", title: "Product Manager", department: "Product", status: "away", lastMessage: "Let's schedule a meeting", lastMessageTime: "5 min ago", unreadCount: 0, avatar: "JS", avatarUrl: null, email: "jane@company.com" },
      { id: 3, name: "Mike Johnson", title: "Designer", department: "Design", status: "online", lastMessage: "The mockups are ready", lastMessageTime: "10 min ago", unreadCount: 2, avatar: "MJ", avatarUrl: null, email: "mike@company.com" },
      { id: 4, name: "Sarah Wilson", title: "QA Engineer", department: "Engineering", status: "offline", lastMessage: "Found some bugs to fix", lastMessageTime: "1 hour ago", unreadCount: 0, avatar: "SW", avatarUrl: null, email: "sarah@company.com" },
      { id: 5, name: "Alex Brown", title: "DevOps Engineer", department: "Infrastructure", status: "online", lastMessage: "Deployment successful", lastMessageTime: "30 min ago", unreadCount: 1, avatar: "AB", avatarUrl: null, email: "alex@company.com" },
      { id: 6, name: "Lisa Davis", title: "Marketing Manager", department: "Marketing", status: "away", lastMessage: "Campaign is live", lastMessageTime: "2 hours ago", unreadCount: 0, avatar: "LD", avatarUrl: null, email: "lisa@company.com" }
    ];
  }, [usersData, currentUser]);

  // Debug realUsers after it's defined
  console.log('🔍 realUsers length:', realUsers.length);
  console.log('🔍 Sample realUsers with avatars:', realUsers.slice(0, 3).map(u => ({
    name: u.name,
    avatar: u.avatar,
    avatarUrl: u.avatarUrl
  })));

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "contacts":
        return realUsers;
      case "groups":
        return sampleGroups;
      case "favorites":
        return sampleFavorites;
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
  console.log('ChatContext - Pagination Debug:', {
    currentDataLength: currentData.length,
    currentPage,
    recordsPerPage,
    totalPages,
    paginatedUsersLength: paginatedUsers.length,
    sliceStart: (currentPage - 1) * recordsPerPage,
    sliceEnd: currentPage * recordsPerPage
  });

  // Update pagination context when data changes
  useEffect(() => {
    console.log('🔍 Pagination update effect:', {
      currentDataLength: currentData.length,
      currentData: currentData.slice(0, 3), // Show first 3 items
      recordsPerPage,
      activeTab
    });

    if (currentData.length > 0) {
      updatePagination({
        totalRecords: currentData.length,
        totalPages: Math.max(1, Math.ceil(currentData.length / recordsPerPage)),
      });
    }
  }, [currentData.length, recordsPerPage, updatePagination, activeTab]);

  const value: ChatContextType = {
    selectedContact,
    setSelectedContact,
    contacts: realUsers,
    groups: sampleGroups,
    favorites: sampleFavorites,
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
