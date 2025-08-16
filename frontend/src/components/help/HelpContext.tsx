import React, { createContext, useContext, useState, ReactNode } from "react";

interface HelpContextType {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelpContext = () => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error("useHelpContext must be used within a HelpProvider");
  }
  return context;
};

interface HelpProviderProps {
  children: ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState("getting-started");

  // Debug logging
  console.log('HelpProvider - selectedSection:', selectedSection);

  return (
    <HelpContext.Provider value={{ selectedSection, setSelectedSection }}>
      {children}
    </HelpContext.Provider>
  );
};

export default HelpContext;
