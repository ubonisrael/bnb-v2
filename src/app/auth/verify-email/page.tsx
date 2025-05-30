"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "@/services/api-service";
import { AuthResponse, ErrorResponse } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmail />
    </Suspense>
  );
}

function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);

  const verifyEmailMutation = useMutation<
    AuthResponse,
    ErrorResponse,
    { token: string }
  >({
    mutationFn: (data: { token: string }) => {
      return api.post<AuthResponse>("auth/verify-email", data);
    },
    onSuccess: (data: AuthResponse) => {
      api.setCsrfToken(data.csrfToken);
      toast.success(data.message, { id: "verify-email" });
      router.push("/onboarding");
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.errors[0].message, { id: "verify-email" });
    },
  });

  useEffect(() => {
    const verifyEmail = async () => {
      toast.loading("Verifying your email...", { id: "verify-email" });
      try {
        const token = searchParams.get("token");

        if (!token) {
          toast.error("Invalid verification link");
          return;
        }

        await verifyEmailMutation.mutateAsync({ token });
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Verification failed");
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {verifying ? (
        <div>Verifying your email...</div>
      ) : (
        <div>
          <p className="text-red-500">
            Verification failed. Please try again or{" "}
            <Link
              href={"/auth/resend-verification-email"}
              className="text-blue-500 hover:underline"
            >
              request a new verification link.
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
