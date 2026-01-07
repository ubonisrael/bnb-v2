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

export function CancelAppointmentDialog({
  appointment,
  date,
  setAppointment,
  tz,
}: AppointmentDialogProps) {
  const [cancelMessage, setCancelMessage] = useState<string>("");
  const queryClient = useQueryClient();
  return (
    <AlertDialog
      open={appointment !== null}
      onOpenChange={() => setAppointment(null)}
    >
      <AlertDialogContent className="max-h-screen overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#121212]">
            <span className="inline-block mb-2">
              Are you sure you want to cancel this appointment? (Booking ID:{" "}
              {appointment?.id})
            </span>
            <span className="inline-block">
              Customer: {appointment.Booking.Customer?.name} (
              {appointment.Booking.Customer?.email})
            </span>
            <br />
            <span className="inline-block">
              Service: {appointment.Service.name}
            </span>
            <br />
            <span className="inline-block">
              Date:{" "}
              {dayjs(appointment.start_time)
                .tz(tz)
                .format("HH:mm, MMMM D, YYYY")}
            </span>
            <br />
            <span className="inline-block mt-2">
              If canceled, customer will be fully refunded. Please note that you
              can not cancel appointments whose event time has passed.
            </span>
            <br />
            <span className="inline-block mt-2 text-red-600">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mb-4">
          <label
            htmlFor="dns-message"
            className="text-sm font-medium text-[#121212]"
          >
            Provide reason for cancellation . This will be relayed to the
            customer in an email
          </label>
          <textarea
            id="dns-message"
            className="mt-2 w-full rounded-md border border-[#E0E0E5] p-3 text-sm"
            placeholder="Your appointment has been cancelled..."
            rows={3}
            value={cancelMessage}
            onChange={(e) => setCancelMessage(e.target.value)}
          />
          {(!cancelMessage.trim().length ||
            cancelMessage.trim().length < 16 ||
            cancelMessage.trim().length > 100) && (
            <span className="inline-block text-red-600 text-sm">
              Reason must have between 16 and 100 characters
            </span>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setCancelMessage("");
              setAppointment(null);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={
              !cancelMessage.trim().length ||
              cancelMessage.trim().length < 16 ||
              cancelMessage.trim().length > 100
            }
            onClick={async (e) => {
              e.preventDefault();
              try {
                toast.loading(
                  `Cancelling appointment with ${appointment.Booking.Customer.name}@${appointment.start_time}`,
                  {
                    id: "cancel-appointment",
                  }
                );
                const res = (await api.post(`sp/booking/item/cancel`, {
                  bookingId: appointment.Booking.id,
                  itemId: appointment.id,
                  message: cancelMessage.trim() || "",
                  email: appointment.Booking.Customer.email,
                })) as any;

                // remove booking from cache
                queryClient.invalidateQueries({ queryKey: ["bookings", date] });

                toast.success(res.message, {
                  id: "cancel-appointment",
                });
                setCancelMessage(""); // Clear message after submission
                setAppointment(null);
              } catch (e: any) {
                console.error(e);
                toast.error(e.response.data.message, {
                  id: "cancel-appointment",
                });
              }
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
