// src/components/auth/profile/ProfileAutosaveProvider.tsx

import React, {
  createContext,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_PROFILE } from "../../../graphql/userProfile";

interface AutosaveContextType {
  autosaveField: (field: string, value: any) => Promise<void>;
  isAutosaving: boolean;
}

const AutosaveContext = createContext<AutosaveContextType | undefined>(
  undefined,
);

export const useAutosave = () => {
  const context = useContext(AutosaveContext);
  if (!context) {
    throw new Error("useAutosave must be used within ProfileAutosaveProvider");
  }
  return context;
};

interface ProfileAutosaveProviderProps {
  children: ReactNode;
}

export const ProfileAutosaveProvider: React.FC<
  ProfileAutosaveProviderProps
> = ({ children }) => {
  const [updateUserProfile, { loading: isAutosaving }] =
    useMutation(UPDATE_USER_PROFILE);

  const autosaveField = useCallback(
    async (field: string, value: any) => {
      try {
        const variables: any = {};
        // Size check for large fields
        if (typeof value === "string" && value.length > 100 * 1024) {
          console.warn(`Skipping autosave of ${field}: payload too large`);
          return;
        }

  const result = await updateUserProfile({ variables });

        if (!result.data?.updateUserProfile.ok) {
          console.error(
            `Autosave failed for ${field}:`,
            result.data?.updateUserProfile.errors,
          );
        }
      } catch (error) {
        console.error(`Autosave error for ${field}:`, error);
      }
    },
    [updateUserProfile],
  );

  const contextValue: AutosaveContextType = {
    autosaveField,
    isAutosaving,
  };

  return (
    <AutosaveContext.Provider value={contextValue}>
      {children}
    </AutosaveContext.Provider>
  );
};
