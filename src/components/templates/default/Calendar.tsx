"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  maxNotice: number;
  minNotice: number;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({ maxNotice, minNotice, selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getMonthName = () => {
    return currentMonth.toLocaleString('default', { month: 'long' }) + ' ' + currentMonth.getFullYear();
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    let days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const formatDate = (day: number | null) => {
    if (!day) return null;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return today.getDate() === day && 
            today.getMonth() === currentMonth.getMonth() && 
            today.getFullYear() === currentMonth.getFullYear();
  };

  const isPast = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Calculate min and max allowed dates
    const minDate = new Date(todayStart);
    minDate.setDate(minDate.getDate() + minNotice);
    
    const maxDate = new Date(todayStart);
    maxDate.setDate(maxDate.getDate() + maxNotice);

    // Return true if date is outside the allowed range
    return checkDate < minDate || checkDate > maxDate;
  };

  const selectDate = (day: number | null) => {
    if (!day || isPast(day)) return;
    onSelectDate(formatDate(day));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Calendar Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{getMonthName()}</h3>
        <Button variant="ghost" size="icon" onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Calendar Days Header */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {days.map(day => (
          <div key={day} className="text-center py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
            <span>{day}</span>
          </div>
        ))}
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
        {getDaysInMonth().map((day, index) => (
          <div 
            key={index}
            onClick={() => selectDate(day)}
            className={`
              h-14 text-center py-2 relative text-gray-900 dark:text-white flex items-center justify-center
              ${day && !isPast(day) 
                ? 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-100 cursor-pointer' 
                : ''}
              ${day && isPast(day) 
                ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                : ''}
              ${!day 
                ? 'bg-gray-100 dark:bg-gray-900' 
                : ''}
              ${selectedDate === formatDate(day) 
                ? 'border border-blue-900 bg-blue-700 text-white font-bold hover:text-black' 
                : ''}
              ${isToday(day) 
                ? 'text-primary-700 dark:text-primary-400 bg-green-200 font-semibold' 
                : ''}
            `}
          >
            {day && <span className="">{day}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
