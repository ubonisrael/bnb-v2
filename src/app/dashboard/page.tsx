"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  DollarSign,
  Users,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
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
    navigator.clipboard
      .writeText(
        `${process.env.NEXT_PUBLIC_WEB_URL || "localhost:3000"}/${text}`
      )
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      });
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded shadow-md">
      <p className="text-sm">
        Booking Link:{" "}
        <span className="rounded px-4 py-1">{`${
          process.env.NEXT_PUBLIC_WEB_URL || "localhost:3000"
        }/${text}`}</span>
      </p>
      <button
        onClick={handleCopy}
        className="bg-blue-500 text-sm text-white py-1 px-2 rounded hover:bg-blue-700"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
};

export default function DashboardPage() {
  const { settings } = useUserSettings();
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: () => {
      return api.get<AnalyticsResponse>("sp/dashboard");
      // return { data: { summary: { total_earnings: 1000, total_bookings: 50, total_unique_customers: 30 } } }
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#121212]">Dashboard</h1>
          <p className="text-[#6E6E73]">Welcome back to your dashboard.</p>
        </div>
      </div>

      <CopyTextComponent text={settings?.bookingSettings.url || "bookingurl"} />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          // Loading skeletons
          <>
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-card">
            <CardHeader className="pb-2">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-8 w-20 animate-pulse rounded bg-gray-200" />
            </CardHeader>
            <CardContent>
          <div className="mt-1 flex items-center">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            <div className="ml-1 h-4 w-24 animate-pulse rounded bg-gray-200" />
          </div>
            </CardContent>
            <CardFooter className="border-t border-[#E0E0E5] pt-4">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
            </CardFooter>
          </Card>
        ))}
          </>
        ) : (
          <>
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-[#6E6E73]">
          Total Revenue
            </CardDescription>
            <CardTitle className="text-3xl font-bold text-[#121212]">
          ${analytics?.revenue?.totalRevenue}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1 flex items-center">
          <div
            className={`text-sm font-medium ${
              analytics?.revenue.revenueChange >= 0
            ? "text-[#4CD964]"
            : "text-[#FF6B6B]"
            }`}
          >
            {analytics?.revenue.revenueChange >= 0 ? (
              <TrendingUp className="mr-1 inline-block h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 inline-block h-4 w-4" />
            )}
            {Math.abs(analytics?.revenue.revenueChange)}%
          </div>
          <div className="text-sm text-muted-foreground ml-1">
            from last month
          </div>
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
          {analytics?.bookings?.totalBookings}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1 flex items-center">
          <div
            className={`text-sm font-medium ${
              analytics?.bookings?.bookingChange >= 0
            ? "text-[#4CD964]"
            : "text-[#FF6B6B]"
            }`}
          >
            {analytics?.bookings?.bookingChange >= 0 ? (
              <TrendingUp className="mr-1 inline-block h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 inline-block h-4 w-4" />
            )}
            {Math.abs(analytics?.bookings?.bookingChange)}%
          </div>
          <div className="text-sm text-muted-foreground ml-1">
            from last month
          </div>
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
          {analytics?.clients?.totalClients}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1 flex items-center">
          <div
            className={`text-sm font-medium ${
              analytics?.clients?.clientChange >= 0
            ? "text-[#4CD964]"
            : "text-[#FF6B6B]"
            }`}
          >
            {analytics?.clients?.clientChange >= 0 ? (
              <TrendingUp className="mr-1 inline-block h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 inline-block h-4 w-4" />
            )}
            {Math.abs(analytics?.clients?.clientChange)}%
          </div>
          <div className="text-sm text-muted-foreground ml-1">
            from last month
          </div>
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
          {analytics?.service?.averageServiceTime} min
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-1 flex items-center">
          <div
            className={`text-sm font-medium ${
              analytics?.service?.serviceChange >= 0
            ? "text-[#4CD964]"
            : "text-[#FF6B6B]"
            }`}
          >
            {analytics?.service?.serviceChange >= 0 ? (
              <TrendingUp className="mr-1 inline-block h-4 w-4" />
            ) : (
              <TrendingDown className="mr-1 inline-block h-4 w-4" />
            )}
            {Math.abs(analytics?.service?.serviceChange)}%
          </div>
          <div className="text-sm text-muted-foreground ml-1">
            from last month
          </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#E0E0E5] pt-4">
            <div className="flex items-center text-sm text-[#6E6E73]">
          <Clock className="mr-1 h-4 w-4" />
          Time analytics
            </div>
          </CardFooter>
        </Card>
          </>
        )}
      </div>

      <div className="grid">
        <Card className="border-0 shadow-card md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-[#121212]">
                Today's Appointments
              </CardTitle>
              <CardDescription className="text-[#6E6E73]">
                {isLoading ? (
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                ) : (
                  `You have ${analytics?.todaysBookings.length} appointments today`
                )}
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
              {isLoading ? (
                // Loading skeleton
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-[#E0E0E5] p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
                      <div>
                        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                        <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                      <div className="mt-2 h-3 w-12 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))
              ) : analytics && analytics.todaysBookings.length ? (
                analytics.todaysBookings.map((b: any) => {
                  const date = new Date(b.event_date);
                  const hr = date.getUTCHours();
                  const min = date.getUTCMinutes();
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg border border-[#E0E0E5] p-4 hover:bg-[#F5F5F7]/50 cursor-pointer"
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
