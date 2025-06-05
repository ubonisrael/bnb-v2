"use client";

import { useRouter } from "next/navigation";
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
import { BookingData, PolicyData } from "@/types/response";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { minutesToTimeString } from "@/utils/time";

dayjs.extend(utc);
dayjs.extend(timezone);

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

interface CancelBookingClientProps {
  id: string;
  booking: BookingData;
  policies: PolicyData[];
}

export default function CancelBookingClient({
  id,
  booking,
  policies,
}: CancelBookingClientProps) {
  const [cancelled, setCancelled] = useState(false);
  const policyTypes = Array.from(new Set(policies.map((p) => p.type)));

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const eventDate = dayjs(booking.event_date).tz(dayjs.tz.guess());

  const cancelBookingMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post(
          `sp/cancel-booking`,
          {
            ...values,
            id,
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
      toast.loading("Cancelling booking...", { id: "cancel-booking" });
    },
    onSuccess: (response: any) => {
      toast.success(`Booking cancelled successfully`, { id: "cancel-booking" });
      setCancelled(true);
    },
    onError: (error: Error) => {
      toast.error(error?.message || `Failed to cancel booking`, {
        id: "cancel-booking",
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await cancelBookingMutation.mutateAsync(values);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Cancel Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cancelled ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg">
                Your appointment has been successfully cancelled.
                <div className="flex items-center justify-center pt-4">
                  <Link href="/" className="text-blue-600 underline text-sm inline-block">
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="font-medium text-xl">Cancellation Policy</h2>
                  <div>
                    <div className="mb-4">
                      {policyTypes.map((policyType) => (
                        <ul
                          key={policyType}
                          className="list-disc list-inside space-y-1"
                        >
                          {policies
                            .filter((policy) => policy.type === policyType)
                            .map(({ policy }, i) => (
                              <li key={`${policyType}-${policy}-${i}`}>
                                {policy}
                              </li>
                            ))}
                        </ul>
                      ))}
                    </div>
                    <div className="">
                      <h3 className="capitalize font-medium text-lg">
                        Booking Details
                      </h3>
                      <div className="p-1 pt-0">
                        <p className="mb-1">
                          <strong className="font-medium">Event Date:</strong>{" "}
                          {`${eventDate.format("YYYY-MM-DD")}`}
                        </p>
                        <p className="mb-1">
                          <strong className="font-medium">Event Time:</strong>{" "}
                          {minutesToTimeString(
                            eventDate.get("hour") * 60 + eventDate.get("minute")
                          )}
                        </p>
                        <p className="mb-1">
                          <strong className="font-medium">Status:</strong>{" "}
                          {booking.status}
                        </p>
                        <p className="mb-1">
                          <strong className="font-medium">Amount Paid:</strong>{" "}
                          £{booking.amount_paid}
                        </p>
                        <p className="mb-1">
                          <strong className="font-medium">Amount Due:</strong> £
                          {booking.amount_due}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

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
                          <FormDescription>
                            Enter the email you used when booking the
                            appointment.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="self-end">Confirm Cancellation</Button>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
