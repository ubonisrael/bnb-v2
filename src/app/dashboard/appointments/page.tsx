"use client"

import { useState } from "react"
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Clock, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { AppointmentDialog } from "@/components/appointments/appointment-dialog"

// Mock data for appointments
const appointments = [
  {
    id: 1,
    clientName: "Jane Doe",
    clientEmail: "jane@example.com",
    service: "Haircut & Styling",
    date: "2025-03-22",
    startTime: "10:00",
    endTime: "11:00",
    staffName: "Emma Johnson",
    staffId: 1,
    status: "confirmed",
    color: "blue",
  },
  {
    id: 2,
    clientName: "John Smith",
    clientEmail: "john@example.com",
    service: "Beard Trim",
    date: "2025-03-22",
    startTime: "11:30",
    endTime: "12:00",
    staffName: "Michael Smith",
    staffId: 2,
    status: "confirmed",
    color: "pink",
  },
  {
    id: 3,
    clientName: "Emily Johnson",
    clientEmail: "emily@example.com",
    service: "Manicure",
    date: "2025-03-22",
    startTime: "13:00",
    endTime: "14:00",
    staffName: "Sophia Lee",
    staffId: 3,
    status: "confirmed",
    color: "teal",
  },
  {
    id: 4,
    clientName: "Robert Brown",
    clientEmail: "robert@example.com",
    service: "Massage",
    date: "2025-03-22",
    startTime: "14:30",
    endTime: "15:30",
    staffName: "David Wilson",
    staffId: 4,
    status: "pending",
    color: "orange",
  },
  {
    id: 5,
    clientName: "Sarah Wilson",
    clientEmail: "sarah@example.com",
    service: "Hair Coloring",
    date: "2025-03-23",
    startTime: "09:00",
    endTime: "11:00",
    staffName: "Emma Johnson",
    staffId: 1,
    status: "confirmed",
    color: "blue",
  },
  {
    id: 6,
    clientName: "Michael Johnson",
    clientEmail: "michael@example.com",
    service: "Haircut",
    date: "2025-03-23",
    startTime: "11:30",
    endTime: "12:30",
    staffName: "Michael Smith",
    staffId: 2,
    status: "confirmed",
    color: "pink",
  },
  {
    id: 7,
    clientName: "Jessica Lee",
    clientEmail: "jessica@example.com",
    service: "Facial",
    date: "2025-03-24",
    startTime: "10:00",
    endTime: "11:00",
    staffName: "Sophia Lee",
    staffId: 3,
    status: "confirmed",
    color: "teal",
  },
]

// Time slots for the calendar
const timeSlots = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

