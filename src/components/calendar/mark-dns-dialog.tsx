"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { BookingDataResponse, BookingsResponse } from "@/types/response";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import toast from "react-hot-toast";
import api from "@/services/api-service";

dayjs.extend(utc);
dayjs.extend(timezone);

type MarkDNSDialogProps = {
  appointment: BookingsResponse;
  date: string;
  setAppointment: (val: null) => void;
  settings: any;
  tz: string;
};

export function MarkDNSDialog({
  appointment,
  date,
  setAppointment,
  settings,
  tz,
}: MarkDNSDialogProps) {
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
              Customer: {appointment?.Customer?.name} (
              {appointment?.Customer?.email})
            </span>
            <br />
            <span className="inline-block">
              Services:{" "}
              {appointment?.service_ids
                .map((s) => {
                  const service = settings?.services.find(
                    (service: Service) => Number(service.id) === Number(s)
                  );
                  return service?.name;
                })
                .join(", ")}
            </span>
            <br />
            <span className="inline-block">
              Date:{" "}
              {dayjs(appointment.event_date)
                .tz(tz)
                .format("HH:mm, MMMM D, YYYY")}
            </span>
            <br />
            <span className="inline-block">
              According to your booking policy,{" "}
              {settings?.bookingSettings.no_show_fee_percent === 100
                ? `a 100% no-show fee will be applied to this booking and the customer will not be refunded.`
                : `a ${
                    settings?.bookingSettings.no_show_fee_percent
                  }% no-show fee will be applied to this booking. ${
                    appointment?.Customer?.name
                  } will be refunded £${(
                    appointment?.amount_paid *
                    (settings
                      ? settings?.bookingSettings.no_show_fee_percent / 100
                      : 0)
                  ).toFixed(2)}.`}
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
            {`${appointment.Customer.name} (${appointment.Customer.email})`}{" "}
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
            onClick={async () => {
              console.log("mark dns", appointment.id);
              try {
                toast.loading(`Marking booking-${appointment.id} as DNS`, {
                  id: "mark-dns",
                });
                const res = (await api.post(`sp/booking/mark-dns`, {
                  id: appointment.id,
                  message: dnsMessage.trim() || "", // Only send if message exists
                  email: appointment.Customer.email
                })) as any;

                // Update the cache with the new DNS status
                queryClient.setQueryData(
                  [date],
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