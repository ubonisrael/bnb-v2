"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import CalendarCard from "./calendar-card";
import { heightOfCalendarRow } from "@/utils/calendar";

dayjs.extend(utc);
dayjs.extend(timezone);

export function WeekView({
  timeSlots,
  weekDays,
  data,
  filteredBookings,
  setAppointment,
}: WeekViewProps) {
  return (
    <div className="max-w-[320px] sm:max-w-[600px] md:max-w-none relative">
      {/* Fixed container for scrollable content */}
      <div className="overflow-x-auto pb-16">
        {/* Week view header */}
        <div className="min-w-[1536px] grid grid-cols-[72px_repeat(7,1fr)] border-b border-[#E0E0E5]">
          <div
            className={cn(
              "h-14 p-2 text-center font-medium sticky left-0 bg-white z-10",
              "text-[#121212]"
            )}
          ></div>
          {weekDays.map((day, index) => (
            <div
              key={day.toString()}
              className={cn(
                "h-14 p-2 text-center font-medium border-r",
                index === 0 ? "border-l" : "",
                isSameDay(day, new Date())
                  ? "bg-blue-200 text-blue-700"
                  : "bg-blue-50 text-[#121212]"
              )}
            >
              <div className="text-sm">{format(day, "EEE")}</div>
              <div className="text-base font-bold">{format(day, "d")}</div>
            </div>
          ))}
        </div>

        {/* Week view time slots and appointments */}
        <div className="min-w-[1536px] grid grid-cols-[72px_repeat(7,1fr)]">
          {/* Fixed time slots column */}
          <div className="border-r border-[#E0E0E5] sticky left-0 bg-white z-10">
            {timeSlots.map((time, timeIndex) => (
              <div
                id={`${time}`}
                key={`${time}`}
                style={{ height: `${heightOfCalendarRow}px` }}
                className={cn(
                  "flex items-center justify-center border-b border-[#E0E0E5]",
                  timeIndex % 2 === 0 ? "bg-white" : "bg-[#F5F5F7]/30"
                )}
              >
                {time}
              </div>
            ))}
          </div>
          {/* Scrollable appointments grid */}
          <div className="col-start-2 col-end-9 grid grid-cols-7">
            {weekDays.map((day, dayIndex) => (
              <>
                <div
                  key={`${day.getMilliseconds()}`}
                  className="relative border-r border-[#E0E0E5]"
                >
                  {timeSlots.map((time, timeIndex) => (
                    <div
                      id={`${day}-${time}`}
                      key={`${day}-${time}`}
                      style={{ height: `${heightOfCalendarRow}px` }}
                      className={cn(
                        "border-b border-[#E0E0E5] cursor-pointer hover:bg-[#F5F5F7]/50",
                        timeIndex % 2 === 0 ? "bg-white" : "bg-[#F5F5F7]/30"
                      )}
                    ></div>
                  ))}
                  <div className="absolute left-0 top-0 w-full">
                    {filteredBookings[dayIndex].map((appointment) => (
                      <CalendarCard
                        key={`${new Date(appointment.event_date)}`}
                        appointment={appointment}
                        setAppointment={setAppointment}
                        timeSlots={timeSlots}
                        timezone={data[dayIndex].timezone}
                        view="week"
                      />
                    ))}
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