// Staff members
const staff = [
  { id: 1, name: "Emma Johnson", role: "Hair Stylist", avatar: "/placeholder.svg" },
  { id: 2, name: "Michael Smith", role: "Barber", avatar: "/placeholder.svg" },
  { id: 3, name: "Sophia Lee", role: "Nail Technician", avatar: "/placeholder.svg" },
  { id: 4, name: "David Wilson", role: "Massage Therapist", avatar: "/placeholder.svg" },
]

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("day")
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{
    date?: Date
    time?: string
    staffId?: number
  }>({})

  // Calculate the days to display in week view
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Function to get appointment color
  const getAppointmentColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-[#5AC8FA]/20 border-[#5AC8FA]/50 text-[#121212]"
      case "pink":
        return "bg-[#FF6B6B]/20 border-[#FF6B6B]/50 text-[#121212]"
      case "teal":
        return "bg-[#4CD964]/20 border-[#4CD964]/50 text-[#121212]"
      case "orange":
        return "bg-[#FFCC00]/20 border-[#FFCC00]/50 text-[#121212]"
      default:
        return "bg-[#5AC8FA]/20 border-[#5AC8FA]/50 text-[#121212]"
    }
  }

  // Function to get time slot index
  const getTimeSlotIndex = (time: string) => {
    return timeSlots.findIndex((slot) => slot === time)
  }

  // Filter appointments for the selected date
  const getAppointmentsForDate = (selectedDate: Date) => {
    const dateString = format(selectedDate, "yyyy-MM-dd")
    return appointments.filter((appointment) => appointment.date === dateString)
  }

  // Get appointments for the current view
  const currentAppointments =
    view === "day"
      ? getAppointmentsForDate(date)
      : appointments.filter((appointment) => {
          const appointmentDate = parseISO(appointment.date)
          return appointmentDate >= weekStart && appointmentDate <= weekEnd
        })

  // Function to open appointment dialog with selected slot
  const openNewAppointmentDialog = (staffId?: number, time?: string) => {
    setSelectedSlot({
      date: date,
      time: time,
      staffId,
    })
    setAppointmentDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Appointments</h1>
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
              {/* <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus /> */}
            </PopoverContent>
          </Popover>
          <Select value={view} onValueChange={(value) => setView(value as "day" | "week" | "month")}>
            <SelectTrigger className="w-[120px] border-[#E0E0E5] bg-white text-[#121212]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="month">Month View</SelectItem>
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
            onClick={() => setDate(subDays(date, view === "day" ? 1 : 7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-[#E0E0E5] bg-white text-[#121212]"
            onClick={() => setDate(addDays(date, view === "day" ? 1 : 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-[#121212]" onClick={() => setDate(new Date())}>
            Today
          </Button>
        </div>
        <Button variant="outline" className="gap-2 border-[#E0E0E5] bg-white text-[#121212]">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader className="border-b border-[#E0E0E5] bg-white pb-4">
              <CardTitle className="text-[#121212]">
                {view === "day"
                  ? format(date, "EEEE, MMMM d, yyyy")
                  : view === "week"
                    ? `${format(weekStart, "MMMM d")} - ${format(weekEnd, "MMMM d, yyyy")}`
                    : format(date, "MMMM yyyy")}
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
                      {currentAppointments.map((appointment) => {
                        const staffIndex = staff.findIndex((s) => s.id === appointment.staffId)
                        const startTimeIndex = getTimeSlotIndex(appointment.startTime)
                        const endTimeIndex = getTimeSlotIndex(appointment.endTime)
                        const duration = endTimeIndex - startTimeIndex || 1

                        if (startTimeIndex === -1) return null

                        return (
                          <div
                            key={appointment.id}
                            className={cn(
                              "absolute rounded-md border p-3 shadow-sm",
                              getAppointmentColor(appointment.color),
                            )}
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
                              {appointment.status === "pending" && (
                                <Badge
                                  variant="outline"
                                  className="bg-[#FFCC00]/20 text-xs text-[#FFCC00] border-[#FFCC00]/50"
                                >
                                  Pending
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-[#121212]">{appointment.service}</div>
                            <div className="text-xs text-[#6E6E73]">
                              {appointment.startTime} - {appointment.endTime}
                            </div>
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
              ) : view === "week" ? (
                <div className="min-w-[800px]">
                  {/* Week view header */}
                  <div className="grid grid-cols-7 border-b border-[#E0E0E5]">
                    {weekDays.map((day) => (
                      <div
                        key={day.toString()}
                        className={cn(
                          "h-12 p-2 text-center font-medium",
                          isSameDay(day, new Date()) ? "bg-[#7B68EE]/10 text-[#7B68EE]" : "text-[#121212]",
                        )}
                      >
                        <div>{format(day, "EEE")}</div>
                        <div className="text-sm">{format(day, "d")}</div>
                      </div>
                    ))}
                  </div>

                  {/* Week view time slots */}
                  <div className="grid grid-cols-7">
                    {weekDays.map((day, dayIndex) => (
                      <div key={day.toString()} className="border-r border-[#E0E0E5]">
                        {timeSlots.map((time, timeIndex) => (
                          <div
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
              ) : (
                <div className="p-4">
                  <div className="text-center text-[#6E6E73]">Month view coming soon</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader className="border-b border-[#E0E0E5] bg-white pb-4">
              <CardTitle className="text-[#121212]">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {currentAppointments.length === 0 ? (
                <div className="py-8 text-center text-[#6E6E73]">No appointments scheduled for this period</div>
              ) : (
                <div className="space-y-4">
                  {currentAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={cn(
                        "flex flex-col rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-[#F5F5F7]/30",
                        appointment.status === "pending" ? "border-[#FFCC00]/50" : "border-[#E0E0E5]",
                      )}
                      onClick={() => {
                        const appointmentDate = parseISO(appointment.date)
                        setDate(appointmentDate)
                        openNewAppointmentDialog(appointment.staffId, appointment.startTime)
                      }}
                    >
                      <div className="mb-4 flex items-center gap-4 sm:mb-0">
                        <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md bg-[#F5F5F7]">
                          <span className="text-xs font-medium text-[#6E6E73]">
                            {format(parseISO(appointment.date), "MMM")}
                          </span>
                          <span className="text-lg font-bold text-[#121212]">
                            {format(parseISO(appointment.date), "dd")}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-[#121212]">{appointment.service}</div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center text-sm text-[#6E6E73]">
                              <Clock className="mr-1 h-4 w-4" />
                              {appointment.startTime} - {appointment.endTime}
                            </div>
                            <div className="flex items-center text-sm text-[#6E6E73]">
                              <User className="mr-1 h-4 w-4" />
                              {appointment.staffName}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start gap-2 sm:items-end">
                        <div className="flex items-center">
                          <Avatar className="mr-2 h-8 w-8">
                            <AvatarFallback>
                              {appointment.clientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm font-medium">{appointment.clientName}</div>
                        </div>
                        {appointment.status === "pending" && (
                          <Badge
                            variant="outline"
                            className="bg-[#FFCC00]/20 text-xs text-[#FFCC00] border-[#FFCC00]/50"
                          >
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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

