import React, { createContext, useContext, useState, ReactNode } from "react";

interface HelpContextType {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
  selectedSubsection: string;
  setSelectedSubsection: (subsection: string) => void;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const useHelpContext = () => {
  const context = useContext(HelpContext);
  if (context === undefined) {
    // Provide more helpful error message in development
    if (import.meta.env.DEV) {
      console.error('HelpContext Error: Component is not wrapped in HelpProvider');
      console.error('Make sure HelpLeftCard and HelpRightCard are wrapped in HelpProvider');
      console.error('Check StableLayout.tsx around line 629');
    }
    throw new Error("useHelpContext must be used within a HelpProvider. Make sure the component is wrapped in HelpProvider.");
  }
  return context;
};

interface HelpProviderProps {
  children: ReactNode;
}

export const HelpProvider: React.FC<HelpProviderProps> = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState<string>("getting-started");
  const [selectedSubsection, setSelectedSubsection] = useState<string>("welcome");

  return (
    <HelpContext.Provider value={{ selectedSection, setSelectedSection, selectedSubsection, setSelectedSubsection }}>
      {children}
    </HelpContext.Provider>
  );
};

export default HelpContext;
