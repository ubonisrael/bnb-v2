"use client";

import React from "react";
import {
  convertTimeSlotsToUserLocalTime,
  minutesToTimeString,
} from "@/utils/time";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmationPageData } from "@/types/response";

dayjs.extend(utc);
dayjs.extend(timezone);

export const ConfirmationTab = ({
  status,
  selectedServices,
  selectedDate,
  selectedTime,
  businessLocation,
  businessUtcOffset,
  url,
}: ConfirmationPageData) => {
  const router = useRouter();

  const timezone = dayjs.tz.guess();
  const clientOffset = dayjs().tz(timezone).utcOffset();

  const statusConfig = {
    success: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600 dark:text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      title: "Appointment Confirmed!",
      message:
        "Your appointment has been successfully booked. We've sent a confirmation to your email.",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    pending: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
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
      ),
      title: "Appointment Pending",
      message:
        "Your appointment is being processed. Please wait for confirmation.",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    failed: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
      title: "Booking Failed",
      message: "Sorry, we couldn't process your appointment. Please try again.",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
    expired: {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-gray-600 dark:text-gray-400"
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
      ),
      title: "Booking Expired",
      message: "This booking session has expired. Please start a new booking.",
      bgColor: "bg-gray-100 dark:bg-gray-900",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <div
                className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${currentStatus.bgColor}`}
              >
                {currentStatus.icon}
              </div>
              <h3 className="mt-4 text-2xl font-medium text-gray-900 dark:text-white">
                {currentStatus.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {currentStatus.message}
              </p>
            </div>

            {status === "success" &&
              selectedServices &&
              selectedDate &&
              selectedTime &&
              businessLocation &&
              businessUtcOffset && (
                <>
                  {/* Keep the existing appointment details section */}
                  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Appointment Details
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                          <p className="font-medium text-gray-900 dark:text-white">
                            {minutesToTimeString(
                              convertTimeSlotsToUserLocalTime(
                                selectedTime as number,
                                clientOffset,
                                businessUtcOffset
                              )
                            )}
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
                            Duration
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedServices.reduce(
                              (acc, service) => acc + service.duration,
                              0
                            )}{" "}
                            min
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Location
                          </p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {businessLocation}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Booked Services
                      </h4>

                      <ul className="space-y-3">
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
                            <span className="text-gray-900 dark:text-white font-medium">
                              £{service.price}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-medium text-gray-900 dark:text-white">
                            Total
                          </span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            £
                            {selectedServices.reduce(
                              (acc, service) => acc + service.price,
                              0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            <div className="mt-8 flex justify-center">
              <Button onClick={() => router.push(`/booking/${url}`)}>
                {status === "success" ? "Return to Home" : "Try Again"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
