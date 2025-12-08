import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "../ui/skeleton";
import { formatDate, getStatusBadgeVariant } from "@/lib/helpers";
import { Badge } from "../ui/badge";

interface ServiceAppointmentsListProps {
  appointments: ServiceAppointment[];
  appointmentsType: "upcoming" | "past";
  appointmentsPage: number;
  setAppointmentsType: (type: "upcoming" | "past") => void;
  setAppointmentsPage: React.Dispatch<React.SetStateAction<number>>;
  isLoadingAppointments: boolean;
  pagination: any;
}

export default function ServiceAppointmentsList({
  appointments,
  appointmentsType,
  appointmentsPage,
  setAppointmentsType,
  setAppointmentsPage,
  isLoadingAppointments,
  pagination,
}: ServiceAppointmentsListProps) {
  return (
    <TabsContent value="appointments" className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Appointments</h3>
        <Select
          value={appointmentsType}
          onValueChange={(value: any) => setAppointmentsType(value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoadingAppointments ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : appointments &&
        appointments.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">
                          {appointment.customer?.name || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.customer?.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.customer?.phone ?? "N/A"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(appointment.start_time)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {appointment.staff?.user?.full_name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(appointment.booking.payment_status)}
                      >
                        {appointment.booking?.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      £{appointment.price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {pagination &&
            pagination.totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setAppointmentsPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          appointmentsPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {[
                      ...Array(
                        Math.min(5, pagination.totalPages)
                      ),
                    ].map((_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setAppointmentsPage(page)}
                            isActive={appointmentsPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setAppointmentsPage((p) =>
                            Math.min(
                              pagination.totalPages,
                              p + 1
                            )
                          )
                        }
                        className={
                          appointmentsPage ===
                          pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No {appointmentsType} appointments found
          </p>
        </div>
      )}
    </TabsContent>
  );
}
