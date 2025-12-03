"use client";

import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
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
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvailableDays } from "@/lib/helpers";
import ServiceAppointmentsList from "./service-appointments-list";
import ServiceClientsList from "./service-clients-list";
import ServiceDetails from "./service-details";

export function ServiceDetailsDialog({
  open,
  onOpenChange,
  serviceId,
  onEdit,
  onDelete,
}: ServiceDetailsDialogProps) {
  const [analyticsPeriod, setAnalyticsPeriod] = useState<ServiceAnalyticsPeriod>("last7Days");
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
  const selectedPeriodData = analytics?.bookings[analyticsPeriod] as { count: number; percentageChange: number };

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
          <ServiceDetails
            service={service || null}
            isLoadingDetails={isLoadingDetails}
            availableDays={availableDays}
            analyticsPeriod={analyticsPeriod}
            setAnalyticsPeriod={setAnalyticsPeriod}
            analytics={analytics || null}
            selectedPeriodData={selectedPeriodData}
          />

          {/* Appointments Tab */}
          <ServiceAppointmentsList
            appointments={appointmentsData?.appointments || []}
            appointmentsType={appointmentsType}
            appointmentsPage={appointmentsPage}
            setAppointmentsType={setAppointmentsType}
            setAppointmentsPage={setAppointmentsPage}
            isLoadingAppointments={isLoadingAppointments}
            pagination={appointmentsData?.pagination}
          />

          {/* Clients Tab */}
          <ServiceClientsList
            clients={clientsData?.clients || []}
            isLoadingClients={isLoadingClients}
            clientsPage={clientsPage}
            setClientsPage={setClientsPage}
            pagination={clientsData?.pagination}
          />
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
