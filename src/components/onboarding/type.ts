export interface BusinessInfoData {
  name: string;
  email: string;
  phone: string;
}

export interface LocationData {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface VisualSettingsData {
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
}

export interface Service {
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

export interface ServicesSetupData {
  categories: ServiceCategory[];
  services: Service[];
}

export interface PaymentDetailsData {
  provider: string;
  accountDetails: Record<string, string>;
}

export interface EmailSettingsData {
  sendBookingConfirmations: boolean;
  sendReminders: boolean;
  reminderHours: number;
  sendFollowUpEmails: boolean;
  followUpDelayHours: number;
  sendCancellationNotices: boolean;
  sendNoShowNotifications: boolean;
}

export interface NotificationSettingsData {
  cancelNoticeHours: number;
  emailSettings: EmailSettingsData;
}

export interface BookingSettingsData {
  maximum_notice: number;
  minimum_notice: number;
  welcome_message: string;
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

export interface BookingTemplateData {
    templateType: string;
    bannerHeader: string;
    bannerMessage: string;
    aboutSubHeader: string;
    bannerImageUrl: string;
    description: string;
  }

export interface OnboardingFormData {
  businessInfo: BusinessInfoData;
  location: LocationData;
  visualSettings: VisualSettingsData;
  servicesSetup: ServicesSetupData;
  paymentDetails: PaymentDetailsData;
  notificationSettings: NotificationSettingsData;
  bookingSettings: BookingSettingsData;
  bookingTemplate: BookingTemplateData;
}
