import React from "react";
import Link from "next/link";
import api from "@/services/api-service";
import DynamicComponentWrapper from "./dynamic-component-wrapper";
import { BusinessDataResponse } from "@/types/response";
import { BusinessLanding } from "./tabs/landing";
import { businessData } from "@/utils/examples";

export type Params = {
  params: Promise<{
    businessUrl: string;
  }>;
};

async function getServiceProviderDetails(url: string) {
  try {
    if (url === "sample") {
      return { data: businessData, error: null };
    }
    const response = await api.get<{
      status: boolean;
      data: BusinessDataResponse;
    }>(`sp/${url}/data`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export default async function LandingPage(props: Params) {
  const { businessUrl } = await props.params;
  let { data, error } = (await getServiceProviderDetails(businessUrl)) as {
    data: BusinessDataResponse;
    error: any;
  };

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

  if (businessUrl === "preview") {
    return <DynamicComponentWrapper />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-4">
            We couldn't load the business details.
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
  return <BusinessLanding {...data} />;
}
