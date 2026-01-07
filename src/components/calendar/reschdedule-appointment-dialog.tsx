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
import Calendar from "../Calendar";
import TimeSlots from "../TimeSlots";
import { useFetchBookingSettings } from "@/hooks/use-fetch-booking-settings";

export function RescheduleAppointmentDialog({
  appointment,
  date,
  setAppointment,
  tz,
}: AppointmentDialogProps) {
  const event_date = dayjs(appointment.start_time).tz(tz);
  const current_date = event_date.format("YYYY-MM-DD");
  const [reason, setReason] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(current_date);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: settings } = useFetchBookingSettings();

  const handleSelectDate = (date: string | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  return (
    <AlertDialog
      open={appointment !== null}
      onOpenChange={() => setAppointment(null)}
    >
      <AlertDialogContent className="max-h-screen max-w-4xl overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-2 md:gap-4">
          <div>
            <AlertDialogHeader>
              <AlertDialogTitle>Reschedule Appointment</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-[#121212]">
                <span className="inline-block mb-2">
                  Are you sure you want to reschedule this appointment? (Booking
                  ID: {appointment?.id})
                </span>
                <span className="inline-block">
                  Customer: {appointment.Booking.Customer.name} (
                  {appointment.Booking.Customer.email})
                </span>
                <br />
                <span className="inline-block">
                  Service:{" "}
                  {appointment.Service.name}
                </span>
                <br />
                <span className="inline-block">
                  Date: {event_date.format("HH:mm, MMMM D, YYYY")}
                </span>
                <br />
                <span className="inline-block mt-2">
                  Please note that you can not reschdedule appointments whose
                  event time has passed.
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
                Provide reason for rescheduling . This will be relayed to the
                customer in an email
              </label>
              <textarea
                id="dns-message"
                className="mt-2 w-full rounded-md border border-[#E0E0E5] p-3 text-sm"
                placeholder="Your appointment has been rescheduled..."
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              {(!reason.trim().length ||
                reason.trim().length < 16 ||
                reason.trim().length > 100) && (
                <span className="inline-block text-red-600 text-sm">
                  Reason must have between 16 and 100 characters
                </span>
              )}
            </div>
          </div>

          {settings && (
            <div className="w-full">
              <Calendar
                minNotice={settings.minimum_notice}
                maxNotice={settings.maximum_notice}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
              />
              <TimeSlots
                bUrl={settings.url}
                utcOffset={dayjs().tz(dayjs.tz.guess()).utcOffset()}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                selectedServices={[
                  { ...appointment.Service, duration: appointment.duration },
                ]}
                totalDuration={appointment.duration}
              />
              {selectedDate === current_date && selectedTime === null && (
                <span className="inline-block text-red-600 text-sm mt-2">
                  Please choose a different date or time
                </span>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setReason("");
              setAppointment(null);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={
              !reason.trim().length ||
              reason.trim().length < 16 ||
              reason.trim().length > 100 ||
              (selectedDate === current_date && selectedTime === null)
            }
            onClick={async (e) => {
              e.preventDefault();
              try {
                toast.loading(
                  `Rescheduling appointment with ${appointment.Booking.Customer.name}@${appointment.start_time}`,
                  {
                    id: "reschedule-appointment",
                  }
                );

                const res = (await api.post(`sp/booking/item/reschedule`, {
                  bookingId: appointment.Booking.id,
                  itemId: appointment.id,
                  message: reason.trim() || "",
                  email: appointment.Booking.Customer.email,
                  new_event_date: selectedDate,
                  new_event_time: selectedTime,
                })) as any;

                // Update the cache
                queryClient.invalidateQueries({ queryKey: ['bookings', date]});
                toast.success(res.message, {
                  id: "reschedule-appointment",
                });
                setReason(""); // Clear message after submission
                setAppointment(null);
              } catch (e: any) {
                console.error(e);
                toast.error(e.response.data.message, {
                  id: "reschedule-appointment",
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
