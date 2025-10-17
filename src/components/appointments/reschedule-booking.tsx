// components/appointments/reschedule-booking.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import { BookingData, ReschedulingOptions } from "@/types/response";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Calendar from "../templates/default/Calendar";
import TimeSlots from "../templates/default/TimeSlots";
import {
  convertTimeSlotsToUserLocalTime,
  minutesToTimeString,
} from "@/utils/time";
import dayjs from "@/utils/dayjsConfig";
import { CountdownTimer } from "../ui/countdown-timer";
import {
  emailFormSchema,
  EmailFormValues,
  otpFormSchema,
  OtpFormValues,
} from "./cancel-booking";

interface RescheduleBookingClientProps {
  id: string;
  url: string;
  booking: BookingData;
  rescheduleOptions: ReschedulingOptions;
}

export default function RescheduleBookingClient({
  id,
  booking,
  rescheduleOptions,
  url,
}: RescheduleBookingClientProps) {
  const [selectedDate, setSelectedDate] = useState(booking.event_date);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [requested, setRequested] = useState(false);
  const timezone = dayjs.tz.guess();
  const clientOffset = dayjs().tz(timezone).utcOffset();

  const eventDate = dayjs(booking.event_date).tz(dayjs.tz.guess());
  // note rescheduleOptions.noticeHours is actually in minutes
  const deadlineDate = eventDate.subtract(
    rescheduleOptions.noticeHours,
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
  const isReschedulingAllowed = isPenaltyApplicable ? rescheduleOptions.penaltyEnabled && rescheduleOptions.allowed : rescheduleOptions.allowed

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
                  minNotice={rescheduleOptions.minNotice}
                  maxNotice={rescheduleOptions.maxNotice}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                />

                <TimeSlots
                  bUrl={url}
                  utcOffset={rescheduleOptions.utcOffset}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  selectedServices={booking.services}
                  totalDuration={booking.event_duration}
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
                        {!rescheduleOptions.allowed ? (
                          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                            Rescheduling is not allowed for this appointment.
                          </div>
                        ) : rescheduleOptions.feePercent === 0 ||
                          rescheduleOptions.noticeHours === 0 ? (
                          <p className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                            You can reschedule this appointment before{" "}
                            {deadlineDate.format("LLLL")}.
                          </p>
                        ) : (
                          <>
                            <p className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
                              You can reschedule this appointment before{" "}
                              {`${deadlineDate.format("LLLL")} ${
                                rescheduleOptions.penaltyEnabled
                                  ? "to avoid fees"
                                  : ""
                              }`}
                            </p>
                            <div className="flex flex-col items-center bg-white p-4 rounded-lg mb-4">
                              <p className="mb-2 text-center">
                                <strong className="font-medium">
                                  Time until rescheduling{" "}
                                  {`${
                                    rescheduleOptions.penaltyEnabled
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
                                  {rescheduleOptions.penaltyEnabled ? (
                                    <p className="text-red-600 mt-2 text-center">
                                      Rescheduling now will incur a{" "}
                                      {rescheduleOptions.feePercent}% fee.
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
                                  {rescheduleOptions.penaltyEnabled ? (
                                    <p className="text-green-600 mt-2">
                                      Reschedule now to avoid the{" "}
                                      {rescheduleOptions.feePercent}% fee.
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
                      <RescheduleForm
                        id={id}
                        reschedulingAllowed={isReschedulingAllowed}
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        setRequested={setRequested}
                      />
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
                                    rescheduleOptions.utcOffset
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
                              {booking.event_duration} min
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

function RescheduleForm({
  id,
  reschedulingAllowed,
  selectedDate,
  selectedTime,
  setRequested,
}: {
  id: string;
  reschedulingAllowed: boolean;
  selectedDate: string;
  selectedTime: number | null;
  setRequested: (val: boolean) => void;
}) {
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [showResheduleModal, setShowRescheduleModal] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);

  const emailForm = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });

  // Mutation for sending OTP
  const sendOtpMutation = useMutation({
    mutationFn: async (values: EmailFormValues) => {
      const response = await api.post(`sp/bookings/${id}/request-otp`, {
        email: values.email,
        type: "rescheduling",
      });
      return response;
    },
    onSuccess: (_, variables) => {
      toast.success("OTP sent to your email", { id: "send-otp" });
      setVerifiedEmail(variables.email);
      setShowOtpForm(true);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send OTP", {
        id: "send-otp",
      });
    },
  });

  const rescheduleBookingMutation = useMutation({
    mutationFn: async (values: z.infer<typeof otpFormSchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post(
          `sp/bookings/${id}/verify-otp`,
          {
            otp: values.otp,
            type: "rescheduling",
            new_event_date: selectedDate,
            new_event_time: selectedTime,
            client_tz: dayjs.tz.guess(),
          },
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Requesting reschedule...", { id: "reschedule-booking" });
    },
    onSuccess: () => {
      toast.success("Reschedule request submitted", {
        id: "reschedule-booking",
      });
      setRequested(true);
    },
    onError: (error: any) => {
      console.error("Reschedule error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to submit request",
        {
          id: "reschedule-booking",
        }
      );
    },
  });

  async function onEmailSubmit(values: EmailFormValues) {
    try {
      await sendOtpMutation.mutateAsync(values);
    } catch (err) {
      console.error(err);
    }
  }

  async function onOtpSubmit(values: OtpFormValues) {
    try {
      await rescheduleBookingMutation.mutateAsync(values);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <Dialog
      open={showResheduleModal}
      onOpenChange={(val) => {
        if (!val) {
          emailForm.reset({
            email: "",
          });
          otpForm.reset({
            otp: "",
          });
        }
        setShowRescheduleModal(val);
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full mt-4"
          variant="default"
          disabled={!selectedTime || !selectedDate || !reschedulingAllowed}
        >
          Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Fill in your details</DialogTitle>
          <DialogDescription>
            Enter the email you used when booking the appointment.
          </DialogDescription>
        </DialogHeader>
        {showOtpForm ? (
          <Form key="otp-form" {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              className="flex flex-col space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="one-time-code"
                        placeholder="Enter OTP"
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the OTP sent to {verifiedEmail}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowOtpForm(false);
                    otpForm.reset(); // Reset OTP form when going back
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={rescheduleBookingMutation.isPending}
                >
                  Confirm Reschedule
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form key="email-form" {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="flex flex-col space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the email you used when booking the appointment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={!reschedulingAllowed}
                type="submit"
                className="self-end"
              >
                Request OTP
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
