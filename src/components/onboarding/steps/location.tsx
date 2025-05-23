"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OnboardingFormData } from "../type";
import { Ref, useEffect, useImperativeHandle } from "react";

const countries = [{ value: "United Kingdom", label: "United Kingdom" }];

const locationSchema = z.object({
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z
    .string()
    .min(2, { message: "State/province must be at least 2 characters" }),
  postalCode: z
    .string()
    .min(4, { message: "Postal code must be at least 4 characters" }),
  country: z.string().min(1, { message: "Please select a country" }),
});

type LocationData = z.infer<typeof locationSchema>;

interface LocationStepProps {
  data: OnboardingFormData;
  onUpdate: (data: LocationData) => void;
  ref: Ref<{ validate: () => Promise<boolean> }>;
}

export function LocationStep({ data, onUpdate, ref }: LocationStepProps) {
  const form = useForm<LocationData>({
    resolver: zodResolver(locationSchema),
    defaultValues: data.location,
  });

  useImperativeHandle(ref, () => ({
    async validate() {
      const isValid = await form.trigger(); // runs validation
      if (isValid) {
        onUpdate(form.getValues());
      }
      return isValid;
    },
  }));

  // Update form data on every change for continuous saving
  // const watchedValues = form.watch()
  // if (
  //   JSON.stringify(watchedValues) !== JSON.stringify(data) &&
  //   form.formState.isValid &&
  //   !form.formState.isSubmitting
  // ) {
  //   onUpdate(watchedValues)
  // }

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values && form.formState.isValid && !form.formState.isSubmitting) {
        onUpdate(values as LocationData);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onUpdate]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">
            Business Location
          </h2>
          <p className="text-sm text-[#6E6E73]">
            Where is your business located?
          </p>
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="State/Province" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Postal Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormDescription className="pt-2">
          This information will be displayed on your booking page and helps
          clients find your business
        </FormDescription>
      </form>
    </Form>
  );
}
