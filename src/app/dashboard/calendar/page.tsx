"use client"

import dayjs from "dayjs"
import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight, Filter, MoreHorizontal, Plus, X } from "lucide-react"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useUserSettings } from "@/contexts/user-settings-context"
import { Service } from "@/components/onboarding/type"
import api from "@/services/api-service"
import { useQuery } from "@tanstack/react-query"
import { BookingDataResponse } from "@/types/response"

// Mock data for appointments
const appointments = [
  {
    id: 1,
    Customer: {
      name: "Jane Doe",
      email: "janedoe@gmail.com"
    },
    event_date: "2025-10-01T08:00:00Z",
    event_duration: 60,
  },
  {
    id: 2,
    Customer: {
      name: "John Smith",
      email: "janedoe@gmail.com"
    },
    event_date: "2025-10-01T11:00:00Z",
    event_duration: 75,
  },
  {
    id: 3,
    Customer: {
      name: "Jane Smith",
      email: "janes@gmail.com"
    },
    event_date: "2025-10-01T14:00:00Z",
    event_duration: 180,
  },
]

// Time slots for the calendar
const timeSlots = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  ]

// Add filter types
type FilterType = {
  status: string[]
  service: Service[]
}

export default function CalendarPage() {
  const { settings } = useUserSettings()

  const { data: bookings, isLoading } = useQuery<BookingDataResponse>({
    queryKey: ["business"],
    queryFn: () => api.get("/sp/bookings"),
  })
  console.log(bookings)
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week">("day")

  const [filters, setFilters] = useState<FilterType>({
    status: [],
    service: [],
  })

  // Calculate the days to display in week view
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Function to get appointment color
  const getAppointmentColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-[hsl(var(--appointment-blue))]"
      case "pink":
        return "bg-[hsl(var(--appointment-pink))]"
      case "teal":
        return "bg-[hsl(var(--appointment-teal))]"
      case "orange":
        return "bg-[hsl(var(--appointment-orange))]"
      default:
        return "bg-[hsl(var(--appointment-blue))]"
    }
  }

  // Function to get time slot index
  const getTimeSlotIndex = (time: string) => {
    return timeSlots.findIndex((slot) => slot === time)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Calendar</h1>
          <p className="text-[#6E6E73]">Manage your appointments and schedule.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start gap-2 border-[#E0E0E5] bg-white text-[#121212]">
                <CalendarIcon className="h-4 w-4" />
                {format(date, "MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
            </PopoverContent>
          </Popover>
          <Select value={view} onValueChange={(value) => setView(value as "day" | "week")}>
            <SelectTrigger className="w-[120px] border-[#E0E0E5] bg-white text-[#121212]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
            </SelectContent>
          </Select>
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
          <Button variant="ghost" className="text-[#121212]" onClick={() => setDate(new Date())}>
            Today
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 border-[#E0E0E5] bg-white text-[#121212]">
              <Filter className="h-4 w-4" />
              Filter
              {(filters.status.length > 0 || filters.service.length > 0) && (
                <Badge variant="secondary" className="ml-2">
                  {filters.status.length + filters.service.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="text-base font-semibold">Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["confirmed", "pending", "cancelled"].map((status) => (
              <DropdownMenuItem
                key={status}
                className="flex items-center gap-3 py-2"
                onSelect={(e) => {
                  e.preventDefault()
                  setFilters(prev => ({
                    ...prev,
                    status: prev.status.includes(status)
                      ? prev.status.filter(s => s !== status)
                      : [...prev.status, status]
                  }))
                }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded border">
                  {filters.status.includes(status) && <X className="h-4 w-4" />}
                </div>
                <span className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-base font-semibold">Filter by Service</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {settings?.services.map((service) => (
              <DropdownMenuItem
                key={service.id}
                className="flex items-center gap-3 py-2"
                onSelect={(e) => {
                  e.preventDefault()
                  setFilters(prev => ({
                    ...prev,
                    service: prev.service.includes(service)
                      ? prev.service.filter(s => s !== service)
                      : [...prev.service, service]
                  }))
                }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded border">
                  {filters.service.includes(service) && <X className="h-4 w-4" />}
                </div>
                <span className="font-medium">{service.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive py-2"
              onSelect={() => setFilters({ status: [], service: [] })}
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
              : `${format(weekStart, "MMMM d")} - ${format(weekEnd, "MMMM d, yyyy")}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {view === "day" ? (
            <div className="flex">
              {/* Calendar grid */}
              <div className="relative flex-1 overflow-x-auto">
                {/* Time slots */}
                <div className="grid grid-cols-1">
                  {timeSlots.map((time, index) => (
                    <div key={time} className="flex h-12">
                      <div className="w-16 border-r border-[#E0E0E5] bg-[#F5F5F7] py-2 pr-2 text-right text-xs text-[#6E6E73]">
                        {time}
                      </div>
                      <div
                        className={cn(
                          "flex-1 border-b border-[#E0E0E5] cursor-pointer hover:bg-[#F5F5F7]/50",
                          index % 2 === 0 ? "bg-white" : "bg-[#F5F5F7]/30",
                        )}
                      ></div>
                    </div>
                  ))}
                </div>

                {/* Appointments */}
                <div className="absolute left-16 top-0 w-[calc(100%-4rem)]">
                  {appointments.map((appointment) => {
                    const date = dayjs(appointment.event_date)
                    const startTime = date.format("HH:mm")
                    const endTime = date.add(appointment.event_duration, "minutes").format("HH:mm")
                    const startTimeIndex = getTimeSlotIndex(startTime)
                    const duration = appointment.event_duration / 60

                    if (startTimeIndex === -1) return null

                    return (
                      <div
                        key={appointment.id}
                        className={cn("absolute rounded-md p-3 shadow-sm", getAppointmentColor("teal"))}
                        style={{
                          top: `${startTimeIndex * 48}px`,
                          height: `${duration * 48 + 48}px`,
                          left: "0",
                          width: "100%",
                          // transform: `translateY(${startTimeIndex * 48}px)`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-[#121212]">{appointment.Customer?.name}</div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-black/5">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View details</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="text-sm text-[#121212]">{appointment.Customer?.email}</div>
                        <div className="text-xs text-[#6E6E73]">
                          {startTime} - {endTime}
                        </div>
                      </div>
                    )
                  })}
                </div>                
              </div>
            </div>
          ) : (
            <div className="min-w-[800px]">
              {/* Week view header */}
              <div className="grid grid-cols-8 border-b border-[#E0E0E5]">
                <div
                  className={cn(
                    "h-14 p-2 text-center font-medium",
                    "text-[#121212]",
                  )}
                ></div>
                {weekDays.map((day) => (
                  <div
                    key={day.toString()}
                    className={cn(
                      "h-14 p-2 text-center font-medium",
                      isSameDay(day, new Date()) ? "bg-[#7B68EE]/10 text-[#7B68EE]" : "text-[#121212]",
                    )}
                  >
                    <div className="text-sm">{format(day, "EEE")}</div>
                    <div className="text-base font-bold">{format(day, "d")}</div>
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
                        timeIndex % 2 === 0 ? "bg-white" : "bg-[#F5F5F7]/30",
                      )}
                    >{time}</div>
                  ))}
                </div>
                {weekDays.map((day, dayIndex) => (
                  <div key={day.toString()} className="border-r border-[#E0E0E5]">

                    {timeSlots.map((time, timeIndex) => (
                      <div
                        id={`${day}-${time}`}
                        key={`${day}-${time}`}
                        className={cn(
                          "h-12 border-b border-[#E0E0E5] cursor-pointer hover:bg-[#F5F5F7]/50",
                          timeIndex % 2 === 0 ? "bg-white" : "bg-[#F5F5F7]/30",
                        )}
                        onClick={() => {
                          setDate(day)
                        }}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

