import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  className?: string;
  offDay: OffDay;
  date?: DateRange;
  onAdd: (offDay: OffDay) => void;
}

export function DateRangePicker({
  className,
  date,
  offDay,
  onAdd,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[240px] sm:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            fixedWeeks
            mode="range"
            selected={{
              from: offDay.start_date ? new Date(offDay.start_date) : undefined,
              to: offDay.end_date ? new Date(offDay.end_date) : undefined,
            }}
            onSelect={(range) => {
              if (!range.from) return;
              onAdd({
                ...offDay,
                start_date: range.from.toISOString(),
                end_date: range.to ? range.to.toISOString() : undefined,
              });
            }}
            showOutsideDays={true}
            required
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
