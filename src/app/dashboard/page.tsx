"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock,
  DollarSign,
  Users,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppointmentDialog } from "@/components/appointments/appointment-dialog";
import { AnalyticsResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-service";
import { useUserSettings } from "@/contexts/user-settings-context";

const CopyTextComponent = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_WEB_URL || 'localhost:3000'}/default/${text}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded shadow-md">
      <p className="text-sm">Booking Link: <span className="rounded px-4 py-1">{`${process.env.NEXT_PUBLIC_WEB_URL || 'localhost:3000'}/default/${text}`}</span></p>
      <button 
        onClick={handleCopy} 
        className="bg-blue-500 text-sm text-white py-1 px-2 rounded hover:bg-blue-700"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};


export default function DashboardPage() {
  const { settings } = useUserSettings();
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);

  const { data: analytics } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: () => {
      console.log("Fetching dashboard analytics");
      console.log('dashboard', api.getCsrfToken())
      // console.log(api.getCsrfToken())
      return api.get<AnalyticsResponse>("/dashboard");
      // return { data: { summary: { total_earnings: 1000, total_bookings: 50, total_unique_customers: 30 } } }
    },
  });

  // console.log(analytics)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#121212]">Dashboard</h1>
          <p className="text-[#6E6E73]">
            Welcome back to your beauty business dashboard.
          </p>
        </div>
        {/* <Button
          className="bg-[#7B68EE] text-white hover:bg-[#7B68EE]/90"
          onClick={() => setAppointmentDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button> */}
      </div>
      
      <CopyTextComponent text={settings?.bookingSettings.url || "bookingurl"} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
        <CardDescription className="text-[#6E6E73]">
          Total Revenue
        </CardDescription>
        <CardTitle className="text-3xl font-bold text-[#121212]">
          ${analytics?.totalRevenue?.totalRevenue}
        </CardTitle>
          </CardHeader>
          <CardContent>
        <div className={`text-sm font-medium ${
          analytics?.totalRevenue?.percentageChange > 0 
            ? 'text-[#4CD964]' 
            : analytics?.totalRevenue?.percentageChange < 0 
          ? 'text-red-500' 
          : 'text-[#121212]'
        }`}>
          {analytics?.totalRevenue?.percentageChange > 0 ? '+' : ''}{analytics?.totalRevenue?.percentageChange}% from last month
        </div>
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
        <CardDescription className="text-[#6E6E73]">
          Total Appointments
        </CardDescription>
        <CardTitle className="text-3xl font-bold text-[#121212]">
          {analytics?.totalAppointments?.totalApps}
        </CardTitle>
          </CardHeader>
          <CardContent>
        <div className={`text-sm font-medium ${
          analytics?.totalAppointments?.percentageChange > 0 
            ? 'text-[#4CD964]' 
            : analytics?.totalAppointments?.percentageChange < 0 
          ? 'text-red-500' 
          : 'text-[#121212]'
        }`}>
          {analytics?.totalAppointments?.percentageChange > 0 ? '+' : ''}{analytics?.totalAppointments?.percentageChange}% from last month
        </div>
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
        <CardDescription className="text-[#6E6E73]">
          Total Clients
        </CardDescription>
        <CardTitle className="text-3xl font-bold text-[#121212]">
          {analytics?.totalClients?.totalClients}
        </CardTitle>
          </CardHeader>
          <CardContent>
        <div className={`text-sm font-medium ${
          analytics?.totalClients?.percentageChange > 0 
            ? 'text-[#4CD964]' 
            : analytics?.totalClients?.percentageChange < 0 
          ? 'text-red-500' 
          : 'text-[#121212]'
        }`}>
          {analytics?.totalClients?.percentageChange > 0 ? '+' : ''}{analytics?.totalClients?.percentageChange}% from last month
        </div>
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
        <CardDescription className="text-[#6E6E73]">
          Average Service Time
        </CardDescription>
        <CardTitle className="text-3xl font-bold text-[#121212]">
          {analytics?.avgServiceTime?.avg} min
        </CardTitle>
          </CardHeader>
          <CardContent>
        <div className={`text-sm font-medium ${
          analytics?.avgServiceTime?.percentageChange > 0 
            ? 'text-[#4CD964]' 
            : analytics?.avgServiceTime?.percentageChange < 0 
          ? 'text-red-500' 
          : 'text-[#121212]'
        }`}>
          {analytics?.avgServiceTime?.percentageChange > 0 ? '+' : ''}{analytics?.avgServiceTime?.percentageChange}% from last month
        </div>
          </CardContent>
          <CardFooter className="border-t border-[#E0E0E5] pt-4">
        <div className="flex items-center text-sm text-[#6E6E73]">
          <Clock className="mr-1 h-4 w-4" />
          Time analytics
        </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid">
        <Card className="border-0 shadow-card md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-[#121212]">
                Today's Appointments
              </CardTitle>
              <CardDescription className="text-[#6E6E73]">
                You have {analytics?.todaysBookings.length} appointments today
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="gap-2 border-[#E0E0E5] bg-white text-[#121212]"
            >
              View All
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics && analytics.todaysBookings.length ? (
                analytics.todaysBookings.map((b: any) => {
                  const date = new Date(b.event_date);
                  const hr = date.getUTCHours();
                  const min = date.getUTCMinutes();
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg border border-[#E0E0E5] p-4 hover:bg-[#F5F5F7]/50 cursor-pointer"
                      // onClick={() => setAppointmentDialogOpen(true)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F7]">
                          <Clock className="h-6 w-6 text-[#6E6E73]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#121212]">
                            {b.Customer.name}
                          </div>
                          <div className="text-sm text-[#121212]">
                            {b.Customer.email}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[#121212]">{`${hr
                          .toString()
                          .padStart(2, "0")}:${min
                          .toString()
                          .padStart(2, "0")}`}</div>
                        <div className="text-sm text-[#6E6E73]">
                          {b.event_duration} min
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-[#6E6E73]">
                  No appointments scheduled for today.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Dialog */}
      <AppointmentDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
      />
    </div>
  );
}
