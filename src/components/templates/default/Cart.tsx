"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import BookingForm from "./BookingForm";
import AvatarImage from "./AvatarImage";

interface CartProps {
  nxtStep: string;
  showButtons?: boolean;
  continueButtonText?: string;
  onContinue?: () => void;
  disabled?: boolean;
}

const Cart: React.FC<CartProps> = ({
  nxtStep,
  showButtons = true,
  continueButtonText = "Continue to Booking",
  onContinue,
  disabled = false,
}) => {
  const {
    name,
    logo,
    bUrl,
    selectedServices,
    removeService,
    getTotalDuration,
    getTotalPrice,
    selectedDate,
    selectedTime
  } = useApp();
  const router = useRouter();

  const handleContinue = () => {
    router.push(`/default/${bUrl}/${nxtStep}`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-auto">
      <div className="flex items-center mb-6">
        <AvatarImage url={logo} name={name} />
        <h3 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
          {name}
        </h3>
      </div>

      <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {showButtons ? "Selected Services" : "Your Services"}
        </h4>

        {selectedServices.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p>No services selected yet</p>
            <p className="text-sm mt-1">
              Select services from the list to add them to your appointment
            </p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
            {selectedServices.map((service) => (
              <li
                key={service.id}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                    {service.name}
                  </h5>
                  <div className="flex items-center mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-gray-500 dark:text-gray-400 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {service.duration} min
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-900 dark:text-white font-medium mr-3">
                    ${service.price}
                  </span>
                  {showButtons && (
                    <button
                      onClick={() => removeService(service.id)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-700 dark:text-gray-300">
            Total Duration:
          </span>
          <span className="text-gray-900 dark:text-white font-medium">
            {getTotalDuration()} min
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Total Price:</span>
          <span className="text-xl text-gray-900 dark:text-white font-bold">
            ${getTotalPrice()}
          </span>
        </div>
      </div>

      {showButtons && nxtStep === "confirmation" && selectedDate && selectedTime && (
        <BookingForm
          bUrl={bUrl}
          nxtStep={nxtStep}
          fee={getTotalPrice()}
          total_amount={getTotalPrice()}
          event_date={selectedDate}
          event_duration={getTotalDuration()}
          event_time={selectedTime}
          service_ids={selectedServices.map((service) => service.id)}
        />
      )}
      {showButtons && nxtStep !== "confirmation" && (
        <Button
          onClick={handleContinue}
          disabled={selectedServices.length === 0 || disabled}
          className="w-full py-3 px-4"
          variant={
            selectedServices.length === 0 || disabled ? "secondary" : "default"
          }
        >
          {continueButtonText}
        </Button>
      )}
    </div>
  );
};

export default Cart;
