"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import BookingForm, {
  BookingType,
} from "@/components/templates/default/BookingForm";
import { useMutation } from "@tanstack/react-query";
import { BookingResponse, BusinessDataResponse, ErrorResponse } from "@/types/response";
import toast from "react-hot-toast";
import api from "@/services/api-service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { BusinessLanding } from "./tabs/landing";
import { ServicesTab } from "./tabs/services";
import { DateTimePickerTab } from "./tabs/pickdatetime";

dayjs.extend(utc);
dayjs.extend(timezone);

interface BookingFormValues {
  name: string;
  email: string;
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
];

export function BookingWizard(props: BusinessDataResponse) {
  const {
    selectedServices,
    getTotalDuration,
    getTotalPrice,
    selectedDate,
    selectedTime,
    resetBooking
  } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);

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
      resetBooking()
      window.location.href = data.url;
      // setShowBookingModal(false);
      // setCurrentStepIndex(3);
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

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get('status');
    const productId = searchParams.get('productId');
    const productType = searchParams.get('productType');

    if (status === 'canceled' && productId && productType) {
      const handleCancellation = async () => {
        try {
          await api.post('/cancel-reservation', { productId: parseInt(productId), productType });
        } catch (error) {
          console.error('Failed to process cancellation:', error);
        }
      };

      handleCancellation();
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl w-full">
      <div className="px-6 py-6">
        {currentStep.id === "landing" && (
          <BusinessLanding gotoBooking={goToTab} {...props} />
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
                setShowBookingModal(true);
              }
            }}
            {...props}
          />
        )}
        {/* Booking Form Modal */}
        {showBookingModal && selectedDate && selectedTime && (
          <BookingForm
            policies={props.bookingPolicy}
            additionalPolicy={props.additionalPolicies}
            currencySymbol={props.currencySymbol}
            amount={getTotalPrice()}
            allowDeposits={props.allowDeposits}
            depositAmount={props.depositAmount}
            showBookingModal={showBookingModal}
            setShowBookingModal={setShowBookingModal}
            onSubmit={onSubmit}
          />
        )}
      </div>
    </div>
  );
}
