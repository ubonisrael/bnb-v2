"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api-service";
import { SettingsResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import {
  minutesToTimeString,
  timeStringToMinutes,
  timezones,
} from "@/utils/time";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useUserSettings } from "@/contexts/user-settings-context";
import { BookingSettingsData } from "../onboarding/type";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSettingsSchema } from "../onboarding/steps/booking-settings";
import { z } from "zod";

const days = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];
export interface WorkingHours {
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

export interface BookingDaysSettingsProps {
  initialData?: {
    [key: string]: WorkingHours;
  };
}

export function BookingDaysSettings({ initialData }: BookingDaysSettingsProps) {
  const {
    settings,
    updateSettings,
    isLoading: settingsLoading,
  } = useUserSettings();

  const form = useForm<z.infer<typeof bookingSettingsSchema>>({
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: {
      welcome_message: settings?.bookingSettings?.welcome_message || "",
      time_zone: settings?.bookingSettings?.time_zone || "",
      minimum_notice: settings?.bookingSettings?.minimum_notice || 0,
      maximum_notice: settings?.bookingSettings?.maximum_notice || 0,
      monday_enabled: settings?.bookingSettings?.monday_enabled || false,
      monday_opening: settings?.bookingSettings?.monday_opening || 640,
      monday_closing: settings?.bookingSettings?.monday_closing || 1200,
      tuesday_enabled: settings?.bookingSettings?.tuesday_enabled || false,
      tuesday_opening: settings?.bookingSettings?.tuesday_opening || 640,
      tuesday_closing: settings?.bookingSettings?.tuesday_closing || 1200,
      wednesday_enabled: settings?.bookingSettings?.wednesday_enabled || false,
      wednesday_opening: settings?.bookingSettings?.wednesday_opening || 640,
      wednesday_closing: settings?.bookingSettings?.wednesday_closing || 1200,
      thursday_enabled: settings?.bookingSettings?.thursday_enabled || false,
      thursday_opening: settings?.bookingSettings?.thursday_opening || 640,
      thursday_closing: settings?.bookingSettings?.thursday_closing || 1200,
      friday_enabled: settings?.bookingSettings?.friday_enabled || false,
      friday_opening: settings?.bookingSettings?.friday_opening || 640,
      friday_closing: settings?.bookingSettings?.friday_closing || 1200,
      saturday_enabled: settings?.bookingSettings?.saturday_enabled || false,
      saturday_opening: settings?.bookingSettings?.saturday_opening || 640,
      saturday_closing: settings?.bookingSettings?.saturday_closing || 1200,
      sunday_enabled: settings?.bookingSettings?.sunday_enabled || false,
      sunday_opening: settings?.bookingSettings?.sunday_opening || 640,
      sunday_closing: settings?.bookingSettings?.sunday_closing || 1200,
    },
  });

  const updateBookingSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof bookingSettingsSchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post<SettingsResponse>(
          "/sp/booking_settings",
          {
            ...values,
          },
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Saving booking settings...", {
        id: "booking-settings-save",
      });
    },
    onSuccess: (response) => {
      toast.success("Booking days updated successfully", {
        id: "booking-days-save",
      });
      updateSettings("bookingSettings", response.data);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update booking days", {
        id: "booking-days-save",
      });
    },
  });

  const handleSave = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      try {
        await updateBookingSettingsMutation.mutateAsync(form.getValues());
      } catch (error) {
        console.error("Error saving booking days:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#121212]">
              Booking Settings Setup
            </h2>
            <p className="text-sm text-[#6E6E73]">
              Configure your booking settings, including the welcome message
              sent upon booking confirmation, available days with their opening
              and closing times, and the minimum and maximum number of days in
              advance that bookings can be made.
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
                  customer can book an appointment. For example, if set to 2,
                  the earliest available booking will be two days from today.
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
                  customer can book an appointment. For example, if set to 14,
                  the latest available booking will be 14 days from today.
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

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateBookingSettingsMutation.isPending}
        >
          {updateBookingSettingsMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
