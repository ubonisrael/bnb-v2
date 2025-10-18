"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/services/api-service";
import dayjs from "@/utils/dayjsConfig";
import { IExtendedProgram } from "@/types/response";

interface ProgramRegistrationFormValues {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  student_id?: string;
  program_ids: string[];
}

interface ProgramRegistrationWizardProps {
  programs: IExtendedProgram[];
}

export function ProgramRegistrationWizard(
  props: ProgramRegistrationWizardProps
) {
  console.log("programs", props.programs);
  const [showProgRegistrationModal, setShowProgRegistrationModal] =
    useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // const registrationMutation = useMutation({
  //   mutationFn: (data: ProgramRegistrationFormValues) => {
  //     toast.loading("Scheduling appointment...", { id: "booking" });
  //     return api.post(`programs/register`, data);
  //   },
  //   onSuccess: async (data) => {
  //     toast.dismiss("booking");
  //     setIsRedirecting(true); // Show loading overlay
  //     window.location.href = data.url;
  //   },
  //   onError: (error) => {
  //     toast.dismiss("booking");
  //     toast.remove("booking");
  //     toast.error(error.errors[0].message || "Error while registering for program(s)", {
  //       id: "prog-registration-error",
  //     });
  //   },
  // });

  // async function onSubmit(data) {
  //     try {
  //       await registrationMutation.mutateAsync(data);
  //     } catch (error) {
  //       console.error("Registration failed:", error);
  //     }
  //   }

  return (
    <div className="w-full bg-slate-100 py-16 sm:pb-20 lg:pb-24">
      <div className="sm:px-6 pb-4 sm:py-6 lg:py-8 mx-auto max-w-7xl">
        {/* Program Registration Form Modal */}
        new page
      </div>

      {/* Loading Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-medium">Redirecting to checkout...</p>
          </div>
        </div>
      )}
    </div>
  );
}
