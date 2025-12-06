"use client";

import api from "@/services/api-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useEffect } from "react";
import { UnsavedChangesBanner } from "../UnSavedChangesBanner";
import { BookingSettingsForm } from "../ui/booking-settings-form";
import { bookingSettingsSchema } from "@/schemas/schema";
import { Form } from "../ui/form";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface BookingSettingsResponse {
  success: boolean;
  message: string;
  data: z.infer<typeof bookingSettingsSchema>;
}

export function BookingDaysSettings() {
  const queryClient = useQueryClient();

  // Fetch booking settings
  const { data: bookingSettings, isLoading: isLoadingBookingSettings } =
    useQuery({
      queryKey: ["booking-settings"],
      queryFn: async () => {
        const response = await api.get<BookingSettingsResponse>(
          "sp/booking_settings"
        );
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });

  const form = useForm<z.infer<typeof bookingSettingsSchema>>({
    mode: "all",
    resolver: zodResolver(bookingSettingsSchema),
    values: bookingSettings ?? {
      reschedule_penalty_enabled: false,
      absorb_service_charge: false,
      welcome_message: "",
      time_slot_duration: 30,
      time_zone: "",
      allow_deposits: false,
      deposit_amount: undefined,
      cancellation_allowed: false,
      cancellation_notice_hours: 0,
      cancellation_fee_percent: 0,
      reschedule_allowed: false,
      reschedule_notice_hours: 0,
      reschedule_fee_percent: 0,
      no_show_fee_percent: 100,
      minimum_notice: 0,
      maximum_notice: 0,
      monday_enabled: false,
      monday_opening: 640,
      monday_closing: 1200,
      tuesday_enabled: false,
      tuesday_opening: 640,
      tuesday_closing: 1200,
      wednesday_enabled: false,
      wednesday_opening: 640,
      wednesday_closing: 1200,
      thursday_enabled: false,
      thursday_opening: 640,
      thursday_closing: 1200,
      friday_enabled: false,
      friday_opening: 640,
      friday_closing: 1200,
      saturday_enabled: false,
      saturday_opening: 640,
      saturday_closing: 1200,
      sunday_enabled: false,
      sunday_opening: 640,
      sunday_closing: 1200,
      custom_policies: [],
      auto_generate_deposit_policy: true,
      auto_generate_cancellation_policy: true,
      auto_generate_reschedule_policy: true,
      auto_generate_no_show_policy: true,
    },
  });

  // Update form when booking settings are loaded
  useEffect(() => {
    if (bookingSettings) {
      form.reset(bookingSettings);
    }
  }, [bookingSettings, form]);

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
      const response = await api.patch<BookingSettingsResponse>(
        "sp/booking_settings",
        values
      );
      return response.data;
    },
    onMutate: () => {
      toast.loading("Saving booking settings...", {
        id: "booking-settings-save",
      });
    },
    onSuccess: () => {
      toast.success("Booking settings updated successfully", {
        id: "booking-settings-save",
      });
      queryClient.invalidateQueries({ queryKey: ["booking-settings"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update booking settings",
        {
          id: "booking-settings-save",
        }
      );
    },
  });

  const onSubmit = async (values: any) => {
    try {
      await updateBookingSettingsMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error saving booking settings:", error);
    }
  };

  const { isDirty } = form.formState;

  if (isLoadingBookingSettings) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <>
      {isDirty && <UnsavedChangesBanner form={form} />}
      <Form key="dashboard-booking-setting-form" {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-4 md:space-y-6 xl:space-y-8"
        >
          <BookingSettingsForm form={form} />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateBookingSettingsMutation.isPending || !isDirty}
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
