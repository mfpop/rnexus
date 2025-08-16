import React, { createContext, useContext, useState, ReactNode } from "react";

export interface AboutSection {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface AboutContextType {
  selectedSection: AboutSection | null;
  setSelectedSection: (section: AboutSection | null) => void;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

export const useAboutContext = () => {
  const context = useContext(AboutContext);
  if (context === undefined) {
    throw new Error("useAboutContext must be used within an AboutProvider");
  }
  return context;
};

interface AboutProviderProps {
  children: ReactNode;
}

export const AboutProvider: React.FC<AboutProviderProps> = ({ children }) => {
  const [selectedSection, setSelectedSection] = useState<AboutSection | null>(
    null,
  );

  return (
    <AboutContext.Provider value={{ selectedSection, setSelectedSection }}>
      {children}
    </AboutContext.Provider>
  );
};
