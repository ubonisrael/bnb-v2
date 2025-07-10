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
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof formSchema>;

export default function ResetPasswordForm() {
  const [response, setResponse] = useState({ status: false, message: "" });
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation<
    { status: boolean; message: string },
    ErrorResponse,
    ResetPasswordFormValues & { token: string }
  >({
    mutationFn: (data) => {
      return api.post("auth/password-reset", data);
    },
    onSuccess: (data) => {
      toast.dismiss("reset-password");
      setResponse({ status: true, message: data.message });
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message, { id: "reset-password" });
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    try {
      resetPasswordMutation.mutate({ ...values, token });
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    }
  };

  return (
    <>
      {response.status ? (
        <div className="p-4 mb-4">
          <p className="p-4 text-center text-green-600 bg-green-50">
            {response.message}
          </p>
          <Link
            href="/auth/login"
            className="block mt-4 text-center text-blue-600 hover:underline"
          >
            Go to Login
          </Link>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      {...field}
                      disabled={resetPasswordMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      {...field}
                      disabled={resetPasswordMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full"
            >
              {resetPasswordMutation.isPending
                ? "Resetting..."
                : "Reset Password"}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
