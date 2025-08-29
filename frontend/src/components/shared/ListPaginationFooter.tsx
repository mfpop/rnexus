import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react";

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
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  const handleFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  const getVisiblePages = () => {
    // If only one page, just return [1]
    if (totalPages === 1) {
      return [1];
    }

    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalRecords === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-teal-600">
        No records to display
      </div>
    );
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-3 py-2 bg-white border-t border-gray-200 ${className}`}>
      {/* Records info and per page selector */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Records info */}
        <div className="text-xs text-gray-700">
          <span className="font-medium">{endRecord}</span> of{" "}
          <span className="font-medium">{totalRecords}</span>
        </div>

        {/* Records per page selector */}
        {showRecordsPerPage && onRecordsPerPageChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="recordsPerPage" className="text-xs text-gray-700">
              Show:
            </label>
            <select
              id="recordsPerPage"
              value={recordsPerPage}
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
          disabled={currentPage === 1}
          className="flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
          title="First page"
        >
          <ChevronsLeft className="h-3 w-3" />
        </button>

        {/* Previous Page */}
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
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
                onClick={() => onPageChange(page as number)}
                className={`flex items-center justify-center w-6 h-6 text-xs font-medium rounded transition-colors ${
                  page === currentPage
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Page */}
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
          title="Next page"
        >
          <ChevronRight className="h-3 w-3" />
        </button>

        {/* Last Page */}
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
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
