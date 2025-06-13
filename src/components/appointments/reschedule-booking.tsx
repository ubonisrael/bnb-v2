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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import { BookingData, PolicyData } from "@/types/response";
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
import { convertTimeSlotsToUserLocalTime, minutesToTimeString } from "@/utils/time";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

interface RescheduleBookingClientProps {
  id: string;
  url: string;
  minNotice: number;
  maxNotice: number;
  utcOffset: number;
  booking: BookingData;
  policies: PolicyData[];
}

export default function RescheduleBookingClient({
  id,
  url,
  minNotice,
  maxNotice,
  utcOffset,
  booking,
  policies,
}: RescheduleBookingClientProps) {
  const [selectedDate, setSelectedDate] = useState(booking.event_date);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [requested, setRequested] = useState(false);
  const timezone = dayjs.tz.guess();
  const clientOffset = dayjs().tz(timezone).utcOffset();

  const policyTypes = Array.from(new Set(policies.map((p) => p.type)));
  const eventDate = dayjs(booking.event_date).tz(dayjs.tz.guess());

  const handleSelectDate = (date: string | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

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
                  minNotice={minNotice}
                  maxNotice={maxNotice}
                  selectedDate={selectedDate}
                  onSelectDate={handleSelectDate}
                />

                <TimeSlots
                  bUrl={url}
                  utcOffset={utcOffset}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSelectTime={setSelectedTime}
                  selectedServices={booking.services}
                  totalDuration={booking.event_duration}
                />
              </div>

              {/* Right Column: Cart and Appointment Details (2/5 width) */}
              <div className="w-full lg:w-2/5">
                <div className="flex flex-col gap-6">
                  {/* Cart Component */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="capitalize">
                        Booking information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        {policyTypes.map((policyType) => (
                          <div className="mb-2">
                            <h3 className="capitalize">{policyType} policy</h3>
                            <ul className="list-disc list-inside space-y-1">
                              {policies
                                .filter((policy) => policy.type === policyType)
                                .map(({ policy }, i) => (
                                  <li key={`${policyType}-${i}-${policy}`}>
                                    {policy}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mb-4">
                        <h3 className="capitalize">Booking Details</h3>
                        <div className="p-1 pt-0">
                          <p className="mb-1">
                            <strong>Event Date:</strong>{" "}
                            {`${eventDate.format("YYYY-MM-DD")}`}
                          </p>
                          <p className="mb-1">
                            <strong>Event Time:</strong>{" "}
                            {minutesToTimeString(
                              eventDate.get("hour") * 60 +
                                eventDate.get("minute")
                            )}
                          </p>
                          <p className="mb-1">
                            <strong>Status:</strong> {booking.status}
                          </p>
                          <p className="mb-1">
                            <strong>Amount Paid:</strong> £{booking.amount_paid}
                          </p>
                          <p className="mb-1">
                            <strong>Amount Due:</strong> £{booking.amount_due}
                          </p>
                        </div>
                      </div>
                      <RescheduleForm
                        id={id}
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
                                {minutesToTimeString(
                                  convertTimeSlotsToUserLocalTime(
                                    selectedTime,
                                    clientOffset,
                                    utcOffset
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
  selectedDate,
  selectedTime,
  setRequested,
}: {
  id: string;
  selectedDate: string;
  selectedTime: number | null;
  setRequested: (val: boolean) => void;
}) {
  const [showResheduleModal, setShowRescheduleModal] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const rescheduleBookingMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post(
          `sp/reschedule-booking`,
          {
            ...values,
            id,
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
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to submit request", {
        id: "reschedule-booking",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
          form.reset({
            email: "",
          });
        }
        setShowRescheduleModal(val);
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full mt-4"
          variant="default"
          disabled={!selectedTime}
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="self-end" type="submit">
              Request Reschedule
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
