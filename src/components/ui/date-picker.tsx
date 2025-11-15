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

interface DatePickerProps {
  className?: string;
  date?: Date;
  offDay: OffDay;
  onAdd: (offDay: OffDay) => void;
}

export function DatePicker({
  className,
  date,
  offDay,
  onAdd,
}: DatePickerProps) {
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
            {date ? format(date, "LLL dd, y") : <span>Pick a date.</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            fixedWeeks
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={(date) => {
              if (!date) return;
              onAdd({
                ...offDay,
                start_date: date.toISOString(),
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
