"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import CalendarCard from "./calendar-card";
import { heightOfCalendarRow } from "@/utils/calendar";

dayjs.extend(utc);
dayjs.extend(timezone);

export function DayView({
  data,
  date,
  timeSlots,
  filteredBookings,
  setAppointment,
  settings,
}: DayViewProps) {
  if (!data.bookings.length) {
    return (
      <div className="flex h-40 p-4 sm:p-6 md:p-8 xl:p-10 text-[#6E6E73]">
        <p className="text-center">
          No appointments scheduled for{" "}
          {isSameDay(date, new Date()) ? "today" : "this date"}.
        </p>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Calendar grid */}
      <div className="relative flex-1 overflow-x-auto pb-16">
        {/* Time slots */}
        <div className="grid grid-cols-1">
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className="flex"
              style={{ height: `${heightOfCalendarRow}px` }}
            >
              <div className="w-16 border-r border-[#E0E0E5] bg-[#F5F5F7] py-2 pr-2 text-right text-xs text-[#6E6E73]">
                {time}
              </div>
              <div
                className={cn(
                  "flex-1 border-b border-[#E0E0E5] cursor-pointer hover:bg-[#F5F5F7]/50",
                  index % 2 === 0 ? "bg-white" : "bg-[#F5F5F7]/30"
                )}
              ></div>
            </div>
          ))}
        </div>

        {/* Appointments */}
        <div className="absolute left-16 top-0 w-[calc(100%-4rem)]">
          {filteredBookings.map((appointment) => (
            <CalendarCard
              key={`${new Date(appointment.event_date)}`}
              appointment={appointment}
              setAppointment={setAppointment}
              timeSlots={timeSlots}
              timezone={data.timezone}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
