"use client";

import { Ref, useImperativeHandle, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { minutesToTimeString, timezones } from "@/utils/time";
import { Textarea } from "@/components/ui/textarea";
import { OffDaysManager } from "@/components/settings/off-days-manager";
import { BreakTimesManager } from "@/components/settings/break-times-manager";
import { PolicyManager } from "@/components/settings/policy-manager";

const policySchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  policies: z.array(z.string()).min(1, "At least one policy is required"),
});

export const baseBookingSettingsSchema = (allowedTimeZones: string[]) =>
  z
    .object({
      welcome_message: z.string().min(24, {
        message:
          "Welcome message must be at least 24 characters long to provide sufficient information",
      }),
      custom_policies: z.array(policySchema),
      absorb_service_charge: z.boolean().default(false),
      time_slot_duration: z
        .number({
          required_error: "Please specify a time slot duration",
          invalid_type_error: "Time slot duration must be a valid number",
        })
        .min(30)
        .max(120),
      allow_deposits: z.boolean(),
      deposit_amount: z
        .number({
          required_error:
            "Please specify a deposit amount when deposits are allowed",
          invalid_type_error: "Deposit amount must be a valid number",
        })
        .min(5)
        .optional(),
      cancellation_allowed: z.boolean(),
      cancellation_notice_hours: z
        .number()
        .refine((value) => [0, 4, 8, 12, 24, 48, 72].includes(value))
        .optional(),
      cancellation_fee_percent: z.number().min(0).max(100).optional(),
      no_show_fee_percent: z.number().min(0).max(100),
      reschedule_allowed: z.boolean(),
      reschedule_notice_hours: z
        .number()
        .refine((value) => [0, 4, 8, 12, 24, 48, 72].includes(value))
        .optional(),
      reschedule_fee_percent: z.number().min(0).max(100).optional(),
      maximum_notice: z.number().min(0),
      minimum_notice: z.number().min(0),
      time_zone: z
        .string()
        .min(2)
        .refine((val) => allowedTimeZones.includes(val), {
          message: "Please select a time zone from the provided list",
        }),
      special_off_days: z.array(
        z.object({
          id: z.string(),
          start_date: z.string().optional(),
          dates: z.array(z.string()).optional(),
          end_date: z.string().optional(),
          reason: z.string().optional(),
          is_recurring: z.boolean().optional(),
          mode: z.enum(["single", "multiple", "range"]),
        })
      ),
      break_times: z.array(
        z.object({
          id: z.string(),
          day_of_week: z.string(),
          start_time: z.number(),
          end_time: z.number(),
          name: z.string().optional(),
        })
      ),

      // Days of the week
      sunday_enabled: z.boolean().default(false),
      sunday_opening: z.number().default(0),
      sunday_closing: z.number().default(0),
      monday_enabled: z.boolean().default(false),
      monday_opening: z.number().default(0),
      monday_closing: z.number().default(0),
      tuesday_enabled: z.boolean().default(false),
      tuesday_opening: z.number().default(0),
      tuesday_closing: z.number().default(0),
      wednesday_enabled: z.boolean().default(false),
      wednesday_opening: z.number().default(0),
      wednesday_closing: z.number().default(0),
      thursday_enabled: z.boolean().default(false),
      thursday_opening: z.number().default(0),
      thursday_closing: z.number().default(0),
      friday_enabled: z.boolean().default(false),
      friday_opening: z.number().default(0),
      friday_closing: z.number().default(0),
      saturday_enabled: z.boolean().default(false),
      saturday_opening: z.number().default(0),
      saturday_closing: z.number().default(0),
    })
    .refine((data) => data.maximum_notice >= data.minimum_notice + 1, {
      message:
        "Maximum advance booking notice must be atleast 1 day more than minimum notice for proper scheduling",
      path: ["maximum_notice"],
    })
    .superRefine((data: Record<string, any>, ctx) => {
      if (
        data.allow_deposits &&
        (data.deposit_amount === undefined || data.deposit_amount === undefined)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "When deposits are enabled, you must specify a deposit amount",
          path: ["deposit_amount"],
        });
      }

      if (data.cancellation_allowed) {
        if (data.cancellation_notice_hours === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Please specify how many hours in advance a cancellation must be made",
            path: ["cancellation_notice_hours"],
          });
        }
        if (data.cancellation_fee_percent === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the cancellation fee percentage",
            path: ["cancellation_fee_percent"],
          });
        }
      }
      if (data.reschedule_allowed) {
        if (data.reschedule_notice_hours === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Please specify how many hours in advance a reschedule must be requested",
            path: ["reschedule_notice_hours"],
          });
        }
        if (data.reschedule_fee_percent === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the reschedule fee percentage",
            path: ["reschedule_fee_percent"],
          });
        }
      }

      const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];

      for (const day of days) {
        const enabled = data[`${day}_enabled`];
        const opening = data[`${day}_opening`];
        const closing = data[`${day}_closing`];

        if (enabled) {
          if (closing >= 1439) {
            ctx.addIssue({
              path: [`${day}_closing`],
              message: `${
                day.charAt(0).toUpperCase() + day.slice(1)
              } closing time must be before 11:59 PM`,
              code: z.ZodIssueCode.custom,
            });
          }

          if (closing <= opening) {
            ctx.addIssue({
              path: [`${day}_closing`],
              message: `${
                day.charAt(0).toUpperCase() + day.slice(1)
              } closing time must be later than opening time`,
              code: z.ZodIssueCode.custom,
            });
          }
        }
        // Break time checks for the current day
        const breaks = (data.break_times || []).filter(
          (b: BreakTime) => b.day_of_week.toLowerCase() === day
        );

        // Sort breaks by startTime to check for overlap
        const sortedBreaks = breaks
          .slice()
          .sort((a: BreakTime, b: BreakTime) => a.start_time - b.start_time);

        for (let i = 0; i < sortedBreaks.length; i++) {
          const curr = sortedBreaks[i];

          // Start >= End?
          if (curr.start_time >= curr.end_time) {
            ctx.addIssue({
              path: [`${day}_break_times_${i}_end_time`],
              message: `Break end time must be after start time`,
              code: z.ZodIssueCode.custom,
            });
          }

          // Start before opening?
          if (curr.start_time < opening) {
            ctx.addIssue({
              path: [`${day}_break_times_${i}_start_time`],
              message: `Break start time cannot be before ${capitalize(
                day
              )} opening time`,
              code: z.ZodIssueCode.custom,
            });
          }

          // End after closing?
          if (curr.end_time > closing) {
            ctx.addIssue({
              path: [`${day}_break_times_${i}_end_time`],
              message: `Break end time cannot be after ${capitalize(
                day
              )} closing time`,
              code: z.ZodIssueCode.custom,
            });
          }

          // Overlap with next break
          const next = sortedBreaks[i + 1];
          if (next && curr.end_time > next.start_time) {
            ctx.addIssue({
              path: [`${day}_break_times_${i}`],
              message: `Break time overlaps with another break on ${capitalize(
                day
              )}`,
              code: z.ZodIssueCode.custom,
            });
          }
        }
      }

      // SPECIAL OFF DAY VALIDATION
      const allOffDatesSet = new Set<string>();

      data.special_off_days?.forEach((offDay: OffDay, index: number) => {
        const mode = offDay.mode;
        const pathPrefix = [`special_off_days_${index}`];

        if (mode === "single") {
          if (!offDay.start_date) {
            ctx.addIssue({
              path: [`${pathPrefix}_start_date`],
              message: "start_date is required for 'single' mode",
              code: z.ZodIssueCode.custom,
            });
          }
          if (offDay.dates || offDay.end_date) {
            ctx.addIssue({
              path: [...pathPrefix],
              message:
                "'dates' and 'end_date' must not be set for 'single' mode",
              code: z.ZodIssueCode.custom,
            });
          }

          if (offDay.start_date) {
            if (allOffDatesSet.has(offDay.start_date)) {
              ctx.addIssue({
                path: [`${pathPrefix}_start_date`],
                message: `Date ${offDay.start_date} overlaps with another special off day`,
                code: z.ZodIssueCode.custom,
              });
            }
            allOffDatesSet.add(offDay.start_date);
          }
        } else if (mode === "multiple") {
          if (!offDay.dates || offDay.dates.length === 0) {
            ctx.addIssue({
              path: [`${pathPrefix}_dates`],
              message: "'dates' must be a non-empty array for 'multiple' mode",
              code: z.ZodIssueCode.custom,
            });
          }

          if (offDay.start_date || offDay.end_date) {
            ctx.addIssue({
              path: [...pathPrefix],
              message:
                "'start_date' and 'end_date' must not be set for 'multiple' mode",
              code: z.ZodIssueCode.custom,
            });
          }

          for (const date of offDay.dates || []) {
            if (allOffDatesSet.has(date)) {
              ctx.addIssue({
                path: [`${pathPrefix}_dates`],
                message: `Date ${date} overlaps with another special off day`,
                code: z.ZodIssueCode.custom,
              });
            }
            allOffDatesSet.add(date);
          }
        } else if (mode === "range") {
          if (!offDay.start_date || !offDay.end_date) {
            ctx.addIssue({
              path: [...pathPrefix],
              message:
                "Both 'start_date' and 'end_date' are required for 'range' mode",
              code: z.ZodIssueCode.custom,
            });
            return;
          }

          if (offDay.dates) {
            ctx.addIssue({
              path: [`${pathPrefix}_dates`],
              message: "'dates' must not be set for 'range' mode",
              code: z.ZodIssueCode.custom,
            });
          }

          const start = new Date(offDay.start_date);
          const end = new Date(offDay.end_date);

          if (start > end) {
            ctx.addIssue({
              path: [`${pathPrefix}_end_date`],
              message: "end_date must be after start_date",
              code: z.ZodIssueCode.custom,
            });
          } else {
            const current = new Date(start);
            while (current <= end) {
              const dateStr = current.toISOString().split("T")[0];
              if (allOffDatesSet.has(dateStr)) {
                ctx.addIssue({
                  path: [...pathPrefix],
                  message: `Date ${dateStr} overlaps with another special off day`,
                  code: z.ZodIssueCode.custom,
                });
              }
              allOffDatesSet.add(dateStr);
              current.setDate(current.getDate() + 1);
            }
          }
        }
      });

      function capitalize(word: string) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
    });

