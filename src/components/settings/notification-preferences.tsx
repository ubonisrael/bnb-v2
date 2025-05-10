"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useUserSettings } from "@/contexts/user-settings-context"
import api from "@/services/api-service"
import { BusinessDataResponse } from "@/types/response"

const notificationSchema = z.object({
  email: z.object({
    bookingConfirmations: z.boolean().default(true),
    bookingReminders: z.boolean().default(true),
    bookingCancellations: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
    reviewRequests: z.boolean().default(true),
  }),
  sms: z.object({
    bookingConfirmations: z.boolean().default(true),
    bookingReminders: z.boolean().default(true),
    bookingCancellations: z.boolean().default(true),
  }),
  reminderTiming: z.string().default("24"),
})

type NotificationFormValues = z.infer<typeof notificationSchema>

export function NotificationPreferences() {
  const { settings, updateSettings, isLoading: settingsLoading } = useUserSettings()

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: settings?.notifications,
  })

  const updateNotificationMutation = useMutation({
    mutationFn: async (values: NotificationFormValues) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.patch<BusinessDataResponse>(
          '/my-business-notifications',
          {
            email: values.email,
            sms: values.sms,
            reminderTiming: values.reminderTiming,
          },
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          toast.error('Request was cancelled');
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading('Saving notification preferences...', { id: 'notification-save' });
    },
    onSuccess: (response) => {
      toast.success('Notification preferences updated successfully', { id: 'notification-save' });
      updateSettings("notifications", response.data);
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update notification preferences', { id: 'notification-save' });
    },
  });

  async function onSubmit(values: NotificationFormValues) {
    try {
      await updateNotificationMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <p className="text-sm text-muted-foreground">Manage the emails you receive from us</p>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email.bookingConfirmations"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Booking Confirmations</FormLabel>
                  <FormDescription>Receive emails when a booking is confirmed</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email.bookingReminders"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Booking Reminders</FormLabel>
                  <FormDescription>Receive reminder emails before appointments</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email.bookingCancellations"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Booking Cancellations</FormLabel>
                  <FormDescription>Receive emails when a booking is cancelled</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email.marketingEmails"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Marketing Emails</FormLabel>
                  <FormDescription>Receive marketing emails and promotions</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email.reviewRequests"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Review Requests</FormLabel>
                  <FormDescription>Receive emails asking for reviews after appointments</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium">Reminder Settings</h3>
          <p className="text-sm text-muted-foreground">Configure when reminders are sent</p>
        </div>

        <FormField
          control={form.control}
          name="reminderTiming"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select when to send reminders" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="2">2 hours before</SelectItem>
                  <SelectItem value="4">4 hours before</SelectItem>
                  <SelectItem value="12">12 hours before</SelectItem>
                  <SelectItem value="24">24 hours before</SelectItem>
                  <SelectItem value="48">48 hours before</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>How long before the appointment to send reminders</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
  )
}

