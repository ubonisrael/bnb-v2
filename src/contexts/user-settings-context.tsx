"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the shape of our user settings
export interface UserSettings {
  profile: {
    businessName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    bio: string
    logoUrl: string | null
  }
  security: {
    twoFactorEnabled: boolean
    lastPasswordChange: string
    activeSessions: number
  }
  notifications: {
    email: {
      bookingConfirmations: boolean
      bookingReminders: boolean
      bookingCancellations: boolean
      marketingEmails: boolean
      reviewRequests: boolean
    }
    sms: {
      bookingConfirmations: boolean
      bookingReminders: boolean
      bookingCancellations: boolean
    }
    reminderTiming: string
  }
  socialMedia: {
    website: string
    instagram: string
    facebook: string
    twitter: string
    linkedin: string
    youtube: string
    tiktok: string
  }
}

// Default settings
const defaultSettings: UserSettings = {
  profile: {
    businessName: "Salon Beautiful",
    email: "contact@salonbeautiful.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    bio: "A premier beauty salon offering a wide range of services including haircuts, styling, coloring, and more.",
    logoUrl: "/placeholder.svg",
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: "2023-01-15",
    activeSessions: 1,
  },
  notifications: {
    email: {
      bookingConfirmations: true,
      bookingReminders: true,
      bookingCancellations: true,
      marketingEmails: false,
      reviewRequests: true,
    },
    sms: {
      bookingConfirmations: true,
      bookingReminders: true,
      bookingCancellations: true,
    },
    reminderTiming: "24",
  },
  socialMedia: {
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
  },
}

// Create the context
type UserSettingsContextType = {
  settings: UserSettings
  updateSettings: (section: keyof UserSettings, data: any) => Promise<void>
  isLoading: boolean
}

const UserSettingsContext = createContext<UserSettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  isLoading: false,
})

// Provider component
export function UserSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // In a real app, you would fetch from an API
        // For now, we'll simulate a delay and use localStorage if available
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (typeof window !== "undefined") {
          const savedSettings = localStorage.getItem("userSettings")
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings))
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  // Update settings
  const updateSettings = async (section: keyof UserSettings, data: any) => {
    setIsLoading(true)

    try {
      // In a real app, you would send to an API
      // For now, we'll simulate a delay and use localStorage
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedSettings = {
        ...settings,
        [section]: {
          ...settings[section],
          ...data,
        },
      }

      setSettings(updatedSettings)

      if (typeof window !== "undefined") {
        localStorage.setItem("userSettings", JSON.stringify(updatedSettings))
      }

      return Promise.resolve()
    } catch (error) {
      console.error("Failed to update settings:", error)
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </UserSettingsContext.Provider>
  )
}

// Hook for using the context
export function useUserSettings() {
  const context = useContext(UserSettingsContext)
  return context
}

