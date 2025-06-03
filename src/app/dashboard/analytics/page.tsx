"use client";

import { useState } from "react";
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
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  CalendarIcon as CalendarIconComponent,
  DollarSign,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
} from "date-fns";

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
import { AnalyticsResponse, AnalyticsServiceDataResponse, PeriodicStatsResponse } from "@/types/response";
import api from "@/services/api-service";
import { useUserSettings } from "@/contexts/user-settings-context";

const COLORS = [
  "#7B68EE",
  "#5AC8FA",
  "#4CD964",
  "#FFCC00",
  "#FF6B6B",
  "#E0E0E5",
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter">(
    "week"
  );
  const [date, setDate] = useState<Date>(new Date());
  const { settings } = useUserSettings()

  const { data: bookingsByDayOfWeek, isLoading: bookingsByDayOfWeekIsLoading } =
    useQuery({
      queryKey: ["bookings-by-day-of-week"],
      queryFn: () => {
        return api.get<AnalyticsResponse>("sp/analytics/day-booking-stats");
      },
    });
    
  const { data: servicesData, isLoading: servicesDataIsLoading } = useQuery({
    queryKey: [settings?.services.map((service) => service.id).join(",")],
    queryFn: () => {
      return api.get<AnalyticsServiceDataResponse>("sp/analytics/service-booking-stats");
    },
  });
  
  const { data: overview, isLoading: overviewIsLoading } = useQuery({
    queryKey: [`overview-${dateRange}`],
    queryFn: () => {
      return api.get<AnalyticsResponse>(
        `sp/analytics/overview?period=${dateRange}`
      );
    },
  });
  const { data: periodStats, isLoading: periodStatsIsLoading } = useQuery({
    queryKey: [`period-${dateRange}`],
    queryFn: () => {
      return api.get<PeriodicStatsResponse>(
        `sp/analytics/periodic-stats?period=${dateRange}`
      );
    },
  });

  const avgRevenuePerBooking = (overview?.bookings.totalBookings / overview?.daysSinceCreation) || 0
  const avgBookingPerDay = (overview?.revenue.totalRevenue / overview?.bookings.totalBookings) || 0
  
  // Get the date range string
  const getDateRangeString = () => {
    switch (dateRange) {
      case "week":
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
        return `${format(weekStart, "MMM d, yyyy")} - ${format(
          weekEnd,
          "MMM d, yyyy"
        )}`;
      case "month":
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        return `${format(monthStart, "MMM d, yyyy")} - ${format(
          monthEnd,
          "MMM d, yyyy"
        )}`;
      case "quarter":
        const quarterStart = startOfQuarter(date);
        const quarterEnd = endOfQuarter(date);
        return `${format(quarterStart, "MMM d, yyyy")} - ${format(
          quarterEnd,
          "MMM d, yyyy"
        )}`;
      default:
        return "";
    }
  };

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
            value={dateRange}
            onValueChange={(value: "week" | "month" | "quarter") =>
              setDateRange(value)
            }
          >
            <SelectTrigger className="w-[150px] self-end md:self-auto border-[#E0E0E5] bg-white text-[#121212]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Weekly</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="quarter">Quarterly</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start gap-2 border-[#E0E0E5] bg-white text-[#121212]"
              >
                <CalendarIconComponent className="h-4 w-4" />
                {getDateRangeString()}
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
                  {overview?.bookings.totalBookings}
                </div>
                <div className="mt-1 flex items-center">
                  <div
                    className={`text-sm font-medium ${
                      overview?.bookings.bookingChange >= 0
                        ? "text-[#4CD964]"
                        : "text-[#FF6B6B]"
                    }`}
                  >
                    {overview?.bookings.bookingChange >= 0 ? (
                      <TrendingUp className="mr-1 inline-block h-4 w-4" />
                    ) : (
                      <TrendingDown className="mr-1 inline-block h-4 w-4" />
                    )}
                    {Math.abs(overview?.bookings.bookingChange)}%
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
                  ${overview?.revenue.totalRevenue.toLocaleString()}
                </div>
                <div className="mt-1 flex items-center">
                  <div
                    className={`text-sm font-medium ${
                      overview?.revenue.revenueChange >= 0
                        ? "text-[#4CD964]"
                        : "text-[#FF6B6B]"
                    }`}
                  >
                    {overview?.revenue.revenueChange >= 0 ? (
                      <TrendingUp className="mr-1 inline-block h-4 w-4" />
                    ) : (
                      <TrendingDown className="mr-1 inline-block h-4 w-4" />
                    )}
                    {Math.abs(overview?.revenue.revenueChange)}%
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
                  {overview?.clients.totalClients}
                </div>
                <div className="mt-1 flex items-center">
                  <div
                    className={`text-sm font-medium ${
                      overview?.clients.clientChange >= 0
                        ? "text-[#4CD964]"
                        : "text-[#FF6B6B]"
                    }`}
                  >
                    {overview?.clients.clientChange >= 0 ? (
                      <TrendingUp className="mr-1 inline-block h-4 w-4" />
                    ) : (
                      <TrendingDown className="mr-1 inline-block h-4 w-4" />
                    )}
                    {Math.abs(overview?.clients.clientChange)}%
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
                      data={periodStats?.data}
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
                      <LineChart data={periodStats?.data}>
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
                      <LineChart data={periodStats?.data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="newClients"
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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={servicesData?.data}
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
                    {servicesData?.data.map((entry, index) => (
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
              <CardTitle>Booking by Day</CardTitle>
              <CardDescription>
                Number of bookings by day of the week
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
                  <BarChart data={bookingsByDayOfWeek?.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
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
                  {avgRevenuePerBooking.toFixed(2)}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <DollarSign className="mb-2 h-8 w-8 text-[#7B68EE]" />
                <div className="text-sm font-medium text-muted-foreground">
                  Avg. Revenue per Booking
                </div>
                <div className="text-2xl font-bold">
                  ${avgBookingPerDay.toFixed(2)}
                </div>
              </div>

              {/* <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <Users className="mb-2 h-8 w-8 text-[#7B68EE]" />
                <div className="text-sm font-medium text-muted-foreground">
                  Client Retention Rate
                </div>
                <div className="text-2xl font-bold">78%</div>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
