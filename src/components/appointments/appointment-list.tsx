import { Clock, Mail, Phone } from "lucide-react";
import dayjs from "@/utils/dayjsConfig";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getPaymentBadgeStyles, getStatusBadgeStyles } from "@/lib/helpers";
import { BookingListItem } from "@/types/response";

interface AppointmentListProps {
  bookings: BookingListItem[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isPastAppointments?: boolean;
}

export function AppointmentList({
  bookings,
  currentPage,
  pageSize,
  totalPages,
  totalItems,
  onPageChange,
  isPastAppointments = false,
}: AppointmentListProps) {
  return (
    <div className="space-y-4">
      {bookings.map((booking) => {
        const startTime = dayjs(booking.start_time);
        return (
          <div
            key={booking.id}
            className={`flex items-center justify-between rounded-lg border border-[#E0E0E5] p-4 hover:bg-[#F5F5F7]/50 cursor-pointer ${
              isPastAppointments ? "opacity-75" : ""
            }`}
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
                  {booking.Service.title} • £
                  {booking.Booking.amount_paid + booking.Booking.amount_due}
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
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#E0E0E5]">
          <div className="text-sm text-[#6E6E73]">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
            appointments
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(Math.max(1, currentPage - 1));
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(pageNum);
                      }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(Math.min(totalPages, currentPage + 1));
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
