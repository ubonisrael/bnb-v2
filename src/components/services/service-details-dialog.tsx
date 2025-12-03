"use client";

import { useState } from "react";
import { Edit, Trash2, Clock, PoundSterling, Calendar, Users, TrendingUp, TrendingDown, Mail, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDate, getAvailableDays, getDurationLabel, getInitials, getStatusBadgeVariant } from "@/lib/helpers";

export function ServiceDetailsDialog({
  open,
  onOpenChange,
  serviceId,
  onEdit,
  onDelete,
}: ServiceDetailsDialogProps) {
  const [analyticsPeriod, setAnalyticsPeriod] = useState<"last7Days" | "last2Weeks" | "lastMonth" | "lastQuarter" | "lastYear" | "allTime">("last7Days");
  const [appointmentsType, setAppointmentsType] = useState<"upcoming" | "past">("upcoming");
  const [clientsPage, setClientsPage] = useState(1);
  const [appointmentsPage, setAppointmentsPage] = useState(1);
  const pageSize = 10;

  // Fetch service details with analytics
  const { data: detailsData, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["service-details", serviceId],
    queryFn: async () => {
      if (!serviceId) return null;
      const response = await api.get<{ success: boolean; data: ServiceDetailsData; message: string }>(
        `sp/services/${serviceId}/details`
      );
      return response.data;
    },
    enabled: open && !!serviceId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch service clients
  const { data: clientsData, isLoading: isLoadingClients } = useQuery({
    queryKey: ["service-clients", serviceId, clientsPage],
    queryFn: async () => {
      if (!serviceId) return null;
      const response = await api.get<{
        success: boolean;
        data: { clients: ServiceClient[]; pagination: any };
        message: string;
      }>(`sp/services/${serviceId}/clients?page=${clientsPage}&size=${pageSize}`);
      return response.data;
    },
    enabled: open && !!serviceId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch service appointments
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["service-appointments", serviceId, appointmentsType, appointmentsPage],
    queryFn: async () => {
      if (!serviceId) return null;
      const response = await api.get<{
        success: boolean;
        data: { appointments: ServiceAppointment[]; pagination: any };
        message: string;
      }>(`sp/services/${serviceId}/appointments?type=${appointmentsType}&page=${appointmentsPage}&size=${pageSize}`);
      return response.data;
    },
    enabled: open && !!serviceId,
    staleTime: 5 * 60 * 1000,
  });

  if (!serviceId) return null;

  const service = detailsData?.service;
  const analytics = detailsData?.analytics;
  const selectedPeriodData = analytics?.bookings[analyticsPeriod];

  const availableDays = getAvailableDays(service);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isLoadingDetails ? <Skeleton className="h-8 w-64" /> : service?.name}
          </DialogTitle>
          <DialogDescription>
            {isLoadingDetails ? <Skeleton className="h-4 w-48" /> : `View ${service?.name} details, appointments, and clients`}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            {isLoadingDetails ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : service ? (
              <>
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{service.category?.name || "No Category"}</Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                  </div>

                  <Separator />

                  {/* Price and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <PoundSterling className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-lg font-semibold">£{service.fullPrice.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-lg font-semibold">{getDurationLabel(service.duration)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Available Days */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-semibold">Available Days</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableDays.map((day) => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Analytics */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold">Analytics</h4>
                      <Select value={analyticsPeriod} onValueChange={(value: any) => setAnalyticsPeriod(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last7Days">Last 7 Days</SelectItem>
                          <SelectItem value="last2Weeks">Last 2 Weeks</SelectItem>
                          <SelectItem value="lastMonth">Last Month</SelectItem>
                          <SelectItem value="lastQuarter">Last Quarter</SelectItem>
                          <SelectItem value="lastYear">Last Year</SelectItem>
                          <SelectItem value="allTime">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedPeriodData?.count || 0}</div>
                          {analyticsPeriod !== "allTime" && selectedPeriodData && "percentageChange" in selectedPeriodData && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              {selectedPeriodData.percentageChange >= 0 ? (
                                <>
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                  <span className="text-green-500">+{selectedPeriodData.percentageChange.toFixed(1)}%</span>
                                </>
                              ) : (
                                <>
                                  <TrendingDown className="h-3 w-3 text-red-500" />
                                  <span className="text-red-500">{selectedPeriodData.percentageChange.toFixed(1)}%</span>
                                </>
                              )}
                            </p>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">£{analytics?.totalRevenue.toFixed(2) || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">Total earned</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Clients</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{analytics?.uniqueClients || 0}</div>
                          <p className="text-xs text-muted-foreground mt-1">Unique customers</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <Separator />

                  {/* Assigned Staff */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-semibold">Assigned Staff</h4>
                      <Badge variant="secondary" className="text-xs">
                        {service.staff?.length || 0}
                      </Badge>
                    </div>
                    {service.staff && service.staff.length > 0 ? (
                      <div className="space-y-2">
                        {service.staff.map((staffMember) => (
                          <div
                            key={staffMember.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs">
                                {staffMember.user ? getInitials(staffMember.user.full_name) : "??"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {staffMember.user?.full_name || "Unknown"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {staffMember.user?.email || "No email"}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs capitalize">
                              {staffMember.role}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No staff assigned</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Failed to load service details</p>
              </div>
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Appointments</h3>
              <Select value={appointmentsType} onValueChange={(value: any) => setAppointmentsType(value)}>
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
            ) : appointmentsData?.appointments && appointmentsData.appointments.length > 0 ? (
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
                      {appointmentsData.appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{appointment.customer?.full_name || "N/A"}</p>
                              <p className="text-xs text-muted-foreground">{appointment.customer?.email}</p>
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
                            <Badge variant={getStatusBadgeVariant(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">£{appointment.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {appointmentsData.pagination && appointmentsData.pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setAppointmentsPage((p) => Math.max(1, p - 1))}
                            className={appointmentsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {[...Array(Math.min(5, appointmentsData.pagination.totalPages))].map((_, i) => {
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
                            onClick={() => setAppointmentsPage((p) => Math.min(appointmentsData.pagination.totalPages, p + 1))}
                            className={appointmentsPage === appointmentsData.pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No {appointmentsType} appointments found</p>
              </div>
            )}
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Clients</h3>

            {isLoadingClients ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : clientsData?.clients && clientsData.clients.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-right">Bookings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientsData.clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {getInitials(client.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{client.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{client.email}</span>
                              </div>
                              {client.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-muted-foreground">{client.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{client.bookingCount}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {clientsData.pagination && clientsData.pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setClientsPage((p) => Math.max(1, p - 1))}
                            className={clientsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {[...Array(Math.min(5, clientsData.pagination.totalPages))].map((_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => setClientsPage(page)}
                                isActive={clientsPage === page}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setClientsPage((p) => Math.min(clientsData.pagination.totalPages, p + 1))}
                            className={clientsPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No clients have booked this service yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onDelete();
                onOpenChange(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button
              type="button"
              onClick={() => {
                onEdit();
                onOpenChange(false);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
