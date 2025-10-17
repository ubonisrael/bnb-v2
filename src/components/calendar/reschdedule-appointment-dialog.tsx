"use client";

import dayjs from "@/utils/dayjsConfig";
import { useState } from "react";
import { BookingDataResponse } from "@/types/response";
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
import Calendar from "../templates/default/Calendar";
import TimeSlots from "../templates/default/TimeSlots";

export function RescheduleAppointmentDialog({
  appointment,
  date,
  setAppointment,
  settings,
  tz,
}: AppointmentDialogProps) {
  const event_date = dayjs(appointment.event_date).tz(tz);
  const current_date = event_date.format("YYYY-MM-DD");
  const [reason, setReason] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(current_date);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const queryClient = useQueryClient();

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
                  Customer: {appointment?.Customer?.name} (
                  {appointment?.Customer?.email})
                </span>
                <br />
                <span className="inline-block">
                  Services:{" "}
                  {appointment?.service_ids
                    .map((s: string) => {
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
                minNotice={settings.bookingSettings.minimum_notice}
                maxNotice={settings.bookingSettings.maximum_notice}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
              />
              <TimeSlots
                bUrl={settings.bookingSettings.url}
                utcOffset={dayjs().tz(dayjs.tz.guess()).utcOffset()}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                selectedServices={appointment.service_ids.map((s: string) => ({
                  id: s,
                }))}
                totalDuration={appointment.event_duration}
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
                  `Rescheduling appointment with ${appointment.Customer.name}@${appointment.event_date}`,
                  {
                    id: "reschedule-appointment",
                  }
                );

                const res = (await api.post(`sp/booking/reschedule`, {
                  id: appointment.id,
                  message: reason.trim() || "",
                  email: appointment.Customer.email,
                  new_event_date: selectedDate,
                  new_event_time: selectedTime,
                })) as any;

                // Update the cache
                queryClient.setQueryData(
                  [`day-${date}`],
                  (oldData: BookingDataResponse | undefined) => {
                    if (!oldData || !selectedTime) return oldData;

                    // if the selected date is the same as the current date, update the time
                    if (selectedDate === current_date) {
                      return {
                        ...oldData,
                        bookings: oldData.bookings.map((booking) => {
                          const oldEventTime = dayjs(booking.event_date).tz(tz)
                          const hrs = Math.floor(selectedTime! / 60);
                          const mins = selectedTime! % 60;
                          const newEventDate = oldEventTime.set("hour", hrs).set("minute", mins);
                          if (booking.id === appointment.id) {
                            return {
                              ...booking,
                              event_date: newEventDate.toISOString(),
                            };
                          }
                          return booking;
                        }),
                      };
                    }
                    // else filter the booking out
                    return {
                      ...oldData,
                      bookings: oldData.bookings.map(
                        (booking) => booking.id !== appointment.id
                      ),
                    };
                  }
                );

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
