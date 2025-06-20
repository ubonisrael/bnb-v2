"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import api from "@/services/api-service";
import {
  NotificationSettingsData,
  notificationSettingsSchema,
} from "../onboarding/steps/notification-settings";
import { NotificationSettingsResponse } from "@/types/response";
import { Card, CardContent } from "../ui/card";
import { useRef } from "react";

export function NotificationPreferences() {
  const {
    settings,
    updateSettings,
    isLoading: settingsLoading,
  } = useUserSettings();

  const form = useForm<NotificationSettingsData>({
    mode: "all",
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: settings?.notifications,
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

  const updateNotificationMutation = useMutation({
    mutationFn: async (values: NotificationSettingsData) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.patch<NotificationSettingsResponse>(
          "sp/notifications",
          {
            email_confirmation: values.emailSettings.sendBookingConfirmations,
            appointment_reminders: values.emailSettings.sendReminders,
            reminder_time: values.emailSettings.reminderHours,
            cancellation_notices: values.emailSettings.sendCancellationNotices,
            no_show_notifications: values.emailSettings.sendNoShowNotifications,
            follow_up_emails: values.emailSettings.sendFollowUpEmails,
            follow_up_delay: values.emailSettings.followUpDelayHours,
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
      toast.loading("Saving notification preferences...", {
        id: "notification-save",
      });
    },
    onSuccess: (response) => {
      toast.success("Notification preferences updated successfully", {
        id: "notification-save",
      });
      updateSettings("notifications", {
        emailSettings: {
          sendBookingConfirmations: response.data.email_confirmation,
          sendReminders: response.data.appointment_reminders,
          reminderHours: response.data.reminder_time,
          sendCancellationNotices: response.data.cancellation_notices,
          sendNoShowNotifications: response.data.no_show_notifications,
          sendFollowUpEmails: response.data.follow_up_emails,
          followUpDelayHours: response.data.follow_up_delay,
        },
      });
    },
    onError: (error: Error) => {
      toast.error(
        error?.message || "Failed to update notification preferences",
        { id: "notification-save" }
      );
    },
  });

  async function onSubmit(values: NotificationSettingsData) {
    try {
      await updateNotificationMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
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
                        defaultChecked={field.value}
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
                        defaultChecked={field.value}
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
                        defaultChecked={field.value}
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
                        defaultChecked={field.value}
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
                        defaultChecked={field.value}
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

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={updateNotificationMutation.isPending || settingsLoading}
          >
            {updateNotificationMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
