"use client";

import React from "react";
import dayjs from "@/utils/dayjsConfig";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProgramRegistrationResultData } from "@/types/response";
import { getProgramClassPrice } from "@/utils/programs";

interface ProgramRegistrationConfirmationProps
  extends ProgramRegistrationResultData {
  url: string;
}

export const ProgramRegistrationConfirmation = (
  props: ProgramRegistrationConfirmationProps
) => {
  const router = useRouter();


  const timezone = dayjs.tz.guess();

  // Get the confirmation status from the nested data
  const confirmationStatus = props.status;

  // Get program classes (ensure it's always an array)
  const programClasses = Array.isArray(props.programClasses)
    ? props.programClasses
    : [];

  // Calculate total price including service charges
  const calculateTotalPrice = () => {
    return programClasses.reduce((total, programClass) => {
      const basePrice = programClass.allow_deposits && programClass.deposit_amount
        ? programClass.deposit_amount
        : programClass.price;
      
      // Add service charge if not absorbed
      const serviceFee = props.program.absorb_service_charge
        ? 0
        : Math.max(1, basePrice * 0.1);
      
      return total + basePrice + serviceFee;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();
  const finalPrice = totalPrice - props.total_discount;

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
      message:
        "Sorry, we couldn't process your program registration. Please try again.",
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
      message:
        "This registration session has expired. Please start a new registration.",
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

                  {/* Service Provider - moved to top */}
                  <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start space-x-4">
                      {/* Logo */}
                      {props.serviceProvider.logo ? (
                        <div className="flex-shrink-0">
                          <img
                            src={props.serviceProvider.logo}
                            alt={props.serviceProvider.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-primary-600 dark:text-primary-400 p-2 bg-white dark:bg-gray-700 rounded-lg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                      )}
                      
                      {/* Provider Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Service Provider
                        </p>
                        <p className="font-medium text-gray-900 dark:text-white text-lg">
                          {props.serviceProvider.name}
                        </p>
                        
                        {/* Email */}
                        {props.serviceProvider.email && (
                          <div className="mt-2 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-400 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {props.serviceProvider.email}
                            </span>
                          </div>
                        )}
                        
                        {/* Location */}
                        {props.serviceProvider.location && (
                          <div className="mt-1 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-400 mr-2"
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
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {props.serviceProvider.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Program Info */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      Program
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {props.program.name}
                    </p>
                  </div>

                  {/* Classes List */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Registered Classes ({programClasses.length})
                    </h5>
                    <div className="space-y-4">
                      {programClasses.map((programClass, index) => {
                        const basePrice = programClass.allow_deposits && programClass.deposit_amount
                          ? programClass.deposit_amount
                          : programClass.price;
                        
                        const serviceFee = props.program.absorb_service_charge
                          ? 0
                          : Math.max(1, basePrice * 0.1);
                        
                        const displayPrice = basePrice + serviceFee;

                        return (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Class Name
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {programClass.name}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Start Date
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {programClass.start_date
                                    ? dayjs(programClass.start_date)
                                        .tz(timezone)
                                        .format("MMM D, YYYY")
                                    : "TBA"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  End Date
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {programClass.end_date
                                    ? dayjs(programClass.end_date)
                                        .tz(timezone)
                                        .format("MMM D, YYYY")
                                    : "TBA"}
                                </p>
                              </div>

                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Price (inc. service charge)
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  £{displayPrice.toFixed(2)}
                                  {programClass.allow_deposits && programClass.deposit_amount && (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                      {" "}
                                      (Deposit)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>                  {/* Pricing Summary */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Pricing Summary
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Subtotal ({programClasses.length} class{programClasses.length !== 1 ? 'es' : ''})
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          £{totalPrice.toFixed(2)}
                        </span>
                      </div>
                      {props.total_discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-green-600 dark:text-green-400">
                            Discount Applied
                          </span>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            -£{props.total_discount.toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between">
                          <span className="text-base font-medium text-gray-900 dark:text-white">
                            Total Paid
                          </span>
                          <span className="text-base font-bold text-gray-900 dark:text-white">
                            £{finalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {props.total_discount > 0 && (
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
                            Great Savings!
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            You saved £{props.total_discount.toFixed(2)} on this
                            registration!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="mt-8 flex justify-center">
              <Button onClick={() => router.push(`/booking/${props.url}`)}>
                {confirmationStatus === "success"
                  ? "Return to Home"
                  : "Try Again"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
