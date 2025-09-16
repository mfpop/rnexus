import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { HomeLeftCard, OptimizedHomeLeftCard } from "./home";
import { ContactLeftCard } from "./contact";
import {
  LoginLeftCard,
  RegisterLeftCard,
  ResetPasswordLeftCard,
  ProfileLeftCard,
} from "./auth";
import { HelpProvider, HelpMainContainer } from "./help";
import { SettingsLeftCard, SettingsProvider } from "./settings";
import { SystemLeftCard, SystemProvider } from "./system";
import { NewsProvider, NewsLeftCardWrapper } from "./news";
import { ProductionLeftCard, ProductionProvider } from "./production";
import { MetricsLeftCard, MetricsProvider } from "./metrics";
import { ProjectsLeftCard, ProjectsProvider } from "./projects";
import { ActivitiesLeftCard, ActivitiesProvider } from "./activities";
import { AboutLeftCard, AboutProvider } from "./about";
import { ChatProvider } from "./chat";
import { DatabaseLeftCard } from "./database";
import { TeamsLeftCard } from "./teams";
import LeftSidebarTemplate from "./templates/LeftSidebarTemplate";
import RightSidebarTemplate from "./templates/RightSidebarTemplate";
import MainContainerTemplate from "./templates/MainContainerTemplate";
import NotificationBell from "./shared/NotificationBell";
import NotificationCenter from "./shared/NotificationCenter";
import { NotificationProvider } from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { PaginationProvider } from "../contexts/PaginationContext";
import PaginationFooterWrapper from "./shared/PaginationFooterWrapper";
import { GET_USER_PROFILE } from "../graphql/userProfile";

// Import all page components
import MainPage from "../pages/MainPage";
import ProductionPage from "../pages/ProductionPage";
import ChatPage from "../pages/ChatPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import ContactPage from "../pages/ContactPage";
import HelpPage from "../pages/HelpPage";
import SettingsPage from "../pages/SettingsPage";
import SystemPage from "../pages/SystemPage";
import NewsPage from "../pages/NewsPage";
import Metrics from "../pages/Metrics";
import Projects from "../pages/Projects";
import Activities from "../pages/Activities";
import About from "../pages/About";
import DatabaseSettingsPage from "../pages/DatabaseSettingsPage";
import TeamsPage from "../pages/TeamsPage";
import OptimizedMainPage from "../pages/OptimizedMainPage";
import ArchiveFunctionalityTest from "../test/ArchiveFunctionalityTest";

import {
  House,
  Funnel,
  RefreshCw,
  Plus,
  Edit3,
  MessagesSquare,
  Info,
  LogOut,
  LogIn,
  Save,
  Calendar,
  PieChart,
  Factory,
  Mail,
  User,
  UserPlus,
  Monitor,
  Cog,
  X,
  Trash2,
  Newspaper,
  ClipboardList,
} from "lucide-react";

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;

/**
 * StableLayout - A template that provides consistent structure
 * This layout NEVER changes regardless of which page is displayed
 * Pages are rendered inside this stable template structure
 */

