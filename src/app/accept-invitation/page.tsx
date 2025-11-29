"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiService from "@/services/api-service";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface AcceptInvitationResponse {
  success: boolean;
  message: string;
  data?: {
    member: {
      id: number;
      role: string;
      organization: {
        id: number;
        name: string;
      };
    };
  };
}

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    
    if (!tokenParam) {
      toast.error("Invalid invitation link. No token provided.");
      router.push("/");
      return;
    }

    setToken(tokenParam);
  }, [searchParams, router]);

  const onSubmit = async (data: PasswordFormData) => {
    if (!token) {
      toast.error("Invalid invitation token");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Accepting invitation...");

    try {
      const response = await apiService.post<AcceptInvitationResponse>(
        "members/invitations/accept",
        {
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }
      );

      toast.dismiss(loadingToast);

      if (response.success) {
        toast.success(
          response.message || "Invitation accepted successfully!"
        );

        // Show organization info if available
        if (response.data) {
          const { organization, role } = response.data.member;
          toast.success(
            `You've joined ${organization.name} as ${role}`,
            { duration: 4000 }
          );
        }

        // Redirect to login or dashboard after success
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to accept invitation");
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while accepting the invitation";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#7B68EE] mx-auto">
            <span className="text-2xl font-bold text-white">B</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Accept Invitation
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Set up your password to join the organization
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Password must:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Be at least 8 characters long</li>
              <li>Contain at least one uppercase letter</li>
              <li>Contain at least one lowercase letter</li>
              <li>Contain at least one number</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#7B68EE] hover:bg-[#7B68EE]/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              "Accept Invitation"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
