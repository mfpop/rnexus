import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaginationContextType {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  recordsPerPage: number;
  setPaginationData: (data: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
  }) => void;
  onPageChange: (page: number) => void;
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
  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 10,
  });

  const handlePageChange = (page: number) => {
    setPaginationData(prev => ({ ...prev, currentPage: page }));
  };

  const value: PaginationContextType = {
    ...paginationData,
    setPaginationData,
    onPageChange: handlePageChange,
  };

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
};
