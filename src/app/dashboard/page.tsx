"use client"

import { useState } from "react"
import { CalendarDays, Clock, DollarSign, Users, Plus, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppointmentDialog } from "@/components/appointments/appointment-dialog"

export default function DashboardPage() {
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#121212]">Dashboard</h1>
          <p className="text-[#6E6E73]">Welcome back to your beauty business dashboard.</p>
        </div>
        <Button
          className="bg-[#7B68EE] text-white hover:bg-[#7B68EE]/90"
          onClick={() => setAppointmentDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#6E6E73]">Total Revenue</CardDescription>
            <CardTitle className="text-3xl font-bold text-[#121212]">$12,548</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-[#4CD964]">+12.5% from last month</div>
          </CardContent>
          <CardFooter className="border-t border-[#E0E0E5] pt-4">
            <div className="flex items-center text-sm text-[#6E6E73]">
              <DollarSign className="mr-1 h-4 w-4" />
              Financial overview
            </div>
          </CardFooter>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#6E6E73]">Total Appointments</CardDescription>
            <CardTitle className="text-3xl font-bold text-[#121212]">248</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-[#4CD964]">+8.2% from last month</div>
          </CardContent>
          <CardFooter className="border-t border-[#E0E0E5] pt-4">
            <div className="flex items-center text-sm text-[#6E6E73]">
              <CalendarDays className="mr-1 h-4 w-4" />
              Appointment details
            </div>
          </CardFooter>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#6E6E73]">Total Clients</CardDescription>
            <CardTitle className="text-3xl font-bold text-[#121212]">156</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-[#4CD964]">+4.6% from last month</div>
          </CardContent>
          <CardFooter className="border-t border-[#E0E0E5] pt-4">
            <div className="flex items-center text-sm text-[#6E6E73]">
              <Users className="mr-1 h-4 w-4" />
              Client details
            </div>
          </CardFooter>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#6E6E73]">Average Service Time</CardDescription>
            <CardTitle className="text-3xl font-bold text-[#121212]">52 min</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-[#FF6B6B]">-2.3% from last month</div>
          </CardContent>
          <CardFooter className="border-t border-[#E0E0E5] pt-4">
            <div className="flex items-center text-sm text-[#6E6E73]">
              <Clock className="mr-1 h-4 w-4" />
              Time analytics
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-0 shadow-card md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-[#121212]">Today's Appointments</CardTitle>
              <CardDescription className="text-[#6E6E73]">You have 8 appointments today</CardDescription>
            </div>
            <Button variant="outline" className="gap-2 border-[#E0E0E5] bg-white text-[#121212]">
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-[#E0E0E5] p-4 hover:bg-[#F5F5F7]/50 cursor-pointer"
                  onClick={() => setAppointmentDialogOpen(true)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F7]">
                      <Clock className="h-6 w-6 text-[#6E6E73]" />
                    </div>
                    <div>
                      <div className="font-medium text-[#121212]">Jane Doe</div>
                      <div className="text-sm text-[#6E6E73]">Haircut & Styling</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[#121212]">10:00 AM</div>
                    <div className="text-sm text-[#6E6E73]">45 min</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#121212]">Recent Services</CardTitle>
            <CardDescription className="text-[#6E6E73]">New clients this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-lg border border-[#E0E0E5] p-4 hover:bg-[#F5F5F7]/50 cursor-pointer"
                  onClick={() => setAppointmentDialogOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#F5F5F7] flex items-center justify-center">
                      <Users className="h-5 w-5 text-[#6E6E73]" />
                    </div>
                    <div>
                      <div className="font-medium text-[#121212]">Sevice name {i}</div>
                      <div className="text-sm text-[#6E6E73]">First visit: Today</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#E0E0E5] pt-4">
            <Button variant="outline" className="w-full gap-2 border-[#E0E0E5] bg-white text-[#121212]">
              View All Services
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Appointment Dialog */}
      <AppointmentDialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen} />
    </div>
  )
}

