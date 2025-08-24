import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/Card";
import Button from "../ui/Button";
import { Maximize2, Minimize2 } from "lucide-react";

interface LeftCardTemplateProps {
  leftTitle?: string;
  leftSubtitle?: string;
  footer?: string | React.ReactNode | null;
  content?: React.ReactNode;
  expandedCard?: "left" | "right" | "left-full" | "right-full" | null;
  onExpandClick?: (side: "left" | "right") => void;
  className?: string;
}

/**
 * LeftCardTemplate - Standardized template for all left cards
 * This template is used by the Layout Template and NEVER changes
 * Only the content/data (leftTitle, leftSubtitle, content, footer) passed to it changes
 *
 * STRUCTURE:
 * - Header: leftTitle, leftSubtitle, dropdown menu, expand button
 * - Content: Scrollable content area
 * - Footer: Footer text/content
 */
const LeftCardTemplate: React.FC<LeftCardTemplateProps> = ({
  leftTitle = "Navigation",
  leftSubtitle = "Page navigation content",
  footer = "Page navigation",
  content,
  expandedCard,
  onExpandClick,
  className = "",
}) => {
  const isHidden = expandedCard === "right-full";
  const isExpanded = expandedCard === "left-full";

  if (isHidden) {
    return null;
  }

  return (
    <Card
      data-testid="left-card"
      className={`flex flex-col h-full max-h-full transition-all duration-300 bg-white/90 backdrop-blur-xl border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden ${className}`}
    >
      {/* Header - Template Structure NEVER changes */}
      <CardHeader className="flex flex-row items-center justify-between h-16 border-b border-gray-200 bg-gray-50/90 backdrop-blur-md shadow-sm px-4">
        <div className="flex flex-col text-center flex-1">
          <span className="text-xl font-bold text-teal-600">{leftTitle}</span>
          <span className="text-sm font-medium text-teal-600">
            {leftSubtitle}
          </span>
        </div>
        {/* Expand Button */}
        {onExpandClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onExpandClick("left")}
            title={isExpanded ? "Minimize" : "Expand"}
            className="h-8 w-8"
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </CardHeader>

      {/* Content Area - Template Structure NEVER changes, only content varies */}
      <CardContent className="flex-1 min-h-0 p-0 overflow-hidden relative">
        {/* increased bottom padding so absolutely positioned footer doesn't cover last items */}
        <div className="h-full overflow-y-auto pb-12">
          {content || (
            <div className="p-4">
              <p className="text-gray-600">
                Page navigation content will appear here
              </p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer - Template Structure NEVER changes */}
      <CardFooter className="absolute bottom-0 left-0 right-0 h-12 border-t border-gray-200 bg-gray-50/90 backdrop-blur-md shadow-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-center p-0">
        {typeof footer === "string" ? (
          <span className="text-sm text-teal-600 px-3 py-3 rounded">
            {footer}
          </span>
        ) : (
          footer
        )}
      </CardFooter>
    </Card>
  );
};

export default LeftCardTemplate;
