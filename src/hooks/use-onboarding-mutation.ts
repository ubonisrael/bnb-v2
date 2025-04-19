import { useMutation } from '@tanstack/react-query';
import ApiService from '@/services/api-service';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { OnboardingFormData } from '@/components/onboarding/type';

export function useOnboardingMutation() {
    const router = useRouter();
    const apiService = new ApiService();

    return useMutation({
        mutationFn: async (data: OnboardingFormData) => {
            // Transform the form data to match the API payload structure
            const payload = {
                name: data.businessInfo.name,
                email: data.businessInfo.email,
                phone: data.businessInfo.phone,
                desc: data.businessInfo.description,
                type: data.businessInfo.category,
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

            return apiService.post('/onboarding', payload);
        },
        onSuccess: () => {
            toast.success('Onboarding completed successfully!');
            router.push('/onboarding/complete');
        },
        onError: (error: any) => {
            console.error('Failed to complete onboarding:', error);
            toast.error('Failed to complete onboarding. Please try again.');
        },
    });
} 