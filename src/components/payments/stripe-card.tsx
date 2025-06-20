"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import api from "@/services/api-service";
import toast from "react-hot-toast";

export default function StripeConnectCard() {
  const { settings, updateSettings } = useUserSettings();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await api.post<{
        status: boolean;
        error: string;
        account: string;
        accountLink: string;
      }>("stripe/create-connected-account", {});
      const { error, account, accountLink } = res;
      if (error) {
        toast.error(error);
        return;
      }
      if (account) {
        toast.success("Stripe account created successfully!");
        updateSettings("stripeAccount", {
          id: account,
          status: "pending",
        });
      }
      if (accountLink) {
        setTimeout(() => {
          toast.success("Redirecting to Stripe for onboarding...");
          // Redirect to Stripe account link
          window.location.href = accountLink;
        }, 1000);
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || "Failed to create Stripe account."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-48 rounded" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <Skeleton className="h-8 w-40 mt-6 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Stripe Account</CardTitle>
      </CardHeader>
      <CardContent>
        {settings?.stripeAccount.id ? (
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="text-sm text-green-700 font-semibold">Connected</p>
            <p>
              <span className="font-medium">Account ID:</span>{" "}
              {settings.stripeAccount.id}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You have not connected a Stripe account yet.
            </p>
            <Button onClick={handleConnect} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Connect Stripe
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
