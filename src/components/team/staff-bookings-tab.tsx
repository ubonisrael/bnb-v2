"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api-service";

interface BookingCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface BookingInfo {
  id: number;
  uuid: string;
  status: string;
  payment_status: string;
  amount_paid: number;
  amount_due: number;
  Customer: BookingCustomer;
}

interface Service {
  id: number;
  title: string;
  description: string | null;
}

interface BookingListItem {
  id: number;
  start_time: string;
  end_time: string;
  duration: number;
  status: string;
  Booking: BookingInfo;
  Service: Service;
}

interface BookingsListData {
  bookings: BookingListItem[];
  pagination: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

interface BookingsListResponse {
  success: boolean;
  message: string;
  data: BookingsListData;
}

interface StaffBookingsTabProps {
  memberId: number;
}

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
};

export function StaffBookingsTab({ memberId }: StaffBookingsTabProps) {
  const [bookingType, setBookingType] = useState<"upcoming" | "past">("upcoming");
  const [page, setPage] = useState(1);

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["staff-bookings", memberId, bookingType, page],
    queryFn: async () => {
      const response = await api.get<BookingsListResponse>(
        `members/${memberId}/bookings/${bookingType}?page=${page}&size=10`
      );
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={bookingType}
          onValueChange={(value) => {
            setBookingType(value as "upcoming" | "past");
            setPage(1);
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value={bookingType} className="space-y-4 mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            ) : !bookingsData?.bookings || bookingsData.bookings.length === 0 ? (
              <div className="text-center py-8 text-[#6E6E73]">
                No {bookingType} bookings found
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {bookingsData.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#121212]">
                            {booking.Service.title}
                          </h4>
                          <p className="text-sm text-[#6E6E73]">
                            {booking.Booking.Customer.name} • {booking.Booking.Customer.email}
                          </p>
                        </div>
                        <Badge
                          className={
                            statusColors[
                              booking.status as keyof typeof statusColors
                            ] || "bg-gray-100 text-gray-800"
                          }
                        >
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-[#6E6E73]">
                        <span>
                          {new Date(booking.start_time).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(booking.start_time).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}{" "}
                          -{" "}
                          {new Date(booking.end_time).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                        <span>•</span>
                        <span>{booking.duration} min</span>
                      </div>

                      <div className="text-sm">
                        <span className="text-[#6E6E73]">Payment: </span>
                        <span className="font-medium">
                          ${booking.Booking.amount_paid.toFixed(2)}
                        </span>
                        {booking.Booking.amount_due > 0 && (
                          <span className="text-red-600 ml-2">
                            (${booking.Booking.amount_due.toFixed(2)} due)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {bookingsData.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-[#6E6E73]">
                      Page {bookingsData.pagination.page} of{" "}
                      {bookingsData.pagination.totalPages} ({bookingsData.pagination.total}{" "}
                      total)
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === bookingsData.pagination.totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
