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

export const bookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  gender: z.enum(["Male", "Female", "Prefer not to say"], {
    required_error: "Please select a gender",
  }),
  age_category: z.enum(["Adult", "Child"], {
    required_error: "Please select an age category",
  }),
});

export type BookingType = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  bookingPolicy: string[];
  additionalPolicy?: string;
  currencySymbol?: string;
  allowDeposits: boolean;
  amount: number;
  depositAmount?: number;
  showServiceModal: boolean;
  setShowServiceModal: (value: boolean) => void;
  onSubmit: (data: BookingType) => void;
}

const BookingForm = ({
  bookingPolicy,
  additionalPolicy = "",
  currencySymbol = "£",
  allowDeposits,
  amount,
  depositAmount,
  showServiceModal,
  setShowServiceModal,
  onSubmit,
}: BookingFormProps) => {
  const [TandCagreed, setTandCagreed] = useState(false);
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      gender: "Male",
      age_category: "Adult",
    },
  });

  return (
    <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
      <DialogTrigger asChild>
        <Button className="w-full py-3 px-4">Schedule Appointment</Button>
      </DialogTrigger>
      {TandCagreed ? (
        <DialogContent className="sm:max-w-[600px]">
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
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Amount to Pay
                </label>
                <div className="h-10 px-3 py-2 border border-input bg-muted rounded-md text-sm flex items-center">
                  {allowDeposits
                    ? `${currencySymbol}${depositAmount}`
                    : `${currencySymbol}${amount}`}
                </div>
                <p className="text-sm text-muted-foreground">
                  {allowDeposits
                    ? `This is a deposit payment of ${currencySymbol}${depositAmount}. Full payment is ${currencySymbol}${amount}.`
                    : `This is a full payment of ${currencySymbol}${amount}.`}
                </p>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setShowServiceModal(false);
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment & Cancellation Policy</DialogTitle>
            <DialogDescription>Review business policy</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 text-slate-600 text-sm">
            <ul className="space-y-1">
              {bookingPolicy.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
            <p className="text-sm">{additionalPolicy}</p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setShowServiceModal(false);
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
