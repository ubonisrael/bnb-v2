"use client";

import dayjs from "@/utils/dayjsConfig";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import toast from "react-hot-toast";
import api from "@/services/api-service";

export function MarkDNSDialog({
  appointment,
  date,
  setAppointment,
  tz,
}: AppointmentDialogProps) {
  const [dnsMessage, setDnsMessage] = useState<string>("");
  const queryClient = useQueryClient();
  return (
    <AlertDialog
      open={appointment !== null}
      onOpenChange={() => setAppointment(null)}
    >
      <AlertDialogContent className="max-h-screen overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Mark as DNS</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#121212]">
            <span className="inline-block mb-2">
              Are you sure you want to mark this appointment as Did Not Show?
            </span>
            <span className="inline-block">Booking ID: {appointment?.id}</span>
            <span className="inline-block">
              Customer: {appointment?.booking.customer?.name} (
              {appointment?.booking.customer?.email})
            </span>
            <br />
            <span className="inline-block">
              Services:{" "}
              {appointment?.service.name}
            </span>
            <br />
            <span className="inline-block">
              Date:{" "}
              {dayjs(appointment.start_time)
                .tz(tz)
                .format("HH:mm, MMMM D, YYYY")}
            </span>
            <br />
            <span className="inline-block">
              If allowed under your booking policy, customer may be refunded.
            </span>
            <br />
            <span className="inline-block mt-2 text-red-600">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4">
          <label
            htmlFor="dns-message"
            className="text-sm font-medium text-[#121212]"
          >
            Message to{" "}
            {`${appointment.booking.customer.name} (${appointment.booking.customer.email})`}{" "}
            (optional)
          </label>
          <textarea
            id="dns-message"
            className="mt-2 w-full rounded-md border border-[#E0E0E5] p-3 text-sm"
            placeholder="Send a follow up message..."
            rows={3}
            value={dnsMessage}
            onChange={(e) => setDnsMessage(e.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setDnsMessage(""); // Clear message when canceling
              setAppointment(null);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault()
              try {
                toast.loading(`Marking booking-${appointment.id} as DNS`, {
                  id: "mark-dns",
                });
                const res = (await api.post(`sp/booking/mark-dns`, {
                  id: appointment.id,
                  message: dnsMessage.trim() || "", // Only send if message exists
                  email: appointment.booking.customer.email,
                })) as any;

                // Update the cache with the new DNS status
                queryClient.setQueryData(
                  [`day-${date}`],
                  (oldData: BookingDataResponse | undefined) => {
                    if (!oldData) return oldData;

                    return {
                      ...oldData,
                      bookings: oldData.bookings.map((booking) => {
                        if (booking.id === appointment.id) {
                          return {
                            ...booking,
                            dns: true,
                          };
                        }
                        return booking;
                      }),
                    };
                  }
                );

                toast.success(res.message, {
                  id: "mark-dns",
                });
              } catch (e: any) {
                console.error(e);
                toast.error(e.response.data.message, {
                  id: "mark-dns",
                });
              }
              setDnsMessage(""); // Clear message after submission
              setAppointment(null);
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
