"use client";

import { useApp } from "@/contexts/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import ServiceCardGrid from "@/components/templates/default/ServiceCardGrid";
import Cart from "@/components/templates/default/Cart";

export default function BusinessServices({ url }: { url: string }) {
  const {
    error,
    categories, services,
    bUrl,
    updateBusinessUrl,
  } = useApp();
  const router = useRouter();

  useEffect(() => {
    updateBusinessUrl(url);
    // resetBooking()
  }, []);

  if (error) {
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

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">
            Our Services
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Choose Your Services
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            Select one or more services to create your appointment.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Column: Services (3/5 width) */}
          <div className="w-full lg:w-3/5 pr-0 lg:pr-8 mb-6 lg:mb-0">
            <ServiceCardGrid categories={categories} services={services} />
          </div>

          {/* Right Column: Cart (2/5 width) */}
          <div className="w-full lg:w-2/5">
            <Cart nxtStep="booking" />
          </div>
        </div>
      </div>
    </div>
  );
}
