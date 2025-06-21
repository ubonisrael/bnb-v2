interface BusinessInfoData {
  logoUrl: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ServiceCategory {
  id: number;
  name: string;
}

interface Service {
  id: string;
  name: string;
  categoryId: number;
  CategoryId?: number;
  price: number;
  fullPrice?: number;
  duration: number;
  description: string;
  availableDays: string[];
  monday_enabled?: boolean;
  tuesday_enabled?: boolean;
  wednesday_enabled?: boolean;
  thursday_enabled?: boolean;
  friday_enabled?: boolean;
  saturday_enabled?: boolean;
  sunday_enabled?: boolean;
}

interface ServicesSetupData {
  categories: ServiceCategory[];
  services: Service[];
}

interface EmailSettingsData {
  sendBookingConfirmations: boolean;
  sendReminders: boolean;
  reminderHours: number;
  sendFollowUpEmails: boolean;
  followUpDelayHours: number;
  sendCancellationNotices: boolean;
  sendNoShowNotifications: boolean;
}

interface NotificationSettingsData {
  emailSettings: EmailSettingsData;
}

interface BookingSettingsData {
  absorb_service_charge: boolean;
  break_times: BreakTime[];
  special_off_days: OffDay[];
  custom_policies: CustomPolicy[];
  maximum_notice: number;
  minimum_notice: number;
  welcome_message: string;
  time_slot_duration: number;
  // deposit policy
  allow_deposits: boolean;
  deposit_amount?: number | undefined;
  // cancellation policy
  cancellation_allowed: boolean;
  cancellation_notice_hours?: number | undefined;
  cancellation_fee_percent?: number | undefined;
  no_show_fee_percent: number;
  // rescheduling policy
  reschedule_allowed: boolean;
  reschedule_notice_hours?: number | undefined;
  reschedule_fee_percent?: number | undefined;
  sunday_enabled: boolean;
  sunday_opening: number;
  sunday_closing: number;
  monday_enabled: boolean;
  monday_opening: number;
  monday_closing: number;
  tuesday_enabled: boolean;
  tuesday_opening: number;
  tuesday_closing: number;
  wednesday_enabled: boolean;
  wednesday_opening: number;
  wednesday_closing: number;
  thursday_enabled: boolean;
  thursday_opening: number;
  thursday_closing: number;
  friday_enabled: boolean;
  friday_opening: number;
  friday_closing: number;
  saturday_enabled: boolean;
  saturday_opening: number;
  saturday_closing: number;
  time_zone: string;
}

interface BookingTemplateData {
  templateType: string;
  images: {
    id: string;
    src: string;
    alt: string;
  }[];
  aboutUs: string;
}

interface OnboardingFormData {
  businessInfo: BusinessInfoData;
  servicesSetup: ServicesSetupData;
  notificationSettings: NotificationSettingsData;
  bookingSettings: BookingSettingsData;
  bookingTemplate: BookingTemplateData;
}
