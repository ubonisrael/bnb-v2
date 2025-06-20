"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function CalendarHeader({ date, view, setDate, setView }: CalendarHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-4">
      <div>
        <h1 className="text-[#121212] text-3xl font-bold">Calendar</h1>
        <p className="text-[#6E6E73]">Manage your appointments and schedule.</p>
      </div>
      <div className="flex flex-row gap-2 justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="md:justify-start gap-2 border-[#E0E0E5] bg-white text-[#121212]">
              <CalendarIcon className="h-4 w-4" />
              {format(date, "MMMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="end">
            <DayPicker animate mode="single" selected={date} onSelect={setDate} required />
          </PopoverContent>
        </Popover>
        <Select value={view} onValueChange={(value) => setView(value as "day" | "week")}>
          <SelectTrigger className="w-[120px] border-[#E0E0E5] bg-white text-[#121212]">
            <SelectValue placeholder="View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day View</SelectItem>
            <SelectItem value="week">Week View</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}