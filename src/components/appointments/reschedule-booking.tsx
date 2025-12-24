"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Link from "next/link";
import { useState } from "react";
import Calendar from "../Calendar";
import TimeSlots from "../TimeSlots";
import {
  convertTimeSlotsToUserLocalTime,
  minutesToTimeString,
} from "@/utils/time";
import dayjs from "@/utils/dayjsConfig";
import { CountdownTimer } from "../ui/countdown-timer";
import { RescheduleForm } from "./reschedule-form";

interface RescheduleBookingClientProps {
  appointmentId: string;
  booking: BookingData;
  url: string;
}

export default function RescheduleBookingClient({
  appointmentId,
  booking,
  url,
}: RescheduleBookingClientProps) {
  let selectedServiceIds: { id: number; name: string; duration: number }[] = [];
  let totalDuration = 0;
  let firstAppointment;
  if (appointmentId === "all") {
    firstAppointment = booking.appointments.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    )[0];
    selectedServiceIds = booking.appointments.map((a) => a.service);
    totalDuration = booking.appointments.reduce(
      (acc, a) => acc + a.service.duration,
      0
    );
  } else {
    firstAppointment = booking.appointments.find(
      (a) => a.id === parseInt(appointmentId)
    );
    selectedServiceIds = firstAppointment ? [firstAppointment.service] : [];
    totalDuration = firstAppointment ? firstAppointment.service.duration : 0;
  }
  const [selectedDate, setSelectedDate] = useState(
    firstAppointment ? firstAppointment.start_time : null
  );
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [requested, setRequested] = useState(false);
  const timezone = dayjs.tz.guess();
  const clientOffset = dayjs().tz(timezone).utcOffset();
  const businessOffset = dayjs()
    .tz(booking.serviceProviderTimezone)
    .utcOffset();

  const eventDate = dayjs(firstAppointment?.start_time).tz(dayjs.tz.guess());
  // note rescheduleOptions.noticeHours is actually in minutes
  const deadlineDate = eventDate.subtract(
    booking.rescheduling_notice_minutes,
    "minute"
  );
  const [isPenaltyApplicable, setIsPenaltyApplicable] = useState(
    dayjs().isAfter(deadlineDate)
  );

  const handleSelectDate = (date: string | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // rescheduling is allowed when the rescheduleOptions.allowed is true
  // and if the deadline has passed and rescheduleOptions.penaltyEnabled is true
  const isReschedulingAllowed = isPenaltyApplicable
    ? booking.reschedule_penalty_enabled && booking.rescheduling_allowed
    : booking.rescheduling_allowed;

  return (
    <div className="w-full">
      {requested ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle className="text-center">
                Reschedule Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-100 text-green-800 p-4 rounded-lg">
                Your reschedule request has been successful submitted. Please
                check your email for confirmation
                <div className="pt-4">
                  <Link href="/" className="text-blue-600 underline text-sm">
                    Return to Home
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
                  minNotice={booking.minNotice}
                  maxNotice={booking.maxNotice}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                />

                <TimeSlots
                  bUrl={url}
                  utcOffset={businessOffset}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  selectedServices={selectedServiceIds}
                  totalDuration={totalDuration}
                />
              </div>

              {/* Right Column: Cart and Appointment Details (2/5 width) */}
              <div className="w-full lg:w-2/5">
                <div className="flex flex-col gap-4">
                  {/* Cart Component */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="capitalize">
                        Booking information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        {!booking.rescheduling_allowed ? (
                          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                            Rescheduling is not allowed for this appointment.
                          </div>
                        ) : booking.reschedule_fee_percent === 0 ||
                          booking.rescheduling_notice_minutes === 0 ? (
                          <p className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                            You can reschedule this appointment before{" "}
                            {deadlineDate.format("LLLL")}.
                          </p>
                        ) : (
                          <>
                            <p className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
                              You can reschedule this appointment before{" "}
                              {`${deadlineDate.format("LLLL")} ${
                                booking.reschedule_penalty_enabled
                                  ? "to avoid fees"
                                  : ""
                              }`}
                            </p>
                            <div className="flex flex-col items-center bg-white p-4 rounded-lg mb-4">
                              <p className="mb-2 text-center">
                                <strong className="font-medium">
                                  Time until rescheduling{" "}
                                  {`${
                                    booking.reschedule_penalty_enabled
                                      ? "fee applies"
                                      : "window closes"
                                  }`}
                                  :
                                </strong>
                              </p>
                              <CountdownTimer
                                targetDate={deadlineDate}
                                onExpire={() => setIsPenaltyApplicable(true)}
                              />
                              {isPenaltyApplicable ? (
                                <>
                                  {booking.reschedule_penalty_enabled ? (
                                    <p className="text-red-600 mt-2 text-center">
                                      Rescheduling now will incur a{" "}
                                      {booking.reschedule_fee_percent}% fee.
                                    </p>
                                  ) : (
                                    <p className="text-red-600 mt-2 text-center">
                                      You are not allowed to reschedule this
                                      appointment as the deadline has passed.
                                    </p>
                                  )}
                                </>
                              ) : (
                                <>
                                  {booking.reschedule_penalty_enabled ? (
                                    <p className="text-green-600 mt-2">
                                      Reschedule now to avoid the{" "}
                                      {booking.reschedule_fee_percent}% fee.
                                    </p>
                                  ) : (
                                    <p className="text-green-600 mt-2">
                                      Reschedule now before the deadline
                                      expires.
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mb-4">
                        <h3 className="capitalize">Booking Details</h3>
                        <div className="grid md:grid-cols-2 gap-1 md:gap-2 mb-2">
                          <p className="flex md:flex-col p-2 bg-slate-100">
                            <strong className="font-medium">Event Date:</strong>{" "}
                            {`${eventDate.format("YYYY-MM-DD")}`}
                          </p>
                          <p className="flex md:flex-col p-2 bg-slate-100">
                            <strong className="font-medium">Event Time:</strong>{" "}
                            {minutesToTimeString(
                              eventDate.get("hour") * 60 +
                                eventDate.get("minute")
                            )}
                          </p>
                          <p className="flex md:flex-col p-2 bg-slate-100">
                            <strong className="font-medium">
                              Amount Paid:
                            </strong>{" "}
                            £{booking.amount_paid}
                          </p>
                          <p className="flex md:flex-col p-2 bg-slate-100">
                            <strong className="font-medium">Amount Due:</strong>{" "}
                            £{booking.amount_due}
                          </p>
                        </div>
                      </div>
                      {selectedDate ? (
                        <RescheduleForm
                          id={booking.id}
                          reschedulingAllowed={isReschedulingAllowed}
                          selectedDate={selectedDate}
                          selectedTime={selectedTime}
                          setRequested={setRequested}
                        />
                      ) : null}
                    </CardContent>
                  </Card>

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
                              {selectedDate.split("T")[0]}
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
                                {minutesToTimeString(
                                  convertTimeSlotsToUserLocalTime(
                                    selectedTime,
                                    clientOffset,
                                    businessOffset
                                  )
                                )}
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
                              {totalDuration} min
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
      )}
    </div>
  );
}
