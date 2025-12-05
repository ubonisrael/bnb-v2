"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2, X } from "lucide-react";

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

interface BreakInput {
  id: string;
  day_of_week: number;
  start: string;
  end: string;
}

export function BreaksSection({ memberId, breaks, workSchedules }: BreaksSectionProps) {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Filter to only get enabled work days
  const enabledWorkDays = workSchedules
    .filter((schedule) => schedule.enabled)
    .map((schedule) => schedule.day_of_week);
  
  // Set default day to first enabled day or 1 (Monday)
  const defaultDay = enabledWorkDays.length > 0 ? enabledWorkDays[0] : 1;
  
  const [newBreaks, setNewBreaks] = useState<BreakInput[]>([
    {
      id: crypto.randomUUID(),
      day_of_week: defaultDay,
      start: "12:00",
      end: "13:00",
    },
  ]);

  const createMutation = useMutation({
    mutationFn: async (data: { breaks: { day_of_week: number; start: number; end: number }[] }) => {
      // remove generated id before sending to API
      const breaks = data.breaks.map(({ day_of_week, start, end }) => ({ day_of_week, start, end }));
      const response = await api.post(`members/${memberId}/breaks`, { breaks });
      return response;
    },
    onMutate: () => {
      toast.loading("Adding breaks...", { id: "add-breaks" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Breaks added successfully", {
        id: "add-breaks",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
      setIsAddDialogOpen(false);
      setNewBreaks([
        {
          id: crypto.randomUUID(),
          day_of_week: defaultDay,
          start: "12:00",
          end: "13:00",
        },
      ]);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add breaks", {
        id: "add-breaks",
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

  const hasDuplicateBreaks = () => {
    const breakSignatures = new Set<string>();
    
    // Add existing breaks to the set
    for (const existingBreak of breaks) {
      const signature = `${existingBreak.day_of_week}-${minutesToTime(existingBreak.start)}-${minutesToTime(existingBreak.end)}`;
      breakSignatures.add(signature);
    }
    
    // Check new breaks for duplicates (against existing and each other)
    for (const brk of newBreaks) {
      const signature = `${brk.day_of_week}-${brk.start}-${brk.end}`;
      if (breakSignatures.has(signature)) {
        return true;
      }
      breakSignatures.add(signature);
    }
    return false;
  };

  const hasOverlappingBreaks = () => {
    // Group all breaks (existing + new) by day
    const breaksByDay: { [key: number]: Array<{ start: number; end: number }> } = {};
    
    // Add existing breaks
    for (const existingBreak of breaks) {
      if (!breaksByDay[existingBreak.day_of_week]) {
        breaksByDay[existingBreak.day_of_week] = [];
      }
      breaksByDay[existingBreak.day_of_week].push({
        start: existingBreak.start,
        end: existingBreak.end,
      });
    }
    
    // Add new breaks
    for (const brk of newBreaks) {
      if (!breaksByDay[brk.day_of_week]) {
        breaksByDay[brk.day_of_week] = [];
      }
      breaksByDay[brk.day_of_week].push({
        start: timeToMinutes(brk.start),
        end: timeToMinutes(brk.end),
      });
    }
    
    // Check for overlaps within each day
    for (const day in breaksByDay) {
      const dayBreaks = breaksByDay[day];
      for (let i = 0; i < dayBreaks.length; i++) {
        for (let j = i + 1; j < dayBreaks.length; j++) {
          const break1 = dayBreaks[i];
          const break2 = dayBreaks[j];
          
          // Check if breaks overlap
          // Break1 starts before Break2 ends AND Break1 ends after Break2 starts
          if (break1.start < break2.end && break1.end > break2.start) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  const handleAddBreak = () => {
    if (hasDuplicateBreaks()) {
      toast.error("You cannot add identical breaks. Please ensure all breaks are unique.");
      return;
    }

    if (hasOverlappingBreaks()) {
      toast.error("Breaks on the same day cannot overlap. Please adjust the times.");
      return;
    }

    const breaksData = newBreaks.map((brk) => ({
      day_of_week: brk.day_of_week,
      start: timeToMinutes(brk.start),
      end: timeToMinutes(brk.end),
    }));
    createMutation.mutate({ breaks: breaksData });
  };

  const addBreakInput = () => {
    setNewBreaks([
      ...newBreaks,
      {
        id: crypto.randomUUID(),
        day_of_week: defaultDay,
        start: "12:00",
        end: "13:00",
      },
    ]);
  };

  const removeBreakInput = (id: string) => {
    if (newBreaks.length > 1) {
      setNewBreaks(newBreaks.filter((brk) => brk.id !== id));
    }
  };

  const updateBreakInput = (id: string, field: keyof BreakInput, value: any) => {
    setNewBreaks(
      newBreaks.map((brk) =>
        brk.id === id ? { ...brk, [field]: value } : brk
      )
    );
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
                  <span className="font-medium capitalize">
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Breaks</DialogTitle>
          <DialogDescription>
            Set up break times for this staff member. You can add multiple breaks at once.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {newBreaks.map((breakInput, index) => (
            <div key={breakInput.id} className="space-y-3 p-4 border rounded-lg relative">
              {newBreaks.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeBreakInput(breakInput.id)}
                  className="absolute top-2 right-2 h-6 w-6 p-0 text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="space-y-2">
                <Label>Day of Week</Label>
                <Select
                  value={breakInput.day_of_week.toString()}
                  onValueChange={(value) =>
                    updateBreakInput(breakInput.id, "day_of_week", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {enabledWorkDays.length > 0 ? (
                      enabledWorkDays.map((dayIndex) => (
                        <SelectItem className="capitalize" key={dayIndex} value={dayIndex.toString()}>
                          {days[dayIndex]}
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
                    value={breakInput.start}
                    onChange={(e) =>
                      updateBreakInput(breakInput.id, "start", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={breakInput.end}
                    onChange={(e) =>
                      updateBreakInput(breakInput.id, "end", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addBreakInput}
            className="w-full"
            type="button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Break
          </Button>
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
            {createMutation.isPending 
              ? "Adding..." 
              : `Add ${newBreaks.length} Break${newBreaks.length > 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
