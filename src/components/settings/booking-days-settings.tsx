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
import { useUserSettings } from "@/contexts/UserSettingsContext";
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
import { OffDaysManager } from "./off-days-manager";
import { BreakTimesManager } from "./break-times-manager";
import { PolicyManager } from "./policy-manager";
import { UnsavedChangesBanner } from "../UnSavedChangesBanner";

export function BookingDaysSettings() {
  const {
    settings,
    updateSettings,
    isLoading: settingsLoading,
  } = useUserSettings();

  const form = useForm<z.infer<typeof bookingSettingsSchema>>({
    mode: "all",
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: {
      absorb_service_charge:
        settings?.bookingSettings?.absorb_service_charge || false,
      welcome_message: settings?.bookingSettings?.welcome_message || "",
      time_slot_duration: settings?.bookingSettings?.time_slot_duration || 30,
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
      special_off_days: settings?.bookingSettings?.special_off_days || [],
      break_times: settings?.bookingSettings?.break_times || [],
      custom_policies: settings?.bookingSettings?.custom_policies || [],
    },
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const onError = (errors: any) => {
    if (!formRef.current) return;
    console.log(errors);
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
      // reset form after successful save
      form.reset(form.getValues());
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

  const { isDirty } = form.formState;
  return (
    <>
      {isDirty && <UnsavedChangesBanner form={form} />}
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
                  Enter the minimum number of days required before a customer
                  can book an appointment. For example, if set to 2, the
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
                    name="maximum_notice"
                    type="number"
                    placeholder="0"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Enter the maximum number of days from the current day within
                  which a customer can book an appointment. For example, if set
                  to 14, the latest available booking will be 14 days from
                  today.
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
                    <br />➤ The customer pays £11.13 (£10 deposit + £1.13
                    service charge fee).
                    <br />➤ You receive the full £10 deposit at settlement.
                    <br />
                    <br />
                    <strong>
                      Example 3 (service fee charge absorbed):
                    </strong>{" "}
                    You allow a £10 deposit.
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
                      Specify the minimum amount required for a deposit. Should
                      not be less than 5.
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
                      Specify how many hours in advance clients must notify you
                      to cancel their booking without taking a penalty
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
                      Specify how many hours in advance clients must notify you
                      to reschedule their booking without taking a penalty
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
              <FormItem className="flex flex-col gap-1">
                <div className="flex items-center justify-between space-y-0 border p-3 rounded-lg">
                  <div className="space-y-0.5">
                    <FormLabel>No-Show Fee (%)</FormLabel>
                    <FormDescription>
                      Percentage of booking fee charged when clients don't show
                      up for their appointment
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
                </div>
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
                  <PolicyManager form={form} field={field} />
                </FormControl>
                <FormDescription>
                  Add custom policies for your business. Each policy must belong
                  to a category (title).
                  <br />
                  General policies for deposits, cancellations, rescheduling and
                  no shows will be generated based on your settings above.
                  Specify any additional rules, or special requirements that
                  clients should know before booking. This helps set clear
                  expectations and ensures smooth service delivery.
                </FormDescription>
              </FormItem>
            )}
          />
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
    </>
  );
}
