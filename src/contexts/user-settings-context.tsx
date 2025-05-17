"use client";

import { Service, ServiceCategory } from "@/components/onboarding/type";
import api from "@/services/api-service";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

// Define the shape of our user settings
export interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    bio: string;
    logo: string | null;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    activeSessions: number;
  };
  notifications: {
    cancelNoticeHours: number;
      emailSettings: {
        sendBookingConfirmations: boolean;
        sendReminders: boolean;
        reminderHours: number;
        sendCancellationNotices: boolean;
        sendNoShowNotifications: boolean;
        sendFollowUpEmails: boolean;
        followUpDelayHours: number;
      },
  };
  social: {
    website: string;
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  categories: ServiceCategory[];
  services: Service[];
  bookingSettings: {
    url: string;
    minimum_notice: number;
    maximum_notice: number;
    time_zone: string;
    welcome_message: string;
    sunday_enabled: boolean;
    sunday_opening: number;
    sunday_closing: number;
    monday_enabled: boolean;
    monday_opening: number;
    monday_closing: number;
    tuesday_enabled: boolean;
    tuesday_opening: number;
    tuesday_closing: number;
    wednesday_enabled: boolean;
    wednesday_opening: number;
    wednesday_closing: number;
    thursday_enabled: boolean;
    thursday_opening: number;
    thursday_closing: number;
    friday_enabled: boolean;
    friday_opening: number;
    friday_closing: number;
    saturday_enabled: boolean;
    saturday_opening: number;
    saturday_closing: number;
  };
}

// Create the context
type UserSettingsContextType = {
  settings: UserSettings | null;
  updateSettings: (section: keyof UserSettings, data: any) => Promise<void>;
  isLoading: boolean;
};

const UserSettingsContext = createContext<UserSettingsContextType>({
  settings: null,
  updateSettings: async () => {},
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
        const businessData = await api.get("/sp");
        if (businessData) {
          setSettings(businessData as UserSettings);
        }
      } catch (error) {
        // check if error is a 401 error
        toast.error(error as string);
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = async (section: keyof UserSettings, data: any) => {
    setIsLoading(true);
    try {
      if (settings) {
        let updatedSettings: UserSettings | null = null;
        if (section === "categories" || section === "services") {
          updatedSettings = {
            ...settings,
            [section]: data,
          };
        } else {
          updatedSettings = {
            ...settings,
            [section]: {
              ...settings[section],
              ...data,
            },
          };
        }

        setSettings(updatedSettings);
      }
    } catch (error) {
      toast.error(error as string);
      console.error("Failed to update settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserSettingsContext.Provider
      value={{ settings, updateSettings, isLoading }}
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
