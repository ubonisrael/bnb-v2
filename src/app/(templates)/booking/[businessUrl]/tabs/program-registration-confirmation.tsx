"use client";

import React from "react";
import dayjs from "@/utils/dayjsConfig";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProgramRegisterationResponse } from "@/types/response";

interface ProgramRegistrationConfirmationProps extends ProgramRegisterationResponse {
  url: string;
}

export const ProgramRegistrationConfirmation = (props: ProgramRegistrationConfirmationProps) => {
  const router = useRouter();
  const { status, data, url } = props;

  const timezone = dayjs.tz.guess();
  
  // Get the confirmation status from the nested data
  const confirmationStatus = data.status;
  
  // Handle program data (could be single program or array)
  const program = Array.isArray(data.programs) ? data.programs[0] : data.programs;

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
      title: "Registration Confirmed!",
      message:
        "Your program registration has been successfully processed. We've sent a confirmation to your email.",
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
      title: "Registration Pending",
      message:
        "Your program registration is being processed. Please wait for confirmation.",
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
      title: "Registration Failed",
      message: "Sorry, we couldn't process your program registration. Please try again.",
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
      title: "Registration Expired",
      message: "This registration session has expired. Please start a new registration.",
      bgColor: "bg-gray-100 dark:bg-gray-900",
    },
  };

  const currentStatus = statusConfig[confirmationStatus];

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

            {confirmationStatus === "success" && (
              <>
                {/* Program Registration Details */}
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Registration Details
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Program Name
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {program?.name || "Program Name"}
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Program Dates
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {program?.start_date && program?.end_date ? 
                            `${dayjs(program.start_date).tz(timezone).format("MMM D, YYYY")} - ${dayjs(program.end_date).tz(timezone).format("MMM D, YYYY")}` : 
                            "Program Dates TBA"
                          }
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
                          Service Provider
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {data.serviceProvider.name}
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
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Program Price
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          £{program?.price ? parseFloat(program.price).toFixed(2) : "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {program?.about && (
                    <div className="mb-6">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Program Description
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {program.about}
                      </p>
                    </div>
                  )}

                  {data.total_discount > 0 && (
                    <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600 dark:text-green-400 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Discount Applied
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            You saved £{data.total_discount.toFixed(2)} on this registration!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="mt-8 flex justify-center">
              <Button onClick={() => router.push(`/booking/${url}`)}>
                {confirmationStatus === "success" ? "Return to Home" : "Try Again"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
