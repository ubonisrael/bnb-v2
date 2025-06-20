"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, addWeeks } from "date-fns";
import { FilterControls } from "./filter-controls";

export function CalendarControls({ date, setDate, filters, setFilters, settings, view }: CalendarControlsProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-[#E0E0E5] bg-white text-[#121212]"
          onClick={() => setDate(view === "day" ? addDays(date, -1) : addWeeks(date, -1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-[#E0E0E5] bg-white text-[#121212]"
          onClick={() => setDate(view === "day" ? addDays(date, 1) : addWeeks(date, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" className="text-[#121212]" onClick={() => setDate(new Date())}>
          Today
        </Button>
      </div>
      <FilterControls filters={filters} setFilters={setFilters} settings={settings} />
    </div>
  );
}