"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";
import "react-day-picker/style.css";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MultiDatePicker } from "@/components/ui/multi-date-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api-service";

interface TimeOffSectionProps {
  memberId: number;
  timeOffs: TimeOff[];
}

export function TimeOffSection({ memberId, timeOffs }: TimeOffSectionProps) {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [offDay, setOffDay] = useState<OffDay>({
    id: crypto.randomUUID(),
    mode: "multiple",
  });
  const [reason, setReason] = useState("");

  const createMutation = useMutation({
    mutationFn: async (data: { start_date: string; end_date: string; reason?: string }) => {
      const response = await api.post(`members/${memberId}/time-off`, data);
      return response;
    },
    onMutate: () => {
      toast.loading("Adding time off...", { id: "add-timeoff" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Time off added successfully", {
        id: "add-timeoff",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
      setIsAddDialogOpen(false);
      setOffDay({
        id: crypto.randomUUID(),
        mode: "multiple",
      });
      setReason("");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add time off", {
        id: "add-timeoff",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (timeOffId: number) => {
      const response = await api.delete(`members/${memberId}/time-off/${timeOffId}`);
      return response;
    },
    onMutate: () => {
      toast.loading("Deleting time off...", { id: "delete-timeoff" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Time off deleted successfully", {
        id: "delete-timeoff",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete time off", {
        id: "delete-timeoff",
      });
    },
  });

  const handleAddTimeOff = () => {
    let startDate: string;
    let endDate: string;

    if (offDay.mode === "single") {
      if (!offDay.start_date) {
        toast.error("Please select a date");
        return;
      }
      startDate = offDay.start_date;
      endDate = offDay.start_date;
    } else if (offDay.mode === "range") {
      if (!offDay.start_date || !offDay.end_date) {
        toast.error("Please select start and end dates");
        return;
      }
      startDate = offDay.start_date;
      endDate = offDay.end_date;
    } else {
      // multiple mode
      if (!offDay.dates || offDay.dates.length === 0) {
        toast.error("Please select at least one date");
        return;
      }
      // Sort dates to get the earliest and latest
      const sortedDates = [...offDay.dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      startDate = sortedDates[0];
      endDate = sortedDates[sortedDates.length - 1];
    }

    createMutation.mutate({
      start_date: startDate,
      end_date: endDate,
      reason: reason.trim() || undefined,
    });
  };

  const handleOffDayUpdate = (updatedOffDay: OffDay) => {
    setOffDay(updatedOffDay);
  };

  const handleModeChange = (mode: "single" | "multiple" | "range") => {
    setOffDay({
      id: crypto.randomUUID(),
      mode,
    });
  };

  const isDateSelected = () => {
    if (offDay.mode === "single") {
      return !!offDay.start_date;
    } else if (offDay.mode === "range") {
      return !!offDay.start_date && !!offDay.end_date;
    } else {
      return !!offDay.dates && offDay.dates.length > 0;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Time Off Requests</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Time Off
            </Button>
          </div>
        </CardHeader>
      <CardContent>
        {timeOffs.length === 0 ? (
          <div className="text-center py-8 text-[#6E6E73]">
            No time off requests
          </div>
        ) : (
          <div className="space-y-3">
            {timeOffs.map((timeOff) => (
              <div
                key={timeOff.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="font-medium text-[#121212]">
                    {new Date(timeOff.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(timeOff.end_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  {timeOff.reason && (
                    <p className="text-sm text-[#6E6E73]">{timeOff.reason}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(timeOff.id)}
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Time Off</DialogTitle>
          <DialogDescription>
            Select the type of time off and choose your dates.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Mode</Label>
            <Select
              value={offDay.mode}
              onValueChange={(value: "single" | "multiple" | "range") => handleModeChange(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single Day</SelectItem>
                <SelectItem value="multiple">Multiple Days</SelectItem>
                <SelectItem value="range">Date Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Select Date{offDay.mode !== "single" ? "s" : ""}</Label>
            {offDay.mode === "single" && (
              <DatePicker
                offDay={offDay}
                date={offDay.start_date ? new Date(offDay.start_date) : undefined}
                onAdd={handleOffDayUpdate}
              />
            )}
            {offDay.mode === "multiple" && (
              <MultiDatePicker
                offDay={offDay}
                dates={offDay.dates?.map(d => new Date(d))}
                onAdd={handleOffDayUpdate}
              />
            )}
            {offDay.mode === "range" && (
              <DateRangePicker
                offDay={offDay}
                date={{
                  from: offDay.start_date ? new Date(offDay.start_date) : undefined,
                  to: offDay.end_date ? new Date(offDay.end_date) : undefined,
                }}
                onAdd={handleOffDayUpdate}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for time off..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setIsAddDialogOpen(false);
              setOffDay({
                id: crypto.randomUUID(),
                mode: "multiple",
              });
              setReason("");
            }}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddTimeOff}
            disabled={createMutation.isPending || !isDateSelected()}
          >
            {createMutation.isPending ? "Adding..." : "Add Time Off"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
