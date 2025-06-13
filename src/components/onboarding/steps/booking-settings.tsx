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
import { BookingSettingsData, OnboardingFormData } from "../type";
import { minutesToTimeString, timezones } from "@/utils/time";
import { Textarea } from "@/components/ui/textarea";

const createBookingSettingsSchema = (allowedTimeZones: string[]) =>
  z
    .object({
      welcome_message: z.string().min(24, {
        message:
          "Welcome message must be at least 24 characters long to provide sufficient information",
      }),
      time_slot_duration: z
        .number({
          required_error: "Please specify a time slot duration",
          invalid_type_error: "Time slot duration must be a valid number",
        })
        .min(30, "Time slot duration must be at least 30 minutes")
        .max(120, "Time slot duration cannot exceed 120 minutes"),
      allow_deposits: z.boolean(),
      deposit_amount: z
        .number({
          required_error:
            "Please specify a deposit amount when deposits are allowed",
          invalid_type_error: "Deposit amount must be a valid number",
        })
        .min(5, "Deposit amount must be at least 5 to cover processing fees")
        .optional(),
      cancellation_allowed: z.boolean(),
      cancellation_notice_hours: z
        .number()
        .refine((value) => [0, 4, 8, 12, 24, 48, 72].includes(value), {
          message:
            "Cancellation notice hours must be one of the following: 0, 4, 8, 12, 24, 48, or 72",
        })
        .optional(),
      cancellation_fee_percent: z
        .number({
          invalid_type_error: "Cancellation fee must be a valid percentage",
          required_error: "Please specify cancellation fee percentage",
        })
        .min(0, "Cancellation fee cannot be negative")
        .max(100, "Cancellation fee cannot exceed 100%")
        .optional(),
      no_show_fee_percent: z
        .number({
          invalid_type_error: "No-show fee must be a valid percentage",
          required_error: "Please specify no-show fee percentage",
        })
        .min(10, "No-show fee must be at least 10%")
        .max(100, "No-show fee cannot exceed 100%"),
      reschedule_allowed: z.boolean(),
      reschedule_notice_hours: z
        .number()
        .refine((value) => [0, 4, 8, 12, 24, 48, 72].includes(value), {
          message:
            "Reschedule notice hours must be one of the following: 0, 4, 8, 12, 24, 48, or 72",
        })
        .optional(),
      reschedule_fee_percent: z
        .number({
          invalid_type_error: "Reschedule fee must be a valid percentage",
          required_error: "Please specify reschedule fee percentage",
        })
        .min(0, "Reschedule fee cannot be negative")
        .max(100, "Reschedule fee cannot exceed 100%")
        .optional(),
      maximum_notice: z
        .number({
          invalid_type_error: "Maximum notice must be a valid number",
          required_error: "Please specify maximum advance booking notice",
        })
        .min(0, "Maximum advance booking notice cannot be negative"),
      minimum_notice: z
        .number({
          invalid_type_error: "Minimum notice must be a valid number",
          required_error: "Please specify minimum advance booking notice",
        })
        .min(0, "Minimum advance booking notice cannot be negative"),
      time_zone: z
        .string({
          required_error: "Please select a time zone",
          invalid_type_error: "Time zone must be a valid string",
        })
        .min(2, "Please select a valid time zone")
        .refine((val) => allowedTimeZones.includes(val), {
          message: "Please select a time zone from the provided list",
        }),

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
          if (closing >= 1380) {
            ctx.addIssue({
              path: [`${day}_closing`],
              message: `${
                day.charAt(0).toUpperCase() + day.slice(1)
              } closing time must be before 11:00 PM`,
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
      }
    });

export const bookingSettingsSchema = createBookingSettingsSchema(timezones);

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
                Define how long each appointment slot will be. This determines
                the intervals between available booking times.
                <br />
                For example, with a 30-minute duration:
                <br />• Morning slots: 8:00, 8:30, 9:00
                <br />• Afternoon slots: 2:00, 2:30, 3:00
                <br />Choose a duration that suits your service delivery time and scheduling preferences.
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
        {/* Allow Deposits Toggle */}
        <FormField
          control={form.control}
          name="allow_deposits"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0 border p-3 rounded-lg">
              <div className="space-y-0.5">
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
                  <br />
                  Customers will be charged a{" "}
                  <strong>£1 non-refundable booking fee</strong>.
                  <br />
                  By default, a <strong>£5 deposit</strong> is allowed. If you
                  enable deposits above £5 or require full payment upfront, a
                  processing fee of <strong>2.9% + £0.80</strong> will apply to
                  the entire transaction (including the £1 booking fee).
                  <br />
                  <span className="text-red-500">
                    This processing fee will be deducted before settlement,
                    reducing the amount your business receives.
                  </span>
                  <br />
                  <br />
                  <strong>Example 1:</strong> You charge £20 and allow a £5
                  deposit.
                  <br />➤ The customer pays £6 (£5 deposit + £1 booking fee).
                  <br />➤ No processing fee applies. You receive the full £5
                  deposit at settlement.
                  <br />
                  <br />
                  <strong>Example 2:</strong> You charge £40 and require full
                  payment.
                  <br />➤ The customer pays £41 (£40 + £1 booking fee).
                  <br />➤ A processing fee of £1.98 (2.9% of £41 + £0.80) is
                  applied.
                  <br />➤ You receive £41- £1.98 = <strong>£39.02</strong> at
                  settlement.
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
                                <FormControl>
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
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </FormItem>
              )}
            />
          ))}
        </div>
      </form>
    </Form>
  );
}
