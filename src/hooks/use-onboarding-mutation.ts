import { useMutation } from '@tanstack/react-query';
import api from '@/services/api-service';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { OnboardingFormData } from '@/components/onboarding/type';

export function useOnboardingMutation() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: OnboardingFormData) => {
            // Transform the form data to match the API payload structure
            const payload = {
                name: data.businessInfo.name,
                email: data.businessInfo.email,
                phone: data.businessInfo.phone,
                desc: data.businessInfo.description,
                address: data.location.address,
                city: data.location.city,
                state: data.location.state,
                country: data.location.country,
                postal_code: data.location.postalCode,
                primary_clr: data.visualSettings.primaryColor,
                cancellation_policy: data.notificationSettings.cancelNoticeHours,
                email_confirmation: data.notificationSettings.emailSettings.sendBookingConfirmations,
                appointment_reminders: data.notificationSettings.emailSettings.sendReminders,
                reminder_time: data.notificationSettings.emailSettings.reminderHours,
                cancellation_notices: data.notificationSettings.emailSettings.sendCancellationNotices,
                no_show_notifications: data.notificationSettings.emailSettings.sendNoShowNotifications,
                follow_up_emails: data.notificationSettings.emailSettings.sendFollowUpEmails,
                follow_up_delay: data.notificationSettings.emailSettings.followUpDelayHours,
                welcome_message: data.bookingSettings.welcome_message,
                time_zone: data.bookingSettings.time_zone,
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
                service_categories: data.servicesSetup.categories.map(category => ({
                    name: category.name,
                    services: data.servicesSetup.services
                        .filter(service => service.categoryId === category.id)
                        .map(service => ({
                            name: service.name,
                            duration: service.duration,
                            description: service.description || '',
                            fullPrice: service.price,
                            sunday_enabled: service.availableDays.includes('sunday'),
                            monday_enabled: service.availableDays.includes('monday'),
                            tuesday_enabled: service.availableDays.includes('tuesday'),
                            wednesday_enabled: service.availableDays.includes('wednesday'),
                            thursday_enabled: service.availableDays.includes('thursday'),
                            friday_enabled: service.availableDays.includes('friday'),
                            saturday_enabled: service.availableDays.includes('saturday'),
                        }))
                }))
            };
            console.log(payload)

            return api.post('/onboarding', payload);
        },
        onSuccess: (data) => {
            console.log(data)
            toast.success('Onboarding completed successfully!');
            router.push('/dashboard');
        },
        onError: (error: any) => {
            console.error('Failed to complete onboarding:', error);
            toast.error('Failed to complete onboarding. Please try again.');
        },
    });
} 