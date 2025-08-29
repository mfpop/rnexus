import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

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
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "contacts" | "groups" | "favorites"
  >("contacts");
  const [itemsPerPage, setItemsPerPage] = useState(12); // Set a reasonable default
  const [showProfileView, setShowProfileView] = useState(false);

  // Simplified items per page calculation - use a fixed reasonable value
  const calculateOptimalItemsPerPage = useCallback(() => {
    // Use a fixed value for now to ensure reliability
    return 12;
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(calculateOptimalItemsPerPage());
    };

    updateItemsPerPage();

    // Add resize listener to recalculate when window size changes
    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, [calculateOptimalItemsPerPage]);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "contacts":
        return allUsers;
      case "groups":
        return sampleGroups;
      case "favorites":
        return sampleFavorites;
      default:
        return allUsers;
    }
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  const paginatedUsers = currentData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Debug logging to see pagination values
  console.log('ChatContext - Pagination Debug:', {
    currentDataLength: currentData.length,
    currentPage,
    itemsPerPage,
    totalPages,
    paginatedUsersLength: paginatedUsers.length,
    sliceStart: (currentPage - 1) * itemsPerPage,
    sliceEnd: currentPage * itemsPerPage
  });

  const value: ChatContextType = {
    selectedContact,
    setSelectedContact,
    contacts: sampleContacts,
    groups: sampleGroups,
    favorites: sampleFavorites,
    allUsers,
    paginatedUsers,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
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
