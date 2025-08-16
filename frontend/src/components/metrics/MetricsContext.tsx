import React, { createContext, useContext, useState, ReactNode } from "react";

interface Metric {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  trend: number;
  category: "production" | "quality" | "performance" | "energy";
  status: "good" | "warning" | "critical";
  target?: number;
  period: string;
  lastUpdated: Date;
  chartType: "line" | "bar" | "pie";
  historicalData?: Array<{
    date: Date;
    value: number;
  }>;
}

interface MetricsContextType {
  selectedMetric: Metric | null;
  setSelectedMetric: (metric: Metric | null) => void;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const useMetricsContext = () => {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error("useMetricsContext must be used within a MetricsProvider");
  }
  return context;
};

interface MetricsProviderProps {
  children: ReactNode;
}

export const MetricsProvider: React.FC<MetricsProviderProps> = ({
  children,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  return (
    <MetricsContext.Provider value={{ selectedMetric, setSelectedMetric }}>
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsContext;
export type { Metric };
