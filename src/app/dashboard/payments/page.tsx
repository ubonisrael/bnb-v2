"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // optional util for classnames
import api from "@/services/api-service";
import toast from "react-hot-toast";
import { useUserSettings } from "@/contexts/user-settings-context";
import SubscriptionDetails from "@/components/payments/subscription-card";

type Invoice = {
  id: string;
  date: string;
  amountPaid: number;
  status: string;
  invoiceUrl: string;
  description: string;
  customerName: string;
  customerEmail: string;
  direction: "incoming" | "outgoing";
};

// ------------------- Component -------------------
export default function PaymentDashboardPage() {
  const { settings } = useUserSettings();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  // const queryParams = useSearchParams()
  console.log("settings", settings);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Payment Settings</h1>
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
            Configure your Stripe integration for receiving payments and
            managing your subscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {settings?.stripeAccount.id ? (
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
                  // Redirect to Stripe account dashboard
                    window.open(res.loginLinkUrl, '_blank');
                }}
              >
                View your Stripe Account dashboard
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <p className="">
                Click the button below to get redirected to Stripe to complete
                onboarding process.
              </p>
              {/* Submit Button */}
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
                Connect your Stripe Account
              </Button>
              <p className="text-sm text-muted-foreground">
                If you do not have a Stripe Account, one will be created for you
                during the Stripe Onboarding process.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction History Section */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex justify-between items-start border-b pb-3 last:border-none"
              >
                <div>
                  <p className="font-medium">{invoice.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {invoice.date} &bull; {invoice.customerName} (
                    {invoice.customerEmail})
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: {invoice.status}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-semibold",
                      invoice.direction === "incoming"
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {invoice.direction === "incoming" ? "+" : "-"}$
                    {(invoice.amountPaid / 100).toFixed(2)}
                  </p>
                  <Button variant="link" asChild className="text-xs px-0">
                    <a
                      href={invoice.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Invoice
                    </a>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No transactions found.
            </p>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
