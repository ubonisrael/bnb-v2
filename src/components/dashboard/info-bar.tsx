import { useCompanyDetails } from "@/hooks/use-company-details";

export function InfoBar() {
  const { data: settings } = useCompanyDetails();
  // check if user has an active subscription
  const hasActiveSubscription =
    settings?.subscription &&
    (settings.subscription.status === "active" ||
      settings?.subscription.status === "trialing");
  const hasStripeAccountSet = settings?.stripeAccount?.id;

  if (!hasActiveSubscription && !hasStripeAccountSet) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3">
        <p className="font-medium">
          Warning: Inactive Subscription and Stripe Account Not Set
        </p>
        <p className="text-sm">
          Your booking URL is currently inactive. Please activate your
          subscription and set up your Stripe account to enable bookings by
          going to the Payments section.
        </p>
      </div>
    );
  }
  // if the user does not have an active subscription, show a message
  if (!hasActiveSubscription) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3">
        <p className="font-medium">Warning: Inactive Subscription</p>
        <p className="text-sm">
          Your booking URL is currently inactive. Please activate your
          subscription to enable bookings by going to the Payments section.
        </p>
      </div>
    );
  }
  // if the user does not have a Stripe account set, show a message
  if (!hasStripeAccountSet) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3">
        <p className="font-medium">Warning: Stripe Account Not Set</p>
        <p className="text-sm">
          Please set up your Stripe account to enable payments and bookings by
          going to the Payments section.
        </p>
      </div>
    );
  }
  return null;
}
