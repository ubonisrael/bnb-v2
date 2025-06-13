"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useState, useMemo } from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  X,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useUserSettings } from "@/contexts/user-settings-context";
import { Service, ServiceCategory } from "@/components/onboarding/type";
import api from "@/services/api-service";
import { useQuery } from "@tanstack/react-query";
import { BookingDataResponse } from "@/types/response";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

dayjs.extend(utc);
dayjs.extend(timezone);

// Time slots for the calendar
// Example usage:
// const timeSlots = generateTimeSlots(420, 1380, 60); // 7:00 to 23:00, hourly intervals
const generateTimeSlots = (
  start: number,
  end: number,
  interval: number
): string[] => {
  const slots: string[] = [];
  for (let i = start; i <= end; i += interval) {
    const hours = Math.floor(i / 60);
    const minutes = i % 60;
    slots.push(
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    );
  }
  return slots;
};

const heightOfCalendarRow = 32; // Height of each row in the calendar (in pixels)

// Add filter types
type FilterType = {
  category: ServiceCategory[];
  service: Service[];
};

export default function CalendarPage() {
  const { settings } = useUserSettings();
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"day" | "week">("day");

  const { data, isLoading } = useQuery<BookingDataResponse>({
    queryKey: [date.toISOString()],
    queryFn: () => api.get(`sp/bookings?date=${format(date, "yyyy-MM-dd")}`),
  });

  const [filters, setFilters] = useState<FilterType>({
    category: [],
    service: [],
  });

  // Calculate the days to display in week view
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Function to get appointment color
  const getAppointmentColor = (() => {
    let lastColor = '';
    return () => {
      const colors = [
        "bg-[hsl(var(--appointment-blue))]",
        "bg-[hsl(var(--appointment-pink))]", 
        "bg-[hsl(var(--appointment-teal))]",
        "bg-[hsl(var(--appointment-orange))]"
      ];
      
      let newColor;
      do {
        newColor = colors[Math.floor(Math.random() * colors.length)];
      } while (newColor === lastColor && colors.length > 1);
      
      lastColor = newColor;
      return newColor;
    };
  })();

const filteredBookings = useMemo(() => {
  if (!data?.bookings) return [];
  
  if (filters.category.length === 0 && filters.service.length === 0) {
    return data.bookings;
  }

  return data.bookings.filter(booking => {
    // Check if any of the booking's services match the selected service filters
    const matchesService = filters.service.length === 0 || 
      booking.service_ids.some(serviceId => 
        filters.service.some(filter => Number(filter.id) === Number(serviceId))
      );

    // Check if any of the booking's services belong to selected categories
    const matchesCategory = filters.category.length === 0 ||
      booking.service_ids.some(serviceId => {
        const service = settings?.services.find(s => Number(s.id) === Number(serviceId));
        return filters.category.some(cat => cat.id === service?.CategoryId);
      });

    return matchesService && matchesCategory;
  });
}, [data?.bookings, filters.category, filters.service, settings?.services]);

  const timeSlots = useMemo(() => {
    if (!data?.dayEnabled) return [];
    return generateTimeSlots(
      data.openingTime ?? 420,
      data.closingTime ?? 1380,
      15 // 15-minute intervals
    );
  }, [data?.dayEnabled, data?.openingTime, data?.closingTime]);

  // Function to get time slot index
  const getTimeSlotIndex = (time: string, slots: string[]) => {
    return slots.findIndex((slot) => slot === time);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Calendar</h1>
          <p className="text-[#6E6E73]">
            Manage your appointments and schedule.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start gap-2 border-[#E0E0E5] bg-white text-[#121212]"
              >
                <CalendarIcon className="h-4 w-4" />
                {format(date, "MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <DayPicker
                animate
                mode="single"
                selected={date}
                onSelect={setDate}
                required
              />
            </PopoverContent>
          </Popover>
          {/* <Select
            value={view}
            onValueChange={(value) => setView(value as "day" | "week")}
          >
            <SelectTrigger className="w-[120px] border-[#E0E0E5] bg-white text-[#121212]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-[#E0E0E5] bg-white text-[#121212]"
            onClick={() => setDate(addDays(date, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-[#E0E0E5] bg-white text-[#121212]"
            onClick={() => setDate(addDays(date, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="text-[#121212]"
            onClick={() => setDate(new Date())}
          >
            Today
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-2 border-[#E0E0E5] bg-white text-[#121212]"
            >
              <Filter className="h-4 w-4" />
              Filter
              {(filters.category.length > 0 || filters.service.length > 0) && (
                <Badge variant="secondary" className="ml-2">
                  {filters.category.length + filters.service.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="text-base font-semibold">
              Filter by Category
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {settings?.categories.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                className="flex items-center gap-3 py-2"
                onSelect={(e) => {
                  e.preventDefault();
                  setFilters((prev) => ({
                    ...prev,
                    category: prev.category.find((s) => s.id === cat.id)
                      ? prev.category.filter((s) => s.id !== cat.id)
                      : [...prev.category, cat],
                  }));
                }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded border">
                  {filters.category.find((s) => s.id === cat.id) && <X className="h-4 w-4" />}
                </div>
                <span className="font-medium">
                  {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-base font-semibold">
              Filter by Service
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {settings?.services.map((service) => (
              <DropdownMenuItem
                key={service.id}
                className="flex items-center gap-3 py-2"
                onSelect={(e) => {
                  e.preventDefault();
                  setFilters((prev) => ({
                    ...prev,
                    service: prev.service.includes(service)
                      ? prev.service.filter((s) => s !== service)
                      : [...prev.service, service],
                  }));
                }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded border">
                  {filters.service.includes(service) && (
                    <X className="h-4 w-4" />
                  )}
                </div>
                <span className="font-medium">{service.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive py-2"
              onSelect={() => setFilters({ category: [], service: [] })}
            >
              Clear all filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

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
        {isLoading ? (
          <div className="flex h-80 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#7B68EE]"></div>
          </div>
        ) : (
          <CardContent className="p-0">
            {view === "day" ? (
              <div className="flex">
                {/* Calendar grid */}
                {data && data.bookings.length > 0 ? (
                  <div className="relative flex-1 overflow-x-auto">
                    {/* Time slots */}
                    <div className="grid grid-cols-1">
                      {timeSlots.map((time, index) => (
                        <div key={time} className='flex' style={{ height: `${heightOfCalendarRow}px` }}>
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
                          data.timezone || "UTC");
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
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger className="absolute top-0 right-0" asChild>
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
                                  <DropdownMenuItem>
                                    View details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="mt-1 md:mt-2 text-sm text-[#121212]">
                              {appointment.service_ids
                                .map((s) => {
                                  const service = settings?.services.find(
                                    (service) =>
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
                ) : (
                  <div className="flex h-40 p-4 sm:p-6 md:p-8 xl:p-10 text-[#6E6E73]">
                    <p className="text-center">No appointments scheduled for today.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="min-w-[800px]">
                {/* Week view header */}
                <div className="grid grid-cols-8 border-b border-[#E0E0E5]">
                  <div
                    className={cn(
                      "h-14 p-2 text-center font-medium",
                      "text-[#121212]"
                    )}
                  ></div>
                  {weekDays.map((day) => (
                    <div
                      key={day.toString()}
                      className={cn(
                        "h-14 p-2 text-center font-medium",
                        isSameDay(day, new Date())
                          ? "bg-[#7B68EE]/10 text-[#7B68EE]"
                          : "text-[#121212]"
                      )}
                    >
                      <div className="text-sm">{format(day, "EEE")}</div>
                      <div className="text-base font-bold">
                        {format(day, "d")}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Week view time slots */}
                <div className="grid grid-cols-8">
                  <div className="border-r border-[#E0E0E5]">
                    {timeSlots.map((time, timeIndex) => (
                      <div
                        id={`${time}`}
                        key={`${time}`}
                        className={cn(
                          "h-12 flex items-center justify-center border-b border-[#E0E0E5] cursor-pointer hover:bg-[#F5F5F7]/50",
                          timeIndex % 2 === 0 ? "bg-white" : "bg-[#F5F5F7]/30"
                        )}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                  {weekDays.map((day, dayIndex) => (
                    <div
                      key={day.toString()}
                      className="border-r border-[#E0E0E5]"
                    >
                      {timeSlots.map((time, timeIndex) => (
                        <div
                          id={`${day}-${time}`}
                          key={`${day}-${time}`}
                          className={cn(
                            "h-12 border-b border-[#E0E0E5] cursor-pointer hover:bg-[#F5F5F7]/50",
                            timeIndex % 2 === 0 ? "bg-white" : "bg-[#F5F5F7]/30"
                          )}
                          onClick={() => {
                            setDate(day);
                          }}
                        ></div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
