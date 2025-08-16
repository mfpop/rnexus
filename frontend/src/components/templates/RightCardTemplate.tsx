import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/Card";
import Button from "../ui/Button";
import { Maximize2, Minimize2 } from "lucide-react";

interface RightCardTemplateProps {
  rightTitle?: string;
  rightSubtitle?: string;
  footer?: string | React.ReactNode;
  content?: React.ReactNode;
  expandedCard?: "left" | "right" | "left-full" | "right-full" | null;
  onExpandClick?: (side: "left" | "right") => void;
  className?: string;
}

/**
 * RightCardTemplate - Standardized template for all right cards
 * This template is used by the Layout Template and NEVER changes
 * Only the content/data (rightTitle, rightSubtitle, content, footer) passed to it changes
 *
 * STRUCTURE:
 * - Header: rightTitle, rightSubtitle, expand button
 * - Content: Scrollable content area with overflow handling
 * - Footer: Footer text/content
 */
const RightCardTemplate: React.FC<RightCardTemplateProps> = ({
  rightTitle = "Content",
  rightSubtitle = "Page content",
  footer = "Page content",
  content,
  expandedCard,
  onExpandClick,
  className = "",
}) => {
  const isHidden = expandedCard === "left-full";
  const isExpanded = expandedCard === "right-full";

  if (isHidden) {
    return null;
  }

  return (
    <Card
      className={`flex flex-col h-full max-h-full transition-all duration-300 bg-white/90 backdrop-blur-xl border-gray-200 shadow-2xl shadow-gray-200/50 overflow-hidden ${className}`}
    >
      {/* Header - Template Structure NEVER changes */}
      <CardHeader className="flex flex-row items-center justify-between h-16 border-b border-gray-200 bg-gray-50/90 backdrop-blur-md shadow-sm px-4">
        <div className="flex flex-col text-center flex-1">
          <span className="text-xl font-bold text-teal-600">{rightTitle}</span>
          <span className="text-sm font-medium text-teal-600">
            {rightSubtitle}
          </span>
        </div>
        {onExpandClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onExpandClick("right")}
            title={isExpanded ? "Minimize" : "Expand"}
            className="ml-2"
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
      <CardContent className="flex-grow p-0 overflow-hidden">
        <div className="h-full overflow-hidden">
          {content || (
            <div className="p-4">
              <p className="text-gray-600">Page content will appear here</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Footer - Template Structure NEVER changes */}
      <CardFooter className="h-12 border-t border-gray-200 bg-gray-50/90 backdrop-blur-md shadow-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-center p-0">
        {typeof footer === "string" ? (
          <span className="text-sm text-teal-600 px-3 py-1 rounded">
            {footer}
          </span>
        ) : (
          footer
        )}
      </CardFooter>
    </Card>
  );
};

export default RightCardTemplate;
