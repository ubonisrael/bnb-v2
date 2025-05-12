"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { generateAvailableTimes } from "@/lib/utils/services";

interface TimeSlotsProps {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  totalDuration: number;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ 
  selectedDate, 
  selectedTime, 
  onSelectTime,
  totalDuration
}) => {
  const availableTimes = selectedDate 
    ? generateAvailableTimes(selectedDate, totalDuration) 
    : [];

  return (
    <div className="mt-6">
      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        {selectedDate 
          ? `Available Times on ${selectedDate}` 
          : "Select a date to see available times"}
      </h4>
      
      {selectedDate && availableTimes.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No available time slots on this date</p>
          <p className="text-sm mt-1">Please select a different date</p>
        </div>
      )}
      
      {selectedDate && availableTimes.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {availableTimes.map(time => (
            <Button
              key={time}
              variant={selectedTime === time ? "secondary" : "outline"}
              onClick={() => onSelectTime(time)}
              className={`
                px-3 py-2 border rounded-md text-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                ${selectedTime === time 
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 border-primary-200 dark:border-primary-700' 
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
              `}
            >
              {time}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeSlots;
