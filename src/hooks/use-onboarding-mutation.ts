import api from "@/services/api-service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function useOnboardingMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      // Transform the form data to match the API payload structure
      const payload = {
        name: data.businessInfo.name,
        phone: data.businessInfo.phone,
        address: data.businessInfo.address,
        display_address: data.businessInfo.display_address,
        city: data.businessInfo.city,
        state: data.businessInfo.state,
        country: data.businessInfo.country,
        postal_code: data.businessInfo.postalCode,
        logo: data.businessInfo.logoUrl,
        image_urls: data.businessInfo.images,
        about_us: data.businessInfo.aboutUs,
        email_confirmation:
          data.notificationSettings.emailSettings.sendBookingConfirmations,
        appointment_reminders:
          data.notificationSettings.emailSettings.sendReminders,
        reminder_time: data.notificationSettings.emailSettings.reminderHours ?? 0,
        cancellation_notices:
          data.notificationSettings.emailSettings.sendCancellationNotices,
        no_show_notifications:
          data.notificationSettings.emailSettings.sendNoShowNotifications,
        follow_up_emails:
          data.notificationSettings.emailSettings.sendFollowUpEmails,
        follow_up_delay: 24,
        welcome_message: data.bookingSettings.welcome_message,
        time_zone: data.bookingSettings.time_zone,
        allow_deposits: data.bookingSettings.allow_deposits,
        deposit_amount: data.bookingSettings.deposit_amount,
        cancellation_allowed: data.bookingSettings.cancellation_allowed,
        cancellation_notice_hours:
          data.bookingSettings.cancellation_notice_hours,
        cancellation_fee_percent: data.bookingSettings.cancellation_fee_percent,
        no_show_fee_percent: data.bookingSettings.no_show_fee_percent,
        reschedule_allowed: data.bookingSettings.reschedule_allowed,
        reschedule_notice_hours: data.bookingSettings.reschedule_notice_hours,
        reschedule_fee_percent: data.bookingSettings.reschedule_fee_percent,
        auto_generate_deposit_policy:
          data.bookingSettings.auto_generate_deposit_policy,
        auto_generate_cancellation_policy:
          data.bookingSettings.auto_generate_cancellation_policy,
        auto_generate_reschedule_policy:
          data.bookingSettings.auto_generate_reschedule_policy,
        auto_generate_no_show_policy:
          data.bookingSettings.auto_generate_no_show_policy,
        minimum_notice: data.bookingSettings.minimum_notice,
        maximum_notice: data.bookingSettings.maximum_notice,
        sunday_enabled: data.bookingSettings.sunday_enabled,
        sunday_opening: data.bookingSettings.sunday_opening,
        sunday_closing: data.bookingSettings.sunday_closing,
        monday_enabled: data.bookingSettings.monday_enabled,
        monday_opening: data.bookingSettings.monday_opening,
        monday_closing: data.bookingSettings.monday_closing,
        tuesday_enabled: data.bookingSettings.tuesday_enabled,
        tuesday_opening: data.bookingSettings.tuesday_opening,
        tuesday_closing: data.bookingSettings.tuesday_closing,
        wednesday_enabled: data.bookingSettings.wednesday_enabled,
        wednesday_opening: data.bookingSettings.wednesday_opening,
        wednesday_closing: data.bookingSettings.wednesday_closing,
        thursday_enabled: data.bookingSettings.thursday_enabled,
        thursday_opening: data.bookingSettings.thursday_opening,
        thursday_closing: data.bookingSettings.thursday_closing,
        friday_enabled: data.bookingSettings.friday_enabled,
        friday_opening: data.bookingSettings.friday_opening,
        friday_closing: data.bookingSettings.friday_closing,
        saturday_enabled: data.bookingSettings.saturday_enabled,
        saturday_opening: data.bookingSettings.saturday_opening,
        saturday_closing: data.bookingSettings.saturday_closing,
        time_slot_duration: data.bookingSettings.time_slot_duration,
        absorb_service_charge: data.bookingSettings.absorb_service_charge,
        reschedule_penalty_enabled:
          data.bookingSettings.reschedule_penalty_enabled,
        custom_policies: data.bookingSettings.custom_policies,
        service_categories: data.servicesSetup.categories.map((category) => ({
          name: category.name,
          services: data.servicesSetup.services.filter(
            (service) => service.CategoryId === category.id
          ),
        })),
      };

      return api.post("auth/sp/onboarding", payload);
    },
    onSuccess: (data) => {
      toast.success("Onboarding completed successfully!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Failed to complete onboarding:", error);
      toast.error("Failed to complete onboarding. Please try again.");
    },
  });
}
