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

export const bookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  gender: z.enum(["Male", "Female", "Prefer not to say"], {
    required_error: "Please select a gender",
  }),
  age_category: z.enum(["Adult", "Child"], {
    required_error: "Please select an age category",
  }),
  agree_to_terms: z.boolean().refine((val) => val, {
    message: "You must agree to the terms and conditions to continue.",
  }),
});

export type BookingType = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  policies: PolicyData[];
  additionalPolicy?: string;
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
  additionalPolicy = "",
  currencySymbol = "£",
  allowDeposits,
  amount,
  depositAmount,
  showBookingModal,
  setShowBookingModal,
  onSubmit,
}: BookingFormProps) => {
  const [TandCagreed, setTandCagreed] = useState(false);
  const policyTypes = Array.from(new Set(policies.map((p) => p.type)));
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      gender: "Male",
      age_category: "Adult",
      agree_to_terms: false,
    },
  });

  const amountToPay = allowDeposits && depositAmount ? depositAmount : amount;
  const applicationFee =
    allowDeposits && depositAmount === 5
      ? 1
      : Math.ceil(amountToPay * 2.9 + 80) / 100;

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

              <FormField
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
                  <span>Booking Fee:</span>
                  <span>{currencySymbol}1.00</span>
                </div>

                <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md font-semibold text-sm flex items-center justify-between">
                  <span>Total to Pay:</span>
                  <span>
                    {currencySymbol}
                    {(
                      (allowDeposits && depositAmount
                        ? depositAmount
                        : amount) + 1
                    ) // booking fee
                      .toFixed(2)}
                  </span>
                </div>

                {applicationFee > 1 && (
                  <p className="text-sm italic text-muted-foreground">
                    A processing fee of {currencySymbol}
                    {applicationFee.toFixed(2)} is included and is{" "}
                    <span className="font-medium">non-refundable</span>.
                  </p>
                )}

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
                    <FormControl>
                      <Checkbox
                        name="agree_to_terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel
                        htmlFor="terms"
                        className="text-sm font-normal"
                      >
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
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
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
            {additionalPolicy && (
              <div className="">
                <h3>Additional Notes:</h3>
                <p className="text-sm">{additionalPolicy}</p>
              </div>
            )}
          </div>
          <DialogFooter>
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
