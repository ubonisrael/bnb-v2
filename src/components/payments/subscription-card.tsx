"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import { useUserSettings } from "@/contexts/user-settings-context";

export default function SubscriptionDetails() {
    const { settings } = useUserSettings()

  if (!settings) {
    return (
    <Card>
      <CardHeader>
        <CardTitle className="animate-pulse bg-muted h-6 w-48 rounded" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="animate-pulse bg-muted h-4 w-3/4 rounded" />
        <div className="animate-pulse bg-muted h-4 w-2/3 rounded" />
        <div className="animate-pulse bg-muted h-4 w-1/2 rounded" />
        <div className="animate-pulse bg-muted h-8 w-40 mt-6 rounded" />
      </CardContent>
    </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {settings.subscription.stripeSubscriptionId ? (
          <>
            <p>
              <strong>Plan:</strong> {settings.subscription.planName}
            </p>
            <p>
              <strong>Status:</strong> {settings.subscription.status}
            </p>
            <p>
              <strong>Next Billing:</strong>{" "}
              {settings.subscription.cancelAtPeriodEnd || !settings.subscription.nextBillingDate
                ? "N/A"
                : new Date(settings.subscription.nextBillingDate).toLocaleDateString()}
            </p>
            {settings.subscription.trialEndDate && (
              <p>
                <strong>Trial Ends:</strong>{" "}
                {new Date(settings.subscription.trialEndDate).toLocaleDateString()}
              </p>
            )}
            <p>
              <strong>Auto-renew:</strong>{" "}
              {settings.subscription.cancelAtPeriodEnd ? "No (canceling)" : "Yes"}
            </p>

            <Button
              className="mt-4"
              onClick={async () => {
                try {
                  const res = await api.post<{ url: string }>("stripe/create-portal-session", {});
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
              You don’t have an active subscription. Choose a plan to get started:
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "Pro Plan", price: "£10/mo", stripePriceId: "price_456" },
              ].map((plan) => (
                <Card key={plan.stripePriceId} className="border shadow-sm p-4 space-y-2">
                  <h4 className="font-semibold">{plan.name}</h4>
                  <p className="text-muted-foreground">{plan.price}</p>
                  <Button
                    onClick={async () => {
                      try {
                        const res = await api.post<{ status: boolean; message?:string; session_id?: string }>(
                          "stripe/create-subscription-session",
                          {}
                        );
                        const stripe = await loadStripe(
                          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
                        );
                        if (!stripe) {
                          toast.error("Stripe failed to load");
                          return;
                        }
                        if (!res.session_id) {
                          toast.error(res.message || "Failed to create checkout session");
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
