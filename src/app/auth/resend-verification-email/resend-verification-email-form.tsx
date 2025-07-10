"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { ResendVerificationResponse } from "@/types/response";
import { ErrorResponse } from "react-router-dom";
import api from "@/services/api-service";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ResendVerificationEmailFormValues = z.infer<typeof formSchema>;

export default function ResendConfirmationEmailForm() {
  const [response, setResponse] = useState({ status: false, message: "" });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const resendVerificationEmailMutation = useMutation<
    ResendVerificationResponse,
    ErrorResponse,
    ResendVerificationEmailFormValues
  >({
    mutationFn: (data: ResendVerificationEmailFormValues) => {
      return api.post<ResendVerificationResponse>(
        "auth/resend-verification-email",
        data
      );
    },
    onSuccess: (data: ResendVerificationResponse) => {
      toast.success(data.message, { id: "resend-verification-email" });
      setResponse({ status: true, message: data.message });
      form.reset();
    },
    onError: (error: any) => {
      setResponse({ status: false, message: error.response.data.message });
    },
  });

  const onSubmit = async (values: ResendVerificationEmailFormValues) => {
    try {
      resendVerificationEmailMutation.mutate(values);
    } catch (err: any) {
      toast.error(err.message || "Failed to send email");
    }
  };

  return (
    <>
      {response.status ? (
        <p className="p-4 mb-4 text-center text-green-600 bg-green-50">
          {response.message}
        </p>
      ) : (
        <Form {...form}>
          {!response.status && response.message && (
            <p className="p-4 mb-4 text-center text-red-600 bg-red-50">
              {response.message}
            </p>
          )}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      disabled={resendVerificationEmailMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={resendVerificationEmailMutation.isPending} className="w-full">
              {resendVerificationEmailMutation.isPending ? "Sending..." : "Resend Verification Email"}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
