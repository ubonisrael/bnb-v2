"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api-service";
import { BusinessSettingsResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import { minutesToTimeString, timezones } from "@/utils/time";
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
import {
  bookingSettingsSchema,
  days,
} from "../onboarding/steps/booking-settings";
import { z } from "zod";
import { useRef } from "react";

export function BookingDaysSettings() {
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
      allow_deposits: settings?.bookingSettings?.allow_deposits || false,
      deposit_amount: settings?.bookingSettings?.deposit_amount || undefined,
      cancellation_allowed:
        settings?.bookingSettings.cancellation_allowed || false,
      cancellation_notice_hours:
        settings?.bookingSettings.cancellation_notice_hours || undefined,
      cancellation_fee_percent:
        settings?.bookingSettings.cancellation_fee_percent || undefined,
      reschedule_allowed: settings?.bookingSettings.reschedule_allowed || false,
      reschedule_notice_hours:
        settings?.bookingSettings.reschedule_notice_hours || undefined,
      reschedule_fee_percent:
        settings?.bookingSettings.reschedule_fee_percent || undefined,
      no_show_fee_percent: settings?.bookingSettings.no_show_fee_percent || 100,
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

  const updateBookingSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof bookingSettingsSchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.patch<BusinessSettingsResponse>(
          "sp/booking_settings",
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
        id: "booking-settings-save",
      });
      updateSettings("bookingSettings", response.data);
    },
    onError: (error: Error) => {
      toast.error("Failed to update booking days", {
        id: "booking-settings-save",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof bookingSettingsSchema>) => {
    try {
      await updateBookingSettingsMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error saving booking days:", error);
    }
  };

  const watchDeposits = form.watch("allow_deposits");
  const watchCancellationAllowed = form.watch("cancellation_allowed");
  const watchRescheduleAllowed = form.watch("reschedule_allowed");

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
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
                  name="time_zone"
                  onValueChange={field.onChange}
                  value={field.value}
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
                <FormLabel>Allow Deposits</FormLabel>
                <FormDescription>
                  Enable this option to require only a portion of the total
                  service fee upfront.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  name="allow_deposits"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              updateBookingSettingsMutation.isPending || settingsLoading
            }
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
      </form>
    </Form>
  );
}
