interface UserSettings {
  role: "owner" | "admin" | "staff";
  profile: {
    name: string;
    email: string;
    phone: string;
    address: string;
    display_address: boolean; // New field for displaying address
    city: string;
    state: string;
    postal_code: string;
    country: string;
    bio: string;
    logo: string | null;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    activeSessions: number;
  };
  notifications: {
    emailSettings: {
      sendBookingConfirmations: boolean;
      sendReminders: boolean;
      reminderHours: number;
      sendCancellationNotices: boolean;
      sendNoShowNotifications: boolean;
      sendFollowUpEmails: boolean;
      followUpDelayHours: number;
    };
  };
  social: {
    website: string;
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  categories: ServiceCategory[];
  services: Service[];
  bookingSettings: {
    url: string;
    allow_deposits: boolean;
    deposit_amount: number | undefined;
    time_slot_duration: number;
    cancellation_allowed: boolean;
    cancellation_notice_hours: number | undefined;
    cancellation_fee_percent: number | undefined;
    reschedule_allowed: boolean;
    reschedule_notice_hours: number | undefined;
    reschedule_fee_percent: number | undefined;
    no_show_fee_percent: number;
    minimum_notice: number;
    maximum_notice: number;
    time_zone: string;
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
    special_off_days: OffDay[];
    break_times: BreakTime[];
    absorb_service_charge: boolean;
    custom_policies: CustomPolicy[];
    auto_generate_deposit_policy: boolean;
    auto_generate_cancellation_policy: boolean;
    auto_generate_reschedule_policy: boolean;
    auto_generate_no_show_policy: boolean;
    absorb_service_charge: boolean;
    reschedule_penalty_enabled: boolean;
  };
  template: {
    templateType: string;
    aboutUs: string;
    imageUrls: string[];
  };
  subscription: {
    planName: string;
    stripeSubscriptionId: string | null;
    status: string | null;
    nextBillingDate: string | null;
    cancelAtPeriodEnd: boolean;
    trialEndDate?: string | null;
  };
  stripeAccount: {
    id: string | null;
    status: string | null;
    requirements: {
      [key: string]: string[];
    };
  };
}

type UserSettingsContextType = {
  settings: UserSettings | null;
  updateSettings: (
    section: keyof UserSettings | "batch",
    data: any
  ) => Promise<void>;
  isLoading: boolean;
};