export const bookingSettingsSchema = baseBookingSettingsSchema(timezones);

interface BookingSetupStepProps {
  data: OnboardingFormData;
  onUpdate: (data: BookingSettingsData) => void;
  ref: Ref<{
    validate: () => Promise<boolean>;
  }>;
}

export const days = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export function BookingSettingsSetupStep({
  data,
  onUpdate,
  ref,
}: BookingSetupStepProps) {
  const form = useForm<BookingSettingsData>({
    mode: "all",
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: data.bookingSettings,
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const onError = (errors: any) => {
    if (!formRef.current) return;
    console.log("Validation errors:", errors);
    const firstErrorField = Object.keys(errors)[0];
    const errorElement = formRef.current.querySelector(
      `[name="${firstErrorField}"]`
    );
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      (errorElement as HTMLElement).focus();
    }
  };

  useImperativeHandle(ref, () => ({
    async validate() {
      const isValid = await form.trigger(); // runs validation
      if (!isValid) {
        onError(form.formState.errors);
        return false;
      }
      if (isValid) {
        onUpdate(form.getValues());
      }
      return isValid;
    },
  }));

  const watchDeposits = form.watch("allow_deposits");
  const watchCancellationAllowed = form.watch("cancellation_allowed");
  const watchRescheduleAllowed = form.watch("reschedule_allowed");

  return (
    <Form {...form}>
      <form ref={formRef} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">
            Booking Settings and Policy Setup
          </h2>
          <p className="text-sm text-[#6E6E73]">
            Configure your booking settings, including the welcome message sent
            upon booking confirmation, available days with their opening and
            closing times, and the minimum and maximum number of days in advance
            that bookings can be made.
          </p>
        </div>
        <FormField
          control={form.control}
          name="welcome_message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Welcome Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Message sent to your clients upon confirmation of booking."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Message sent to your clients upon confirmation of booking
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time_zone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Zone</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  name="time_zone"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {timezone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Select the time zone for your booking settings
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time_slot_duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Slot Duration</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                  }}
                  defaultValue={`${field.value ?? 30}`}
                  name="time_slot_duration"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time " />
                  </SelectTrigger>
                  <SelectContent>
                    {[30, 45, 60, 75, 90, 120].map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {`${duration} minutes`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Define the spacing between available booking times. This sets
                how frequently time slots appear on the schedule — it does not
                determine how long an appointment lasts.
                <br />
                <br />
                For example, with a 30-minute interval:
                <br />• Morning: 8:00, 8:30, 9:00
                <br />• Afternoon: 2:00, 2:30, 3:00
                <br />
                <br />
                Choose an interval that matches how flexibly you want users to
                book within your working hours.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minimum_notice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Notice</FormLabel>
              <FormControl>
                <Input
                  name="minimum_notice"
                  type="number"
                  placeholder="0"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Enter the minimum number of days required before a customer can
                book an appointment. For example, if set to 2, the earliest
                available booking will be two days from today.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maximum_notice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Notice</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  name="maximum_notice"
                  placeholder="0"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Enter the maximum number of days from the current day within
                which a customer can book an appointment. For example, if set to
                14, the latest available booking will be 14 days from today.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Service Charge Options */}
        <FormField
          control={form.control}
          name="absorb_service_charge"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 border p-3 rounded-lg">
              <div className="w-full space-y-0.5">
                <div className="flex items-center justify-between">
                  <FormLabel>Absorb Service Charge</FormLabel>
                  <FormControl>
                    <Switch
                      name="absorb_service_charge"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  Enable this option if you want to absorb the service charge
                  instead of passing it to your customers.
                  <br />
                  When enabled, the maximum of £1 and 2.9% + £0.80 will be
                  deducted from your settlement amount as the processing fee.
                  <br />
                  When disabled, the fee will be added to the customer's total
                  payment.
                  <br />
                  <br />
                  <strong>
                    Example 1 (service fee charge not absorbed):
                  </strong>{" "}
                  You allow a £5 deposit.
                  <br />➤ The customer pays £6 (£5 deposit + £1 service charge
                  fee).
                  <br />➤ You receive the full £5 deposit at settlement.
                  <br />
                  <br />
                  <strong>
                    Example 2 (service fee charge not absorbed):
                  </strong>{" "}
                  You allow a £10 deposit.
                  <br />➤ The customer pays £11.13 (£10 deposit + £1.13 service
                  charge fee).
                  <br />➤ You receive the full £10 deposit at settlement.
                  <br />
                  <br />
                  <strong>Example 3 (service fee charge absorbed):</strong> You
                  allow a £10 deposit.
                  <br />➤ The customer pays £10.
                  <br />➤ A service fee of £1.09 is applied.
                  <br />➤ You receive £10 - £1.09 = <strong>£8.91</strong> at
                  settlement.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {/* Allow Deposits Toggle */}
        <FormField
          control={form.control}
          name="allow_deposits"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 border p-3 rounded-lg">
              <div className="w-full space-y-0.5">
                <div className="flex items-center justify-between">
                  <FormLabel>Allow Deposits</FormLabel>{" "}
                  <FormControl>
                    <Switch
                      name="allow_deposits"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  Enable this option to require only a portion of the total
                  service fee upfront.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        {watchDeposits && (
          <>
            <FormField
              control={form.control}
              name="deposit_amount"
              disabled={!watchDeposits}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 30"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value ? String(field.value) : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify the minimum amout required for a deposit. Should not
                    be less than 5.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Cancellation */}
        <FormField
          control={form.control}
          name="cancellation_allowed"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 border p-3 rounded-lg">
              <div className="space-y-0.5">
                <FormLabel>Allow Cancellation</FormLabel>
                <FormDescription>
                  Enable this option to allow your clients to cancel bookings.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  name="cancellation_allowed"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {watchCancellationAllowed && (
          <>
            <FormField
              control={form.control}
              name="cancellation_notice_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Notice (Hours)</FormLabel>
                  <Select
                    name="cancellation_notice_hours"
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">No notice required</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours (1 day)</SelectItem>
                      <SelectItem value="48">48 hours (2 days)</SelectItem>
                      <SelectItem value="72">72 hours (3 days)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specify how many hours in advance clients must notify you to
                    cancel their booking without taking a penalty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cancellation_fee_percent"
              disabled={!watchCancellationAllowed}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Fee (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 30"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value ? Number(field.value) : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Set the percentage of the booking fee charged as
                    cancellation penalty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="reschedule_allowed"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 border p-3 rounded-lg">
              <div className="space-y-0.5">
                <FormLabel>Allow Rescheduling</FormLabel>
                <FormDescription>
                  Enable this option to allow your clients to reschedule
                  bookings.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  name="reschedule_allowed"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {watchRescheduleAllowed && (
          <>
            <FormField
              control={form.control}
              name="reschedule_notice_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rescheduling Notice (Hours)</FormLabel>
                  <Select
                    name="reschedule_notice_hours"
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">No notice required</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                      <SelectItem value="12">12 hours</SelectItem>
                      <SelectItem value="24">24 hours (1 day)</SelectItem>
                      <SelectItem value="48">48 hours (2 days)</SelectItem>
                      <SelectItem value="72">72 hours (3 days)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Specify how many hours in advance clients must notify you to
                    reschedule their booking without taking a penalty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reschedule_fee_percent"
              disabled={!watchCancellationAllowed}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reschedule Fee (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 30"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value ? Number(field.value) : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Set the percentage of the booking fee charged as
                    rescheduling penalty
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="no_show_fee_percent"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 border p-3 rounded-lg">
              <div className="space-y-0.5">
                <FormLabel>No-Show Fee (%)</FormLabel>
                <FormDescription>
                  Percentage of booking fee charged when clients don't show up
                  for their appointment
                </FormDescription>
              </div>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g. 30"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value ? Number(field.value) : ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Booking Days Section */}
        <div className="mb-6">
          <h3 className="font-medium text-[#121212]">Booking Days & Hours</h3>
          <p className="text-sm text-[#6E6E73]">
            Set up your business working hours and availability
          </p>
        </div>
        <div className="space-y-4">
          {days.map((day) => (
            <FormField
              key={day.id}
              control={form.control}
              name={`${day.id}_enabled` as keyof BookingSettingsData}
              render={({ field }) => (
                <FormItem>
                  <Card className="border-[#E0E0E5]">
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                        <div className="flex items-center space-x-4">
                          <FormControl>
                            <Switch
                              name={
                                `${day.id}_enabled` as keyof BookingSettingsData
                              }
                              checked={Boolean(field.value)}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label className="text-sm font-medium">
                            {day.label}
                          </Label>
                        </div>
                        {field.value && (
                          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-2 md:gap-0">
                            <FormField
                              control={form.control}
                              name={
                                `${day.id}_opening` as keyof BookingSettingsData
                              }
                              render={({ field: openingField }) => {
                                return (
                                  <FormControl>
                                    <Input
                                      name={
                                        `${day.id}_opening` as keyof BookingSettingsData
                                      }
                                      type="time"
                                      value={minutesToTimeString(
                                        openingField.value as number
                                      )}
                                      onChange={(e) => {
                                        const [h, m] = e.target.value
                                          .split(":")
                                          .map(Number);
                                        openingField.onChange(h * 60 + m);
                                      }}
                                      className="w-32"
                                    />
                                  </FormControl>
                                );
                              }}
                            />
                            <span className="text-sm text-[#6E6E73]">to</span>
                            <FormField
                              control={form.control}
                              name={
                                `${day.id}_closing` as keyof BookingSettingsData
                              }
                              render={({ field: closingField }) => (
                                <div className="w-32 flex flex-col">
                                  <FormControl className="self-end">
                                    <Input
                                      name={
                                        `${day.id}_closing` as keyof BookingSettingsData
                                      }
                                      type="time"
                                      value={minutesToTimeString(
                                        closingField.value as number
                                      )}
                                      onChange={(e) => {
                                        const [h, m] = e.target.value
                                          .split(":")
                                          .map(Number);
                                        closingField.onChange(h * 60 + m);
                                      }}
                                      className="w-32"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </div>
                              )}
                            />
                          </div>
                        )}
                      </div>
                      {field.value && (
                        <div className="mt-4">
                          <BreakTimesManager
                            form={form}
                            breakTimes={form.watch("break_times") || []}
                            dayId={day.id}
                            onAdd={(breakTime) => {
                              const current = form.watch("break_times") || [];
                              const newBreakTimes = [...current];
                              const index = newBreakTimes.findIndex(
                                (b) => b.id === breakTime.id
                              );
                              if (index >= 0) {
                                newBreakTimes[index] = breakTime;
                              } else {
                                newBreakTimes.push(breakTime);
                              }
                              form.setValue("break_times", newBreakTimes);
                            }}
                            onRemove={(id) => {
                              const current = form.watch("break_times") || [];
                              form.setValue(
                                "break_times",
                                current.filter((b) => b.id !== id)
                              );
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </FormItem>
              )}
            />
          ))}
        </div>
        {/* Add Off Days Manager */}
        <FormField
          control={form.control}
          name="special_off_days"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OffDaysManager
                  form={form}
                  offDays={field.value || []}
                  onAdd={(offDay) => {
                    const newOffDays = [...(field.value || [])];
                    const index = newOffDays.findIndex(
                      (d) => d.id === offDay.id
                    );
                    if (index >= 0) {
                      newOffDays[index] = offDay;
                    } else {
                      newOffDays.push(offDay);
                    }
                    field.onChange(newOffDays);
                  }}
                  onRemove={(id) => {
                    field.onChange(
                      (field.value || []).filter((d) => d.id !== id)
                    );
                  }}
                />
              </FormControl>
              <FormDescription>
                Set specific dates when your business will be closed
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="custom_policies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custom Policies</FormLabel>
              <FormControl>
                <PolicyManager form={form} />
              </FormControl>
              <FormDescription>
                Add custom policies for your business. Each policy must belong
                to a category (title).
                <br />
                General policies for deposits, cancellations, rescheduling and
                no shows will be generated based on your settings above. Specify
                any additional rules, or special requirements that clients
                should know before booking. This helps set clear expectations
                and ensures smooth service delivery.
              </FormDescription>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
