"use client";

import api from "@/services/api-service";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

const UserSettingsContext = createContext<UserSettingsContextType>({
  settings: null,
  isLoading: false,
});

// Provider component
export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount ?? settings will be added on login
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // get user data
        // check if csrftoken exists
        const businessData = await api.get("sp");

        if (businessData) {
          setSettings(businessData as UserSettings);
        }
      } catch (error) {
        // check if error is a 401 error
        toast.error(error as string);
        console.error("Failed to load settings:", error);
        // if (settings === null) {
        // window.location.href = "/auth/login"
        // }
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  return (
    <UserSettingsContext.Provider
      value={{ settings, isLoading }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
}

// Hook for using the context
export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  return context;
}
