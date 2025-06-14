"use client";

import React, { createContext, useContext } from "react";
import useLocalStorage from "use-local-storage";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Service } from "@/components/onboarding/type";
import { ServiceFrontend } from "@/types/response";

dayjs.extend(utc);
dayjs.extend(timezone);


export type AppStep = "home" | "services" | "datetime" | "confirmation";

type AppContextType = {
  selectedServices: ServiceFrontend[];
  addService: (service: ServiceFrontend) => void;
  removeService: (serviceId: string) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  selectedTime: number | null;
  setSelectedTime: (time: number | null) => void;
  resetBooking: () => void;
  getTotalDuration: () => number;
  getTotalPrice: () => number;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {

  const [selectedServices, setSelectedServices] = useLocalStorage<ServiceFrontend[]>(
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

  const addService = (service: ServiceFrontend) => {
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

  return (
    <AppContext.Provider
      value={{
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
