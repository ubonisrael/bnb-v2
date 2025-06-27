"use client";

import api from "@/services/api-service";
import { BusinessSettingsResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef } from "react";
import { UnsavedChangesBanner } from "../UnSavedChangesBanner";
import { BookingSettingsForm } from "../ui/booking-settings-form";
import { bookingSettingsSchema } from "@/schemas/schema";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

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
        settings?.bookingSettings.cancellation_notice_hours || 0,
      cancellation_fee_percent:
        settings?.bookingSettings.cancellation_fee_percent || 0,
      reschedule_allowed: settings?.bookingSettings.reschedule_allowed || false,
      reschedule_notice_hours:
        settings?.bookingSettings.reschedule_notice_hours || 0,
      reschedule_fee_percent:
        settings?.bookingSettings.reschedule_fee_percent || 0,
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
      auto_generate_deposit_policy:
        settings?.bookingSettings?.auto_generate_deposit_policy || true,
      auto_generate_cancellation_policy:
        settings?.bookingSettings?.auto_generate_cancellation_policy || true,
      auto_generate_reschedule_policy:
        settings?.bookingSettings?.auto_generate_reschedule_policy || true,
      auto_generate_no_show_policy:
        settings?.bookingSettings?.auto_generate_no_show_policy || true,
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

  const { isDirty } = form.formState;
  return (
    <>
      {isDirty && <UnsavedChangesBanner form={form} />}
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-4 md:space-y-6 xl:space-y-8"
        >
          <BookingSettingsForm
            form={form}
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
