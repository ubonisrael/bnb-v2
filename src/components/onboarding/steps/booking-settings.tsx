"use client";

import { Ref, useImperativeHandle, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, Clock, DollarSign, Calendar, Edit, Trash } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      welcome_message: z
        .string()
        .min(24, { message: "Welcome message must be at least 24 characters" }),
      maximum_notice: z
        .number()
        .min(0, { message: "Maximum notice must be at least 0" }),
      minimum_notice: z
        .number()
        .min(0, { message: "Minimum notice must be at least 0" }),
      time_zone: z
        .string()
        .min(2, { message: "Time zone must be at least 2 characters" })
        .refine((val) => allowedTimeZones.includes(val), {
          message: "Invalid time zone selected",
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
    .superRefine((data: Record<string, any>, ctx) => {
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
              message: `${day} closing time must be less than 1380`,
              code: z.ZodIssueCode.custom,
            });
          }

          if (closing <= opening) {
            ctx.addIssue({
              path: [`${day}_closing`],
              message: `${day} closing time must be after opening time`,
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

const days = [
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
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: data.bookingSettings,
  });

  useImperativeHandle(ref, () => ({
    async validate() {
      const isValid = await form.trigger(); // runs validation
      if (isValid) {
        onUpdate(form.getValues());
      }
      return isValid;
    },
  }));

  function onSubmit(values: BookingSettingsData) {
    // onUpdate(values)
    console.log("Booking Settings", values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">
            Booking Settings Setup
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
          name="minimum_notice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Notice</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Enter the minimum number of days' notice required before a
                customer can book an appointment. For example, if set to 2, the
                earliest available booking will be two days from today.
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
                  placeholder="0"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Enter the maximum number of days' notice required before a
                customer can book an appointment. For example, if set to 14, the
                latest available booking will be 14 days from today.
              </FormDescription>
              <FormMessage />
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <FormControl>
                            <Switch
                              checked={Boolean(field.value)}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label className="text-sm font-medium">
                            {day.label}
                          </Label>
                        </div>
                        {field.value && (
                          <div className="flex items-center space-x-4">
                            <FormField
                              control={form.control}
                              name={
                                `${day.id}_opening` as keyof BookingSettingsData
                              }
                              render={({ field: openingField }) => {
                                return (
                                  <FormControl>
                                    <Input
                                      type="time"
                                      value={minutesToTimeString(
                                        openingField.value as number
                                      )}
                                      onChange={(e) => {
                                        // console.log()
                                        console.log("value", e.target.value);
                                        const [h, m] = e.target.value
                                          .split(":")
                                          .map(Number);
                                        // console.log(e.target.valueAsNumber)
                                        // console.log(minutesToTimeString(e.target.valueAsNumber))
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
                                    type="time"
                                    value={minutesToTimeString(
                                      closingField.value as number
                                    )}
                                    onChange={(e) => {
                                      // console.log()
                                      console.log("value", e.target.value);
                                      const [h, m] = e.target.value
                                        .split(":")
                                        .map(Number);
                                      // console.log(e.target.valueAsNumber)
                                      // console.log(minutesToTimeString(e.target.valueAsNumber))
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
