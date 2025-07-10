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
import { ErrorResponse } from "react-router-dom";
import api from "@/services/api-service";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
});

type ForgotPasswordFormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const [response, setResponse] = useState({ status: false, message: "" });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation<
    { status: boolean; message: string },
    ErrorResponse,
    ForgotPasswordFormValues
  >({
    mutationFn: (data: ForgotPasswordFormValues) => {
      return api.post("auth/forgot-password", data);
    },
    onSuccess: (data) => {
      toast.dismiss("forgot-password");
      setResponse({ status: true, message: data.message });
      form.reset();
    },
    onError: (error: any) => {
      setResponse({ status: false, message: error.response.data.message });
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      forgotPasswordMutation.mutate(values);
    } catch (err: any) {
      toast.error(err.message || "Failed to send password reset email");
    }
  };

  return (
    <>
      {response.status ? (
        <div>
          <p className="p-4 mb-4 text-center text-green-600 bg-green-50">
            {response.message}
          </p>
          <p>
            Have not received the email?{" "}
            <span
              onClick={() => setResponse({ status: false, message: "" })}
              className="text-blue-600 hover:underline"
            >
              Request another
            </span>
          </p>
        </div>
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
                      disabled={forgotPasswordMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full"
            >
              {forgotPasswordMutation.isPending
                ? "Sending..."
                : "Request Password Reset"}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
