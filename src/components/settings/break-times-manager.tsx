import { Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { minutesToTimeString } from "@/utils/time";
import { Input } from "../ui/input";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { bookingSettingsSchema } from "../onboarding/steps/booking-settings";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";

export function BreakTimesManager({
  breakTimes,
  dayId,
  form,
}: {
  breakTimes: BreakTime[];
  dayId: string;
  form: UseFormReturn<
    z.infer<typeof bookingSettingsSchema> & { [key: string]: any }
  >;
}) {
  const handleAdd = (
    breakTime: BreakTime,
    field: ControllerRenderProps<any>
  ) => {
    const newBreakTimes = [...breakTimes];
    const index = newBreakTimes.findIndex((b) => b.id === breakTime.id);
    if (index >= 0) {
      newBreakTimes[index] = breakTime;
    } else {
      newBreakTimes.push(breakTime);
    }
    field.onChange(newBreakTimes);
  };
  const handleRemove = (id: string, field: ControllerRenderProps<any>) => {
    field.onChange(breakTimes.filter((b) => b.id !== id));
  };
  return (
    <FormField
      control={form.control}
      name="break_times"
      render={({ field }) => (
        <FormItem>
          <div className="flex justify-between items-center">
            <FormLabel>Break Times</FormLabel>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {
                handleAdd(
                  {
                    id: crypto.randomUUID(),
                    day_of_week: dayId,
                    start_time: 720, // 12:00 PM
                    end_time: 780, // 1:00 PM
                    name: "Break",
                  },
                  field
                );
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Break
            </Button>
          </div>
          <FormControl>
            <div>
            {breakTimes
              .filter((breakTime) => breakTime.day_of_week === dayId)
              .map((breakTime, index) => (
                <div
                  key={breakTime.id}
                  className="flex flex-col md:items-center gap-4 bg-slate-50 p-2 rounded-lg md:flex-row"
                >
                  <div>
                    <Input
                      type="time"
                      name={`${dayId}_break_times_${index}_start_time`}
                      value={minutesToTimeString(breakTime.start_time)}
                      onChange={(e) => {
                        const [h, m] = e.target.value.split(":").map(Number);
                        handleAdd(
                          {
                            ...breakTime,
                            start_time: h * 60 + m,
                          },
                          field
                        );
                      }}
                    />
                    {form.formState.errors[
                      `${dayId}_break_times_${index}_start_time`
                    ] && (
                      <span className="text-red-500 text-xs">
                        {form.formState.errors[
                          `${dayId}_break_times_${index}_start_time`
                        ]?.message?.toString()}
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
                        handleAdd(
                          {
                            ...breakTime,
                            end_time: h * 60 + m,
                          },
                          field
                        );
                      }}
                    />
                    {form.formState.errors[
                      `${dayId}_break_times_${index}_end_time`
                    ] && (
                      <span className="text-red-500 text-xs">
                        {form.formState.errors[
                          `${dayId}_break_times_${index}_end_time`
                        ]?.message?.toString()}
                      </span>
                    )}
                  </div>
                  <div>
                    <Input
                      name={`${dayId}_break_times_${index}`}
                      placeholder="Break Name"
                      value={breakTime.name || ""}
                      onChange={(e) => {
                        handleAdd(
                          {
                            ...breakTime,
                            name: e.target.value,
                          },
                          field
                        );
                      }}
                    />
                    {form.formState.errors[`${dayId}_break_times_${index}`] && (
                      <span className="text-red-500 text-xs">
                        {form.formState.errors[
                          `${dayId}_break_times_${index}`
                        ]?.message?.toString()}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(breakTime.id, field)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
