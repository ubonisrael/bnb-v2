import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { minutesToTimeString } from "@/utils/time";
import { Input } from "../ui/input";
import { UseFormReturn } from "react-hook-form";
import { bookingSettingsSchema } from "../onboarding/steps/booking-settings";
import { z } from "zod";

export function BreakTimesManager({
  breakTimes,
  dayId,
  form,
  onAdd,
  onRemove,
}: {
  breakTimes: BreakTime[];
  dayId: string;
  form: UseFormReturn<z.infer<typeof bookingSettingsSchema> & { [key: string]: any }>
  onAdd: (breakTime: BreakTime) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Break Times</h4>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => {
            onAdd({
              id: crypto.randomUUID(),
              day_of_week: dayId,
              start_time: 720, // 12:00 PM
              end_time: 780, // 1:00 PM
              name: "Break",
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Break
        </Button>
      </div>

      {breakTimes
        .filter((breakTime) => breakTime.day_of_week === dayId)
        .map((breakTime, index) => (
          <div key={breakTime.id} className="flex flex-col md:items-center gap-4 bg-slate-50 p-2 rounded-lg md:flex-row">
            <div>
              <Input
                type="time"
                name={`${dayId}_break_times_${index}_start_time`}
                value={minutesToTimeString(breakTime.start_time)}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(":").map(Number);
                  onAdd({
                    ...breakTime,
                    start_time: h * 60 + m,
                  });
                }}
              />
              { form.formState.errors[`${dayId}_break_times_${index}_start_time`] && (
                <span className="text-red-500 text-xs">
                  {form.formState.errors[`${dayId}_break_times_${index}_start_time`]?.message?.toString()}
                </span>
              )}
            </div>
            <span>to</span>
            <div>
              <Input
                type="time"
                name={`${dayId}_break_times_${index}_end_time`}
                value={minutesToTimeString(breakTime.end_time)}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(":").map(Number);
                  onAdd({
                    ...breakTime,
                    end_time: h * 60 + m,
                  });
                }}
              />
              { form.formState.errors[`${dayId}_break_times_${index}_end_time`] && (
                <span className="text-red-500 text-xs">
                  {form.formState.errors[`${dayId}_break_times_${index}_end_time`]?.message?.toString()}
                </span>
              )}
            </div>
            <div>
              <Input
                name={`${dayId}_break_times_${index}`}
                placeholder="Break Name"
                value={breakTime.name || ""}
                onChange={(e) => {
                  onAdd({
                    ...breakTime,
                    name: e.target.value,
                  });
                }}
              />
              { form.formState.errors[`${dayId}_break_times_${index}`] && (
                <span className="text-red-500 text-xs">
                  {form.formState.errors[`${dayId}_break_times_${index}`]?.message?.toString()}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(breakTime.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
    </div>
  );
}
