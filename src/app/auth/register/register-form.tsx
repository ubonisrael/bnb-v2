"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { ErrorResponse, SignupResponse } from "@/types/response";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState({ status: false, message: "" });

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation<
    SignupResponse,
    ErrorResponse,
    RegisterFormValues
  >({
    mutationFn: (data: RegisterFormValues) => {
      toast.loading("Creating account...", { id: "register-loading" });
      return api.post<SignupResponse>("auth/signup", data);
    },
    onSuccess: async (data: SignupResponse) => {
      toast.dismiss("register-loading");
      setIsSuccess({ status: true, message: data.message });
      // toast.success(data.message);
      if (data.token) {
        // test environment
        setTimeout(() => {
          router.push(`/auth/verify-email?token=${data.token}`);
        }, 1000);
      }
      // await verifyEmailMutation.mutateAsync({ token: data.token })
    },
    onError: (error: any) => {
      toast.dismiss("register-loading");
      // toast.remove("register-loading");
      toast.error(`Error creating account - ${error.response.data.message}`, {
        id: "register-error",
      });
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      await registerMutation.mutateAsync(data);
    } catch (error: any) {
      console.error("Error creating account:", error);
      // toast.dismiss("register-loading");
      // toast.error("Error creating account", { id: "register-error" });
    }
  }

  return (
    <>
      {isSuccess.status ? (
        <p className="p-4 mb-4 text-center text-green-600 bg-green-50">{isSuccess.message}</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
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
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
