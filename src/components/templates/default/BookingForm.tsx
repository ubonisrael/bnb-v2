"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { PolicyData } from "@/types/response";
import { Checkbox } from "./ui/checkbox";

const amountToBePaid = (
  serviceChargeAbsorbed: boolean,
  amount: number,
  applicationFeeInCents: number
) => {
  if (serviceChargeAbsorbed) {
    return { amount, serviceCharge: applicationFeeInCents };
  }
  if (applicationFeeInCents === 100) {
    return { amount: amount + 1, serviceCharge: applicationFeeInCents };
  }
  const finalAmount = Math.ceil(100 * ((amount + 0.8) / 0.971));
  const serviceCharge = finalAmount - (amount * 100)
  return { amount: finalAmount / 100, serviceCharge: serviceCharge / 100 };
};

export const bookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  // gender: z.enum(["Male", "Female", "Prefer not to say"], {
  //   required_error: "Please select a gender",
  // }),
  phone: z.string().min(10, "Please enter a valid phone number").optional(),
  age_category: z.enum(["Adult", "Child"], {
    required_error: "Please select an age category",
  }),
  agree_to_terms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms and conditions to continue.",
  }),
});

export type BookingType = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  absorbServiceCharge: boolean;
  policies: PolicyData[];
  customPolicies: CustomPolicy[];
  currencySymbol?: string;
  allowDeposits: boolean;
  amount: number;
  depositAmount?: number;
  showBookingModal: boolean;
  setShowBookingModal: (value: boolean) => void;
  onSubmit: (data: BookingType) => void;
}

const BookingForm = ({
  policies,
  customPolicies,
  currencySymbol = "£",
  allowDeposits,
  amount,
  depositAmount,
  showBookingModal,
  setShowBookingModal,
  onSubmit,
  absorbServiceCharge = false,
}: BookingFormProps) => {
  const [TandCagreed, setTandCagreed] = useState(false);
  const policyTypes = Array.from(new Set(policies.map((p) => p.type)));
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      // gender: "Male",
      age_category: "Adult",
      agree_to_terms: false,
    },
  });

  const applicationFeeInCents = Math.max(100, amount * 2.9 + 10)
  const { amount: finalAmount, serviceCharge } = amountToBePaid(
    absorbServiceCharge,
    allowDeposits && depositAmount ? depositAmount : amount,
    applicationFeeInCents
  );

  return (
    <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
      <DialogTrigger asChild>
        <Button className="w-full py-3 px-4">Schedule Appointment</Button>
      </DialogTrigger>
      {TandCagreed ? (
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-screen">
          <DialogHeader>
            <DialogTitle>Enter your details</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g. jane@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Male", "Female", "Prefer not to say"].map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an age category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Adult", "Child"].map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <div className="text-sm font-medium leading-none">
                  Amount to Pay
                </div>

                <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md text-sm flex items-center justify-between">
                  <span>Service Total:</span>
                  <span>
                    {currencySymbol}
                    {allowDeposits && depositAmount
                      ? depositAmount.toFixed(2)
                      : amount.toFixed(2)}
                  </span>
                </div>

                <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md text-sm flex items-center justify-between">
                  <span>
                    Service charge {absorbServiceCharge ? "(inclusive)" : ""}:
                  </span>
                  <span>
                    {currencySymbol}
                    {serviceCharge.toFixed(2)}
                  </span>
                </div>

                <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md font-semibold text-sm flex items-center justify-between">
                  <span>Total to Pay:</span>
                  <span>
                    {currencySymbol}
                    {finalAmount.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm italic text-muted-foreground">
                  The service charge of {currencySymbol}
                  {serviceCharge.toFixed(2)} is
                  <span className="font-medium">non-refundable</span>.
                </p>

                <p className="text-sm text-muted-foreground">
                  {allowDeposits && depositAmount
                    ? `This is a deposit payment of ${currencySymbol}${depositAmount.toFixed(
                        2
                      )}. Full payment is ${currencySymbol}${amount.toFixed(
                        2
                      )}.`
                    : `This is a full payment of ${currencySymbol}${amount.toFixed(
                        2
                      )}.`}
                </p>
              </div>

              <div className="rounded-md bg-yellow-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      The checkout session will expire in 30 minutes. Please
                      complete your booking before then.
                    </p>
                  </div>
                </div>
              </div>
              <FormField
                control={form.control}
                name="agree_to_terms"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormLabel
                      htmlFor="agree_to_terms"
                      className="flex items-center justify-center gap-4 text-sm font-normal"
                    >
                      <FormControl>
                        <Checkbox
                          name="agree_to_terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span>
                        I agree to the{" "}
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-primary"
                        >
                          Terms and Conditions
                        </a>
                        .
                      </span>
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-2 md:gap-0 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setShowBookingModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Make appointment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-screen">
          <DialogHeader>
            <DialogTitle>Payment & Cancellation Policy</DialogTitle>
            <DialogDescription>Review business policy</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 text-slate-600 text-sm">
            {policyTypes.map((policyType, i) => (
              <div key={`${i}-${policyType}`} className="space-y-2">
                <h3 className="capitalize">{policyType}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {policies
                    .filter((policy) => policy.type === policyType)
                    .map(({ policy }, i) => (
                      <li key={`${policyType}-${i}`}>{policy}</li>
                    ))}
                </ul>
              </div>
            ))}
            {customPolicies.map((policy, i) => (
              <div className="" key={`custom-policy-${i}`}>
                <h3>{policy.title}</h3>
                <ul>
                  {policy.policies.map((p, j) => (
                    <li key={`custom-policy-${i}-policy-${j}`}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <DialogFooter className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-2 md:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setShowBookingModal(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => setTandCagreed(true)} type="button">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default BookingForm;
