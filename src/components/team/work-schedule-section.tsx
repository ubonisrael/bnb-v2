"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Edit2, Save, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api-service";
import { removeNullish } from "@/utils/flatten";
import { useFetchBookingSettings } from "@/hooks/use-fetch-booking-settings";

interface WorkSchedule {
  id: number;
  day_of_week: number;
  opening_time: number | null;
  closing_time: number | null;
  enabled: boolean;
}

interface WorkScheduleSectionProps {
  memberId: number;
  workSchedules: WorkSchedule[];
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const minutesToTime = (minutes: number | null): string => {
  if (minutes === null) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export function WorkScheduleSection({
  memberId,
  workSchedules,
}: WorkScheduleSectionProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: bookingSettings, isLoading: isLoadingBookingSettings } =
    useFetchBookingSettings();

  const createCompleteSchedule = () => {
    return daysOfWeek.map((_, idx) => {
      const existingSchedule = workSchedules.find((s) => s.day_of_week === idx);
      return (
        existingSchedule || {
          id: idx,
          day_of_week: idx,
          opening_time: 540, // 9 AM
          closing_time: 1020, // 5 PM
          enabled: false,
        }
      );
    });
  };

  const [schedules, setSchedules] = useState<WorkSchedule[]>(
    createCompleteSchedule()
  );

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      // for disabled days, set opening_time and closing_time to 100
      const schedules: WorkSchedule[] = data.schedules.map(
        (s: WorkSchedule) => ({
          ...s,
          opening_time: s.enabled ? s.opening_time : 540,
          closing_time: s.enabled ? s.closing_time : 1020,
        })
      );
      const response = await api.post(`members/${memberId}/schedule`, {
        schedules,
      });
      return response;
    },
    onMutate: () => {
      toast.loading("Updating schedule...", { id: "update-schedule" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Schedule updated successfully", {
        id: "update-schedule",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update schedule",
        { id: "update-schedule" }
      );
    },
  });

  const handleSave = () => {
    const schedulesData = schedules.map((s) => ({
      day_of_week: s.day_of_week,
      opening_time: s.enabled ? s.opening_time : null,
      closing_time: s.enabled ? s.closing_time : null,
      enabled: s.enabled,
    }));
    updateMutation.mutate({ schedules: schedulesData });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Working Hours</CardTitle>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSchedules(createCompleteSchedule());
                  setIsEditing(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.day_of_week} className="flex items-center gap-4">
              <div className="w-24 font-medium text-sm">
                {daysOfWeek[schedule.day_of_week]}
              </div>
              <Switch
                checked={schedule.enabled}
                disabled={!isEditing}
                onCheckedChange={(checked) => {
                  setSchedules((prev) =>
                    prev.map((s) =>
                      s.day_of_week === schedule.day_of_week
                        ? { ...s, enabled: checked }
                        : s
                    )
                  );
                }}
              />
              {schedule.enabled && (
                <>
                  <Input
                    type="time"
                    value={minutesToTime(schedule.opening_time)}
                    disabled={!isEditing}
                    onChange={(e) => {
                      setSchedules((prev) =>
                        prev.map((s) =>
                          s.day_of_week === schedule.day_of_week
                            ? {
                                ...s,
                                opening_time: timeToMinutes(e.target.value),
                              }
                            : s
                        )
                      );
                    }}
                    className="w-32"
                  />
                  <span className="text-[#6E6E73]">to</span>
                  <Input
                    type="time"
                    value={minutesToTime(schedule.closing_time)}
                    disabled={!isEditing}
                    onChange={(e) => {
                      setSchedules((prev) =>
                        prev.map((s) =>
                          s.day_of_week === schedule.day_of_week
                            ? {
                                ...s,
                                closing_time: timeToMinutes(e.target.value),
                              }
                            : s
                        )
                      );
                    }}
                    className="w-32"
                  />
                </>
              )}
              {!schedule.enabled && (
                <span className="text-[#6E6E73] text-sm">Closed</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
