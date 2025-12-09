"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import SubscriptionDetails from "@/components/payments/subscription-card";
import { useCompanyDetails } from "@/hooks/use-company-details";

// ------------------- Component -------------------
export default function PaymentDashboardPage() {
  const { data: settings } = useCompanyDetails();
  const router = useRouter();

  // Restrict access to admin and owner only
  useEffect(() => {
    if (settings && settings.role !== "owner" && settings.role !== "admin") {
      toast.error("You don't have permission to access this page");
      router.push("/dashboard");
    }
  }, [settings, router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Stripe Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your Stripe integration, subscription and transaction details.
        </p>
      </div>

      {/* Stripe Account Settings Form */}
      {/* Subscription Section */}
      <SubscriptionDetails />
      <Card>
        <CardHeader>
          <CardTitle>Stripe Account Settings</CardTitle>
          <CardDescription>
            Configure your Stripe integration for receiving payments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {settings === null ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : settings?.stripeAccount?.id ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Stripe Account ID
                </label>
                <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md text-sm flex items-center">
                  {settings.stripeAccount.id}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Stripe Account Status
                </label>
                <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md text-sm flex items-center">
                  {settings.stripeAccount.status}
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={async () => {
                  console.log("Redirecting to Stripe dashboard...");
                  if (!settings.stripeAccount.id) {
                    toast.error("Stripe account not found");
                    return;
                  }
                  const res = await api.get<{
                    loginLinkUrl: string;
                  }>(`stripe/accounts/${settings.stripeAccount.id}`);
                  if (!res.loginLinkUrl) {
                    toast.error("Failed to get Stripe account link");
                    return;
                  }
                  window.location.href = res.loginLinkUrl;
                }}
              >
                View your Stripe Account dashboard
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <p className="">
                To start receiving payments, you need to connect a Stripe
                account. Stripe is a secure and trusted platform used by
                millions of businesses to manage payments. If you already have a
                Stripe account, you can link it. Otherwise, you'll be guided to
                create one — it only takes a few minutes.
              </p>
              <Button
                onClick={async () => {
                  console.log("Connecting to Stripe...");
                  try {
                    const res = await api.post<{
                      status: boolean;
                      message?: string;
                      account?: string;
                      accountLink?: string;
                    }>("stripe/create-connected-account", {});
                    if (!res.account || !res.accountLink) {
                      toast.error(
                        res.message || "Stripe account creation failed"
                      );
                      return;
                    }
                    window.location.href = res.accountLink || "";
                  } catch (error) {
                    console.error("Error subscribing:", error);
                    toast.error("Failed to subscribe. Please try again.");
                  }
                }}
                className="rounded"
                type="button"
              >
                Connect with Stripe
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
