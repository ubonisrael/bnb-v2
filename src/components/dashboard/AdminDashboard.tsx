import {
  CalendarDays,
  Clock,
  Users,
  ArrowUpRight,
  PoundSterling,
  UserCheck,
  BarChart3,
  CheckCircle,
  AlertCircle,
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
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-service";
import { CopyTextComponent } from "../CopyText";
import { useCompanyDetails } from "@/hooks/use-company-details";

export const AdminDashboard = () => {
  const { data: settings } = useCompanyDetails();

  const { data: keyMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["dashboard-key-metrics"],
    queryFn: async () => {
      const response = await api.get<KeyMetricsResponse>(
        "members/dashboard/key-metrics"
      );
      return response;
    },
  });

  const { data: todayOverview, isLoading: overviewLoading } = useQuery({
    queryKey: ["dashboard-today-overview"],
    queryFn: async () => {
      const response = await api.get<TodayOverviewResponse>(
        "members/dashboard/today-overview"
      );
      return response;
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

      <CopyTextComponent text={settings?.bookingUrl || "bookingurl"} />

      {/* Key Business Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {metricsLoading ? (
          <>
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border-0 shadow-card">
                <CardHeader className="pb-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-8 w-20 animate-pulse rounded bg-gray-200" />
                </CardHeader>
                <CardFooter className="border-t border-[#E0E0E5] pt-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                </CardFooter>
              </Card>
            ))}
          </>
        ) : keyMetrics?.success ? (
          <>
            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#6E6E73]">
                  Total Revenue
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-[#121212]">
                  £{keyMetrics.data.totalRevenue.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardFooter className="border-t border-[#E0E0E5] pt-4">
                <div className="flex items-center text-sm text-[#6E6E73]">
                  <PoundSterling className="mr-1 h-4 w-4" />
                  This {keyMetrics.data.period}
                </div>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#6E6E73]">
                  Total Bookings
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-[#121212]">
                  {keyMetrics.data.totalBookings}
                </CardTitle>
              </CardHeader>
              <CardFooter className="border-t border-[#E0E0E5] pt-4">
                <div className="flex items-center text-sm text-[#6E6E73]">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  This {keyMetrics.data.period}
                </div>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#6E6E73]">
                  Active Clients
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-[#121212]">
                  {keyMetrics.data.activeClients}
                </CardTitle>
              </CardHeader>
              <CardFooter className="border-t border-[#E0E0E5] pt-4">
                <div className="flex items-center text-sm text-[#6E6E73]">
                  <Users className="mr-1 h-4 w-4" />
                  This {keyMetrics.data.period}
                </div>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#6E6E73]">
                  Staff With Bookings
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-[#121212]">
                  {keyMetrics.data.staffWithBookings}
                </CardTitle>
              </CardHeader>
              <CardFooter className="border-t border-[#E0E0E5] pt-4">
                <div className="flex items-center text-sm text-[#6E6E73]">
                  <UserCheck className="mr-1 h-4 w-4" />
                  Active staff
                </div>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#6E6E73]">
                  Utilization
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-[#121212]">
                  {keyMetrics.data.utilization}%
                </CardTitle>
              </CardHeader>
              <CardFooter className="border-t border-[#E0E0E5] pt-4">
                <div className="flex items-center text-sm text-[#6E6E73]">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  Capacity used
                </div>
              </CardFooter>
            </Card>
          </>
        ) : (
          <div className="col-span-full text-center text-[#6E6E73] py-8">
            Unable to load metrics. Please try again.
          </div>
        )}
      </div>

      {/* Today's Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary Cards */}
        {overviewLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-0 shadow-card">
                <CardHeader>
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-8 w-16 animate-pulse rounded bg-gray-200" />
                </CardHeader>
              </Card>
            ))}
          </>
        ) : todayOverview?.success ? (
          <>
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardDescription className="text-[#6E6E73]">
                  Total Appointments Today
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-[#121212]">
                  {todayOverview.data.summary.totalAppointments}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {todayOverview.data.summary.confirmed} Confirmed
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {todayOverview.data.summary.pending} Pending
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </>
        ) : null}
      </div>

      {/* Staff Breakdown and Upcoming Bookings */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Staff Breakdown */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#121212]">
              Staff Overview
            </CardTitle>
            <CardDescription className="text-[#6E6E73]">
              Today's staff schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overviewLoading ? (
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
                  </div>
                ))
              ) : todayOverview?.success &&
                todayOverview.data.staffBreakdown.length > 0 ? (
                todayOverview.data.staffBreakdown.map((staff) => (
                  <div
                    key={staff.staffId}
                    className="flex items-center justify-between rounded-lg border border-[#E0E0E5] p-4 hover:bg-[#F5F5F7]/50"
                  >
                    <div className="flex items-center gap-4">
                      {staff.staffAvatar ? (
                        <img
                          src={staff.staffAvatar}
                          alt={staff.staffName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F7]">
                          <UserCheck className="h-6 w-6 text-[#6E6E73]" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-[#121212]">
                          {staff.staffName}
                        </div>
                        <div className="text-sm text-[#6E6E73]">
                          {staff.appointmentsCount} appointments • Starts at{" "}
                          {staff.firstAppointmentTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {staff.statusBreakdown.confirmed}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                      >
                        {staff.statusBreakdown.pending}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-[#6E6E73] py-4">
                  No staff scheduled for today.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <Card className="border-0 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-[#121212]">
                Upcoming Appointments
              </CardTitle>
              <CardDescription className="text-[#6E6E73]">
                {overviewLoading ? (
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                ) : todayOverview?.success ? (
                  `${todayOverview.data.upcomingBookings.length} appointments upcoming`
                ) : (
                  "Today's schedule"
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
              {overviewLoading ? (
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
              ) : todayOverview?.success &&
                todayOverview.data.upcomingBookings.length > 0 ? (
                todayOverview.data.upcomingBookings
                  .slice(0, 5)
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between rounded-lg border border-[#E0E0E5] p-4 hover:bg-[#F5F5F7]/50 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F7]">
                          <Clock className="h-6 w-6 text-[#6E6E73]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#121212]">
                            {booking.customer.name}
                          </div>
                          <div className="text-sm text-[#6E6E73]">
                            {booking.service.name} • {booking.staff.name}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={
                                booking.status === "confirmed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : booking.status === "pending"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {booking.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                booking.paymentStatus === "paid"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-orange-50 text-orange-700 border-orange-200"
                              }
                            >
                              {booking.paymentStatus}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[#121212]">
                          {booking.startTime}
                        </div>
                        <div className="text-sm text-[#6E6E73]">
                          {booking.duration} min
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-[#6E6E73] py-4">
                  No upcoming appointments for today.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
