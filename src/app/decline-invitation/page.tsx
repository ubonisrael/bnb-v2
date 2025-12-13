"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/services/api-service";
import toast from "react-hot-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface DeclineResponse {
  success: boolean;
  message: string;
}

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function DeclineInvitationPage({ searchParams }: PageProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = typeof searchParams.token === 'string' ? searchParams.token : null;

    if (!token) {
      setStatus("error");
      setMessage("Invalid invitation link. No token provided.");
      toast.error("Invalid invitation link");
      return;
    }

    const declineInvitation = async () => {
      try {
        const response = await apiService.post<DeclineResponse>(
          "members/invitations/decline",
          { token }
        );

        if (response.success) {
          setStatus("success");
          setMessage(response.message || "Invitation declined successfully");
          toast.success(response.message || "Invitation declined successfully");
          
          // Redirect to home or login page after 3 seconds
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(response.message || "Failed to decline invitation");
          toast.error(response.message || "Failed to decline invitation");
        }
      } catch (error: any) {
        setStatus("error");
        const errorMessage = error.response?.data?.message || "An error occurred while declining the invitation";
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    declineInvitation();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Declining Invitation...
              </h1>
              <p className="text-gray-600">
                Please wait while we process your request.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Invitation Declined
              </h1>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting you to the home page...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <h1 className="text-2xl font-semibold text-gray-900">
                Something Went Wrong
              </h1>
              <p className="text-gray-600">{message}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Go to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
