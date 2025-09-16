import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProductionLine {
  id: number;
  name: string;
  location: string;
  status: "running" | "stopped" | "maintenance" | "warning";
  efficiency: number;
  currentProduct: string;
  operator: string;
  shift: string;
  lastMaintenance: Date;
  nextMaintenance: Date;
  metrics: {
    oee: number;
    availability: number;
    performance: number;
    quality: number;
  };
  currentRun: {
    startTime: Date;
    targetQuantity: number;
    actualQuantity: number;
    cycleTime: number;
  };
}

interface ProductionContextType {
  selectedLine: ProductionLine | null;
  setSelectedLine: (line: ProductionLine | null) => void;
}

const ProductionContext = createContext<ProductionContextType | undefined>(
  undefined,
);

export const useProductionContext = () => {
  const context = useContext(ProductionContext);
  if (context === undefined) {
    throw new Error(
      "useProductionContext must be used within a ProductionProvider",
    );
  }
  return context;
};

interface ProductionProviderProps {
  children: ReactNode;
}

export const ProductionProvider: React.FC<ProductionProviderProps> = ({
  children,
}) => {
  const [selectedLine, setSelectedLine] = useState<ProductionLine | null>(null);

  return (
    <ProductionContext.Provider value={{ selectedLine, setSelectedLine }}>
      {children}
    </ProductionContext.Provider>
  );
};

export default ProductionContext;
export type { ProductionLine };
