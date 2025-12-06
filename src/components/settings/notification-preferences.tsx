"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import api from "@/services/api-service";
import {
  NotificationSettingsData,
  notificationSettingsSchema,
} from "../onboarding/steps/notification-settings";
import { Card, CardContent } from "../ui/card";
import { useRef, useEffect } from "react";
import { UnsavedChangesBanner } from "../UnSavedChangesBanner";
import { Skeleton } from "../ui/skeleton";

interface NotificationSettings {
  email_confirmation: boolean;
  appointment_reminders: boolean;
  reminder_time: number;
  cancellation_notices: boolean;
  no_show_notifications: boolean;
  follow_up_emails: boolean;
  follow_up_delay: number;
}

interface NotificationResponse {
  success: boolean;
  message: string;
  data: NotificationSettings;
}

export function NotificationPreferences() {
  const queryClient = useQueryClient();

  // Fetch notification settings
  const { data: notificationData, isLoading: isLoadingNotifications } =
    useQuery({
      queryKey: ["notification-settings"],
      queryFn: async () => {
        const response = await api.get<NotificationResponse>(
          "sp/notifications"
        );
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });

  const form = useForm<NotificationSettingsData>({
    mode: "all",
    resolver: zodResolver(notificationSettingsSchema),
    values: notificationData
      ? {
          emailSettings: {
            sendBookingConfirmations: notificationData.email_confirmation,
            sendReminders: notificationData.appointment_reminders,
            reminderHours: notificationData.reminder_time,
            sendCancellationNotices: notificationData.cancellation_notices,
            sendNoShowNotifications: notificationData.no_show_notifications,
            sendFollowUpEmails: notificationData.follow_up_emails,
            followUpDelayHours: notificationData.follow_up_delay,
          },
        }
      : {
          emailSettings: {
            sendBookingConfirmations: false,
            sendReminders: false,
            reminderHours: 24,
            sendCancellationNotices: false,
            sendNoShowNotifications: false,
            sendFollowUpEmails: false,
            followUpDelayHours: 48,
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

  const updateNotificationMutation = useMutation({
    mutationFn: async (values: NotificationSettingsData) => {
      const response = await api.patch<NotificationResponse>(
        "sp/notifications",
        {
          email_confirmation: values.emailSettings.sendBookingConfirmations,
          appointment_reminders: values.emailSettings.sendReminders,
          reminder_time: values.emailSettings.reminderHours,
          cancellation_notices: values.emailSettings.sendCancellationNotices,
          no_show_notifications: values.emailSettings.sendNoShowNotifications,
          follow_up_emails: values.emailSettings.sendFollowUpEmails,
          follow_up_delay: values.emailSettings.followUpDelayHours,
        }
      );
      return response.data;
    },
    onMutate: () => {
      toast.loading("Saving notification preferences...", {
        id: "notification-save",
      });
    },
    onSuccess: () => {
      toast.success("Notification preferences updated successfully", {
        id: "notification-save",
      });
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update notification preferences",
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

  const { isDirty } = form.formState;

  if (isLoadingNotifications) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-full" />
        <Card className="border-[#E0E0E5]">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                          Send confirmation emails when clients book
                          appointments
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
                            field.onChange(Number(value))
                          }
                          value={field.value ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select hours" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0.25">15 minutes</SelectItem>
                            <SelectItem value="0.5">30 minutes</SelectItem>
                            <SelectItem value="0.75">45 minutes</SelectItem>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="1.25">
                              1 hour 15 minutes
                            </SelectItem>
                            <SelectItem value="1.5">
                              1 hour 30 minutes
                            </SelectItem>
                            <SelectItem value="1.75">
                              1 hour 45 minutes
                            </SelectItem>
                            <SelectItem value="2">2 hours</SelectItem>
                            <SelectItem value="4">4 hours</SelectItem>
                            <SelectItem value="8">8 hours</SelectItem>
                            <SelectItem value="12">12 hours</SelectItem>
                            <SelectItem value="24">24 hours (1 day)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How many hours before the appointment to send
                          reminders
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
                          Send emails when clients don't show up for
                          appointments
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
                            field.onChange(Number(value))
                          }
                          value={field.value ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select hours" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0.25">15 minutes</SelectItem>
                            <SelectItem value="0.5">30 minutes</SelectItem>
                            <SelectItem value="0.75">45 minutes</SelectItem>
                            <SelectItem value="1">1 hour</SelectItem>
                            <SelectItem value="1.25">
                              1 hour 15 minutes
                            </SelectItem>
                            <SelectItem value="1.5">
                              1 hour 30 minutes
                            </SelectItem>
                            <SelectItem value="1.75">
                              1 hour 45 minutes
                            </SelectItem>
                            <SelectItem value="2">2 hours</SelectItem>
                            <SelectItem value="4">4 hours</SelectItem>
                            <SelectItem value="8">8 hours</SelectItem>
                            <SelectItem value="12">12 hours</SelectItem>
                            <SelectItem value="24">24 hours (1 day)</SelectItem>
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
              disabled={updateNotificationMutation.isPending || !isDirty}
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
    </>
  );
}
