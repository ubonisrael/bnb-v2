import dayjs from "@/utils/dayjsConfig";
import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Users,
  Mail,
  Phone,
  Calendar,
  BarChart3,
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

export const StaffDashboard = () => {
  const { data: settings } = useCompanyDetails();
  const today = dayjs().format("YYYY-MM-DD");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ["staff-dashboard-overview"],
    queryFn: async () => {
      const response = await api.get<StaffDashboardOverviewResponse>(
        "members/my-dashboard/overview"
      );
      return response;
    },
  });

  const { data: todayBookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["staff-today-bookings", today, currentPage, pageSize],
    queryFn: async () => {
      const response = await api.get<StaffBookingsByDateResponse>(
        `members/my-bookings/date?date=${today}&page=${currentPage}&size=${pageSize}`
      );
      return response;
    },
  });

  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "partial":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#121212]">Dashboard</h1>
          <p className="text-[#6E6E73]">Welcome back, {settings?.name}!</p>
        </div>
      </div>

      <CopyTextComponent text={settings?.bookingUrl || "bookingurl"} />

      {/* Overview Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {overviewLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
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
        ) : overview?.success ? (
          <>
            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#6E6E73]">
                  Appointments Today
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-[#121212]">
                  {overview.data.appointmentsToday}
                </CardTitle>
              </CardHeader>
              <CardFooter className="border-t border-[#E0E0E5] pt-4">
                <div className="flex items-center text-sm text-[#6E6E73]">
                  <Calendar className="mr-1 h-4 w-4" />
                  Today's schedule
                </div>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#6E6E73]">
                  This Week
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-[#121212]">
                  {overview.data.appointmentsThisWeek}
                </CardTitle>
              </CardHeader>
              <CardFooter className="border-t border-[#E0E0E5] pt-4">
                <div className="flex items-center text-sm text-[#6E6E73]">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  Weekly bookings
                </div>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#6E6E73]">
                  Today's Occupancy
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-[#121212]">
                  {overview.data.todayOccupancy}%
                </CardTitle>
              </CardHeader>
              <CardFooter className="border-t border-[#E0E0E5] pt-4">
                <div className="flex items-center text-sm text-[#6E6E73]">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  Time utilization
                </div>
              </CardFooter>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="text-[#6E6E73]">
                  New Customers
                </CardDescription>
                <CardTitle className="text-3xl font-bold text-[#121212]">
                  {overview.data.newCustomers}
                </CardTitle>
              </CardHeader>
              <CardFooter className="border-t border-[#E0E0E5] pt-4">
                <div className="flex items-center text-sm text-[#6E6E73]">
                  <Users className="mr-1 h-4 w-4" />
                  Last 30 days
                </div>
              </CardFooter>
            </Card>
          </>
        ) : (
          <div className="col-span-full text-center text-[#6E6E73] py-8">
            Unable to load overview. Please try again.
          </div>
        )}
      </div>

      {/* Today's Appointments */}
      <Card className="border-0 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-[#121212]">
              Today's Appointments
            </CardTitle>
            <CardDescription className="text-[#6E6E73]">
              {bookingsLoading ? (
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              ) : todayBookings?.success ? (
                `You have ${todayBookings.data.pagination ? todayBookings.data.pagination.total: todayBookings.data.total} appointments today`
              ) : (
                "Your schedule for today"
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
              className="text-sm border border-[#E0E0E5] rounded px-2 py-1 bg-white text-[#121212]"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookingsLoading ? (
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
            ) : todayBookings?.success && todayBookings.data.bookings.length > 0 ? (
              todayBookings.data.bookings.map((booking) => {
                const startTime = dayjs(booking.startTime).tz(
                  todayBookings.data.timezone || "UTC"
                );
                return (
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
                          {booking.Booking.Customer.name}
                        </div>
                        <div className="text-sm text-[#6E6E73]">
                          {booking.Service.title} • £{booking.Service.price}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-xs text-[#6E6E73] flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {booking.Booking.Customer.email}
                          </div>
                          {booking.Booking.Customer.phone && (
                            <div className="text-xs text-[#6E6E73] flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {booking.Booking.Customer.phone}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={getStatusBadgeStyles(booking.Booking.status)}
                          >
                            {booking.Booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-[#121212]">
                        {startTime.format("HH:mm")}
                      </div>
                      <div className="text-sm text-[#6E6E73]">
                        {booking.duration} min
                      </div>
                      <div className="text-xs text-[#6E6E73] mt-1">
                        £{booking.Booking.amountPaid} / £
                        {booking.Booking.amountDue + booking.Booking.amountPaid}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-[#6E6E73] py-8">
                No appointments scheduled for today.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {todayBookings?.success && todayBookings.data.pagination && todayBookings.data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E0E0E5]">
              <div className="text-sm text-[#6E6E73]">
                Showing{" "}
                {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(
                  currentPage * pageSize,
                  todayBookings.data.pagination.total
                )}{" "}
                of {todayBookings.data.pagination.total} appointments
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || bookingsLoading}
                  className="border-[#E0E0E5] bg-white text-[#121212] disabled:opacity-50"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {/* Show page numbers */}
                  {Array.from(
                    { length: Math.min(5, todayBookings.data.pagination.totalPages) },
                    (_, i) => {
                      const totalPages = todayBookings.data.pagination ? todayBookings.data.pagination.totalPages : 1;
                      let pageNum;
                      
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={bookingsLoading}
                          className={
                            currentPage === pageNum
                              ? "bg-[#121212] text-white"
                              : "border-[#E0E0E5] bg-white text-[#121212]"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(todayBookings.data.pagination ? todayBookings.data.pagination.totalPages : 1, prev + 1)
                    )
                  }
                  disabled={
                    currentPage === todayBookings.data.pagination.totalPages ||
                    bookingsLoading
                  }
                  className="border-[#E0E0E5] bg-white text-[#121212] disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
