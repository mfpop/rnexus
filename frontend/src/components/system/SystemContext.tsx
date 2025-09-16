import React, { createContext, useContext, useState, ReactNode } from "react";

interface SystemContextType {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystemContext = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error("useSystemContext must be used within a SystemProvider");
  }
  return context;
};

interface SystemProviderProps {
  children: ReactNode;
}

export const SystemProvider: React.FC<SystemProviderProps> = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState("overview");

  return (
    <SystemContext.Provider value={{ selectedSection, setSelectedSection }}>
      {children}
    </SystemContext.Provider>
  );
};

export default SystemContext;
