"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OnboardingFormData } from "../type";
import { Ref, useImperativeHandle, useRef } from "react";

export const notificationSettingsSchema = z.object({
  emailSettings: z.object({
    sendBookingConfirmations: z.boolean().default(true),
    sendReminders: z.boolean().default(true),
    reminderHours: z.coerce
      .number()
      .min(1, { message: "Must be at least 1 hour" }),
    sendCancellationNotices: z.boolean().default(true),
    sendNoShowNotifications: z.boolean().default(true),
    sendFollowUpEmails: z.boolean().default(false),
    followUpDelayHours: z.coerce
      .number()
      .min(1, { message: "Must be at least 1 hour" })
      .optional(),
  }),
});

export type NotificationSettingsData = z.infer<
  typeof notificationSettingsSchema
>;

interface NotificationSettingsStepProps {
  data: OnboardingFormData;
  onUpdate: (data: NotificationSettingsData) => void;
  ref: Ref<{ validate: () => Promise<boolean> }>;
}

export function NotificationSettingsStep({
  data,
  onUpdate,
  ref,
}: NotificationSettingsStepProps) {
  const form = useForm<NotificationSettingsData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailSettings: {
        sendBookingConfirmations:
          data.notificationSettings.emailSettings.sendBookingConfirmations ??
          true,
        sendReminders:
          data.notificationSettings.emailSettings.sendReminders ?? true,
        reminderHours:
          data.notificationSettings.emailSettings.reminderHours || 24,
        sendCancellationNotices:
          data.notificationSettings.emailSettings.sendCancellationNotices ??
          true,
        sendNoShowNotifications:
          data.notificationSettings.emailSettings.sendNoShowNotifications ??
          true,
        sendFollowUpEmails:
          data.notificationSettings.emailSettings.sendFollowUpEmails ?? false,
        followUpDelayHours:
          data.notificationSettings.emailSettings.followUpDelayHours || 48,
      },
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

  useImperativeHandle(ref, () => ({
    async validate() {
      const isValid = await form.trigger(); // runs validation
      if (!isValid) {
        onError(form.formState.errors);
      }
      if (isValid) {
        onUpdate(form.getValues());
      }
      return isValid;
    },
  }));

  function onSubmit(values: NotificationSettingsData) {
    onUpdate(values);
  }

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">
            Notification Settings
          </h2>
          <p className="text-sm text-[#6E6E73]">
            Configure your email notifications settings
          </p>
        </div>

        <Card className="border-[#E0E0E5]">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium text-[#121212]">
                Email Notifications
              </h3>

              <FormField
                control={form.control}
                name="emailSettings.sendBookingConfirmations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Booking Confirmations</FormLabel>
                      <FormDescription>
                        Send confirmation emails when clients book appointments
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        name="emailSettings.sendBookingConfirmations"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailSettings.sendReminders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Appointment Reminders</FormLabel>
                      <FormDescription>
                        Send reminder emails before appointments
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        name="emailSettings.sendReminders"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("emailSettings.sendReminders") && (
                <FormField
                  control={form.control}
                  name="emailSettings.reminderHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Reminder Time (Hours Before Appointment)
                      </FormLabel>
                      <Select
                        name="emailSettings.reminderHours"
                        onValueChange={(value) =>
                          field.onChange(Number.parseInt(value))
                        }
                        defaultValue={field.value.toString()}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hours" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="12">12 hours</SelectItem>
                          <SelectItem value="24">24 hours (1 day)</SelectItem>
                          <SelectItem value="48">48 hours (2 days)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How many hours before the appointment to send reminders
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="emailSettings.sendCancellationNotices"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Cancellation Notices</FormLabel>
                      <FormDescription>
                        Send emails when appointments are cancelled
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        name="emailSettings.sendCancellationNotices"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailSettings.sendNoShowNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>No-Show Notifications</FormLabel>
                      <FormDescription>
                        Send emails when clients don't show up for appointments
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        name="emailSettings.sendNoShowNotifications"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailSettings.sendFollowUpEmails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Follow-Up Emails</FormLabel>
                      <FormDescription>
                        Send follow-up emails after appointments
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        name="emailSettings.sendFollowUpEmails"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("emailSettings.sendFollowUpEmails") && (
                <FormField
                  control={form.control}
                  name="emailSettings.followUpDelayHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Follow-Up Delay (Hours After Appointment)
                      </FormLabel>
                      <Select
                        name="emailSettings.followUpDelayHours"
                        onValueChange={(value) =>
                          field.onChange(Number.parseInt(value))
                        }
                        defaultValue={field.value?.toString() || "24"}
                        value={field.value?.toString() || "24"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select hours" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="12">12 hours</SelectItem>
                          <SelectItem value="24">24 hours (1 day)</SelectItem>
                          <SelectItem value="48">48 hours (2 days)</SelectItem>
                          <SelectItem value="72">72 hours (3 days)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How many hours after the appointment to send follow-up
                        emails
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
