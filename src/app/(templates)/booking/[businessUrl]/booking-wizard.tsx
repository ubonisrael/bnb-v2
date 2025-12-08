"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import BookingForm, {
  BookingType,
} from "@/components/BookingForm";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/services/api-service";
import dayjs from "@/utils/dayjsConfig";
import { ServicesTab } from "./tabs/services";
import { DateTimePickerTab } from "./tabs/pickdatetime";
import { usePathname, useRouter } from "next/navigation";

interface BookingFormValues {
  name: string;
  email: string;
  gender?: string;
  phone: string | null;
  age_category?: string;
  event_date: string;
  event_time: number;
  event_duration: number;
  services: { id: string; duration: number }[];
  client_tz: string;
}

const steps = [
  { id: "services", title: "Services" },
  { id: "datetime", title: "datetime" },
];

export function BookingWizard(props: BusinessDataResponse) {
  const {
    addServices,
    selectedServices,
    getTotalDuration,
    getTotalPrice,
    setSelectedDate,
    setSelectedTime,
    selectedDate,
    selectedTime,
    resetBooking,
  } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter()
  const pathname = usePathname()

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
      if (props.bUrl === "sample") {
        return Promise.reject(
          new Error("Sample business does not support booking")
        );
      }
      return api.post<BookingResponse>(`sp/${props.bUrl}/booking`, data);
    },
    onSuccess: async (data: BookingResponse) => {
      toast.dismiss("booking");
      resetBooking();
      setIsRedirecting(true); // Show loading overlay
      window.location.href = data.url;
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
        services: selectedServices.map((service) => ({ id: service.id, duration: service.duration })),
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
    // check for info in URL
    const event_date = searchParams.get("event_date");
    const event_time = searchParams.get("event_time");
    const service_ids = searchParams.get("service_ids");

    let step = 0;

    if (service_ids) {
      // Parse and set the service IDs
      const parsedServiceIds = service_ids
        .split(",")
        .map((id) => Number(id.trim()));
      // add services to context
      const services: ServiceFrontend[] = [];
      props.serviceCategories.forEach((category) => {
        category.services.forEach((service) => {
          if (parsedServiceIds.includes(Number(service.id))) {
            services.push({
              ...service,
            });
          }
        });
      });
      addServices(services);
      step = 2;
      searchParams.delete("service_ids");
      if (event_date && event_time) {
        // Set selected date and time
        const date = dayjs(event_date).format("YYYY-MM-DD");
        const time = parseInt(event_time, 10);
        // Set the selected date and time in context
        setSelectedDate(date);
        setSelectedTime(time);

        searchParams.delete("event_date");
        searchParams.delete("event_time");
      }
      setCurrentStepIndex(step);
      if (step) router.replace(pathname);
    }
  }, []);

  return (
    <div className="w-full bg-slate-100 py-16 sm:pb-20 lg:pb-24">
      <div className="sm:px-6 pb-4 sm:py-6 lg:py-8 mx-auto max-w-7xl">
        {currentStep.id === "services" && (
          <ServicesTab
            businessUrl={props.bUrl}
            gotoNextTab={() => goToTab(1)}
            {...props}
          />
        )}
        {currentStep.id === "datetime" && (
          <DateTimePickerTab
            gotoPrevTab={() => goToTab(0)}
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
          cancellationAllowed={props.cancellationAllowed}
            absorbServiceCharge={props.absorbServiceCharge}
            policies={props.bookingPolicy}
            customPolicies={props.customPolicies}
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

      {/* Loading Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-medium">Redirecting to checkout...</p>
          </div>
        </div>
      )}
    </div>
  );
}
