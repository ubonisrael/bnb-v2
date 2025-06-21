"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import {
  getAppointmentColor,
  getTimeSlotIndex,
  heightOfCalendarRow,
} from "@/app/dashboard/calendar/page";
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
import { Badge } from "../ui/badge";

dayjs.extend(utc);
dayjs.extend(timezone);

export function WeekView({
  timeSlots,
  weekDays,
  data,
  filteredBookings,
  settings,
  setAppointment
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
                index === 0 ? 'border-l' : '',
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
                  key={day.toString()}
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
                    {filteredBookings[dayIndex].map((appointment) => {
                      const date = dayjs(appointment.event_date).tz(
                        data[dayIndex].timezone || "UTC"
                      );
                      const startTime = date.format("HH:mm");
                      const endTime = date
                        .add(appointment.event_duration, "minutes")
                        .format("HH:mm");
                      const startTimeIndex = getTimeSlotIndex(
                        startTime,
                        timeSlots
                      );
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
                          <div className="relative flex flex-col">
                            <div className="flex flex-col gap-2">
                              <div className="font-medium text-[#121212]">
                                {appointment.Customer?.name}
                              </div>
                              <div className="text-sm text-[#121212]">
                                {appointment.Customer?.email}
                              </div>
                              {appointment.dns && (
                                <Badge className="w-12 bg-red-400 text-white">
                                  DNS
                                </Badge>
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
                                  (service: Service) =>
                                    Number(service.id) === Number(s)
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
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
