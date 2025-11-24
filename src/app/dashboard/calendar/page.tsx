"use client";

import dayjs from "@/utils/dayjsConfig";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import api from "@/services/api-service";
import { useQuery } from "@tanstack/react-query";
import { StaffBookingsByDateResponse, MembersResponse } from "@/types/response";
import "react-day-picker/style.css";
import { MarkDNSDialog } from "@/components/calendar/mark-dns-dialog";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarControls } from "@/components/calendar/calendar-controls";
import { DayView } from "@/components/calendar/day-view";
import { generateTimeSlots, getTimeSlotIndex, heightOfCalendarRow } from "@/utils/calendar";
import { CancelAppointmentDialog } from "@/components/calendar/cancel-appointment-dialog";
import { RescheduleAppointmentDialog } from "@/components/calendar/reschdedule-appointment-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CalendarPage() {
  const { settings } = useUserSettings();
  const [date, setDate] = useState<Date>(new Date());
  const [appointment, setAppointment] = useState<AppointmentProps | null>(null);
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

  // Fetch bookings based on role
  const { data: bookingsData, isLoading: isBookingsLoading } = useQuery({
    queryKey: ["bookings", date.toISOString(), selectedMemberId, isStaff],
    queryFn: async () => {
      const dateParam = format(date, "yyyy-MM-dd");
      
      if (isStaff) {
        // Staff fetches their own bookings
        const response = await api.get<StaffBookingsByDateResponse>(
          `members/me/booking/date?date=${dateParam}&all=true`
        );
        return response;
      } else if (isAdminOrOwner && selectedMemberId) {
        // Admin/Owner fetches specific member's bookings
        const response = await api.get<StaffBookingsByDateResponse>(
          `members/${selectedMemberId}/bookings/date?date=${dateParam}&all=true`
        );
        return response;
      }
      return null;
    },
    enabled: isStaff || (isAdminOrOwner && !!selectedMemberId),
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

  const [filters, setFilters] = useState<FilterProps>({
    category: [],
    service: [],
  });

  const filteredDayBookings = (() => {
    if (!bookingsData?.success || !bookingsData.data.bookings) return [];

    if (filters.category.length === 0 && filters.service.length === 0) {
      return bookingsData.data.bookings;
    }

    return bookingsData.data.bookings.filter((booking) => {
      const serviceId = booking.Service.id;
      
      // Check if the booking's service matches the selected service filters
      const matchesService =
        filters.service.length === 0 ||
        filters.service.some((filter) => Number(filter.id) === Number(serviceId));

      // Check if the booking's service belongs to selected categories
      const matchesCategory =
        filters.category.length === 0 ||
        (() => {
          const service = settings?.services.find(
            (s) => Number(s.id) === Number(serviceId)
          );
          return filters.category.some(
            (cat) => cat.id === service?.CategoryId
          );
        })();

      return matchesService && matchesCategory;
    });
  })();

  const timeSlots = (() => {

    if (!bookingsData?.data) return [];
    
    const dayOfWeek = format(date, "EEEE").toLowerCase();
    const dayKey = `${dayOfWeek}_enabled` as keyof typeof bookingsData.data;
    const openingKey = `${dayOfWeek}_opening` as keyof typeof bookingsData.data;
    const closingKey = `${dayOfWeek}_closing` as keyof typeof bookingsData.data;
    
    const isDayEnabled = bookingsData?.data[dayKey];
    if (!isDayEnabled) return [];
    
    const openingTime = bookingsData?.data[openingKey] as number;
    const closingTime = bookingsData?.data[closingKey] as number;
    
    return generateTimeSlots(
      openingTime ?? 420,
      closingTime ?? 1380,
      15 // 15-minute intervals
    );
  })();

  // Add this effect to scroll to first appointment
  useEffect(() => {
    if (
      bookingsData?.success &&
      bookingsData.data.bookings &&
      bookingsData.data.bookings.length > 0 &&
      !isBookingsLoading
    ) {
      const firstAppointment = bookingsData.data.bookings[0];
      const appointmentDate = dayjs(firstAppointment.startTime).tz(
        bookingsData.data.timezone || "UTC"
      );
      const startTime = appointmentDate.format("HH:mm");
      const timeSlotIndex = getTimeSlotIndex(startTime, timeSlots);

      if (timeSlotIndex !== -1) {
        const yOffset = timeSlotIndex * heightOfCalendarRow;
        window.scrollTo({
          top: yOffset,
          behavior: "smooth",
        });
      }
    }
  }, [bookingsData, timeSlots, isBookingsLoading]);

  const isDayDataLoading = isBookingsLoading || (isAdminOrOwner && isMembersLoading);

  // Convert bookings data to format expected by DayView
  const dayViewData = bookingsData?.success
    ? {
        bookings: bookingsData.data.bookings.map((booking) => ({
          id: booking.id,
          Customer: booking.Booking.Customer,
          service_ids: [booking.Service.id.toString()],
          event_date: booking.startTime,
          event_time: dayjs(booking.startTime).format("HH:mm"),
          event_duration: booking.duration,
          dns: false,
          amount_paid: booking.Booking.amountPaid,
        })),
        timeSlotDuration: settings?.bookingSettings?.time_slot_duration || 15,
        dayEnabled: true,
        closingTime: timeSlots.length > 0 ? 1380 : 0,
        openingTime: timeSlots.length > 0 ? 420 : 0,
        timezone: bookingsData.data.timezone,
        status: true,
        message: "",
      }
    : null;

  return (
    <>
      {appointment && appointment.type === "dns" && bookingsData && (
        <MarkDNSDialog
          appointment={appointment.data}
          setAppointment={setAppointment}
          date={date.toISOString()}
          tz={bookingsData.data.timezone}
          settings={settings}
        />
      )}
      {appointment && appointment.type === "cancel" && bookingsData && (
        <CancelAppointmentDialog
          appointment={appointment.data}
          setAppointment={setAppointment}
          date={date.toISOString()}
          tz={bookingsData.data.timezone}
          settings={settings}
        />
      )}
      {appointment && appointment.type === "reschedule" && bookingsData && (
        <RescheduleAppointmentDialog
          appointment={appointment.data}
          setAppointment={setAppointment}
          date={date.toISOString()}
          tz={bookingsData.data.timezone}
          settings={settings}
        />
      )}
      <div>
        <CalendarHeader date={date} setDate={setDate} />

        <CalendarControls
          date={date}
          setDate={setDate}
          filters={filters}
          setFilters={setFilters}
          settings={settings}
        />

        {/* Member Selector for Admin/Owner */}
        {isAdminOrOwner && (
          <div className="mb-4">
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
                      <SelectItem
                        key={member.id}
                        value={member.id.toString()}
                      >
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

        <Card className="overflow-hidden border-0 bg-white shadow-card">
          <CardHeader className="border-b border-[#E0E0E5] bg-white pb-4">
            <CardTitle className="text-[#121212]">
              {format(date, "EEEE, MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          {isDayDataLoading ? (
            <div className="flex h-80 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#7B68EE]"></div>
            </div>
          ) : isAdminOrOwner && !selectedMemberId ? (
            <div className="flex h-80 items-center justify-center">
              <p className="text-[#6E6E73]">
                Please select a staff member to view their schedule
              </p>
            </div>
          ) : (
            <CardContent className="w-full p-0">
              <DayView
                data={dayViewData}
                date={date}
                timeSlots={timeSlots}
                filteredBookings={filteredDayBookings}
                setAppointment={setAppointment}
                settings={settings}
              />
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
}
