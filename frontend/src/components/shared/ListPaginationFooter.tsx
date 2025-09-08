import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

interface ListPaginationFooterProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  onRecordsPerPageChange?: (recordsPerPage: number) => void;
  showRecordsPerPage?: boolean;
  className?: string;
}

/**
 * ListPaginationFooter - Pagination controls for list pages
 * Ensures consistent 10 records per page display across all list components
 */

const ListPaginationFooter: React.FC<ListPaginationFooterProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  recordsPerPage,
  onPageChange,
  onRecordsPerPageChange,
  showRecordsPerPage = true,
  className = "",
}) => {
  // Defensive: ensure all values are valid numbers
  const safeCurrentPage =
    Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
  const safeTotalPages =
    Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;
  const safeTotalRecords =
    Number.isFinite(totalRecords) && totalRecords >= 0 ? totalRecords : 0;
  const safeRecordsPerPage =
    Number.isFinite(recordsPerPage) && recordsPerPage > 0 ? recordsPerPage : 10;

  const endRecord = Math.min(
    safeCurrentPage * safeRecordsPerPage,
    safeTotalRecords,
  );

  const handleFirstPage = () => {
    if (safeCurrentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (safeCurrentPage < safeTotalPages) {
      onPageChange(safeCurrentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (safeCurrentPage < safeTotalPages) {
      onPageChange(safeTotalPages);
    }
  };

  const getVisiblePages = () => {
    if (safeTotalPages <= 1) {
      return safeTotalPages === 1 ? [1] : [];
    }

    const delta = 1; // Pages to show around current page
    const pages = [];

    // Always add the first page
    pages.push(1);

    // Ellipsis if current page is far from the beginning
    if (safeCurrentPage > delta + 2) {
      pages.push("...");
    }

    // Pages around the current page
    const start = Math.max(2, safeCurrentPage - delta);
    const end = Math.min(safeTotalPages - 1, safeCurrentPage + delta);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Ellipsis if current page is far from the end
    if (safeCurrentPage < safeTotalPages - (delta + 1)) {
      if (!pages.includes("...")) {
        // Avoid double ellipsis
        pages.push("...");
      }
    }

    // Always add the last page
    if (!pages.includes(safeTotalPages)) {
      pages.push(safeTotalPages);
    }

    return pages;
  };

  if (safeTotalRecords === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-teal-600">
        No records to display
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-2 bg-white border-t border-gray-200 ${className}`}
    >
      {/* Records info and per page selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Records info */}
        <div className="text-xs text-gray-700">
          <span className="font-medium">{endRecord}</span> of{" "}
          <span className="font-medium">{safeTotalRecords}</span>
        </div>

        {/* Records per page selector */}
        {showRecordsPerPage && onRecordsPerPageChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="recordsPerPage" className="text-xs text-gray-700">
              Show:
            </label>
            <select
              id="recordsPerPage"
              value={safeRecordsPerPage}
              onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
              className="text-xs border border-gray-300 rounded px-1.5 py-0.5 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            >
              {[5, 10, 15, 20, 25, 50].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={handleFirstPage}
          disabled={safeCurrentPage === 1}
          className="flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
          title="First page"
        >
          <ChevronsLeft className="h-3 w-3" />
        </button>

        {/* Previous Page */}
        <button
          onClick={handlePreviousPage}
          disabled={safeCurrentPage === 1}
          className="flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>

        {/* Page Numbers */}
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="flex items-center justify-center w-6 h-6 text-xs text-gray-500">
                <MoreHorizontal className="h-3 w-3" />
              </span>
            ) : (
              <button
                onClick={() => onPageChange(Number(page))}
                className={`flex items-center justify-center w-6 h-6 text-xs font-medium rounded transition-colors ${
                  Number(page) === safeCurrentPage
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={
                  Number(page) === safeCurrentPage ? "page" : undefined
                }
              >
                {String(page)}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Page */}
        <button
          onClick={handleNextPage}
          disabled={safeCurrentPage === safeTotalPages}
          className="flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
          title="Next page"
        >
          <ChevronRight className="h-3 w-3" />
        </button>

        {/* Last Page */}
        <button
          onClick={handleLastPage}
          disabled={safeCurrentPage === safeTotalPages}
          className="flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
          title="Last page"
        >
          <ChevronsRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default ListPaginationFooter;
