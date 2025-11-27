"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  CalendarIcon as CalendarIconComponent,
  PoundSterling,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsResponse, AnalyticsServiceDataResponse, PeriodicStatsResponse, StaffPerformanceResponse, DayBookingStatsResponse } from "@/types/response";
import api from "@/services/api-service";
import { COLORS, getDateRangeString } from "@/lib/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AnalyticsPage() {
  const { settings } = useUserSettings();

  const router = useRouter();

  // Restrict access to admin and owner only
  useEffect(() => {
    if (settings && settings.role !== "owner" && settings.role !== "admin") {
      toast.error("You don't have permission to access this page");
      router.push("/dashboard");
    }
  }, [settings, router]);

  const [period, setPeriod] = useState<"last 7 days" | "month" | "quarter" | "year" | "all time">(
    "last 7 days"
  );
  const [date, setDate] = useState<Date>(new Date());

  const { data: bookingsByDayOfWeek, isLoading: bookingsByDayOfWeekIsLoading } =
    useQuery({
      queryKey: ["bookings-by-day-of-week"],
      queryFn: async () => {
        const response = await api.get<DayBookingStatsResponse>("sp/analytics/day-booking-stats");
        return response.data.stats;
      },
      staleTime: 5 * 60 * 1000,
    });
    
  const { data: servicesData, isLoading: servicesDataIsLoading } = useQuery({
    queryKey: ["services", period],
    queryFn: async () => {
      const response = await api.get<AnalyticsServiceDataResponse>(
        `sp/analytics/services?period=${period}`
      );
      return response.data.serviceCount;
    },
    staleTime: 5 * 60 * 1000,
  });
  
  const { data: staffPerformance, isLoading: staffPerformanceIsLoading } = useQuery({
    queryKey: ["staff-performance", period],
    queryFn: async () => {
      const response = await api.get<StaffPerformanceResponse>(
        `sp/analytics/staff-performance?period=${period}`
      );
      return response.data.staffPerformance;
    },
    staleTime: 5 * 60 * 1000,
  });
  
  const { data: overview, isLoading: overviewIsLoading } = useQuery({
    queryKey: ["overview", period],
    queryFn: async () => {
      const response = await api.get<AnalyticsResponse>(
        `sp/analytics/overview?period=${period}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
  
  const { data: periodStats, isLoading: periodStatsIsLoading } = useQuery({
    queryKey: ["periodic-stats", period],
    queryFn: async () => {
      const response = await api.get<PeriodicStatsResponse>(
        `sp/analytics/periodic-stats?period=${period}`
      );
      return response.data.stats;
    },
    staleTime: 5 * 60 * 1000,
  });

  const avgBookingPerDay = overview ? (overview.bookings.totalBookings / overview.daysSinceCreation) : 0;
  const avgRevenuePerBooking = overview ? (overview.revenue.totalRevenue / overview.bookings.totalBookings) : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Analytics</h1>
          <p className="text-[#6E6E73]">
            Track your business performance and growth.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <Select
            value={period}
            onValueChange={(value: "last 7 days" | "month" | "quarter" | "year" | "all time") =>
              setPeriod(value)
            }
          >
            <SelectTrigger className="w-[180px] self-end md:self-auto border-[#E0E0E5] bg-white text-[#121212]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last 7 days">Last 7 Days</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="all time">All Time</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start gap-2 border-[#E0E0E5] bg-white text-[#121212]"
              >
                <CalendarIconComponent className="h-4 w-4" />
                {getDateRangeString(date, period === "last 7 days" ? "week" : period === "month" ? "month" : "quarter")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {/* <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus /> */}
            </PopoverContent>
          </Popover>

          {/* <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button> */}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {overviewIsLoading ? (
          <>
            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Total Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {overview?.bookings.totalBookings ?? 0}
                </div>
                <div className="mt-1 flex items-center">
                  <div
                    className={`text-sm font-medium ${
                      (overview?.bookings.bookingChange ?? 0) >= 0
                        ? "text-[#4CD964]"
                        : "text-[#FF6B6B]"
                    }`}
                  >
                    {(overview?.bookings.bookingChange ?? 0) >= 0 ? (
                      <TrendingUp className="mr-1 inline-block h-4 w-4" />
                    ) : (
                      <TrendingDown className="mr-1 inline-block h-4 w-4" />
                    )}
                    {Math.abs(overview?.bookings.bookingChange ?? 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground ml-1">
                    vs. previous period
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${(overview?.revenue.totalRevenue ?? 0).toLocaleString()}
                </div>
                <div className="mt-1 flex items-center">
                  <div
                    className={`text-sm font-medium ${
                      (overview?.revenue.revenueChange ?? 0) >= 0
                        ? "text-[#4CD964]"
                        : "text-[#FF6B6B]"
                    }`}
                  >
                    {(overview?.revenue.revenueChange ?? 0) >= 0 ? (
                      <TrendingUp className="mr-1 inline-block h-4 w-4" />
                    ) : (
                      <TrendingDown className="mr-1 inline-block h-4 w-4" />
                    )}
                    {Math.abs(overview?.revenue.revenueChange ?? 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground ml-1">
                    vs. previous period
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  New Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {overview?.clients.totalClients ?? 0}
                </div>
                <div className="mt-1 flex items-center">
                  <div
                    className={`text-sm font-medium ${
                      (overview?.clients.clientChange ?? 0) >= 0
                        ? "text-[#4CD964]"
                        : "text-[#FF6B6B]"
                    }`}
                  >
                    {(overview?.clients.clientChange ?? 0) >= 0 ? (
                      <TrendingUp className="mr-1 inline-block h-4 w-4" />
                    ) : (
                      <TrendingDown className="mr-1 inline-block h-4 w-4" />
                    )}
                    {Math.abs(overview?.clients.clientChange ?? 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground ml-1">
                    vs. previous period
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>
                  Number of appointments booked over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {periodStatsIsLoading ? (
                  <div className="h-[300px] w-full bg-gray-200 rounded animate-pulse" />
                ) : (
                  <ChartContainer
                    config={{
                      bookings: {
                        label: "Bookings",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <LineChart
                      data={periodStats ?? []}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis width={40} tick={{ fontSize: 12 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="black"
                        strokeWidth={2}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Revenue generated over time</CardDescription>
              </CardHeader>
              <CardContent>
                {periodStatsIsLoading ? (
                  <div className="h-[300px] w-full bg-gray-200 rounded animate-pulse" />
                ) : (
                  <ChartContainer
                    config={{
                      revenue: {
                        label: "Revenue",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={periodStats ?? []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="green"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>New Client Acquisition</CardTitle>
                <CardDescription>
                  Number of new clients over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {periodStatsIsLoading ? (
                  <div className="h-[300px] w-full bg-gray-200 rounded animate-pulse" />
                ) : (
                  <ChartContainer
                    config={{
                      newClients: {
                        label: "New Clients",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={periodStats ?? []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="clients"
                          stroke="blue"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Popular Services</CardTitle>
            <CardDescription>
              Distribution of bookings by service type
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servicesDataIsLoading ? (
              <div className="h-[300px] w-full bg-gray-200 rounded animate-pulse" />
            ) : (
              <div className="space-y-4">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={servicesData ?? []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {(servicesData ?? []).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {period !== "all time" && (servicesData ?? []).some(s => s.percentageChange !== undefined) && (
                  <div className="border-t pt-4 space-y-2">
                    <h4 className="text-sm font-semibold text-[#121212]">vs. Previous Period</h4>
                    {(servicesData ?? []).map((service) => (
                      service.percentageChange !== undefined && (
                        <div key={service.serviceId} className="flex items-center justify-between text-sm">
                          <span className="text-[#6E6E73]">{service.name}</span>
                          <span
                            className={`font-medium flex items-center gap-1 ${
                              service.percentageChange >= 0
                                ? "text-[#4CD964]"
                                : "text-[#FF6B6B]"
                            }`}
                          >
                            {service.percentageChange >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(service.percentageChange).toFixed(1)}%
                          </span>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {bookingsByDayOfWeekIsLoading ? (
          <Card className="border-0 shadow-card">
            <CardHeader>
              <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ) : (
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Appointment by Day</CardTitle>
              <CardDescription>
                Number of appointments by day of the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  bookings: {
                    label: "Bookings",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingsByDayOfWeek ?? []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="bookings" fill="var(--color-bookings)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>
              Important metrics for your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <CalendarIconComponent className="mb-2 h-8 w-8 text-[#7B68EE]" />
                <div className="text-sm font-medium text-muted-foreground">
                  Avg. Bookings per Day
                </div>
                <div className="text-2xl font-bold">
                  {avgBookingPerDay.toFixed(2)}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <PoundSterling className="mb-2 h-8 w-8 text-[#7B68EE]" />
                <div className="text-sm font-medium text-muted-foreground">
                  Avg. Revenue per Booking
                </div>
                <div className="text-2xl font-bold">
                  £{avgRevenuePerBooking.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance Section */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle>Staff Performance</CardTitle>
          <CardDescription>
            Top performing team members by revenue and bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {staffPerformanceIsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <div className="space-y-2 text-right">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(staffPerformance ?? []).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No staff performance data available
                </div>
              ) : (
                (staffPerformance ?? []).map((staff) => (
                  <div
                    key={staff.staffId}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[#121212]">
                          {staff.staffName}
                        </h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#7B68EE]/10 text-[#7B68EE] capitalize">
                          {staff.role}
                        </span>
                      </div>
                      <p className="text-sm text-[#6E6E73]">{staff.staffEmail}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold text-lg text-[#4CD964]">
                        ${staff.revenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-[#6E6E73]">
                        {staff.completedBookings} bookings
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
