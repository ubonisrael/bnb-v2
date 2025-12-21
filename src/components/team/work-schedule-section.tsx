"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Edit2, Save, X, AlertTriangle, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

const getBusinessDaySettings = (bookingSettings: any, dayIndex: number) => {
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayName = dayNames[dayIndex];
  return {
    enabled: bookingSettings?.[`${dayName}_enabled`] ?? false,
    opening: bookingSettings?.[`${dayName}_opening`] ?? 540,
    closing: bookingSettings?.[`${dayName}_closing`] ?? 1020,
  };
};

const isDayDisabledInBusiness = (bookingSettings: any, dayIndex: number): boolean => {
  const businessDay = getBusinessDaySettings(bookingSettings, dayIndex);
  return !businessDay.enabled;
};

const hasTimeConflict = (
  staffOpeningTime: number | null,
  staffClosingTime: number | null,
  businessOpeningTime: number,
  businessClosingTime: number
): boolean => {
  if (staffOpeningTime === null || staffClosingTime === null) return false;
  return (
    staffOpeningTime < businessOpeningTime ||
    staffClosingTime > businessClosingTime
  );
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
    // Validate schedules against business hours
    const invalidSchedules: string[] = [];
    
    schedules.forEach((s) => {
      if (s.enabled) {
        const businessDay = getBusinessDaySettings(bookingSettings, s.day_of_week);
        
        // Check if day is disabled in business
        if (!businessDay.enabled) {
          invalidSchedules.push(
            `${daysOfWeek[s.day_of_week]} is disabled organization-wide`
          );
        }
        
        // Check time conflicts
        if (hasTimeConflict(s.opening_time, s.closing_time, businessDay.opening, businessDay.closing)) {
          invalidSchedules.push(
            `${daysOfWeek[s.day_of_week]} hours must be within business hours (${minutesToTime(businessDay.opening)} - ${minutesToTime(businessDay.closing)})`
          );
        }
      }
    });
    
    if (invalidSchedules.length > 0) {
      toast.error(invalidSchedules[0], { duration: 5000 });
      return;
    }
    
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
        <TooltipProvider>
          <div className="space-y-4">
            {schedules.map((schedule) => {
              const businessDay = getBusinessDaySettings(bookingSettings, schedule.day_of_week);
              const isDayDisabled = isDayDisabledInBusiness(bookingSettings, schedule.day_of_week);
              const hasConflict = schedule.enabled && hasTimeConflict(
                schedule.opening_time,
                schedule.closing_time,
                businessDay.opening,
                businessDay.closing
              );
              const showWarning = schedule.enabled && (isDayDisabled || hasConflict);
              
              return (
                <div key={schedule.day_of_week} className="flex items-center gap-4">
                  <div className="w-24 font-medium text-sm flex items-center gap-2">
                    {daysOfWeek[schedule.day_of_week]}
                    {showWarning && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertTriangle className="h-4 w-4 text-amber-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          {isDayDisabled && (
                            <p className="text-sm">
                              This day is disabled organization-wide. Staff will not be active on this day.
                            </p>
                          )}
                          {hasConflict && !isDayDisabled && (
                            <p className="text-sm">
                              Staff hours ({minutesToTime(schedule.opening_time)} - {minutesToTime(schedule.closing_time)}) 
                              are outside business hours ({minutesToTime(businessDay.opening)} - {minutesToTime(businessDay.closing)}).
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <Switch
                    checked={schedule.enabled}
                    disabled={!isEditing}
                    onCheckedChange={(checked) => {
                      // Prevent enabling days that are disabled in business
                      if (checked && isDayDisabled) {
                        toast.error(`${daysOfWeek[schedule.day_of_week]} is disabled organization-wide`);
                        return;
                      }
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
                          const newOpeningTime = timeToMinutes(e.target.value);
                          setSchedules((prev) =>
                            prev.map((s) =>
                              s.day_of_week === schedule.day_of_week
                                ? {
                                    ...s,
                                    opening_time: newOpeningTime,
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
                          const newClosingTime = timeToMinutes(e.target.value);
                          setSchedules((prev) =>
                            prev.map((s) =>
                              s.day_of_week === schedule.day_of_week
                                ? {
                                    ...s,
                                    closing_time: newClosingTime,
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
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
