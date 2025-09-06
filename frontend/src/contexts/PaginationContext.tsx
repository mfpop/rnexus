import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
}

interface PaginationContextType {
  // State
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;

  // Actions
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  setRecordsPerPage: (recordsPerPage: number) => void;
  updatePagination: (data: Partial<PaginationState>) => void;
  resetPagination: () => void;
}

const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (context === undefined) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};

interface PaginationProviderProps {
  children: ReactNode;
}

export const PaginationProvider: React.FC<PaginationProviderProps> = ({ children }) => {
  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 5, // Reduced from 6 to 5 to ensure pagination shows with 27 users
  });

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    setPaginationState(prev => {
      const newPage = Math.max(1, Math.min(page, prev.totalPages));
      return { ...prev, currentPage: newPage };
    });
  }, []);

  const goToNextPage = useCallback(() => {
    setPaginationState(prev => {
      const nextPage = Math.min(prev.currentPage + 1, prev.totalPages);
      return { ...prev, currentPage: nextPage };
    });
  }, []);

  const goToPreviousPage = useCallback(() => {
    setPaginationState(prev => {
      const prevPage = Math.max(prev.currentPage - 1, 1);
      return { ...prev, currentPage: prevPage };
    });
  }, []);

  const goToFirstPage = useCallback(() => {
    setPaginationState(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const goToLastPage = useCallback(() => {
    setPaginationState(prev => ({ ...prev, currentPage: prev.totalPages }));
  }, []);

  const setRecordsPerPage = useCallback((recordsPerPage: number) => {
    setPaginationState(prev => {
      const newTotalPages = Math.max(1, Math.ceil(prev.totalRecords / recordsPerPage));
      const newCurrentPage = Math.min(prev.currentPage, newTotalPages);
      return {
        ...prev,
        recordsPerPage,
        totalPages: newTotalPages,
        currentPage: newCurrentPage,
      };
    });
  }, []);

  const updatePagination = useCallback((data: Partial<PaginationState>) => {
    setPaginationState(prev => {
      const newState = { ...prev, ...data };

      // Ensure currentPage is within valid range
      if (newState.currentPage > newState.totalPages) {
        newState.currentPage = Math.max(1, newState.totalPages);
      }

      // Ensure totalPages is at least 1
      newState.totalPages = Math.max(1, newState.totalPages);

      return newState;
    });
  }, []);

  const resetPagination = useCallback(() => {
    setPaginationState({
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      recordsPerPage: 6,
    });
  }, []);

  const value: PaginationContextType = {
    // State
    currentPage: paginationState.currentPage,
    totalPages: paginationState.totalPages,
    totalRecords: paginationState.totalRecords,
    recordsPerPage: paginationState.recordsPerPage,

    // Actions
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    setRecordsPerPage,
    updatePagination,
    resetPagination,
  };

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};
