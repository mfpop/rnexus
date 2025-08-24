import React from "react";
import { usePagination } from "../../contexts/PaginationContext";
import ListPaginationFooter from "./ListPaginationFooter";

/**
 * PaginationFooterWrapper - Wrapper component that uses pagination context
 * This component automatically gets pagination data from the context and renders the footer
 */
const PaginationFooterWrapper: React.FC = () => {
  const { currentPage, totalPages, totalRecords, recordsPerPage, onPageChange } = usePagination();

  return (
    <ListPaginationFooter
      currentPage={currentPage}
      totalPages={totalPages}
      totalRecords={totalRecords}
      recordsPerPage={recordsPerPage}
      onPageChange={onPageChange}
    />
  );
};

export default PaginationFooterWrapper;
