"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import dayjs from "@/utils/dayjsConfig";

export default function SubscriptionDetails({
  subscription,
  timezone,
}: {
  subscription: SubscriptionDetails;
  timezone: string;
}) {
  const subExpirationDate = dayjs(subscription.subscription_expiration)
    .tz(timezone || "UTC")
    .format("DD MMM YYYY, h:mm A");
    const nextBillingDate = dayjs(subscription.nextBillingDate)
      .tz(timezone || "UTC")
      .format("DD MMM YYYY, h:mm A");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {subscription.stripeSubscriptionId ? (
          <>
            <p>
              <strong>Plan:</strong> {subscription.planName}
            </p>
            <p>
              <strong>Status:</strong> {subscription.status}
            </p>
            {subscription.status === "trialing" &&
              subscription.subscription_expiration && (
                <p>
                  <strong>Trial Ends:</strong> {subExpirationDate}
                </p>
              )}
            <p>
              <strong>Next Billing:</strong>{" "}
              {subscription.cancelAtPeriodEnd || !subscription.nextBillingDate
                ? "N/A"
                : nextBillingDate}
            </p>
            <p>
              <strong>Auto-renew:</strong>{" "}
              {subscription.cancelAtPeriodEnd ? "No (canceling)" : "Yes"}
            </p>

            <Button
              className="mt-4 rounded"
              onClick={async () => {
                try {
                  const res = await api.post<{ url: string }>(
                    "stripe/create-portal-session",
                    {}
                  );
                  if (!res.url) {
                    toast.error("Failed to create portal session");
                    return;
                  }
                  window.location.href = res.url;
                } catch (error) {
                  console.error("Error redirecting to portal:", error);
                  toast.error("Failed to redirect to subscription portal.");
                }
              }}
            >
              Manage Subscription
            </Button>
          </>
        ) : (
          <>
            <p className="text-muted-foreground text-sm">
              You don't have an active subscription. Choose a plan to get
              started:
            </p>

            {!subscription.free_trial_activated && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 my-4">
                <p className="text-blue-800 text-sm font-medium mb-1">
                  🎉 Start Your Free 60-Day Trial
                </p>
                <p className="text-blue-700 text-xs">
                  Subscribe now and enjoy a free 60-day trial period. You won't
                  be charged during the trial, and you can cancel anytime before
                  it ends.
                </p>
              </div>
            )}

            <div className="grid gap-4">
              {[
                {
                  name: "Pro Plan",
                  price: "£10/mo",
                },
              ].map((plan) => (
                <Card
                  key={plan.name}
                  className="sm:flex items-center justify-between gap-4 border shadow-sm p-4 space-y-2"
                >
                  <div className="flex items-center gap-4">
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-muted-foreground">{plan.price}</p>
                  </div>
                  <Button
                    className="mt-2 rounded-md"
                    onClick={async () => {
                      try {
                        const res = await api.post<{
                          status: boolean;
                          message?: string;
                          session_id?: string;
                        }>("stripe/create-subscription-session", {});
                        const stripe = await loadStripe(
                          process.env
                            .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
                        );
                        if (!stripe) {
                          toast.error("Stripe failed to load");
                          return;
                        }
                        if (!res.session_id) {
                          toast.error(
                            res.message || "Failed to create checkout session"
                          );
                          return;
                        }
                        await stripe.redirectToCheckout({
                          sessionId: res.session_id,
                        });
                      } catch (error) {
                        console.error("Error subscribing:", error);
                        toast.error("Failed to subscribe. Please try again.");
                      }
                    }}
                  >
                    Subscribe
                  </Button>
                </Card>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
