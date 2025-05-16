"use client";

import { Service, ServiceCategory } from "@/components/onboarding/type";
import api from "@/services/api-service";
import { TemplateResponse } from "@/types/response";
import React, { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);


export type AppStep = "home" | "services" | "datetime" | "confirmation";

type AppContextType = {
  name: string;
  bUrl: string;
  banner: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  utcOffset: number;
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  latitude?: number;
  longitude?: number;
  bannerHeader: string;
  bannerMessage: string;
  aboutSubHeader: string;
  maxNotice: number;
  minNotice: number;
  categories: {
    id: string;
    name: string;
  }[];
  services: {
    id: string;
    CategoryId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    availableDays: string[];
  }[];
  setBusinessInfo: (values: LandingTemplate) => void;
  updateBusinessUrl: (url: string) => void;
  activeCategoryTab?: ServiceCategory;
  setActiveCategoryTab: (category: ServiceCategory) => void;
  selectedServices: Service[];
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedTime: number | null;
  setSelectedTime: (time: number | null) => void;
  resetBooking: () => void;
  getTotalDuration: () => number;
  getTotalPrice: () => number;
  error: string | null;
};

export interface LandingTemplate {
  type: string;
  name: string;
  bannerHeader: string;
  bannerMessage: string;
  aboutSubHeader: string;
  bUrl: string;
  banner: string;
  logo: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  minNotice: number;
  maxNotice: number;
  description: string;
  utcOffset: number;
  categories: {
    id: string;
    name: string;
  }[];
  services: {
    id: string;
    CategoryId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    availableDays: string[];
  }[];
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  latitude?: number;
  longitude?: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [businessInfo, setBusinessInfo] = useLocalStorage<LandingTemplate | null>(
    "businessInfo", null);
  const [error, setError] = useState<string | null>(null);

  const updateBusinessUrl = (url: string) => {
    if (businessInfo) {
      setBusinessInfo({
        ...businessInfo,
        bUrl: url,
      });
    }
  };

  const [activeCategoryTab, setActiveCategoryTab] =
    useLocalStorage<ServiceCategory>("activeCategoryTab", {
      id: "",
      name: "",
    });
  const [selectedServices, setSelectedServices] = useLocalStorage<Service[]>(
    "selectedServices",
    []
  );
  const [selectedDate, setSelectedDate] = useLocalStorage<string | null>(
    "selectedDate",
    new Date().toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useLocalStorage<number | null>(
    "selectedTime",
    null
  );

  const addService = (service: Service) => {
    if (!selectedServices.some((s) => s.id === service.id)) {
      setSelectedServices((prev = []) => [...prev, service]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices((prev = []) =>
      prev.filter((service) => service.id !== serviceId)
    );
  };

  const resetBooking = () => {
    setSelectedServices([]);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const getTotalDuration = () => {
    return selectedServices.reduce((sum, service) => sum + service.duration, 0);
  };

  const getTotalPrice = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0);
  };

  useEffect(() => {
    async function fetchBusinessInfo() {
      try {
        if (!businessInfo) return;
        // throw new Error("Business URL is not defined");
        const { data } = (await api.get(
          `/sp/${businessInfo.bUrl}`
        )) as TemplateResponse;
        console.log("Business data:", data);
        setBusinessInfo(data);
        const today = dayjs().tz(dayjs.tz.guess());
        const earliestAvailableDate = today.add(data.minNotice, "day").format("YYYY-MM-DD");
        setSelectedDate(earliestAvailableDate)
      } catch (error) {
        console.error("Error fetching business details:", error);
        setError("Failed to fetch business details. Please try again later.");
      }
    }
    if (!businessInfo) {
      fetchBusinessInfo();
    }
  }, [businessInfo?.bUrl]);

  return (
    <AppContext.Provider
      value={{
        error,
        utcOffset: businessInfo?.utcOffset ?? 0,
        categories: businessInfo?.categories ?? [],
        services: businessInfo?.services ?? [],
        latitude: businessInfo?.latitude,
        longitude: businessInfo?.longitude,
        banner: businessInfo?.banner ?? '',
        email: businessInfo?.email ?? '',
        name: businessInfo?.name ?? '',
        logo: businessInfo?.logo ?? '',
        bUrl: businessInfo?.bUrl ?? '',
        phone: businessInfo?.phone ?? '',
        description: businessInfo?.description ?? '',
        hours: businessInfo?.hours ?? {
          monday: '',
          tuesday: '',
          wednesday: '',
          thursday: '',
          friday: '',
          saturday: '',
          sunday: ''
        },
        state: businessInfo?.state ?? '',
        zip: businessInfo?.zip ?? '',
        aboutSubHeader: businessInfo?.aboutSubHeader ?? '',
        bannerHeader: businessInfo?.bannerHeader ?? '',
        bannerMessage: businessInfo?.bannerMessage ?? '',
        address: businessInfo?.address ?? '',
        maxNotice: businessInfo?.maxNotice ?? 0,
        minNotice: businessInfo?.minNotice ?? 0,
        city: businessInfo?.city ?? '',
        updateBusinessUrl,
        setBusinessInfo,
        activeCategoryTab,
        setActiveCategoryTab,
        selectedServices,
        addService,
        removeService,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        resetBooking,
        getTotalDuration,
        getTotalPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
