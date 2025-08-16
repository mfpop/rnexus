import React from "react";
import { Card } from "../ui/Card";
import Button from "../ui/Button";

interface SidebarButton {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  height: string;
}

interface LeftSidebarTemplateProps {
  logo?: React.ReactNode;
  logoTitle?: string;
  firstButtons?: SidebarButton[]; // B1-B5
  secondButtons?: SidebarButton[]; // B6-B10
  applicationName?: string;
}

/**
 * LeftSidebarTemplate - 4-Row Structure Template for the left sidebar
 * This template is used by the Layout Template and NEVER changes
 *
 * STRUCTURE:
 * Row 1: Top Section (Logo)
 * Row 2: First Buttons Section (B1-B5) - vertically centered
 * Row 3: Second Buttons Section (B6-B10) - vertically centered
 * Row 4: Bottom Section (Application Name: "Nexus LMD")
 */
const LeftSidebarTemplate: React.FC<LeftSidebarTemplateProps> = ({
  logo,
  logoTitle = "Nexus LMD",
  firstButtons = [], // B1-B5
  secondButtons = [], // B6-B10
  applicationName = "Nexus LMD",
}) => {
  return (
    <Card className="flex flex-col h-screen border-r border-gray-200 bg-white/80 backdrop-blur-xl shadow-xl px-0">
      {/* ROW 1: Top Section - Logo (Non-interactive) */}
      <div className="flex items-center justify-center p-3 border-b border-gray-200 bg-white backdrop-blur-sm h-[74px] shadow-sm">
        <div className="w-12 h-12 flex items-center justify-center">
          {logo || (
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/Nexus.svg"
                alt={logoTitle}
                className="w-10 h-10 object-contain"
                onLoad={() => {}}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML =
                      '<span class="text-teal-600 font-bold text-xl">N</span>';
                    parent.className =
                      "w-10 h-10 flex items-center justify-center";
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: First Buttons Section (B1-B5) - Vertically Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-1.5">
          {firstButtons.map((button, index) => (
            <div key={`first-${index}`} className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className={`${button.height} w-12 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors`}
                title={button.title}
                onClick={button.onClick}
              >
                {button.icon}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 3: Second Buttons Section (B6-B10) - Vertically Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-1.5">
          {secondButtons.map((button, index) => (
            <div key={`second-${index}`} className="flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className={`${button.height} w-12 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors`}
                title={button.title}
                onClick={button.onClick}
              >
                {button.icon}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 4: Bottom Section - Application Name */}
      <div className="flex items-center justify-center h-[68px] p-2 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm shadow-sm">
        <div className="text-xs text-gray-500 text-center font-medium">
          <div>{applicationName}</div>
        </div>
      </div>
    </Card>
  );
};

export default LeftSidebarTemplate;
