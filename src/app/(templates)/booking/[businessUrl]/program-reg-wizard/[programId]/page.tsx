import React from "react";
import Link from "next/link";
import api from "@/services/api-service";
import { ProgramsWizardResponse } from "@/types/response";
import { ProgramRegistrationWizard } from "../../program-reg-wizard";

export type Params = {
  params: Promise<{
    businessUrl: string;
    programId: string;
  }>;
};

async function getServiceProviderProgramDetails(businessUrl: string, programId: string) {
  try {
    const response = await api.get<ProgramsWizardResponse>(
      `programs/${businessUrl}/active-programs/${programId}`
    );
    return { data: response, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

export default async function ProgramRegistrationWizardPage(props: Params) {
  const { businessUrl, programId } = await props.params;
  let { data, error } = await getServiceProviderProgramDetails(businessUrl, programId);

  if (error) {
    console.error("Failed to load business details:", error.response || error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            {error.response?.data?.field || "Sorry, an error occurred."}
          </h1>
          <p className="text-gray-600 mb-4">
            {error.response?.data?.message ||
              "We couldn't load the business details. Please try again later."}
          </p>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data?.program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-4">
            We couldn't load the program details.
          </p>
          <p className="text-gray-500 mb-4">
            Please try again later or contact support.
          </p>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  return <ProgramRegistrationWizard program={data.program} businessUrl={businessUrl} />;
}
