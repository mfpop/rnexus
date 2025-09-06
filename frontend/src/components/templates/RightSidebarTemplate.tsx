import React from "react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import { Database } from "lucide-react";

interface SidebarButton {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  height: string;
  disabled?: boolean;
}

interface RightSidebarTemplateProps {
  avatar?: React.ReactNode;
  avatarSrc?: string;
  avatarFallback?: string;
  avatarTitle?: string;
  firstButtons?: SidebarButton[]; // B11-B15
  secondButtons?: SidebarButton[]; // B16-B20
  showDatabaseButton?: boolean; // Admin/Staff only
  onDatabaseClick?: () => void;
  userRole?: "admin" | "staff" | "user";
}

/**
 * RightSidebarTemplate - 4-Row Structure Template for the right sidebar
 * This template is used by the Layout Template and NEVER changes
 *
 * STRUCTURE:
 * Row 1: Top Section (User Avatar)
 * Row 2: First Buttons Section (B11-B15) - vertically centered
 * Row 3: Second Buttons Section (B16-B20) - vertically centered
 * Row 4: Bottom Section (Database Button - Admin/Staff Only)
 */
const RightSidebarTemplate: React.FC<RightSidebarTemplateProps> = ({
  avatar,
  avatarSrc,
  avatarFallback = "U",
  avatarTitle = "Mihai Herea",
  firstButtons = [], // B11-B15
  secondButtons = [], // B16-B20
  showDatabaseButton = true,
  onDatabaseClick,
  userRole = "admin", // Default to admin for demo
}) => {

  // Show database button only for admin and staff
  const canAccessDatabase = userRole === "admin" || userRole === "staff";
  const shouldShowDatabaseButton = showDatabaseButton && canAccessDatabase;

  return (
    <Card className="flex flex-col h-screen border-l border-gray-200 bg-white/80 backdrop-blur-xl shadow-xl px-0">
      {/* ROW 1: Top Section - User Avatar */}
      <div className="flex items-center justify-center p-2 border-b border-gray-200 bg-white backdrop-blur-sm h-[74px] shadow-sm">
        <div className="w-full h-full rounded-lg flex items-center justify-center">
          {avatar || (
            <Avatar className="w-10 h-10" title={avatarTitle}>
              {avatarSrc && <AvatarImage src={avatarSrc} alt={avatarTitle} />}
              <AvatarFallback className="bg-gray-100 text-gray-600">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>

      {/* ROW 2: First Buttons Section (B11-B15) - Vertically Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-1.5">
          {firstButtons.map((button, index) => (
            <div key={`first-${index}`} className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className={`${button.height} w-12 transition-colors ${
                  button.disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
                title={button.title}
                onClick={button.disabled ? undefined : button.onClick}
                disabled={button.disabled}
              >
                {button.icon}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 3: Second Buttons Section (B16-B20) - Vertically Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-1.5">
          {secondButtons.map((button, index) => (
            <div key={`second-${index}`} className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className={`${button.height} w-12 transition-colors ${
                  button.disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
                title={button.title}
                onClick={button.disabled ? undefined : button.onClick}
                disabled={button.disabled}
              >
                {button.icon}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 4: Bottom Section - Database Button (Admin/Staff Only) */}
      <div className="flex items-center justify-center h-[68px] p-2 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm shadow-sm">
        {shouldShowDatabaseButton ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-12 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            title="Database Settings (Admin/Staff Only)"
            onClick={onDatabaseClick}
          >
            <Database className="w-5 h-5" />
          </Button>
        ) : (
          <div className="text-xs text-gray-400 text-center">
            {/* Empty space for non-admin users */}
          </div>
        )}
      </div>
    </Card>
  );
};

export default RightSidebarTemplate;
