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
  const [loading, setLoading] = useState(false);
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
      toast.success(data.message, { id: "forgot-password" });
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message, { id: "forgot-password" });
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      forgotPasswordMutation.mutate(values);
    } catch (err: any) {
      toast.error(err.message || "Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
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
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Request Password Reset"}
        </Button>
      </form>
    </Form>
  );
}
