import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  selectedSection: string;
  setSelectedSection: (section: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSettingsContext must be used within a SettingsProvider",
    );
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [selectedSection, setSelectedSection] = useState("general");

  return (
    <SettingsContext.Provider value={{ selectedSection, setSelectedSection }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