export default function StableLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout: authLogout } = useAuth();
  const [expandedCard, setExpandedCard] = useState<ExpandedCardState>(null);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  // Get current user profile with avatar information
  const { data: profileData, refetch: refetchProfile } = useQuery(GET_USER_PROFILE, {
    skip: !isAuthenticated,
  });

  // Listen for profile updates (e.g., avatar changes)
  useEffect(() => {
    const handleProfileUpdate = () => {
      refetchProfile();
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdate);
    };
  }, [refetchProfile]);

  // Custom navigation function that forces re-render
  const forceNavigate = (path: string) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authLogout();
      // Redirect to home page
      forceNavigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Grid columns and card visibility are now handled by MainContainerTemplate

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

  // Helper function to get the current page component
  const getCurrentPage = useMemo(() => {
    const page = (() => {
      switch (location.pathname) {
        case "/":
          return <MainPage />;
        case "/production":
          return <ProductionPage />;
        case "/chat":
          return (
            <ChatPage
              expandedCard={expandedCard}
              onExpandClick={handleExpandClick}
            />
          );
        case "/login":
          return <LoginPage />;
        case "/register":
          return <RegisterPage />;
        case "/reset-password":
          return <ResetPasswordPage />;
        case "/profile":
          return <ProfilePage />;
        case "/contact":
          return <ContactPage />;
        case "/help":
          return <HelpPage />;
        case "/settings":
          return <SettingsPage />;
        case "/system":
          return <SystemPage />;
        case "/news":
          return <NewsPage />;
        case "/metrics":
          return <Metrics />;
        case "/projects":
          return <Projects />;
        case "/activities":
          return <Activities />;
        case "/teams":
          return <TeamsPage />;
        case "/about":
          return <About />;
        case "/db-settings":
          return <DatabaseSettingsPage />;
        case "/optimized":
          return <OptimizedMainPage />;
        case "/archive-test":
          return <ArchiveFunctionalityTest />;
        default:
          return <MainPage />;
      }
    })();
    return page;
  }, [location.pathname, expandedCard, handleExpandClick]);

  // Helper function to get page-specific configuration
  const getPageConfig = (path: string) => {
    switch (path) {
      case "/":
        return {
          leftTitle: "Quick Navigation",
          leftSubtitle: "Access key platform features and modules",
          leftFooter: "Welcome to your dashboard",
          rightTitle: "Welcome to Nexus LMD",
          rightSubtitle:
            "Your comprehensive platform for managing and monitoring your production environment",
          rightFooter: "© 2024 Nexus LMD. All rights reserved.",
        };
      case "/contact":
        return {
          leftTitle: "Get in Touch",
          leftSubtitle: "We're here to help you succeed",
          leftFooter: "Your trusted partner in manufacturing innovation",
          rightTitle: "Send us a Message",
          rightSubtitle: "Tell us how we can help",
          rightFooter: "© 2024 Nexus LMD. All rights reserved.",
        };
      case "/login":
        return {
          leftTitle: "Secure Access",
          leftSubtitle: "Enterprise-grade security features",
          leftFooter: "Trusted by manufacturing leaders worldwide",
          rightTitle: "Sign In",
          rightSubtitle: "Access your Nexus LMD account",
          rightFooter: "Need help? Contact our support team",
        };
      case "/register":
        return {
          leftTitle: "Join Nexus LMD",
          leftSubtitle: "Transform your manufacturing operations",
          leftFooter: "Trusted by manufacturing leaders worldwide",
          rightTitle: "Create Account",
          rightSubtitle: "Start your manufacturing transformation",
          rightFooter: "Join thousands of satisfied customers",
        };
      case "/reset-password":
        return {
          leftTitle: "Password Recovery",
          leftSubtitle: "Secure account recovery process",
          leftFooter: "Your security is our priority",
          rightTitle: "Reset Password",
          rightSubtitle: "Regain access to your account",
          rightFooter: "Need additional help? Contact support",
        };
      case "/help":
        return {
          leftTitle: "User Manual",
          leftSubtitle: "Complete guide to using Nexus LMD platform",
          leftFooter: (
            <div className="text-center h-12 flex items-center justify-center">
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm text-teal-600">Need more help?</span>
                <button
                  className="h-18 w-12 text-teal-600 hover:bg-gray-100 hover:text-teal-700 transition-colors flex items-center justify-center"
                  onClick={() => (window.location.href = "/contact")}
                  title="Contact Support"
                >
                  <Mail className="h-6 w-6" />
                </button>
              </div>
            </div>
          ),
          rightTitle: "Getting Started",
          rightSubtitle: "Welcome to Nexus LMD",
          rightFooter: "~5 min read • Beginner level",
        };
      case "/settings":
        return {
          leftTitle: "System Settings",
          leftSubtitle: "Configure your application preferences",
          leftFooter: "Use right sidebar buttons to save settings",
          rightTitle: "Configuration",
          rightSubtitle: "Customize your experience",
          rightFooter: "Click Edit to modify settings. Save changes manually.",
        };
      case "/system":
        return {
          leftTitle: "System Monitor",
          leftSubtitle: "Real-time performance monitoring",
          leftFooter: "Auto-refresh: 30 seconds",
          rightTitle: "Performance Dashboard",
          rightSubtitle: "System health and metrics",
          rightFooter: "Live monitoring data",
        };
      case "/news":
        return {
          leftTitle: "News & Updates",
          leftSubtitle: "Latest company and industry news",
          leftFooter: <PaginationFooterWrapper />,
          rightTitle: "Article Reader",
          rightSubtitle: "Select an article to start reading",
          rightFooter:
            "Use right sidebar buttons to manage articles and settings.",
        };
      case "/production":
        return {
          leftTitle: "Production Lines",
          leftSubtitle: "Manufacturing line status and overview",
          leftFooter: "Monitor all production lines in real-time",
          rightTitle: "Production Dashboard",
          rightSubtitle: "Select a production line to view dashboard",
          rightFooter: "Real-time production monitoring and control",
        };
      case "/metrics":
        return {
          leftTitle: "Performance Metrics",
          leftSubtitle: "KPIs and performance indicators",
          leftFooter: "Monitor key performance metrics across all areas",
          rightTitle: "Metric Dashboard",
          rightSubtitle: "Select a metric to view detailed analysis",
          rightFooter: "Real-time metric monitoring and analysis",
        };
      case "/projects":
        return {
          leftTitle: "Project Portfolio",
          leftSubtitle: "Project management and tracking",
          leftFooter: <PaginationFooterWrapper />,
          rightTitle: "Project Dashboard",
          rightSubtitle: "Select a project to view detailed dashboard",
          rightFooter:
            "Use right sidebar buttons to create, edit, and save project data.",
        };
      case "/activities":
        return {
          leftTitle: "Activities Management",
          leftSubtitle: "Activities management and scheduling",
          leftFooter: <PaginationFooterWrapper />,
          rightTitle: "Activity Dashboard",
          rightSubtitle: "Select an activity to view detailed information",
          rightFooter:
            "Use right sidebar buttons to manage activity data and settings.",
        };
      case "/teams":
        return {
          leftTitle: "Microsoft Teams",
          leftSubtitle: "Team collaboration and communication",
          leftFooter: "Stay connected with your team",
          rightTitle: "Teams Dashboard",
          rightSubtitle: "Manage meetings, channels, and chats",
          rightFooter: "© 2024 Nexus LMD. All rights reserved.",
        };
      case "/chat":
        return {
          leftTitle: "Team Communications",
          leftSubtitle: "Manage contacts, groups, and conversations",
          leftFooter: <PaginationFooterWrapper />,
          rightTitle: "Chat Interface",
          rightSubtitle: "Real-time communication with your team",
          rightFooter:
            "Use right sidebar buttons for chat management. Be professional and respectful.",
        };
      case "/about":
        return {
          leftTitle: "About RNexus",
          leftSubtitle: "Company information and sections",
          leftFooter: "Learn about our company, mission, and team",
          rightTitle: "Company Information",
          rightSubtitle: "Select a section to learn more about RNexus",
          rightFooter: "Discover our story, values, and achievements",
        };
      case "/db-settings":
        return {
          leftTitle: "Database Management",
          leftSubtitle: "Database configuration and monitoring",
          leftFooter: "Administrative access required",
          rightTitle: "Database Settings",
          rightSubtitle: "Configure database connections and performance",
          rightFooter: "Changes may require system restart",
        };
      case "/profile":
        return {
          leftTitle: "Account Overview",
          leftSubtitle: "Your profile summary and quick actions",
          leftFooter: "Keep your profile updated for better experience",
          rightTitle: "Profile Details",
          rightSubtitle: "View and edit your profile information",
          rightFooter: "Remember to save your changes to update your profile",
        };
      case "/archive-test":
        return {
          leftTitle: "Archive Test",
          leftSubtitle: "Test archive functionality with different chat ID formats",
          leftFooter: "Verify chat archiving works correctly",
          rightTitle: "Archive Functionality Test",
          rightSubtitle: "Test the archive/unarchive functionality",
          rightFooter: "© 2024 Nexus LMD. All rights reserved.",
        };
      default:
        return {
          leftTitle: "Navigation",
          leftSubtitle: "Page content",
          leftFooter: "Page navigation",
          rightTitle: "Content",
          rightSubtitle: "Page content",
          rightFooter: "Page content",
        };
    }
  };

  // Get current page configuration based on location
  const pageConfig = useMemo(() => {
    const config = getPageConfig(location.pathname);
    return config;
  }, [location.pathname]);

  // Authentication handler
  const handleAuthClick = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      forceNavigate("/login");
    }
  };

  // Stable left sidebar buttons (B1-B10) - exact from layout.md
  const leftSidebarButtons = [
    // First Buttons Section (B1-B5)
    {
      icon: <House className="h-6 w-6" />,
      title: "Home",
      onClick: () => forceNavigate("/"),
      height: "h-18",
    }, // B1
    {
      icon: isAuthenticated ? (
        <LogOut className="h-6 w-6" />
      ) : (
        <LogIn className="h-6 w-6" />
      ),
      title: isAuthenticated ? "Logout" : "Login",
      onClick: handleAuthClick,
      height: "h-18",
    }, // B2
    {
      icon: isAuthenticated ? (
        <User className="h-6 w-6" />
      ) : (
        <UserPlus className="h-6 w-6" />
      ),
      title: isAuthenticated ? "Profile" : "Register",
      onClick: () => forceNavigate(isAuthenticated ? "/profile" : "/register"),
      height: "h-18",
    }, // B3
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Contact",
      onClick: () => forceNavigate("/contact"),
      height: "h-18",
    }, // B4
    {
      icon: <MessagesSquare className="h-6 w-6" />,
      title: "Chat",
      onClick: () => forceNavigate("/chat"),
      height: "h-18",
    }, // B5

    // Second Buttons Section (B6-B10)
    {
      icon: <Newspaper className="h-6 w-6" />,
      title: "News",
      onClick: () => forceNavigate("/news"),
      height: "h-16",
    }, // B6
    {
      icon: <Factory className="h-6 w-6" />,
      title: "Production",
      onClick: () => forceNavigate("/production"),
      height: "h-16",
    }, // B7
    {
      icon: <PieChart className="h-6 w-6" />,
      title: "Metrics",
      onClick: () => forceNavigate("/metrics"),
      height: "h-16",
    }, // B8
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Projects",
      onClick: () => forceNavigate("/projects"),
      height: "h-16",
    }, // B9
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Activities",
      onClick: () => forceNavigate("/activities"),
      height: "h-16",
    }, // B10
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: "Teams",
      onClick: () => forceNavigate("/teams"),
      height: "h-16",
    }, // B11
  ];

  // Button navigation handler (from layout.md)
  const handleButtonClick = (buttonNumber: number) => {
    // Page-specific button handling
    if (location.pathname === "/news") {
      handleNewsPageButton(buttonNumber);
      return;
    }

    if (location.pathname === "/profile") {
      handleProfilePageButton(buttonNumber);
      return;
    }

    // Default navigation mapping for other pages
    const navigationMap: { [key: number]: string } = {
      1: "/",
      2: "/production",
      3: "/chat",
      4: "/metrics",
      5: "/projects",
      6: "/activities",
      7: "/teams",
      8: "/about",
      9: "/contact",
      10: "/help",
      11: "/teams",
      18: "/system",
      19: "/help",
      20: "/settings",
    };
    const path = navigationMap[buttonNumber];
    if (path) {
      forceNavigate(path);
    } else {
      console.log(`No navigation mapping for button ${buttonNumber}`);
    }
  };

  // News page specific button handling
  const handleNewsPageButton = (buttonNumber: number) => {
    switch (buttonNumber) {
      case 11: // Add Record - Create new news
        // This will be handled by the NewsLeftCardSimple component
        // We can add a custom event or use a ref to communicate
        window.dispatchEvent(
          new CustomEvent("news:create", {
            detail: { action: "showCreateForm" },
          }),
        );
        break;
      case 12: // Edit Record - Edit selected news
        window.dispatchEvent(
          new CustomEvent("news:edit", { detail: { action: "showEditForm" } }),
        );
        break;
      case 13: // Save - Save form changes
        window.dispatchEvent(
          new CustomEvent("news:save", { detail: { action: "saveForm" } }),
        );
        break;
      case 14: // Cancel - Cancel form changes
        window.dispatchEvent(
          new CustomEvent("news:cancel", { detail: { action: "cancelForm" } }),
        );
        break;
      case 15: // Delete - Delete selected news
        window.dispatchEvent(
          new CustomEvent("news:delete", {
            detail: { action: "deleteUpdate" },
          }),
        );
        break;
      default:
        console.log(`News: Button ${buttonNumber} not handled`);
    }
  };

  // Profile page specific button handling
  const handleProfilePageButton = (buttonNumber: number) => {
    const handlers = (window as any).profileButtonHandlers;
    if (!handlers) {
      console.warn("Profile button handlers not available");
      return;
    }

    console.log(`Profile button ${buttonNumber} clicked, handlers:`, handlers);

    switch (buttonNumber) {
      case 11: // Add Record - Add work experience
        console.log("Calling handlers.add()");
        handlers.add();
        break;
      case 12: // Edit Record - Enable edit mode
        console.log("Calling handlers.edit()");
        handlers.edit();
        break;
      case 13: // Save - Save profile changes
        console.log("Calling handlers.save()");
        handlers.save();
        break;
      case 14: // Cancel - Cancel profile changes
        console.log("Calling handlers.cancel()");
        handlers.cancel();
        break;
      case 15: // Delete - Delete profile
        console.log("Calling handlers.delete()");
        handlers.delete();
        break;
      case 17: // Refresh - Reload profile data
        console.log("Calling handlers.refresh()");
        if (handlers.refresh) {
          handlers.refresh();
        } else {
          // Fallback to page reload if no refresh handler
          window.location.reload();
        }
        break;
      default:
        console.log(`Profile page button ${buttonNumber} clicked`);
    }
  };

  // Check if we're on profile page for conditional button titles
  const isProfilePage = location.pathname === "/profile";

  // Stable right sidebar buttons (B11-B20) - exact from layout.md
  const rightSidebarButtons = useMemo(
    () => [
      // First Buttons Section (B11-B15)
      {
        icon: <Plus className="h-6 w-6" />,
        title: isProfilePage ? "Add Record" : "Add Record",
        onClick: () => handleButtonClick(11),
        height: "h-16",
        disabled: false,
      }, // B11
      {
        icon: <Edit3 className="h-6 w-6" />,
        title: isProfilePage ? "Edit Profile" : "Edit Record",
        onClick: () => handleButtonClick(12),
        height: "h-16",
        disabled: false,
      }, // B12
      {
        icon: <Save className="h-6 w-6" />,
        title: isProfilePage ? "Save Profile" : "Save",
        onClick: () => handleButtonClick(13),
        height: "h-16",
        disabled: false,
      }, // B13
      {
        icon: <X className="h-6 w-6" />,
        title: isProfilePage ? "Cancel Changes" : "Cancel",
        onClick: () => handleButtonClick(14),
        height: "h-16",
        disabled: false,
      }, // B14
      {
        icon: <Trash2 className="h-6 w-6" />,
        title: isProfilePage ? "Delete Profile" : "Delete",
        onClick: () => handleButtonClick(15),
        height: "h-16",
        disabled: false,
      }, // B15

      // Second Buttons Section (B16-B20)
      {
        icon: <Funnel className="h-6 w-6" />,
        title: "Filter",
        onClick: () => handleButtonClick(16),
        height: "h-16",
        disabled: false,
      }, // B16
      {
        icon: <RefreshCw className="h-6 w-6" />,
        title: "Refresh",
        onClick: () => handleButtonClick(17),
        height: "h-16",
        disabled: false,
      }, // B17
      {
        icon: <Monitor className="h-6 w-6" />,
        title: "App Monitor",
        onClick: () => handleButtonClick(18),
        height: "h-16",
        disabled: false,
      }, // B18
      {
        icon: <Info className="h-6 w-6" />,
        title: "App Documentation",
        onClick: () => handleButtonClick(19),
        height: "h-16",
        disabled: false,
      }, // B19
      {
        icon: <Cog className="h-6 w-6" />,
        title: "Settings",
        onClick: () => handleButtonClick(20),
        height: "h-16",
        disabled: false,
      }, // B20
      {
        icon: (
          <NotificationBell
            onClick={() => setShowNotificationCenter((prev) => !prev)}
          />
        ),
        title: "Notifications",
        onClick: () => setShowNotificationCenter((prev) => !prev),
        height: "h-16",
      }, // New Notification Bell
    ],
    [isProfilePage],
  );

  return (
    <NotificationProvider>
      <div className="grid h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 grid-cols-[60px_1fr_60px]">
        {/* Left Sidebar - Uses LeftSidebarTemplate with 4-Row Structure */}
        <LeftSidebarTemplate
          firstButtons={leftSidebarButtons.slice(0, 5)} // B1-B5
          secondButtons={leftSidebarButtons.slice(5, 10)} // B6-B10
          applicationName="Nexus LMD"
        />

        {/* Main Content Area - Conditional Layout */}
        {location.pathname === "/help" ? (
          // Help page uses HelpProvider for left-right card communication
          <HelpProvider>
            <HelpMainContainer
              pageConfig={pageConfig}
              expandedCard={expandedCard}
              handleExpandClick={handleExpandClick}
            />
          </HelpProvider>
        ) : location.pathname === "/settings" ? (
          // Settings page uses SettingsProvider for left-right card communication
          <SettingsProvider>
            <MainContainerTemplate
              key={location.pathname}
              leftTitle={pageConfig.leftTitle}
              leftSubtitle={pageConfig.leftSubtitle}
              leftFooter={pageConfig.leftFooter}
              leftContent={<SettingsLeftCard />}
              rightTitle={pageConfig.rightTitle}
              rightSubtitle={pageConfig.rightSubtitle}
              rightFooter={pageConfig.rightFooter}
              rightContent={getCurrentPage}
              expandedCard={expandedCard}
              onExpandClick={handleExpandClick}
              gridProportions="1fr 3fr"
            />
          </SettingsProvider>
        ) : location.pathname === "/system" ? (
          // System page uses SystemProvider for left-right card communication
          <SystemProvider>
            <MainContainerTemplate
              key={location.pathname}
              leftTitle={pageConfig.leftTitle}
              leftSubtitle={pageConfig.leftSubtitle}
              leftFooter={pageConfig.leftFooter}
              leftContent={<SystemLeftCard />}
              rightTitle={pageConfig.rightTitle}
              rightSubtitle={pageConfig.rightSubtitle}
              rightFooter={pageConfig.rightFooter}
              rightContent={getCurrentPage}
              expandedCard={expandedCard}
              onExpandClick={handleExpandClick}
              gridProportions="1fr 3fr"
            />
          </SystemProvider>
        ) : location.pathname === "/news" ? (
          // News page uses NewsProvider and PaginationProvider for left-right card communication
          <NewsProvider>
            <PaginationProvider>
              <MainContainerTemplate
                key={location.pathname}
                leftTitle={pageConfig.leftTitle}
                leftSubtitle={pageConfig.leftSubtitle}
                leftFooter={pageConfig.leftFooter}
                leftContent={<NewsLeftCardWrapper />}
                rightTitle={pageConfig.rightTitle}
                rightSubtitle={pageConfig.rightSubtitle}
                rightFooter={pageConfig.rightFooter}
                rightContent={getCurrentPage}
                gridProportions="1fr 3fr"
              />
            </PaginationProvider>
          </NewsProvider>
        ) : location.pathname === "/production" ? (
          // Production page uses ProductionProvider for left-right card communication
          <ProductionProvider>
            <MainContainerTemplate
              key={location.pathname}
              leftTitle={pageConfig.leftTitle}
              leftSubtitle={pageConfig.leftSubtitle}
              leftFooter={pageConfig.leftFooter}
              leftContent={<ProductionLeftCard />}
              rightTitle={pageConfig.rightTitle}
              rightSubtitle={pageConfig.rightSubtitle}
              rightFooter={pageConfig.rightFooter}
              rightContent={getCurrentPage}
              expandedCard={expandedCard}
              onExpandClick={handleExpandClick}
              gridProportions="1fr 3fr"
            />
          </ProductionProvider>
        ) : location.pathname === "/metrics" ? (
          // Metrics page uses MetricsProvider for left-right card communication
          <MetricsProvider>
            <MainContainerTemplate
              key={location.pathname}
              leftTitle={pageConfig.leftTitle}
              leftSubtitle={pageConfig.leftSubtitle}
              leftFooter={pageConfig.leftFooter}
              leftContent={<MetricsLeftCard />}
              rightTitle={pageConfig.rightTitle}
              rightSubtitle={pageConfig.rightSubtitle}
              rightFooter={pageConfig.rightFooter}
              rightContent={getCurrentPage}
              expandedCard={expandedCard}
              onExpandClick={handleExpandClick}
              gridProportions="1fr 3fr"
            />
          </MetricsProvider>
        ) : location.pathname === "/projects" ? (
          // Projects page uses ProjectsProvider and PaginationProvider for left-right card communication
          <ProjectsProvider>
            <PaginationProvider>
              <MainContainerTemplate
                key={location.pathname}
                leftTitle={pageConfig.leftTitle}
                leftSubtitle={pageConfig.leftSubtitle}
                leftFooter={pageConfig.leftFooter}
                leftContent={<ProjectsLeftCard />}
                rightTitle={pageConfig.rightTitle}
                rightSubtitle={pageConfig.rightSubtitle}
                rightFooter={pageConfig.rightFooter}
                rightContent={getCurrentPage}
                expandedCard={expandedCard}
                onExpandClick={handleExpandClick}
                gridProportions="1fr 3fr"
              />
            </PaginationProvider>
          </ProjectsProvider>
        ) : location.pathname === "/activities" ? (
          // Activities page uses ActivitiesProvider and PaginationProvider for left-right card communication
          <ActivitiesProvider>
            <PaginationProvider>
              <MainContainerTemplate
                key={location.pathname}
                leftTitle={pageConfig.leftTitle}
                leftSubtitle={pageConfig.leftSubtitle}
                leftFooter={pageConfig.leftFooter}
                leftContent={<ActivitiesLeftCard />}
                rightTitle={pageConfig.rightTitle}
                rightSubtitle={pageConfig.rightSubtitle}
                rightFooter={pageConfig.rightFooter}
                rightContent={getCurrentPage}
                expandedCard={expandedCard}
                onExpandClick={handleExpandClick}
                gridProportions="1fr 3fr"
              />
            </PaginationProvider>
          </ActivitiesProvider>
        ) : location.pathname === "/teams" ? (
          // Teams page uses standard MainContainer Template
          <MainContainerTemplate
            key={location.pathname}
            leftTitle={pageConfig.leftTitle}
            leftSubtitle={pageConfig.leftSubtitle}
            leftFooter={pageConfig.leftFooter}
            leftContent={<TeamsLeftCard />}
            rightTitle={pageConfig.rightTitle}
            rightSubtitle={pageConfig.rightSubtitle}
            rightFooter={pageConfig.rightFooter}
            rightContent={getCurrentPage}
            expandedCard={expandedCard}
            onExpandClick={handleExpandClick}
            gridProportions="1fr 3fr"
          />
        ) : location.pathname === "/about" ? (
          // About page uses AboutProvider for left-right card communication
          <AboutProvider>
            <MainContainerTemplate
              key={location.pathname}
              leftTitle={pageConfig.leftTitle}
              leftSubtitle={pageConfig.leftSubtitle}
              leftFooter={pageConfig.leftFooter}
              leftContent={<AboutLeftCard />}
              rightTitle={pageConfig.rightTitle}
              rightSubtitle={pageConfig.rightSubtitle}
              rightFooter={pageConfig.rightFooter}
              rightContent={getCurrentPage}
              expandedCard={expandedCard}
              onExpandClick={handleExpandClick}
              gridProportions="1fr 3fr"
            />
          </AboutProvider>
        ) : location.pathname === "/chat" ? (
          // Chat page uses ChatProvider and PaginationProvider for left-right card communication
          <ChatProvider>
            <PaginationProvider>{getCurrentPage}</PaginationProvider>
          </ChatProvider>
        ) : (
          // Other pages use the standard MainContainer Template
          <MainContainerTemplate
            key={location.pathname}
            leftTitle={pageConfig.leftTitle}
            leftSubtitle={pageConfig.leftSubtitle}
            leftFooter={pageConfig.leftFooter}
            leftContent={
              location.pathname === "/" ? (
                <HomeLeftCard />
              ) : location.pathname === "/optimized" ? (
                <OptimizedHomeLeftCard />
              ) : location.pathname === "/contact" ? (
                <ContactLeftCard />
              ) : location.pathname === "/login" ? (
                <LoginLeftCard />
              ) : location.pathname === "/register" ? (
                <RegisterLeftCard />
              ) : location.pathname === "/reset-password" ? (
                <ResetPasswordLeftCard />
              ) : location.pathname === "/profile" ? (
                <ProfileLeftCard />
              ) : location.pathname === "/db-settings" ? (
                <DatabaseLeftCard />
              ) : (
                <div className="p-4">
                  <p className="text-gray-600">
                    Page navigation will appear here
                  </p>
                </div>
              )
            }
            rightTitle={pageConfig.rightTitle}
            rightSubtitle={pageConfig.rightSubtitle}
            rightFooter={pageConfig.rightFooter}
            rightContent={getCurrentPage}
            expandedCard={expandedCard}
            onExpandClick={handleExpandClick}
            gridProportions="1fr 3fr"
          />
        )}

        {/* Right Sidebar - Uses RightSidebarTemplate with 4-Row Structure */}
        <RightSidebarTemplate
          firstButtons={rightSidebarButtons.slice(0, 5)} // B11-B15
          secondButtons={rightSidebarButtons.slice(5, 10)} // B16-B20
          showDatabaseButton={true}
          onDatabaseClick={() => forceNavigate("/db-settings")}
          userRole="admin" // This should come from user context in real app
          avatarSrc={profileData?.userProfile?.avatarUrl || profileData?.userProfile?.avatar}
          avatarFallback={
            profileData?.userProfile?.user?.firstName?.[0] ||
            profileData?.userProfile?.user?.username?.[0] ||
            "U"
          }
          avatarTitle={
            profileData?.userProfile?.user?.firstName
              ? `${profileData.userProfile.user.firstName} ${profileData.userProfile.user.lastName || ""}`.trim()
              : profileData?.userProfile?.user?.username || "User"
          }
        />
        {showNotificationCenter && (
          <NotificationCenter
            onClose={() => setShowNotificationCenter(false)}
          />
        )}
      </div>
    </NotificationProvider>
  );
}
