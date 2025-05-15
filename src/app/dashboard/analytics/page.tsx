"use client"

import { useState } from "react"
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
} from "recharts"
import {
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  CalendarIcon as CalendarIconComponent,
  DollarSign,
} from "lucide-react"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for analytics
const weeklyData = [
  { name: "Mon", bookings: 12, revenue: 450, newClients: 3 },
  { name: "Tue", bookings: 19, revenue: 680, newClients: 5 },
  { name: "Wed", bookings: 15, revenue: 550, newClients: 2 },
  { name: "Thu", bookings: 22, revenue: 810, newClients: 7 },
  { name: "Fri", bookings: 28, revenue: 1050, newClients: 4 },
  { name: "Sat", bookings: 35, revenue: 1280, newClients: 8 },
  { name: "Sun", bookings: 8, revenue: 320, newClients: 1 },
]

const monthlyData = [
  { name: "Week 1", bookings: 85, revenue: 3200, newClients: 18 },
  { name: "Week 2", bookings: 92, revenue: 3450, newClients: 15 },
  { name: "Week 3", bookings: 78, revenue: 2900, newClients: 12 },
  { name: "Week 4", bookings: 95, revenue: 3600, newClients: 20 },
]

const quarterlyData = [
  { name: "Jan", bookings: 320, revenue: 12000, newClients: 45 },
  { name: "Feb", bookings: 290, revenue: 10800, newClients: 38 },
  { name: "Mar", bookings: 350, revenue: 13200, newClients: 52 },
  { name: "Apr", bookings: 380, revenue: 14500, newClients: 60 },
  { name: "May", bookings: 400, revenue: 15200, newClients: 55 },
  { name: "Jun", bookings: 420, revenue: 16000, newClients: 65 },
  { name: "Jul", bookings: 450, revenue: 17200, newClients: 70 },
  { name: "Aug", bookings: 480, revenue: 18500, newClients: 75 },
  { name: "Sep", bookings: 460, revenue: 17800, newClients: 68 },
  { name: "Oct", bookings: 440, revenue: 16900, newClients: 62 },
  { name: "Nov", bookings: 410, revenue: 15600, newClients: 58 },
  { name: "Dec", bookings: 390, revenue: 14800, newClients: 50 },
]

const serviceData = [
  { name: "Haircut", value: 35 },
  { name: "Coloring", value: 25 },
  { name: "Styling", value: 15 },
  { name: "Manicure", value: 10 },
  { name: "Facial", value: 8 },
  { name: "Massage", value: 7 },
]

