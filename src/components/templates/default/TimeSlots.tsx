"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { convertTimeSlotsToUserLocalTime, minutesToTimeString } from "@/utils/time";
import { AvailableTimeSlotsResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-service";
import { useApp } from "@/contexts/AppContext";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { AxiosError } from "axios";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimeSlotsProps {
  selectedDate: string | null;
  selectedTime: number | null;
  onSelectTime: (time: number) => void;
  totalDuration: number;
  bUrl: string;
  utcOffset: number;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  selectedDate,
  selectedTime,
  onSelectTime,
  totalDuration,
  utcOffset,
  bUrl,
}) => {
  const { selectedServices } = useApp();
  const timezone = dayjs.tz.guess();
  const clientOffset = dayjs().tz(timezone).utcOffset();
  const urlString = `/sp/${bUrl}/available-time-slots?date=${selectedDate}&clientTz=${timezone}${selectedServices
    .map((s) => `&service_ids[]=${s.id}`)
    .join("")}&duration=${totalDuration}`;
  // fetch available time slots based on selected date
  const { data, isLoading, error } = useQuery<AvailableTimeSlotsResponse, AxiosError>({
    queryKey: [selectedDate],
    queryFn: async () => {
      if (bUrl === "sample") {
        return Promise.resolve({
          status: true,
          timeSlots: [540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080],
          message: "Success",
        });
      }
      return await api.get(urlString);
    },
  });

  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="h-7 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4"></h4>
      {selectedDate
        ? `Available Times on ${selectedDate}`
        : "Select a date to see available times"}
      {error && (
        <div className="text-red-500 text-sm mt-2">{(error?.response?.data as { message: string })?.message}</div>
      )}

      {selectedDate && data?.timeSlots.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-3 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>No available time slots on this date</p>
          <p className="text-sm mt-1">Please select a different date</p>
        </div>
      )}

      {selectedDate && data && data.timeSlots.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {data?.timeSlots.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "secondary" : "outline"}
              onClick={() => onSelectTime(time)}
              className={`
                px-3 py-2 border rounded-md text-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                ${
                  selectedTime === time
                    ? "bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 border-primary-200 dark:border-primary-700"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
            >
              {minutesToTimeString(convertTimeSlotsToUserLocalTime(time, clientOffset, utcOffset))}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSlots;
