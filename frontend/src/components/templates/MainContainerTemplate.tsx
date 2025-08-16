import React, { useMemo } from "react";
import LeftCardTemplate from "./LeftCardTemplate";
import RightCardTemplate from "./RightCardTemplate";

type ExpandedCardState = "left" | "right" | "left-full" | "right-full" | null;

// Generic type for list records
interface ListRecord {
  id: string | number;
  [key: string]: any;
}

// Content relationship types
type ContentRelationship = "master-detail" | "independent";

interface MainContainerTemplateProps {
  // Content Relationship Pattern
  contentRelationship?: ContentRelationship;

  // Left Card Props
  leftTitle?: string;
  leftSubtitle?: string;
  leftFooter?: string | React.ReactNode;
  leftContent?: React.ReactNode;

  // Right Card Props
  rightTitle?: string;
  rightSubtitle?: string;
  rightFooter?: string | React.ReactNode;
  rightContent?: React.ReactNode;

  // Master-Detail Pattern Props
  recordsList?: ListRecord[];
  selectedRecord?: ListRecord | null;
  onRecordSelect?: (record: ListRecord) => void;
  onAddNewRecord?: () => void;

  // Dynamic Right Card Content (based on selection state)
  detailsContent?: (record: ListRecord) => React.ReactNode;
  addFormContent?: React.ReactNode;
  emptyStateContent?: React.ReactNode;

  // Expansion State
  expandedCard?: ExpandedCardState;
  onExpandClick?: (side: "left" | "right") => void;

  // Container Styling
  className?: string;
  gap?: string;
  padding?: string;

  // Custom Grid Proportions
  gridProportions?: string;
}

/**
 * MainContainerTemplate - Standardized template for the main content area
 * This template is used by the Layout Template and NEVER changes its structure
 * Only the content/data passed to it changes for different pages
 *
 * CONTENT RELATIONSHIP PATTERNS:
 * 1. MASTER-DETAIL: Left card shows list of records, right card shows selected record details/forms
 * 2. INDEPENDENT: Left and right cards have unrelated content (like home page)
 *
 * STRUCTURE:
 * - Grid container with dynamic columns based on expansion state
 * - Left Card Template with expansion functionality
 * - Right Card Template with expansion functionality
 * - Dynamic content rendering based on relationship pattern
 * - Responsive grid layout with proper spacing
 *
 * EXPANSION BEHAVIOR:
 * - Normal: 1fr 1fr (equal split)
 * - Left expanded: 3fr 1fr (left takes more space)
 * - Right expanded: 1fr 3fr (right takes more space)
 * - Left full: 1fr (only left card visible)
 * - Right full: 1fr (only right card visible)
 */
const MainContainerTemplate: React.FC<MainContainerTemplateProps> = ({
  // Content Relationship Pattern
  contentRelationship = "independent",

  // Left Card Props
  leftTitle = "Navigation",
  leftSubtitle = "Page navigation content",
  leftFooter = "Page navigation",
  leftContent,

  // Right Card Props
  rightTitle = "Content",
  rightSubtitle = "Page content",
  rightFooter = "Page content",
  rightContent,

  // Master-Detail Pattern Props
  recordsList = [],
  selectedRecord = null,
  onRecordSelect,
  onAddNewRecord,

  // Dynamic Right Card Content
  detailsContent,
  addFormContent,
  emptyStateContent,

  // Expansion State
  expandedCard,
  onExpandClick,

  // Container Styling
  className = "",
  gap = "gap-6",
  padding = "p-4",

  // Custom Grid Proportions
  gridProportions = "1fr 1fr",
}) => {
  // Calculate grid classes based on expansion state (from layout.md)
  const gridClasses = useMemo(() => {
    if (expandedCard === "left") return "grid-cols-[3fr_1fr]";
    if (expandedCard === "right") return "grid-cols-[1fr_3fr]";
    if (expandedCard === "left-full") return "grid-cols-1";
    if (expandedCard === "right-full") return "grid-cols-1";

    // Convert gridProportions to Tailwind class
    if (gridProportions === "1fr 1fr") return "grid-cols-2";
    if (gridProportions === "1fr 3fr") return "grid-cols-[1fr_3fr]";
    if (gridProportions === "3fr 1fr") return "grid-cols-[3fr_1fr]";

    // Default fallback
    return "grid-cols-2";
  }, [expandedCard, gridProportions]);

  // Determine card visibility based on expansion state
  const cardVisibility = useMemo(
    () => ({
      leftCardHidden: expandedCard === "right-full",
      rightCardHidden: expandedCard === "left-full",
    }),
    [expandedCard],
  );

  // Generate content based on relationship pattern
  const resolvedLeftContent = useMemo(() => {
    if (
      contentRelationship === "master-detail" &&
      recordsList &&
      recordsList.length > 0
    ) {
      // Master-Detail: Render records list
      return (
        <div className="p-4">
          <div className="space-y-2">
            {onAddNewRecord && (
              <button
                onClick={onAddNewRecord}
                className="w-full p-3 mb-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                + Add New Record
              </button>
            )}
            {recordsList.map((record) => (
              <div
                key={record.id}
                onClick={() => onRecordSelect?.(record)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRecord?.id === record.id
                    ? "bg-teal-50 border-teal-300"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="font-medium">
                  {record["name"] || record["title"] || `Record ${record.id}`}
                </div>
                {record["description"] && (
                  <div className="text-sm text-gray-600 mt-1">
                    {record["description"]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Independent or custom content
    return (
      leftContent || (
        <div className="p-4">
          <p className="text-gray-600">
            Page navigation content will appear here
          </p>
        </div>
      )
    );
  }, [
    contentRelationship,
    recordsList,
    selectedRecord,
    onRecordSelect,
    onAddNewRecord,
    leftContent,
  ]);

  const resolvedRightContent = useMemo(() => {
    if (contentRelationship === "master-detail") {
      // Master-Detail: Show details, form, or empty state
      if (selectedRecord && detailsContent) {
        return detailsContent(selectedRecord);
      }

      if (addFormContent) {
        return addFormContent;
      }

      return (
        emptyStateContent || (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              No Record Selected
            </h3>
            <p className="text-gray-600">
              Select a record from the list to view details or add a new record
            </p>
          </div>
        )
      );
    }

    // Independent content
    return (
      rightContent || (
        <div className="p-4">
          <p className="text-gray-600">Page content will appear here</p>
        </div>
      )
    );
  }, [
    contentRelationship,
    selectedRecord,
    detailsContent,
    addFormContent,
    emptyStateContent,
    rightContent,
  ]);

  return (
    <div
      className={`grid ${gridClasses} ${gap} ${padding} h-full overflow-hidden ${className}`}
    >
      {/* Left Card - Uses LeftCardTemplate */}
      {!cardVisibility.leftCardHidden && (
        <LeftCardTemplate
          leftTitle={leftTitle}
          leftSubtitle={leftSubtitle}
          footer={leftFooter}
          content={resolvedLeftContent}
          expandedCard={expandedCard}
          onExpandClick={onExpandClick}
        />
      )}

      {/* Right Card - Uses RightCardTemplate */}
      {!cardVisibility.rightCardHidden && (
        <RightCardTemplate
          rightTitle={rightTitle}
          rightSubtitle={rightSubtitle}
          footer={rightFooter}
          content={resolvedRightContent}
          expandedCard={expandedCard}
          onExpandClick={onExpandClick}
        />
      )}
    </div>
  );
};

export default MainContainerTemplate;