const COLORS = ["#7B68EE", "#5AC8FA", "#4CD964", "#FFCC00", "#FF6B6B", "#E0E0E5"]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter">("week")
  const [date, setDate] = useState<Date>(new Date())

  // Get the appropriate data based on the selected date range
  const getData = () => {
    switch (dateRange) {
      case "week":
        return weeklyData
      case "month":
        return monthlyData
      case "quarter":
        return quarterlyData
      default:
        return weeklyData
    }
  }

  // Get the date range string
  const getDateRangeString = () => {
    switch (dateRange) {
      case "week":
        const weekStart = startOfWeek(date, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
        return `${format(weekStart, "MMM d, yyyy")} - ${format(weekEnd, "MMM d, yyyy")}`
      case "month":
        const monthStart = startOfMonth(date)
        const monthEnd = endOfMonth(date)
        return `${format(monthStart, "MMM d, yyyy")} - ${format(monthEnd, "MMM d, yyyy")}`
      case "quarter":
        const quarterStart = startOfQuarter(date)
        const quarterEnd = endOfQuarter(date)
        return `${format(quarterStart, "MMM d, yyyy")} - ${format(quarterEnd, "MMM d, yyyy")}`
      default:
        return ""
    }
  }

  // Calculate totals and changes
  const currentData = getData()
  const totalBookings = currentData.reduce((sum, item) => sum + item.bookings, 0)
  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0)
  const totalNewClients = currentData.reduce((sum, item) => sum + item.newClients, 0)

  // Calculate changes (mock data)
  const bookingChange = dateRange === "week" ? 12.5 : dateRange === "month" ? 8.3 : 15.2
  const revenueChange = dateRange === "week" ? 9.8 : dateRange === "month" ? 7.2 : 11.5
  const clientChange = dateRange === "week" ? 15.3 : dateRange === "month" ? 10.1 : 18.7

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Analytics</h1>
          <p className="text-[#6E6E73]">Track your business performance and growth.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={dateRange} onValueChange={(value: "week" | "month" | "quarter") => setDateRange(value)}>
            <SelectTrigger className="w-[150px] border-[#E0E0E5] bg-white text-[#121212]">
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
              <Button variant="outline" className="justify-start gap-2 border-[#E0E0E5] bg-white text-[#121212]">
                <CalendarIconComponent className="h-4 w-4" />
                {getDateRangeString()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              {/* <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus /> */}
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookings}</div>
            <div className="mt-1 flex items-center">
              <div className={`text-sm font-medium ${bookingChange >= 0 ? "text-[#4CD964]" : "text-[#FF6B6B]"}`}>
                {bookingChange >= 0 ? (
                  <TrendingUp className="mr-1 inline-block h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 inline-block h-4 w-4" />
                )}
                {Math.abs(bookingChange)}%
              </div>
              <div className="text-sm text-muted-foreground ml-1">vs. previous period</div>
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
            <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="mt-1 flex items-center">
              <div className={`text-sm font-medium ${revenueChange >= 0 ? "text-[#4CD964]" : "text-[#FF6B6B]"}`}>
                {revenueChange >= 0 ? (
                  <TrendingUp className="mr-1 inline-block h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 inline-block h-4 w-4" />
                )}
                {Math.abs(revenueChange)}%
              </div>
              <div className="text-sm text-muted-foreground ml-1">vs. previous period</div>
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
            <div className="text-3xl font-bold">{totalNewClients}</div>
            <div className="mt-1 flex items-center">
              <div className={`text-sm font-medium ${clientChange >= 0 ? "text-[#4CD964]" : "text-[#FF6B6B]"}`}>
                {clientChange >= 0 ? (
                  <TrendingUp className="mr-1 inline-block h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 inline-block h-4 w-4" />
                )}
                {Math.abs(clientChange)}%
              </div>
              <div className="text-sm text-muted-foreground ml-1">vs. previous period</div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <CardDescription>Number of appointments booked over time</CardDescription>
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
                  <LineChart data={getData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bookings"
                      stroke="var(--color-bookings)"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Popular Services</CardTitle>
                <CardDescription>Distribution of bookings by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Booking by Day</CardTitle>
                <CardDescription>Number of bookings by day of the week</CardDescription>
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
                    <BarChart data={weeklyData}>
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
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Revenue generated over time</CardDescription>
            </CardHeader>
            <CardContent>
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
                  <LineChart data={getData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>New Client Acquisition</CardTitle>
              <CardDescription>Number of new clients over time</CardDescription>
            </CardHeader>
            <CardContent>
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
                  <LineChart data={getData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="newClients"
                      stroke="var(--color-newClients)"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-card md:col-span-2">
          <CardHeader>
            <CardTitle>Key Performance Indicators</CardTitle>
            <CardDescription>Important metrics for your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <CalendarIconComponent className="mb-2 h-8 w-8 text-[#7B68EE]" />
                <div className="text-sm font-medium text-muted-foreground">Avg. Bookings per Day</div>
                <div className="text-2xl font-bold">{(totalBookings / 7).toFixed(1)}</div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <DollarSign className="mb-2 h-8 w-8 text-[#7B68EE]" />
                <div className="text-sm font-medium text-muted-foreground">Avg. Revenue per Booking</div>
                <div className="text-2xl font-bold">${(totalRevenue / totalBookings).toFixed(2)}</div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                <Users className="mb-2 h-8 w-8 text-[#7B68EE]" />
                <div className="text-sm font-medium text-muted-foreground">Client Retention Rate</div>
                <div className="text-2xl font-bold">78%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Top Staff Performance</CardTitle>
            <CardDescription>Staff with the most bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Emma Johnson", bookings: 45, revenue: 1680 },
                { name: "Michael Smith", bookings: 38, revenue: 1420 },
                { name: "Sophia Lee", bookings: 32, revenue: 1280 },
                { name: "David Wilson", bookings: 28, revenue: 1050 },
              ].map((staff, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F7]">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-xs text-muted-foreground">{staff.bookings} bookings</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">${staff.revenue}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

