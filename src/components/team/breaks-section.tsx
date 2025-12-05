"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api-service";
import { days } from "@/lib/helpers";

interface BreaksSectionProps {
  memberId: number;
  breaks: StaffBreak[];
  workSchedules: WorkSchedule[];
}

interface WorkSchedule {
  id: number;
  day_of_week: number;
  opening_time: number | null;
  closing_time: number | null;
  enabled: boolean;
}

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export function BreaksSection({ memberId, breaks, workSchedules }: BreaksSectionProps) {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Filter to only get enabled work days
  const enabledWorkDays = workSchedules
    .filter((schedule) => schedule.enabled)
    .map((schedule) => schedule.day_of_week);
  
  // Set default day to first enabled day or 1 (Monday)
  const defaultDay = enabledWorkDays.length > 0 ? enabledWorkDays[0] : 1;
  
  const [newBreak, setNewBreak] = useState({
    day_of_week: defaultDay,
    start: "12:00",
    end: "13:00",
  });

  const createMutation = useMutation({
    mutationFn: async (data: { day_of_week: number; start: number; end: number }) => {
      const response = await api.post(`members/${memberId}/breaks`, data);
      return response;
    },
    onMutate: () => {
      toast.loading("Adding break...", { id: "add-break" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Break added successfully", {
        id: "add-break",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
      setIsAddDialogOpen(false);
      setNewBreak({ day_of_week: defaultDay, start: "12:00", end: "13:00" });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add break", {
        id: "add-break",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (breakId: number) => {
      const response = await api.delete(`members/${memberId}/breaks/${breakId}`);
      return response;
    },
    onMutate: () => {
      toast.loading("Deleting break...", { id: "delete-break" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Break deleted successfully", {
        id: "delete-break",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete break", {
        id: "delete-break",
      });
    },
  });

  const handleAddBreak = () => {
    createMutation.mutate({
      day_of_week: newBreak.day_of_week,
      start: timeToMinutes(newBreak.start),
      end: timeToMinutes(newBreak.end),
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Breaks</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Break
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        {breaks.length === 0 ? (
          <div className="text-center py-8 text-[#6E6E73]">
            No breaks configured
          </div>
        ) : (
          <div className="space-y-2">
            {breaks.map((breakItem) => (
              <div
                key={breakItem.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <span className="font-medium">
                    {days[breakItem.day_of_week]}
                  </span>
                  <span className="text-[#6E6E73] ml-2">
                    {minutesToTime(breakItem.start)} - {minutesToTime(breakItem.end)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(breakItem.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>

    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Break</DialogTitle>
          <DialogDescription>
            Set up a break time for this staff member
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Day of Week</Label>
            <Select
              value={newBreak.day_of_week.toString()}
              onValueChange={(value) =>
                setNewBreak({ ...newBreak, day_of_week: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {enabledWorkDays.length > 0 ? (
                  enabledWorkDays.map((dayIndex) => (
                    <SelectItem key={dayIndex} value={dayIndex.toString()}>
                      {days[dayIndex].charAt(0).toUpperCase() + days[dayIndex].slice(1)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No work days configured
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={newBreak.start}
                onChange={(e) =>
                  setNewBreak({ ...newBreak, start: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={newBreak.end}
                onChange={(e) =>
                  setNewBreak({ ...newBreak, end: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsAddDialogOpen(false)}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddBreak}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Adding..." : "Add Break"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
