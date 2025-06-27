"use client";

import { Ref, useImperativeHandle, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BookingSettingsForm } from "@/components/ui/booking-settings-form";
import { bookingSettingsSchema } from "@/schemas/schema";

interface BookingSetupStepProps {
  data: OnboardingFormData;
  onUpdate: (data: BookingSettingsData) => void;
  ref: Ref<{
    validate: () => Promise<boolean>;
  }>;
}

export const days = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

export function BookingSettingsSetupStep({
  data,
  onUpdate,
  ref,
}: BookingSetupStepProps) {
  const form = useForm<BookingSettingsData>({
    mode: "all",
    resolver: zodResolver(bookingSettingsSchema),
    defaultValues: data.bookingSettings,
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const onError = (errors: any) => {
    if (!formRef.current) return;
    const firstErrorField = Object.keys(errors)[0];
    const errorElement = formRef.current.querySelector(
      `[name="${firstErrorField}"]`
    );
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      (errorElement as HTMLElement).focus();
    }
  };

  useImperativeHandle(ref, () => ({
    async validate() {
      const isValid = await form.trigger(); // runs validation
      if (!isValid) {
        onError(form.formState.errors);
        return false;
      }
      if (isValid) {
        onUpdate(form.getValues());
      }
      return isValid;
    },
  }));

  return (
    <BookingSettingsForm form={form} formRef={formRef} />
  );
}
