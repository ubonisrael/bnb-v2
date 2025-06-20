"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Service } from "../onboarding/type";
import { getAppointmentColor, getTimeSlotIndex, heightOfCalendarRow } from "@/app/dashboard/calendar/page";

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
          {filteredBookings.map((appointment) => {
            const date = dayjs(appointment.event_date).tz(
              data.timezone || "UTC"
            );
            const startTime = date.format("HH:mm");
            const endTime = date
              .add(appointment.event_duration, "minutes")
              .format("HH:mm");
            const startTimeIndex = getTimeSlotIndex(startTime, timeSlots);
            const duration = appointment.event_duration / 15;

            if (startTimeIndex === -1) return null;

            return (
              <div
                key={appointment.id}
                className={cn(
                  "absolute rounded-md p-3 shadow-sm",
                  getAppointmentColor()
                )}
                style={{
                  top: `${startTimeIndex * heightOfCalendarRow}px`,
                  height: `${heightOfCalendarRow * (duration + 1)}px`,
                  left: "0",
                  width: "100%",
                  // transform: `translateY(${startTimeIndex * 48}px)`,
                }}
              >
                <div className="relative flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                    <div className="font-medium text-[#121212]">
                      {appointment.Customer?.name}
                    </div>
                    <div className="text-sm text-[#121212]">
                      {appointment.Customer?.email}
                    </div>
                    {appointment.dns && (
                      <Badge className="w-12 bg-red-400 text-white">DNS</Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className="absolute top-0 right-0"
                      asChild
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-black/5"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={appointment.dns}
                        onClick={() => setAppointment(appointment)}
                      >
                        Mark as DNS
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-1 md:mt-2 text-sm text-[#121212]">
                  {appointment.service_ids
                    .map((s: string[]) => {
                      const service = settings?.services.find(
                        (service: Service) => Number(service.id) === Number(s)
                      );
                      return service?.name;
                    })
                    .join(", ")}
                </div>
                <div className="text-xs text-[#6E6E73]">
                  {startTime} - {endTime}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
