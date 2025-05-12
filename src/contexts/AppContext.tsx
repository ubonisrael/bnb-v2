"use client"

import { Service, ServiceCategory } from "@/components/onboarding/type";
import React, { createContext, useContext, useState } from "react";

export type AppStep = "home" | "services" | "datetime" | "confirmation";

type AppContextType = {
  name?: string;
  logo?: string;
  handleBusinessInfo: (values: BusinessInfoType) => void;
  activeCategoryTab?: ServiceCategory;
  setActiveCategoryTab: (category: ServiceCategory) => void;
  selectedServices: Service[];
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  resetBooking: () => void;
  getTotalDuration: () => number;
  getTotalPrice: () => number;
};

type BusinessInfoType = {
  name: string;
  logo: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfoType | null>(null)
  const handleBusinessInfo = (values: BusinessInfoType) => {
    setBusinessInfo(values)
  }
  
  const [activeCategoryTab, setActiveCategoryTab] = useState<ServiceCategory | undefined>();
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const addService = (service: Service) => {
    if (!selectedServices.some(s => s.id === service.id)) {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(service => service.id !== serviceId));
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

  return (
    <AppContext.Provider
      value={{
        name: businessInfo?.name,
        logo: businessInfo?.logo,
        handleBusinessInfo,
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
        getTotalPrice
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
