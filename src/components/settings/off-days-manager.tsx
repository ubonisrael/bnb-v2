import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { DayPicker } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import "react-day-picker/style.css";
import { DatePicker } from "../ui/date-picker";
import { MultiDatePicker } from "../ui/multi-date-picker";
import { DateRangePicker } from "../ui/date-range-picker";
import { UseFormReturn } from "react-hook-form";
import { bookingSettingsSchema } from "../onboarding/steps/booking-settings";
import { z } from "zod";

export function OffDaysManager({
  offDays,
  onAdd,
  onRemove,
  form,
}: {
  offDays: OffDay[];
  onAdd: (offDay: OffDay) => void;
  onRemove: (id: string) => void;
  form: UseFormReturn<
    z.infer<typeof bookingSettingsSchema> & { [key: string]: any }
  >;
}) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">Special Off Days</h4>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => {
            onAdd({
              id: crypto.randomUUID(),
              mode: "single",
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Off Day
        </Button>
      </div>

      {offDays.map((offDay, index) => (
        <div key={offDay.id} className="grid gap-4 p-4 border rounded-lg">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            {offDay.mode === "range" ? (
              <div className="">
                <DateRangePicker
                  offDay={offDay}
                  date={{
                    from: offDay.start_date
                      ? new Date(offDay.start_date)
                      : undefined,
                    to: offDay.end_date ? new Date(offDay.end_date) : undefined,
                  }}
                  onAdd={onAdd}
                />
                {form.formState.errors[
                  `special_off_days_${index}_end_date`
                ] && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors[
                      `special_off_days_${index}_start_date`
                    ]?.message?.toString()}
                  </span>
                )}
                {form.formState.errors[`special_off_days_${index}`] && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors[
                      `special_off_days_${index}`
                    ]?.message?.toString()}
                  </span>
                )}
              </div>
            ) : offDay.mode === "multiple" ? (
              <div>
                <MultiDatePicker
                  dates={
                    offDay.dates
                      ? offDay.dates.map((date) => new Date(date))
                      : undefined
                  }
                  onAdd={onAdd}
                  offDay={offDay}
                />
                {form.formState.errors[
                  `special_off_days_${index}_dates`
                ] && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors[
                      `special_off_days_${index}_dates`
                    ]?.message?.toString()}
                  </span>
                )}
                {form.formState.errors[
                  `special_off_days_${index}`
                ] && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors[
                      `special_off_days_${index}`
                    ]?.message?.toString()}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <DatePicker
                  date={
                    offDay.start_date ? new Date(offDay.start_date) : undefined
                  }
                  onAdd={onAdd}
                  offDay={offDay}
                />
                {form.formState.errors[
                  `special_off_days_${index}_start_date`
                ] && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors[
                      `special_off_days_${index}_start_date`
                    ]?.message?.toString()}
                  </span>
                )}
                {form.formState.errors[`special_off_days_${index}`] && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors[
                      `special_off_days_${index}`
                    ]?.message?.toString()}
                  </span>
                )}
              </div>
            )}
            <Select
              onValueChange={(value) =>
                onAdd({
                  ...offDay,
                  mode: value as "single" | "multiple" | "range",
                })
              }
              value={offDay.mode}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="multiple">Multiple</SelectItem>
                <SelectItem value="range">Range</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 md:mt-2">
              <Switch
                checked={offDay.is_recurring}
                onCheckedChange={(checked) => {
                  onAdd({
                    ...offDay,
                    is_recurring: checked,
                  });
                }}
              />
              <span className="text-sm text-muted-foreground">
                Recurring yearly
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(offDay.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Input
              className="flex-1"
              placeholder="Reason (optional)"
              value={offDay.reason || ""}
              onChange={(e) => {
                onAdd({
                  ...offDay,
                  reason: e.target.value,
                });
              }}
            />
          </div>

          {offDay.is_recurring && (
            <p className="text-sm text-muted-foreground">
              This date {offDay.end_date ? "range" : ""} will be marked as off
              every year
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
