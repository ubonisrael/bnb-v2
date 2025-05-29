"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Check } from "lucide-react"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OnboardingFormData } from "../type"
import { Ref, useEffect, useImperativeHandle } from "react"

const paymentDetailsSchema = z.object({
  provider: z.string().min(1, { message: "Please select a payment provider" }),
  accountDetails: z.record(z.any()),
})

type PaymentDetailsData = z.infer<typeof paymentDetailsSchema>

interface PaymentDetailsStepProps {
  data: OnboardingFormData
  onUpdate: (data: PaymentDetailsData) => void
  ref: Ref<{ validate: () => Promise<boolean> }>
}

export function PaymentDetailsStep({ data, onUpdate, ref }: PaymentDetailsStepProps) {
  const form = useForm<PaymentDetailsData>({
    resolver: zodResolver(paymentDetailsSchema),
    defaultValues: {
      provider: data.paymentDetails.provider || "",
      accountDetails: {
        stripeAccountId: data.paymentDetails.accountDetails?.stripeAccountId || "",
        stripePublishableKey: data.paymentDetails.accountDetails?.stripePublishableKey || "",
        requireFullPayment: data.paymentDetails.accountDetails?.requireFullPayment || false,
        allow_deposits: data.paymentDetails.accountDetails?.allow_deposits || false,
        paypalEmail: data.paymentDetails.accountDetails?.paypalEmail || "",
        paypalClientId: data.paymentDetails.accountDetails?.paypalClientId || "",
        squareAccessToken: data.paymentDetails.accountDetails?.squareAccessToken || "",
        squareLocationId: data.paymentDetails.accountDetails?.squareLocationId || "",
        currency: data.paymentDetails.accountDetails?.currency || "USD",
        acceptCashPayments: data.paymentDetails.accountDetails?.acceptCashPayments || false,
        collectTaxes: data.paymentDetails.accountDetails?.collectTaxes || false,
        taxRate: data.paymentDetails.accountDetails?.taxRate || "0.00",
      },
    },
  })

    useImperativeHandle(ref, () => ({
      async validate() {
        // const isValid = await form.trigger(); // runs validation
        // if (isValid) {
        //   onUpdate(form.getValues());
        // }
        // return isValid;
        return true
      },
    }));

  function onSubmit(values: PaymentDetailsData) {
    onUpdate(values)
  }

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values && form.formState.isValid && !form.formState.isSubmitting) {
        onUpdate(values as PaymentDetailsData)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, onUpdate])

  // Get the selected payment provider
  const selectedProvider = form.watch("provider")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">Payment Details</h2>
          <p className="text-sm text-[#6E6E73]">Set up how you'll receive payments for your services</p>
        </div>

        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Payment Provider</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  {[
                    {
                      value: "stripe",
                      title: "Stripe",
                      description: "Accept credit cards, Apple Pay, Google Pay",
                    },
                    {
                      value: "paypal",
                      title: "PayPal",
                      description: "Accept PayPal and credit card payments",
                    },
                    {
                      value: "square",
                      title: "Square",
                      description: "Accept payments with Square",
                    },
                  ].map((provider) => (
                    <div
                      key={provider.value}
                      className={`relative rounded-lg border p-4 ${field.value === provider.value
                        ? "border-[#7B68EE] bg-[#7B68EE]/5"
                        : "border-[#E0E0E5] hover:border-[#E0E0E5]/80"
                        }`}
                    >
                      {field.value === provider.value && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#7B68EE]">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={provider.value} />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium">{provider.title}</FormLabel>
                          <FormDescription className="text-xs">{provider.description}</FormDescription>
                        </div>
                      </FormItem>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedProvider === "stripe" && (
          <Card className="border-[#E0E0E5]">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="accountDetails.stripeAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stripe Account ID</FormLabel>
                      <FormControl>
                        <Input placeholder="acct_..." {...field} />
                      </FormControl>
                      <FormDescription>Your Stripe account ID starts with "acct_"</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountDetails.stripePublishableKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stripe Publishable Key</FormLabel>
                      <FormControl>
                        <Input placeholder="pk_..." {...field} />
                      </FormControl>
                      <FormDescription>Your Stripe publishable key starts with "pk_"</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountDetails.requireFullPayment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Require Full Payment</FormLabel>
                        <FormDescription>Clients must pay the full amount when booking</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountDetails.allow_deposits"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Allow Deposits</FormLabel>
                        <FormDescription>Clients can pay a deposit to secure their booking</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedProvider === "paypal" && (
          <Card className="border-[#E0E0E5]">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="accountDetails.paypalEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PayPal Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormDescription>The email address associated with your PayPal account</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountDetails.paypalClientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PayPal Client ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Client ID from PayPal Developer Dashboard" {...field} />
                      </FormControl>
                      <FormDescription>Find this in your PayPal Developer Dashboard</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedProvider === "square" && (
          <Card className="border-[#E0E0E5]">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="accountDetails.squareAccessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Access Token</FormLabel>
                      <FormControl>
                        <Input placeholder="Access token from Square Developer Dashboard" {...field} />
                      </FormControl>
                      <FormDescription>Find this in your Square Developer Dashboard</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountDetails.squareLocationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Square Location ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Location ID from Square Dashboard" {...field} />
                      </FormControl>
                      <FormDescription>Find this in your Square Dashboard</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-[#E0E0E5]">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-md font-medium text-[#121212]">General Payment Settings</h3>

              <FormField
                control={form.control}
                name="accountDetails.currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The currency you want to accept payments in</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountDetails.acceptCashPayments"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Accept Cash Payments</FormLabel>
                      <FormDescription>Allow clients to pay in cash at the time of service</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountDetails.collectTaxes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Collect Taxes</FormLabel>
                      <FormDescription>Add taxes to client payments</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("accountDetails.collectTaxes") && (
                <FormField
                  control={form.control}
                  name="accountDetails.taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormDescription>The tax rate to apply to bookings</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}

