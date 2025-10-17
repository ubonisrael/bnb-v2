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
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import Link from "next/link";
import { useState } from "react";
import { BookingData, CancellationSettings } from "@/types/response";
import dayjs from "@/utils/dayjsConfig";
import { minutesToTimeString } from "@/utils/time";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Textarea } from "../ui/textarea";

export const emailFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const otpFormSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
  cancellation_reason: z
    .string()
    // .min(16, { message: "Cancellation reason must be at least 16 characters" })
    .optional(),
});

export type EmailFormValues = z.infer<typeof emailFormSchema>;
export type OtpFormValues = z.infer<typeof otpFormSchema>;

interface CancelBookingClientProps {
  id: string;
  booking: BookingData;
  setting: CancellationSettings;
}

export default function CancelBookingClient({
  id,
  booking,
  setting,
}: CancelBookingClientProps) {
  const [cancelled, setCancelled] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "", cancellation_reason: "" },
  });

  const eventDate = dayjs(booking.event_date).tz(dayjs.tz.guess());
  // setting.noticeHours is actually in minutes
  const deadlineDate = eventDate.subtract(setting.noticeHours, "minute");
  const [isPenaltyApplicable, setIsPenaltyApplicable] = useState(
    dayjs().isAfter(deadlineDate)
  );

  // Mutation for request OTP
  const requestOtpMutation = useMutation({
    mutationFn: async (values: EmailFormValues) => {
      const response = await api.post(`sp/bookings/${id}/request-otp`, {
        email: values.email,
        type: "cancellation",
      });
      return response;
    },
    onSuccess: (_, variables) => {
      toast.success("OTP sent to your email", { id: "send-otp" });
      setVerifiedEmail(variables.email);
      setShowOtpForm(true);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to send OTP", { id: "send-otp" });
    },
  });

  // Mutation for verifying OTP and cancelling booking
  const cancelBookingMutation = useMutation({
    mutationFn: async (values: OtpFormValues) => {
      const response = await api.post(`sp/bookings/${id}/verify-otp`, {
        otp: values.otp,
        type: "cancellation",
      });
      return response;
    },
    onSuccess: () => {
      toast.success("Booking cancelled successfully", { id: "cancel-booking" });
      setCancelled(true);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to cancel booking", {
        id: "cancel-booking",
      });
    },
  });

  async function onEmailSubmit(values: EmailFormValues) {
    try {
      await requestOtpMutation.mutateAsync(values);
    } catch (err) {
      console.error(err);
    }
  }

  async function onOtpSubmit(values: OtpFormValues) {
    try {
      await cancelBookingMutation.mutateAsync(values);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="max-w-xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Cancel Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 bg-slate-100">
            {cancelled ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg">
                Your appointment has been successfully cancelled.
                <div className="flex items-center justify-center pt-4">
                  <Link
                    href="/"
                    className="text-blue-600 underline text-sm inline-block"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="py-4">
                  <div>
                    <div className="mb-4">
                      {!setting.allowed ? (
                        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                          Deposits and amount paid will not be refunded for this
                          appointment if cancelled.
                        </div>
                      ) : setting.feePercent === 0 ||
                        setting.noticeHours === 0 ? (
                        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                          You can cancel this appointment before{" "}
                          {deadlineDate.format("LLLL")} for a full refund.
                        </div>
                      ) : (
                        <>
                          <p className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                            You can cancel this appointment before{" "}
                            {deadlineDate.format("LLLL")} to avoid fees.
                          </p>
                          <div className="flex flex-col items-center bg-white p-4 rounded-lg mb-4">
                            <p className="mb-2 text-center">
                              <strong className="font-medium">
                                Time until cancellation fee applies:
                              </strong>
                            </p>
                            <CountdownTimer
                              targetDate={deadlineDate}
                              onExpire={() => setIsPenaltyApplicable(true)}
                            />
                            {isPenaltyApplicable ? (
                              <p className="text-red-600 mt-2">
                                Cancelling now will incur a {setting.feePercent}
                                % cancellation fee.
                              </p>
                            ) : (
                              <p className="text-green-600 mt-2">
                                Cancel now to avoid the {setting.feePercent}%
                                cancellation fee.
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="">
                      <h3 className="capitalize font-medium text-lg">
                        Booking Details
                      </h3>
                      <div className="grid md:grid-cols-2 gap-1 md:gap-2 mb-2">
                        <p className="flex md:flex-col p-2 bg-slate-100">
                          <strong className="font-medium">Event Date:</strong>{" "}
                          {`${eventDate.format("YYYY-MM-DD")}`}
                        </p>
                        <p className="flex md:flex-col p-2 bg-slate-100">
                          <strong className="font-medium">Event Time:</strong>{" "}
                          {minutesToTimeString(
                            eventDate.get("hour") * 60 + eventDate.get("minute")
                          )}
                        </p>
                        <p className="flex md:flex-col p-2 bg-slate-100">
                          <strong className="font-medium">Amount Paid:</strong>{" "}
                          £{booking.amount_paid}
                        </p>
                        <p className="flex md:flex-col p-2 bg-slate-100">
                          <strong className="font-medium">Amount Due:</strong> £
                          {booking.amount_due}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {showOtpForm ? (
                  <Form key="otp-form" {...otpForm}>
                    <form
                      onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                      className="flex flex-col space-y-4"
                    >
                      <FormField
                        control={otpForm.control}
                        name="cancellation_reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Reason for cancellation (optional)
                            </FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
                          disabled={cancelBookingMutation.isPending}
                        >
                          Confirm Cancellation
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
                              Enter the email you used when booking the
                              appointment.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="self-end">
                        Request OTP
                      </Button>
                    </form>
                  </Form>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
