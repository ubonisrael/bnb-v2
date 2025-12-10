"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-service";
import { AppointmentList } from "@/components/appointments/appointment-list";
import { useCompanyDetails } from "@/hooks/use-company-details";

export default function AppointmentsPage() {
  const { data: settings } = useCompanyDetails();
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
            ? `members/my-bookings/upcoming?${params}`
            : `members/my-bookings/past?${params}`;
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
                <AppointmentList
                  bookings={bookingsData.data.bookings}
                  timezone={settings?.timezone}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalPages={bookingsData.data.pagination.totalPages}
                  totalItems={bookingsData.data.pagination.total}
                  onPageChange={setCurrentPage}
                />
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
                <AppointmentList
                  bookings={bookingsData.data.bookings}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalPages={bookingsData.data.pagination.totalPages}
                  totalItems={bookingsData.data.pagination.total}
                  onPageChange={setCurrentPage}
                  isPastAppointments
                />
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

