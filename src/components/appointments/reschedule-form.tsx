import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  emailFormSchema,
  EmailFormValues,
  otpFormSchema,
  OtpFormValues,
} from "./cancel-booking";
import { useState } from "react";
import dayjs from "@/utils/dayjsConfig";

export function RescheduleForm({
  id,
  appointmentId,
  reschedulingAllowed,
  selectedDate,
  selectedTime,
  setRequested,
}: {
  id: number;
  appointmentId: string;
  reschedulingAllowed: boolean;
  selectedDate: string;
  selectedTime: number | null;
  setRequested: (val: boolean) => void;
}) {
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [showResheduleModal, setShowRescheduleModal] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);

  const emailForm = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { otp: "" },
  });

  const sendOtpURL =
    appointmentId === "all"
      ? `sp/bookings/${id}/request-otp`
      : `sp/bookings/${id}/items/${appointmentId}/request-otp`;
  const verifyOtpURL =
    appointmentId === "all"
      ? `sp/bookings/${id}/verify-otp`
      : `sp/bookings/${id}/items/${appointmentId}/verify-otp`;

  // Mutation for sending OTP
  const sendOtpMutation = useMutation({
    mutationFn: async (values: EmailFormValues) => {
      const response = await api.post(sendOtpURL, {
        email: values.email,
        type: "rescheduling",
      });
      return response;
    },
    onSuccess: (_, variables) => {
      toast.success("OTP sent to your email", { id: "send-otp" });
      setVerifiedEmail(variables.email);
      setShowOtpForm(true);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send OTP", {
        id: "send-otp",
      });
    },
  });

  const rescheduleBookingMutation = useMutation({
    mutationFn: async (values: z.infer<typeof otpFormSchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post(
          verifyOtpURL,
          {
            otp: values.otp,
            type: "rescheduling",
            new_event_date: selectedDate,
            new_event_time: selectedTime,
            client_tz: dayjs.tz.guess(),
          },
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Requesting reschedule...", { id: "reschedule-booking" });
    },
    onSuccess: () => {
      toast.success("Reschedule request submitted", {
        id: "reschedule-booking",
      });
      setRequested(true);
    },
    onError: (error: any) => {
      console.error("Reschedule error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to submit request",
        {
          id: "reschedule-booking",
        }
      );
    },
  });

  async function onEmailSubmit(values: EmailFormValues) {
    try {
      await sendOtpMutation.mutateAsync(values);
    } catch (err) {
      console.error(err);
    }
  }

  async function onOtpSubmit(values: OtpFormValues) {
    try {
      await rescheduleBookingMutation.mutateAsync(values);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <Dialog
      open={showResheduleModal}
      onOpenChange={(val) => {
        if (!val) {
          emailForm.reset({
            email: "",
          });
          otpForm.reset({
            otp: "",
          });
        }
        setShowRescheduleModal(val);
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="w-full mt-4"
          variant="default"
          disabled={!selectedTime || !selectedDate || !reschedulingAllowed}
        >
          Reschedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Fill in your details</DialogTitle>
          <DialogDescription>
            Enter the email you used when booking the appointment.
          </DialogDescription>
        </DialogHeader>
        {showOtpForm ? (
          <Form key="otp-form" {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              className="flex flex-col space-y-4"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        autoComplete="one-time-code"
                        placeholder="Enter OTP"
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the OTP sent to {verifiedEmail}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between w-full">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowOtpForm(false);
                    otpForm.reset(); // Reset OTP form when going back
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={rescheduleBookingMutation.isPending}
                >
                  Confirm Reschedule
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form key="email-form" {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="flex flex-col space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the email you used when booking the appointment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={!reschedulingAllowed}
                type="submit"
                className="self-end"
              >
                Request OTP
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
