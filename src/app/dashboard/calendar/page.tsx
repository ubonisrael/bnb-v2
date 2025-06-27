"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import api from "@/services/api-service";
import { useQuery } from "@tanstack/react-query";
import { BookingDataResponse, BookingsResponse } from "@/types/response";
import "react-day-picker/style.css";
import { MarkDNSDialog } from "@/components/calendar/mark-dns-dialog";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarControls } from "@/components/calendar/calendar-controls";
import { DayView } from "@/components/calendar/day-view";
import { WeekView } from "@/components/calendar/week-view";
import { generateTimeSlots, getTimeSlotIndex, heightOfCalendarRow } from "@/utils/calendar";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function CalendarPage() {
  const { settings } = useUserSettings();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week">("day");
  const [appointment, setAppointment] = useState<BookingsResponse | null>(null);

  // Calculate the days to display in week view
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const { data: dayData, isLoading: isDayDataLoading } =
    useQuery<BookingDataResponse>({
      queryKey: ["dayBookings", date.toISOString()],
      queryFn: () => api.get(`sp/bookings?date=${format(date, "yyyy-MM-dd")}`),
    });

  const { data: weekData, isLoading: isWeekDataLoading } = useQuery<
    BookingDataResponse[]
  >({
    queryKey: ["weekBookings", date.toISOString()], // More descriptive queryKey
    queryFn: async (): Promise<BookingDataResponse[]> => {
      try {
        return await Promise.all(
          weekDays.map((day) =>
            api.get<BookingDataResponse>(
              `sp/bookings?date=${format(day, "yyyy-MM-dd")}`
            )
          )
        );
      } catch (error) {
        console.error("Error fetching week bookings:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
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

  const filteredWeekBookings = (() => {
    if (!weekData?.length) return [];

      if (filters.category.length === 0 && filters.service.length === 0) {
        return weekData.map(day => day.bookings);
      }

      return weekData.map((day) => day.bookings.filter((booking) => {
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
      }))
  })();

  const timeSlots = (() => {
    if (view === "day") {
      if (!dayData?.dayEnabled) return [];
      return generateTimeSlots(
        dayData.openingTime ?? 420,
        dayData.closingTime ?? 1380,
        15 // 15-minute intervals
      );
    }
    // week view
    if (!weekData || weekData.length === 0) return [];
    // find the earliest opening time and latest closing time across the week
    const weekOpeningTime = Math.min(
      ...weekData.map((data) => data.openingTime ?? 420)
    );
    const weekClosingTime = Math.max(
      ...weekData.map((data) => data.closingTime ?? 1380)
    );
    return generateTimeSlots(weekOpeningTime, weekClosingTime, 15);
  })();

  // Add this effect to scroll to first appointment
  useEffect(() => {
    if (
      dayData?.bookings &&
      dayData.bookings.length > 0 &&
      view === "day" &&
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
  }, [dayData?.bookings, dayData?.timezone, timeSlots, view, isDayDataLoading]);

  return (
    <>
      {appointment && dayData && (
        <MarkDNSDialog
          appointment={appointment}
          setAppointment={setAppointment}
          date={date.toISOString()}
          tz={dayData?.timezone}
          settings={settings}
        />
      )}
      <div>
        <CalendarHeader
          date={date}
          view={view}
          setDate={setDate}
          setView={setView}
        />

        <CalendarControls
          date={date}
          setDate={setDate}
          filters={filters}
          setFilters={setFilters}
          settings={settings}
          view={view}
        />
        <Card className="overflow-hidden border-0 bg-white shadow-card">
          <CardHeader className="border-b border-[#E0E0E5] bg-white pb-4">
            <CardTitle className="text-[#121212]">
              {view === "day"
                ? format(date, "EEEE, MMMM d, yyyy")
                : `${format(weekStart, "MMMM d")} - ${format(
                    weekEnd,
                    "MMMM d, yyyy"
                  )}`}
            </CardTitle>
          </CardHeader>
          {view === "day" ? (
            <>
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
            </>
          ) : (
            <>
              {isWeekDataLoading ? (
                <div className="flex h-80 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#7B68EE]"></div>
                </div>
              ) : (
                <CardContent className="w-full p-0">
                  <WeekView
                    timeSlots={timeSlots}
                    weekDays={weekDays}
                    data={weekData!}
                    filteredBookings={filteredWeekBookings}
                    settings={settings}
                    setAppointment={setAppointment}
                  />
                </CardContent>
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
}
