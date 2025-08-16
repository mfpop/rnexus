import React, { useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeftSidebarTemplate from "./LeftSidebarTemplate";
import RightSidebarTemplate from "./RightSidebarTemplate";
import MainContainerTemplate from "./MainContainerTemplate";
import {
  House,
  LogOut,
  LogIn,
  User,
  UserPlus,
  Mail,
  MessagesSquare,
  Newspaper,
  Factory,
  PieChart,
  ClipboardList,
  Calendar,
  Plus,
  Edit3,
  Save,
  X,
  Trash2,
  Funnel,
  RefreshCw,
  Monitor,
  Info,
  Cog,
} from "lucide-react";

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;
type ContentRelationship = "master-detail" | "independent";

// Generic type for list records (for master-detail pattern)
interface ListRecord {
  id: string | number;
  [key: string]: any;
}

interface LayoutTemplateProps {
  // Main Container Props
  contentRelationship?: ContentRelationship;
  leftTitle?: string;
  leftSubtitle?: string;
  leftFooter?: string;
  leftContent?: React.ReactNode;
  rightTitle?: string;
  rightSubtitle?: string;
  rightFooter?: string;
  rightContent?: React.ReactNode;

  // Master-Detail Pattern Props
  recordsList?: ListRecord[];
  selectedRecord?: ListRecord | null;
  onRecordSelect?: (record: ListRecord) => void;
  onAddNewRecord?: () => void;
  detailsContent?: (record: ListRecord) => React.ReactNode;
  addFormContent?: React.ReactNode;
  emptyStateContent?: React.ReactNode;

  // User Authentication State
  isLoggedIn?: boolean;
  userRole?: "admin" | "staff" | "user";
  userName?: string;
  userAvatar?: string;
  userFallback?: string;

  // Layout Customization
  className?: string;
  showDatabaseButton?: boolean;

  // Event Handlers
  onAuthStateChange?: (isLoggedIn: boolean) => void;
  onDatabaseClick?: () => void;
}

/**
 * LayoutTemplate - The Master Template for the entire application layout
 * This template is the root layout component and NEVER changes its structure
 * Only the content/data passed to it changes for different pages and states
 *
 * STRUCTURE:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ LAYOUT TEMPLATE (Grid: 60px 1fr 60px)                          │
 * │ ┌──────────┐ ┌──────────────────────────────┐ ┌──────────────┐ │
 * │ │ LEFT     │ │ MAIN CONTAINER               │ │ RIGHT        │ │
 * │ │ SIDEBAR  │ │ ┌────────────┐ ┌──────────┐ │ │ SIDEBAR      │ │
 * │ │ TEMPLATE │ │ │ LEFT CARD  │ │ RIGHT    │ │ │ TEMPLATE     │ │
 * │ │          │ │ │ TEMPLATE   │ │ CARD     │ │ │              │ │
 * │ │ • Logo   │ │ │            │ │ TEMPLATE │ │ │ • Avatar     │ │
 * │ │ • B1-B5  │ │ │ • Header   │ │          │ │ │ • B11-B15    │ │
 * │ │ • B6-B10 │ │ │ • Content  │ │ • Header │ │ │ • B16-B20    │ │
 * │ │ • Name   │ │ │ • Footer   │ │ • Content│ │ │ • Database   │ │
 * │ │          │ │ │            │ │ • Footer │ │ │              │ │
 * │ │          │ │ └────────────┘ └──────────┘ │ │              │ │
 * │ └──────────┘ └──────────────────────────────┘ └──────────────┘ │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * TEMPLATE COMPOSITION:
 * - LeftSidebarTemplate: Navigation buttons (B1-B10) + Nexus.svg logo
 * - MainContainerTemplate: Central content area with LeftCard + RightCard
 * - RightSidebarTemplate: Action buttons (B11-B20) + user avatar + database
 *
 * CONTENT PATTERNS:
 * - Independent: Left and right content are unrelated (home page)
 * - Master-Detail: Left list drives right content (data management pages)
 */
const LayoutTemplate: React.FC<LayoutTemplateProps> = ({
  // Main Container Props
  contentRelationship = "independent",
  leftTitle = "Navigation",
  leftSubtitle = "Page navigation content",
  leftFooter = "Page navigation",
  leftContent,
  rightTitle = "Content",
  rightSubtitle = "Page content",
  rightFooter = "Page content",
  rightContent,

  // Master-Detail Pattern Props
  recordsList = [],
  selectedRecord = null,
  onRecordSelect,
  onAddNewRecord,
  detailsContent,
  addFormContent,
  emptyStateContent,

  // User Authentication State
  isLoggedIn = false,
  userRole = "admin",
  userName = "Mihai Herea",
  userAvatar = "https://github.com/shadcn.png",
  userFallback = "MH",

  // Layout Customization
  className = "",
  showDatabaseButton = true,

  // Event Handlers
  onAuthStateChange,
  onDatabaseClick,
}) => {
  // Local state for expansion if not managed externally
  const [expandedCard, setExpandedCard] = useState<ExpandedCardState>(null);

  // Navigation hooks
  const location = useLocation();
  const navigate = useNavigate();

  // Expansion handler
  const handleExpandClick = useCallback((side: "left" | "right") => {
    setExpandedCard((prev) => {
      if (side === "left") {
        if (prev === null) return "left";
        if (prev === "left") return "left-full";
        if (prev === "left-full") return null;
        return "left";
      } else {
        if (prev === null) return "right";
        if (prev === "right") return "right-full";
        if (prev === "right-full") return null;
        return "right";
      }
    });
  }, []);

  // Authentication handler
  const handleAuthClick = useCallback(() => {
    const newAuthState = !isLoggedIn;
    onAuthStateChange?.(newAuthState);
    if (!newAuthState) {
      // Logout action
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate, onAuthStateChange]);

  // Button navigation handler
  const handleButtonClick = useCallback(
    (buttonNumber: number) => {
      const navigationMap: Record<number, string> = {
        1: "/",
        6: "/news",
        7: "/production",
        8: "/metrics",
        9: "/projects",
        10: "/activities",
        18: "/system",
        19: "/help",
        20: "/settings",
      };
      const path = navigationMap[buttonNumber];
      if (path) navigate(path);
    },
    [navigate],
  );

  // Left sidebar buttons (B1-B10) - from layout.md specifications
  const leftSidebarButtons = useMemo(
    () => [
      // First Buttons Section (B1-B5)
      {
        icon: <House className="h-6 w-6" />,
        title: "Home",
        onClick: () => navigate("/"),
        height: "h-18",
      }, // B1
      {
        icon: isLoggedIn ? (
          <LogOut className="h-6 w-6" />
        ) : (
          <LogIn className="h-6 w-6" />
        ),
        title: isLoggedIn ? "Logout" : "Login",
        onClick: handleAuthClick,
        height: "h-18",
      }, // B2
      {
        icon: isLoggedIn ? (
          <User className="h-6 w-6" />
        ) : (
          <UserPlus className="h-6 w-6" />
        ),
        title: isLoggedIn ? "Profile" : "Register",
        onClick: () => navigate(isLoggedIn ? "/profile" : "/register"),
        height: "h-18",
      }, // B3
      {
        icon: <Mail className="h-6 w-6" />,
        title: "Contact",
        onClick: () => navigate("/contact"),
        height: "h-18",
      }, // B4
      {
        icon: <MessagesSquare className="h-6 w-6" />,
        title: "Chat",
        onClick: () => navigate("/chat"),
        height: "h-18",
      }, // B5

      // Second Buttons Section (B6-B10)
      {
        icon: <Newspaper className="h-6 w-6" />,
        title: "News",
        onClick: () => handleButtonClick(6),
        height: "h-16",
      }, // B6
      {
        icon: <Factory className="h-6 w-6" />,
        title: "Production",
        onClick: () => handleButtonClick(7),
        height: "h-16",
      }, // B7
      {
        icon: <PieChart className="h-6 w-6" />,
        title: "Metrics",
        onClick: () => handleButtonClick(8),
        height: "h-16",
      }, // B8
      {
        icon: <ClipboardList className="h-6 w-6" />,
        title: "Projects",
        onClick: () => handleButtonClick(9),
        height: "h-16",
      }, // B9
      {
        icon: <Calendar className="h-6 w-6" />,
        title: "Activities",
        onClick: () => handleButtonClick(10),
        height: "h-16",
      }, // B10
    ],
    [isLoggedIn, navigate, handleAuthClick, handleButtonClick],
  );

  // Right sidebar buttons (B11-B20) - from layout.md specifications
  const rightSidebarButtons = useMemo(
    () => [
      // First Buttons Section (B11-B15)
      {
        icon: <Plus className="h-6 w-6" />,
        title: "Add Record",
        onClick: () => handleButtonClick(11),
        height: "h-16",
      }, // B11
      {
        icon: <Edit3 className="h-6 w-6" />,
        title: "Edit Record",
        onClick: () => handleButtonClick(12),
        height: "h-16",
      }, // B12
      {
        icon: <Save className="h-6 w-6" />,
        title: "Save",
        onClick: () => handleButtonClick(13),
        height: "h-16",
      }, // B13
      {
        icon: <X className="h-6 w-6" />,
        title: "Cancel",
        onClick: () => handleButtonClick(14),
        height: "h-16",
      }, // B14
      {
        icon: <Trash2 className="h-6 w-6" />,
        title: "Delete",
        onClick: () => handleButtonClick(15),
        height: "h-16",
      }, // B15

      // Second Buttons Section (B16-B20)
      {
        icon: <Funnel className="h-6 w-6" />,
        title: "Filter",
        onClick: () => handleButtonClick(16),
        height: "h-16",
      }, // B16
      {
        icon: <RefreshCw className="h-6 w-6" />,
        title: "Refresh",
        onClick: () => handleButtonClick(17),
        height: "h-16",
      }, // B17
      {
        icon: <Monitor className="h-6 w-6" />,
        title: "App Monitor",
        onClick: () => handleButtonClick(18),
        height: "h-16",
      }, // B18
      {
        icon: <Info className="h-6 w-6" />,
        title: "App Documentation",
        onClick: () => handleButtonClick(19),
        height: "h-16",
      }, // B19
      {
        icon: <Cog className="h-6 w-6" />,
        title: "Settings",
        onClick: () => handleButtonClick(20),
        height: "h-16",
      }, // B20
    ],
    [handleButtonClick],
  );

  return (
    <div
      className={`grid grid-cols-[60px_1fr_60px] h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 ${className}`}
    >
      {/* Left Sidebar - Uses LeftSidebarTemplate with 4-Row Structure */}
      <LeftSidebarTemplate
        firstButtons={leftSidebarButtons.slice(0, 5)} // B1-B5
        secondButtons={leftSidebarButtons.slice(5, 10)} // B6-B10
        applicationName="Nexus LMD"
        logoTitle="Nexus LMD"
      />

      {/* Main Content Area - Uses MainContainerTemplate */}
      <MainContainerTemplate
        contentRelationship={contentRelationship}
        leftTitle={leftTitle}
        leftSubtitle={leftSubtitle}
        leftFooter={leftFooter}
        leftContent={leftContent}
        rightTitle={rightTitle}
        rightSubtitle={rightSubtitle}
        rightFooter={rightFooter}
        rightContent={rightContent}
        recordsList={recordsList}
        selectedRecord={selectedRecord}
        onRecordSelect={onRecordSelect}
        onAddNewRecord={onAddNewRecord}
        detailsContent={detailsContent}
        addFormContent={addFormContent}
        emptyStateContent={emptyStateContent}
        expandedCard={expandedCard}
        onExpandClick={handleExpandClick}
      />

      {/* Right Sidebar - Uses RightSidebarTemplate with 4-Row Structure */}
      <RightSidebarTemplate
        firstButtons={rightSidebarButtons.slice(0, 5)} // B11-B15
        secondButtons={rightSidebarButtons.slice(5, 10)} // B16-B20
        showDatabaseButton={showDatabaseButton}
        onDatabaseClick={onDatabaseClick || (() => navigate("/db-settings"))}
        userRole={userRole}
        avatarSrc={userAvatar}
        avatarFallback={userFallback}
        avatarTitle={userName}
      />
    </div>
  );
};

export default LayoutTemplate;
