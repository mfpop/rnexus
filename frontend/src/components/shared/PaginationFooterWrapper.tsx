import React from "react";
import { usePagination } from "../../contexts/PaginationContext";
import ListPaginationFooter from "./ListPaginationFooter";

/**
 * PaginationFooterWrapper - Wrapper component that uses pagination context
 * This component automatically gets pagination data from the context and renders the footer
 */
const PaginationFooterWrapper: React.FC = () => {
  const { currentPage, totalPages, totalRecords, recordsPerPage, goToPage, setRecordsPerPage } = usePagination();

  // Defensive: ensure all values are valid numbers before passing to ListPaginationFooter
  const safeCurrentPage = Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
  const safeTotalPages = Number.isFinite(totalPages) && totalPages > 0 ? totalPages : 1;
  const safeTotalRecords = Number.isFinite(totalRecords) && totalRecords >= 0 ? totalRecords : 0;
  const safeRecordsPerPage = Number.isFinite(recordsPerPage) && recordsPerPage > 0 ? recordsPerPage : 10;

  console.log('🔍 PaginationFooterWrapper Debug:', {
    raw: { currentPage, totalPages, totalRecords, recordsPerPage },
    safe: { safeCurrentPage, safeTotalPages, safeTotalRecords, safeRecordsPerPage },
    shouldShow: safeTotalRecords > 0
  });

  return (
    <ListPaginationFooter
      currentPage={safeCurrentPage}
      totalPages={safeTotalPages}
      totalRecords={safeTotalRecords}
      recordsPerPage={safeRecordsPerPage}
      onPageChange={goToPage}
      onRecordsPerPageChange={setRecordsPerPage}
    />
  );
};

export default PaginationFooterWrapper;
