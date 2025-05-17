"use client";

import Calendar from "@/components/templates/default/Calendar";
import Cart from "@/components/templates/default/Cart";
import TimeSlots from "@/components/templates/default/TimeSlots";
import { Button } from "@/components/templates/default/ui/button";
import { useApp } from "@/contexts/AppContext";
import { minutesToTimeString } from "@/utils/time";
import { ArrowLeft, Home } from "lucide-react";
import React from "react";

interface DateTimePickerTabProps {
  bUrl: string;
  utcOffset: number;
  name: string;
  logo: string;
  minNotice: number;
  maxNotice: number;
  gotoPrevTab: () => void;
  showBookingForm: () => void;
  gotoHome: () => void;
}

export const DateTimePickerTab = ({
  utcOffset,
  bUrl,
  name,
  logo,
  minNotice,
  maxNotice,
  showBookingForm,
  gotoPrevTab,
  gotoHome,
}: DateTimePickerTabProps) => {
  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    getTotalDuration,
  } = useApp();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-4">
          <Button
            onClick={gotoHome}
            className="flex items-center justify-center"
          >
            <Home />
          </Button>
          <Button
            onClick={gotoPrevTab}
            className="flex items-center justify-center"
          >
            <ArrowLeft />
          </Button>
        </div>
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">
            Choose Date & Time
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Select When You'd Like to Visit
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Pick a date and time that works for your schedule.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Column: Date & Time Selection (3/5 width) */}
          <div className="w-full lg:w-3/5 pr-0 lg:pr-8 mb-6 lg:mb-0">
            <Calendar
              minNotice={minNotice}
              maxNotice={maxNotice}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />

            <TimeSlots
              bUrl={bUrl}
              utcOffset={utcOffset}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              totalDuration={getTotalDuration()}
            />
          </div>

          {/* Right Column: Cart and Appointment Details (2/5 width) */}
          <div className="w-full lg:w-2/5">
            <div className="flex flex-col gap-6">
              {/* Cart Component */}
              <div>
                <Cart
                  name={name}
                  logo={logo}
                  gotoBooking={showBookingForm}
                  showButtons={true}
                  continueButtonText="Confirm Appointment"
                  disabled={!selectedDate || !selectedTime}
                />
              </div>

              {/* Appointment details */}
              {selectedDate && selectedTime && (
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Appointment Details
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-1 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Date
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-1 mr-3"
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
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Time
                        </p>
                        {selectedTime ? (
                          <p className="font-medium text-gray-900 dark:text-white">
                            {minutesToTimeString(selectedTime)}
                          </p>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic">
                            Please select a time
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-1 mr-3"
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
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Duration
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getTotalDuration()} min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
