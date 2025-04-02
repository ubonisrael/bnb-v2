"use client"

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
import { AppointmentDialog } from "@/components/appointments/appointment-dialog"

// Mock data for staff
const staff = [
  { id: 1, name: "Emma Johnson", role: "Hair Stylist", avatar: "/placeholder.svg" },
  { id: 2, name: "Michael Smith", role: "Barber", avatar: "/placeholder.svg" },
  { id: 3, name: "Sophia Lee", role: "Nail Technician", avatar: "/placeholder.svg" },
  { id: 4, name: "David Wilson", role: "Massage Therapist", avatar: "/placeholder.svg" },
]

// Mock data for appointments
const appointments = [
  {
    id: 1,
    clientName: "Jane Doe",
    service: "Haircut & Styling",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    staffId: 1,
    status: "confirmed",
    color: "blue",
  },
  {
    id: 2,
    clientName: "John Smith",
    service: "Beard Trim",
    startTime: "11:30 AM",
    endTime: "12:00 PM",
    staffId: 2,
    status: "confirmed",
    color: "pink",
  },
  {
    id: 3,
    clientName: "Emily Johnson",
    service: "Manicure",
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    staffId: 3,
    status: "confirmed",
    color: "teal",
  },
  {
    id: 4,
    clientName: "Robert Brown",
    service: "Massage",
    startTime: "2:30 PM",
    endTime: "3:30 PM",
    staffId: 4,
    status: "pending",
    color: "orange",
  },
  {
    id: 5,
    clientName: "Sarah Wilson",
    service: "Hair Coloring",
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    staffId: 1,
    status: "confirmed",
    color: "blue",
  },
]

// Time slots for the calendar
const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
]

// Add filter types
type FilterType = {
  staff: number[]
  status: string[]
  service: string[]
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week">("day")
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{
    date?: Date
    time?: string
    staffId?: number
  }>({})
  const [filters, setFilters] = useState<FilterType>({
    staff: [],
    status: [],
    service: [],
  })

  // Calculate the days to display in week view
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Get unique services from appointments
  const uniqueServices = Array.from(new Set(appointments.map(apt => apt.service)))

  // Filter appointments based on selected filters
  const filteredAppointments = appointments.filter(appointment => {
    const staffMatch = filters.staff.length === 0 || filters.staff.includes(appointment.staffId)
    const statusMatch = filters.status.length === 0 || filters.status.includes(appointment.status)
    const serviceMatch = filters.service.length === 0 || filters.service.includes(appointment.service)
    return staffMatch && statusMatch && serviceMatch
  })

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

  // Function to open appointment dialog with selected slot
  const openNewAppointmentDialog = (staffId?: number, time?: string) => {
    setSelectedSlot({
      date: date,
      time: time ? time.split(" ")[0] : undefined,
      staffId,
    })
    setAppointmentDialogOpen(true)
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
          <Button className="bg-[#7B68EE] text-white hover:bg-[#7B68EE]/90" onClick={() => openNewAppointmentDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
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
              {(filters.staff.length > 0 || filters.status.length > 0 || filters.service.length > 0) && (
                <Badge variant="secondary" className="ml-2">
                  {filters.staff.length + filters.status.length + filters.service.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="text-base font-semibold">Filter by Staff</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {staff.map((person) => (
              <DropdownMenuItem
                key={person.id}
                className="flex items-center gap-3 py-2"
                onSelect={(e) => {
                  e.preventDefault()
                  setFilters(prev => ({
                    ...prev,
                    staff: prev.staff.includes(person.id)
                      ? prev.staff.filter(id => id !== person.id)
                      : [...prev.staff, person.id]
                  }))
                }}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded border">
                  {filters.staff.includes(person.id) && <X className="h-4 w-4" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{person.name}</span>
                  <span className="text-xs text-muted-foreground">{person.role}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
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
            {uniqueServices.map((service) => (
              <DropdownMenuItem
                key={service}
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
                <span className="font-medium">{service}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive py-2"
              onSelect={() => setFilters({ staff: [], status: [], service: [] })}
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
              {/* Staff column */}
              <div className="w-48 flex-shrink-0 border-r border-[#E0E0E5] bg-white">
                <div className="h-12"></div> {/* Empty space to align with time slots */}
                {staff.map((person) => (
                  <div key={person.id} className="flex h-16 items-center gap-3 px-4">
                    <Avatar className="h-10 w-10 border-2 border-white">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback className="bg-[#F5F5F7] text-[#6E6E73]">
                        {person.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <div className="truncate font-medium text-[#121212]">{person.name}</div>
                      <div className="truncate text-xs text-[#6E6E73]">{person.role}</div>
                    </div>
                  </div>
                ))}
              </div>

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
                        onClick={() => openNewAppointmentDialog(undefined, time)}
                      ></div>
                    </div>
                  ))}
                </div>

                {/* Appointments */}
                <div className="absolute left-16 top-0 w-[calc(100%-4rem)]">
                  {filteredAppointments.map((appointment) => {
                    const staffIndex = staff.findIndex((s) => s.id === appointment.staffId)
                    const startTimeIndex = getTimeSlotIndex(appointment.startTime)
                    const endTimeIndex = getTimeSlotIndex(appointment.endTime)
                    const duration = endTimeIndex - startTimeIndex || 1

                    if (startTimeIndex === -1) return null

                    return (
                      <div
                        key={appointment.id}
                        className={cn("absolute rounded-md p-3 shadow-sm", getAppointmentColor(appointment.color))}
                        style={{
                          top: `${startTimeIndex * 48}px`,
                          height: `${duration * 48 - 8}px`,
                          left: "0",
                          width: "100%",
                          transform: `translateY(${staffIndex * 64}px)`,
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-[#121212]">{appointment.clientName}</div>
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
                              <DropdownMenuItem>Edit appointment</DropdownMenuItem>
                              <DropdownMenuItem>Cancel appointment</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="text-sm text-[#121212]">{appointment.service}</div>
                        <div className="text-xs text-[#6E6E73]">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                        {appointment.status === "pending" && (
                          <Badge variant="outline" className="mt-1 border-0 bg-[#FFCC00]/20 text-xs text-[#FFCC00]">
                            Pending
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Staff column time slot overlays for clicking */}
                <div className="absolute left-0 top-0">
                  {staff.map((person, staffIndex) => (
                    <div
                      key={person.id}
                      className="relative"
                      style={{ transform: `translateY(${staffIndex * 64 + 48}px)` }}
                    >
                      {timeSlots.map((time, timeIndex) => (
                        <div
                          key={`${person.id}-${time}`}
                          className="absolute h-12 w-16 cursor-pointer hover:bg-[#F5F5F7]"
                          style={{ top: `${timeIndex * 48}px` }}
                          onClick={() => openNewAppointmentDialog(person.id, time)}
                        ></div>
                      ))}
                    </div>
                  ))}
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
                          openNewAppointmentDialog(undefined, time)
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

      {/* Appointment Dialog */}
      <AppointmentDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        initialDate={selectedSlot.date}
        initialTime={selectedSlot.time}
        initialStaffId={selectedSlot.staffId}
      />
    </div>
  )
}

