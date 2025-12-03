"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { User, UserX, Trash2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api-service";
import { getInitials } from "@/lib/helpers";
import { WorkScheduleSection } from "./work-schedule-section";
import { BreaksSection } from "./breaks-section";
import { OverrideHoursSection } from "./override-hours-section";
import { StaffBookingsTab } from "./staff-bookings-tab";
import { TimeOffSection } from "./time-off-section";

interface StaffDetailsSheetProps {
  memberId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleBadgeColors = {
  owner: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  staff: "bg-gray-100 text-gray-800",
};

export function StaffDetailsSheet({
  memberId,
  open,
  onOpenChange,
}: StaffDetailsSheetProps) {
  const queryClient = useQueryClient();

  // Fetch staff member details
  const { data: staffData, isLoading } = useQuery({
    queryKey: ["staff-details", memberId],
    queryFn: async () => {
      const response = await api.get<StaffMemberDetailsResponse>(
        `members/${memberId}/details`
      );
      return response.data;
    },
    enabled: !!memberId && open,
    staleTime: 2 * 60 * 1000,
  });

  // Suspend staff mutation
  const suspendMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch(`members/${memberId}/suspend`, {});
      return (response as any).data;
    },
    onMutate: () => {
      toast.loading("Suspending staff member...", { id: "suspend-staff" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Staff member suspended successfully", {
        id: "suspend-staff",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to suspend staff member",
        { id: "suspend-staff" }
      );
    },
  });

  // Delete staff mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete(`members/${memberId}`);
      return (response as any).data;
    },
    onMutate: () => {
      toast.loading("Deleting staff member...", { id: "delete-staff" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Staff member deleted successfully", {
        id: "delete-staff",
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete staff member",
        { id: "delete-staff" }
      );
    },
  });

  const handleSuspend = () => {
    if (
      confirm(`Are you sure you want to suspend ${staffData?.member.user.full_name}?`)
    ) {
      suspendMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete ${staffData?.member.user.full_name}? This action cannot be undone.`
      )
    ) {
      deleteMutation.mutate();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Staff Member Details</SheetTitle>
          <SheetDescription>
            View and manage staff member information and schedule
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-6 mt-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : !staffData ? (
          <div className="text-center py-12">
            <p className="text-[#6E6E73]">
              Failed to load staff member details
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {/* Staff Profile */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={staffData?.member.user.avatar || undefined} />
                    <AvatarFallback className="bg-[#7B68EE] text-white text-xl">
                      {getInitials(staffData.member.user.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-[#121212]">
                        {staffData.member.user.full_name}
                      </h2>
                      <Badge className={roleBadgeColors[staffData.member.role]}>
                        {staffData.member.role}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-[#6E6E73]">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{staffData.member.user.email}</span>
                      </div>
                      {staffData.member.user.phone && (
                        <div className="flex items-center gap-2">
                          <span>📞</span>
                          <span>{staffData.member.user.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSuspend}
                        disabled={suspendMutation.isPending}
                        className="gap-2"
                      >
                        <UserX className="h-4 w-4" />
                        Suspend
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                        disabled={deleteMutation.isPending}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="schedule" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="time-off">Time Off</TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="space-y-4">
                <WorkScheduleSection
                  memberId={memberId}
                  workSchedules={staffData.workingHours}
                />
                {/* <BreaksSection memberId={memberId} breaks={staffData.workSchedules.flatMap(ws => ws.breaks)} /> */}
                <OverrideHoursSection
                  memberId={memberId}
                  overrideHours={staffData.upcomingOverrideHours}
                />
              </TabsContent>

              <TabsContent value="bookings">
                <StaffBookingsTab memberId={memberId} />
              </TabsContent>

              <TabsContent value="time-off">
                <TimeOffSection
                  memberId={memberId}
                  timeOffs={staffData.upcomingTimeOffs}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
