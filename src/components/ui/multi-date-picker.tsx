import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";

interface MultiDatePickerProps {
  className?: string;
  dates?: Date[];
  offDay: OffDay;
  onAdd: (offDay: OffDay) => void;
}

export function MultiDatePicker({
  className,
  dates,
  offDay,
  onAdd,
}: MultiDatePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[240px] sm:w-[300px] max-w-[624px] justify-start text-left font-normal",
              !dates?.length && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dates ? (
              <span className="text-ellipsis overflow-hidden whitespace-nowrap">
                {dates.map((date) => format(date, "LLL dd, y")).join(" | ")}
              </span>
            ) : (
              <span>Pick multiple dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            fixedWeeks
            mode="multiple"
            selected={offDay.dates?.map((date) => new Date(date))}
            onSelect={(dates) => {
              onAdd({
                ...offDay,
                dates: [...dates.map((date) => date.toISOString())],
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
