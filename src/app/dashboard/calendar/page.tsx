"use client";

import dayjs from "@/utils/dayjsConfig";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import api from "@/services/api-service";
import { useQuery } from "@tanstack/react-query";
import { BookingDataResponse } from "@/types/response";
import "react-day-picker/style.css";
import { MarkDNSDialog } from "@/components/calendar/mark-dns-dialog";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarControls } from "@/components/calendar/calendar-controls";
import { DayView } from "@/components/calendar/day-view";
import { generateTimeSlots, getTimeSlotIndex, heightOfCalendarRow } from "@/utils/calendar";
import { CancelAppointmentDialog } from "@/components/calendar/cancel-appointment-dialog";
import { RescheduleAppointmentDialog } from "@/components/calendar/reschdedule-appointment-dialog";

export default function CalendarPage() {
  const { settings } = useUserSettings();
  const [date, setDate] = useState<Date>(new Date());
  const [appointment, setAppointment] = useState<AppointmentProps | null>(null);

  const { data: dayData, isLoading: isDayDataLoading } =
    useQuery<BookingDataResponse>({
      queryKey: [`day-${date.toISOString()}`],
      queryFn: () => api.get(`sp/bookings?date=${format(date, "yyyy-MM-dd")}`),
    });

  const [filters, setFilters] = useState<FilterProps>({
    category: [],
    service: [],
  });

  const filteredDayBookings = (() => {
      if (!dayData?.bookings) return [];

      if (filters.category.length === 0 && filters.service.length === 0) {
        return dayData.bookings;
      }

      return dayData.bookings.filter((booking) => {
        // Check if any of the booking's services match the selected service filters
        const matchesService =
          filters.service.length === 0 ||
          booking.service_ids.some((serviceId) =>
            filters.service.some(
              (filter) => Number(filter.id) === Number(serviceId)
            )
          );

        // Check if any of the booking's services belong to selected categories
        const matchesCategory =
          filters.category.length === 0 ||
          booking.service_ids.some((serviceId) => {
            const service = settings?.services.find(
              (s) => Number(s.id) === Number(serviceId)
            );
            return filters.category.some(
              (cat) => cat.id === service?.CategoryId
            );
          });

        return matchesService && matchesCategory;
      });
  })();

  const timeSlots = (() => {
    if (!dayData?.dayEnabled) return [];
    return generateTimeSlots(
      dayData.openingTime ?? 420,
      dayData.closingTime ?? 1380,
      15 // 15-minute intervals
    );
  })();

  // Add this effect to scroll to first appointment
  useEffect(() => {
    if (
      dayData?.bookings &&
      dayData.bookings.length > 0 &&
      !isDayDataLoading
    ) {
      const firstAppointment = dayData.bookings[0];
      const date = dayjs(firstAppointment.event_date).tz(
        dayData.timezone || "UTC"
      );
      const startTime = date.format("HH:mm");
      const timeSlotIndex = getTimeSlotIndex(startTime, timeSlots);

      if (timeSlotIndex !== -1) {
        const yOffset = timeSlotIndex * heightOfCalendarRow;
        window.scrollTo({
          top: yOffset,
          behavior: "smooth",
        });
      }
    }
  }, [dayData?.bookings, dayData?.timezone, timeSlots, isDayDataLoading]);

  return (
    <>
      {appointment && appointment.type === 'dns' && dayData && (
        <MarkDNSDialog
          appointment={appointment.data}
          setAppointment={setAppointment}
          date={date.toISOString()}
          tz={dayData?.timezone}
          settings={settings}
        />
      )}
      {appointment && appointment.type === 'cancel' && dayData && (
        <CancelAppointmentDialog
          appointment={appointment.data}
          setAppointment={setAppointment}
          date={date.toISOString()}
          tz={dayData?.timezone}
          settings={settings}
        />
      )}
      {appointment && appointment.type === 'reschedule' && dayData && (
        <RescheduleAppointmentDialog
          appointment={appointment.data}
          setAppointment={setAppointment}
          date={date.toISOString()}
          tz={dayData?.timezone}
          settings={settings}
        />
      )}
      <div>
        <CalendarHeader
          date={date}
          setDate={setDate}
        />

        <CalendarControls
          date={date}
          setDate={setDate}
          filters={filters}
          setFilters={setFilters}
          settings={settings}
        />
        <Card className="overflow-hidden border-0 bg-white shadow-card">
          <CardHeader className="border-b border-[#E0E0E5] bg-white pb-4">
            <CardTitle className="text-[#121212]">
              {format(date, "EEEE, MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          {isDayDataLoading ? (
            <div className="flex h-80 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#7B68EE]"></div>
            </div>
          ) : (
            <CardContent className="w-full p-0">
              <DayView
                data={dayData}
                date={date}
                timeSlots={timeSlots}
                filteredBookings={filteredDayBookings}
                setAppointment={setAppointment}
                settings={settings}
              />
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}
