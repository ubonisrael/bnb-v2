"use client";

import { useState } from "react";
import { LandingTab } from "./tabs/landing";
import { BusinessDataType } from "./types";
import { useApp } from "@/contexts/AppContext";
import BookingForm, {
  BookingType,
} from "@/components/templates/default/BookingForm";
import { useMutation } from "@tanstack/react-query";
import { BookingResponse, ErrorResponse } from "@/types/response";
import toast from "react-hot-toast";
import api from "@/services/api-service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { ServicesTab } from "./tabs/services";
import { DateTimePickerTab } from "./tabs/pickdatetime";
import { ConfirmationTab } from "./tabs/confirmation";

dayjs.extend(utc);
dayjs.extend(timezone);

interface BookingFormValues {
  name: string;
  email: string;
  amount_paid: number;
  amount_due: number;
  gender: string;
  age_category: string;
  event_date: string;
  event_time: number;
  event_duration: number;
  service_ids: string[];
  client_tz: string;
}

const steps = [
  { id: "landing", title: "Landing" },
  { id: "services", title: "Services" },
  { id: "datetime", title: "datetime" },
  { id: "confirmation", title: "Confirmation" },
];

export function BookingWizard(props: BusinessDataType) {
  const {
    selectedServices,
    getTotalDuration,
    getTotalPrice,
    selectedDate,
    selectedTime,
  } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const currentStep = steps[currentStepIndex];

  const goToTab = (index: number) => {
    setCurrentStepIndex(index);
    window.scrollTo(0, 0);
  };

  const bookingMutation = useMutation<
    BookingResponse,
    ErrorResponse,
    BookingFormValues
  >({
    mutationFn: (data: BookingFormValues) => {
      toast.loading("Scheduling appointment...", { id: "booking" });
      return api.post<BookingResponse>(`sp/${props.bUrl}/booking`, data);
    },
    onSuccess: async (data: BookingResponse) => {
      toast.dismiss("booking");
      toast.success(data.message);
      setShowServiceModal(false);
      setCurrentStepIndex(3);
    },
    onError: (error: ErrorResponse) => {
      toast.dismiss("booking");
      toast.remove("booking");
      toast.error(error.errors[0].message || "Error while scheduling booking", {
        id: "booking-error",
      });
    },
  });

  async function onSubmit(data: BookingType) {
    if (selectedDate && selectedTime) {
      const bookingData: BookingFormValues = {
        ...data,
        amount_paid: getTotalPrice(),
        amount_due: getTotalPrice(),
        event_date: selectedDate,
        event_time: selectedTime,
        event_duration: getTotalDuration(),
        service_ids: selectedServices.map((service) => service.id),
        client_tz: dayjs.tz.guess(),
      };

      try {
        await bookingMutation.mutateAsync(bookingData);
      } catch (error) {
        console.error("Booking failed:", error);
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl w-full">
      <div className="px-6 py-6">
        {currentStep.id === "landing" && (
          <LandingTab gotoBooking={goToTab} {...props} />
        )}
        {currentStep.id === "services" && (
          <ServicesTab
            gotoPrevTab={() => goToTab(0)}
            gotoNextTab={() => goToTab(2)}
            {...props}
          />
        )}
        {currentStep.id === "datetime" && (
          <DateTimePickerTab
            gotoHome={() => goToTab(0)}
            gotoPrevTab={() => goToTab(1)}
            showBookingForm={() => {
              if (selectedDate && selectedTime) {
                setShowServiceModal(true);
              }
            }}
            {...props}
          />
        )}
        {currentStep.id === "confirmation" && (
          <ConfirmationTab gotoHome={() => goToTab(0)} {...props} />
        )}
        {/* Booking Form Modal */}
        {showServiceModal && selectedDate && selectedTime && (
          <BookingForm
            showServiceModal={showServiceModal}
            setShowServiceModal={setShowServiceModal}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}
