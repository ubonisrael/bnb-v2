interface UserSettingsData {
  subscription: {
    planName: string; // e.g., "Pro Plan"
    stripeSubscriptionId: string | null; // Stripe subscription ID
    status: string | null; // e.g., "active", "canceled", "past_due"
    nextBillingDate: Date | null; // Next billing/expiration date
    cancelAtPeriodEnd: boolean; // Whether subscription cancels at period end
    subscription_cancel_at: Date | null; // When subscription was set to cancel
    subscription_cancel_at_period_end: boolean; // Duplicate field for cancel at period end
    subscription_ended_at: Date | null; // When subscription ended
    subscription_expiration: Date | null; // Subscription expiration date
  };
  stripeAccount: {
    id: string | null; // Stripe Connect account ID
    status: string | null; // e.g., "complete", "restricted", "pending"
    requirements: object | null; // Stripe account requirements object
  };
  role: string; // User's role: "owner" | "admin" | "staff"
  memberId: number; // ServiceProviderMember ID from session
  bookingUrl: string; // Booking URL for the service provider
  timeslot_duration: number; // timeslot duration in minutes
  logo: string | null; // URL of the business logo image
  name: string; // Business name
}

interface UserSettingsResponse {
  success: boolean;
  message: string;
  data: UserSettingsData;
}

type UserSettingsContextType = {
  settings: UserSettings | null;
  isLoading: boolean;
};
