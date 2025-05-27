"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils"; // optional util for classnames
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/services/api-service";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { useUserSettings } from "@/contexts/user-settings-context";
import SubscriptionDetails from "@/components/payments/subscription-card";

// ------------------- Zod Schema -------------------
export const settingsSchema = z
  .object({
    stripeAccountId: z.string().min(1, "Stripe Account ID is required."),
    stripePublishableKey: z
      .string()
      .min(1, "Stripe Publishable Key is required."),
    allowDeposits: z.boolean(),
    depositPercentage: z
      .number({
        required_error:
          "Deposit percentage is required when deposits are allowed.",
        invalid_type_error: "Deposit percentage must be a number.",
      })
      .min(1, "Must be at least 1%")
      .max(99, "Cannot exceed 99%")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.allowDeposits &&
      (data.depositPercentage === undefined || data.depositPercentage === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Deposit percentage is required when deposits are enabled.",
        path: ["depositPercentage"],
      });
    }

    if (!data.allowDeposits && data.depositPercentage !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Deposit percentage must be empty when deposits are disabled.",
        path: ["depositPercentage"],
      });
    }
  });

type SettingsFormData = z.infer<typeof settingsSchema>;

type Subscription = {
  planName: string;
  status: string;
  nextBillingDate: string;
  cancelAtPeriodEnd: boolean;
};

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

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      stripeAccountId: "",
      stripePublishableKey: "",
      allowDeposits: false,
      depositPercentage: undefined,
    },
  });

  const watchDeposits = form.watch("allowDeposits");

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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                // Replace with your update API call
                console.log("Updated settings:", data);
              })}
              className="space-y-4"
            >
              {/* Stripe Account ID */}
              <FormField
                control={form.control}
                name="stripeAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stripe Account ID</FormLabel>
                    <FormControl>
                      <Input placeholder="acct_1234" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your connected Stripe Account ID used to receive
                      payments.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Stripe Publishable Key */}
              <FormField
                control={form.control}
                name="stripePublishableKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stripe Publishable Key</FormLabel>
                    <FormControl>
                      <Input placeholder="pk_test_XXXX" {...field} />
                    </FormControl>
                    <FormDescription>
                      This key is used for securely interacting with Stripe from
                      your frontend.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Allow Deposits Toggle */}
              <FormField
                control={form.control}
                name="allowDeposits"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0 border p-3 rounded-lg">
                    <div className="space-y-0.5">
                      <FormLabel>Allow Deposits</FormLabel>
                      <FormDescription>
                        Enable this option to require only a portion of the
                        total service fee upfront.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="depositPercentage"
                disabled={!watchDeposits}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit Percentage (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 30"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Specify what percentage of the total payment is required
                      as a deposit.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit">Save Changes</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Transaction History Section */}
      <Card>
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
      </Card>
    </div>
  );
}
