"use client";

import { useState, useEffect } from "react";
import { Search, Clock, Mail, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "@/utils/dayjsConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-service";
import { BookingsListResponse, MembersResponse } from "@/types/response";

export default function AppointmentsPage() {
  const { settings } = useUserSettings();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const isAdminOrOwner = settings?.role === "owner" || settings?.role === "admin";
  const isStaff = settings?.role === "staff";

  // Fetch members list for admin/owner
  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await api.get<MembersResponse>("members");
      return response;
    },
    enabled: isAdminOrOwner,
  });

  // Set default selected member to the first staff member for admin/owner
  useEffect(() => {
    if (isAdminOrOwner && membersData?.success && !selectedMemberId) {
      const staffMembers = membersData.data.members.filter(
        (member) => member.status === "accepted" && member.role === "staff"
      );
      if (staffMembers.length > 0) {
        setSelectedMemberId(staffMembers[0].id.toString());
      }
    }
  }, [membersData, isAdminOrOwner, selectedMemberId]);

  // Fetch bookings based on role and tab
  const { data: bookingsData, isLoading: isBookingsLoading } = useQuery({
    queryKey: [
      "bookings-list",
      activeTab,
      currentPage,
      pageSize,
      searchQuery,
      selectedMemberId,
      isStaff,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
      });

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (isStaff) {
        // Staff fetches their own bookings
        const endpoint =
          activeTab === "upcoming"
            ? `members/me/bookings/upcoming?${params}`
            : `members/me/bookings/past?${params}`;
        const response = await api.get<BookingsListResponse>(endpoint);
        return response;
      } else if (isAdminOrOwner && selectedMemberId) {
        // Admin/Owner fetches specific member's bookings
        const endpoint =
          activeTab === "upcoming"
            ? `members/${selectedMemberId}/bookings/upcoming?${params}`
            : `members/${selectedMemberId}/bookings/past?${params}`;
        const response = await api.get<BookingsListResponse>(endpoint);
        return response;
      }
      return null;
    },
    enabled: isStaff || (isAdminOrOwner && !!selectedMemberId),
  });

  // Reset to page 1 when changing tabs or search
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, selectedMemberId]);

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

  const isLoading = isBookingsLoading || (isAdminOrOwner && isMembersLoading);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Appointments</h1>
          <p className="text-[#6E6E73]">Manage your appointments and schedule.</p>
        </div>
      </div>

      {/* Member Selector for Admin/Owner */}
      {isAdminOrOwner && (
        <div className="flex items-center gap-4">
          <Select
            value={selectedMemberId || ""}
            onValueChange={setSelectedMemberId}
          >
            <SelectTrigger className="w-[300px] border-[#E0E0E5] bg-white text-[#121212]">
              <SelectValue placeholder="Select a staff member" />
            </SelectTrigger>
            <SelectContent>
              {isMembersLoading ? (
                <SelectItem value="loading" disabled>
                  Loading members...
                </SelectItem>
              ) : membersData?.success ? (
                membersData.data.members
                  .filter((member) => member.status === "accepted")
                  .map((member) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.User.full_name} ({member.User.email})
                    </SelectItem>
                  ))
              ) : (
                <SelectItem value="no-staff" disabled>
                  No staff members found
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E73]" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#E0E0E5] bg-white"
          />
        </div>
        <Select value={pageSize.toString()} onValueChange={(val) => setPageSize(Number(val))}>
          <SelectTrigger className="w-[140px] border-[#E0E0E5] bg-white text-[#121212]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "upcoming" | "past")} className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader className="border-b border-[#E0E0E5] bg-white pb-4">
              <CardTitle className="text-[#121212]">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex h-60 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#7B68EE]"></div>
                </div>
              ) : isAdminOrOwner && !selectedMemberId ? (
                <div className="flex h-60 items-center justify-center">
                  <p className="text-[#6E6E73]">
                    Please select a staff member to view their appointments
                  </p>
                </div>
              ) : bookingsData?.success && bookingsData.data.bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookingsData.data.bookings.map((booking) => {
                    const startTime = dayjs(booking.start_time);
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border border-[#E0E0E5] p-4 hover:bg-[#F5F5F7]/50 cursor-pointer"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F7]">
                            <Clock className="h-6 w-6 text-[#6E6E73]" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-[#121212]">
                              {booking.Booking.Customer.name}
                            </div>
                            <div className="text-sm text-[#6E6E73]">
                              {booking.Service.title} • £{booking.Booking.amount_paid + booking.Booking.amount_due}
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
                                className={getStatusBadgeStyles(booking.status)}
                              >
                                {booking.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getPaymentBadgeStyles(
                                  booking.Booking.payment_status
                                )}
                              >
                                {booking.Booking.payment_status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[#121212]">
                            {startTime.format("MMM DD, YYYY")}
                          </div>
                          <div className="text-sm text-[#6E6E73]">
                            {startTime.format("HH:mm")} • {booking.duration} min
                          </div>
                          <div className="text-xs text-[#6E6E73] mt-1">
                            £{booking.Booking.amount_paid} / £
                            {booking.Booking.amount_paid + booking.Booking.amount_due}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination */}
                  {bookingsData.data.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E0E0E5]">
                      <div className="text-sm text-[#6E6E73]">
                        Showing{" "}
                        {(currentPage - 1) * pageSize + 1} to{" "}
                        {Math.min(
                          currentPage * pageSize,
                          bookingsData.data.pagination.total
                        )}{" "}
                        of {bookingsData.data.pagination.total} appointments
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="border-[#E0E0E5] bg-white text-[#121212] disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, bookingsData.data.pagination.totalPages) },
                            (_, i) => {
                              const totalPages = bookingsData.data.pagination.totalPages;
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
                              Math.min(bookingsData.data.pagination.totalPages, prev + 1)
                            )
                          }
                          disabled={
                            currentPage === bookingsData.data.pagination.totalPages
                          }
                          className="border-[#E0E0E5] bg-white text-[#121212] disabled:opacity-50"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-60 items-center justify-center">
                  <p className="text-[#6E6E73]">No upcoming appointments found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <Card className="border-0 shadow-card">
            <CardHeader className="border-b border-[#E0E0E5] bg-white pb-4">
              <CardTitle className="text-[#121212]">Past Appointments</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="flex h-60 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#7B68EE]"></div>
                </div>
              ) : isAdminOrOwner && !selectedMemberId ? (
                <div className="flex h-60 items-center justify-center">
                  <p className="text-[#6E6E73]">
                    Please select a staff member to view their appointments
                  </p>
                </div>
              ) : bookingsData?.success && bookingsData.data.bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookingsData.data.bookings.map((booking) => {
                    const startTime = dayjs(booking.start_time);
                    return (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between rounded-lg border border-[#E0E0E5] p-4 hover:bg-[#F5F5F7]/50 cursor-pointer opacity-75"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F7]">
                            <Clock className="h-6 w-6 text-[#6E6E73]" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-[#121212]">
                              {booking.Booking.Customer.name}
                            </div>
                            <div className="text-sm text-[#6E6E73]">
                              {booking.Service.title} • £{booking.Booking.amount_paid + booking.Booking.amount_due}
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
                                className={getStatusBadgeStyles(booking.status)}
                              >
                                {booking.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={getPaymentBadgeStyles(
                                  booking.Booking.payment_status
                                )}
                              >
                                {booking.Booking.payment_status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-[#121212]">
                            {startTime.format("MMM DD, YYYY")}
                          </div>
                          <div className="text-sm text-[#6E6E73]">
                            {startTime.format("HH:mm")} • {booking.duration} min
                          </div>
                          <div className="text-xs text-[#6E6E73] mt-1">
                            £{booking.Booking.amount_paid} / £
                            {booking.Booking.amount_paid + booking.Booking.amount_due}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Pagination */}
                  {bookingsData.data.pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E0E0E5]">
                      <div className="text-sm text-[#6E6E73]">
                        Showing{" "}
                        {(currentPage - 1) * pageSize + 1} to{" "}
                        {Math.min(
                          currentPage * pageSize,
                          bookingsData.data.pagination.total
                        )}{" "}
                        of {bookingsData.data.pagination.total} appointments
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="border-[#E0E0E5] bg-white text-[#121212] disabled:opacity-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, bookingsData.data.pagination.totalPages) },
                            (_, i) => {
                              const totalPages = bookingsData.data.pagination.totalPages;
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
                              Math.min(bookingsData.data.pagination.totalPages, prev + 1)
                            )
                          }
                          disabled={
                            currentPage === bookingsData.data.pagination.totalPages
                          }
                          className="border-[#E0E0E5] bg-white text-[#121212] disabled:opacity-50"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-60 items-center justify-center">
                  <p className="text-[#6E6E73]">No past appointments found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

