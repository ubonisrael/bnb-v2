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
              dayOfWeek: dayId,
              startTime: 720, // 12:00 PM
              endTime: 780, // 1:00 PM
              name: "Break",
            });
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Break
        </Button>
      </div>

      {breakTimes
        .filter((breakTime) => breakTime.dayOfWeek === dayId)
        .map((breakTime, index) => (
          <div key={breakTime.id} className="flex flex-col md:items-center gap-4 bg-slate-50 p-2 rounded-lg md:flex-row">
            <div>
              <Input
                type="time"
                name={`${dayId}_break_times_${index}_startTime`}
                value={minutesToTimeString(breakTime.startTime)}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(":").map(Number);
                  onAdd({
                    ...breakTime,
                    startTime: h * 60 + m,
                  });
                }}
              />
              { form.formState.errors[`${dayId}_break_times_${index}_startTime`] && (
                <span className="text-red-500 text-xs">
                  {form.formState.errors[`${dayId}_break_times_${index}_startTime`]?.message?.toString()}
                </span>
              )}
            </div>
            <span>to</span>
            <div>
              <Input
                type="time"
                name={`${dayId}_break_times_${index}_endTime`}
                value={minutesToTimeString(breakTime.endTime)}
                onChange={(e) => {
                  const [h, m] = e.target.value.split(":").map(Number);
                  onAdd({
                    ...breakTime,
                    endTime: h * 60 + m,
                  });
                }}
              />
              { form.formState.errors[`${dayId}_break_times_${index}_endTime`] && (
                <span className="text-red-500 text-xs">
                  {form.formState.errors[`${dayId}_break_times_${index}_endTime`]?.message?.toString()}
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
