"use client";

import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/templates/default/ui/button";
import Map from "@/components/templates/default/Map";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function BusinessLanding({ url }: { url: string }) {
  const {
    error,
    name,
    email,
    description,
    state,
    zip,
    address,
    city,
    hours,
    phone,
    latitude,
    longitude,
    aboutSubHeader,
    banner,
    bannerHeader,
    bannerMessage,
    bUrl,
    categories,
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
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-50 dark:bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 dark:bg-gray-900 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  {bannerHeader}
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  {bannerMessage}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button
                      onClick={() => {
                        router.push(`/default/${bUrl}/services`);
                      }}
                      className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10"
                    >
                      Book Now
                    </Button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Button
                      onClick={() => {
                        router.push(`/default/${bUrl}/services`);
                      }}
                      variant="outline"
                      className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10"
                    >
                      View Services
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src={banner}
            alt={`${name} banner image`}
          />
        </div>
      </div>

      {/* Business Info and Other Sections */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">
              About Us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {aboutSubHeader}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              {description}
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Location
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                  {address}, {city}, {state} {zip}
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Contact
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                  Phone: {phone}
                  <br />
                  Email: {email}
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Hours
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                  Monday: {hours.monday}
                  <br />
                  Tuesday: {hours.tuesday}
                  <br />
                  Wednesday: {hours.wednesday}
                  <br />
                  Thursday: {hours.thursday}
                  <br />
                  Friday: {hours.friday}
                  <br />
                  Saturday: {hours.saturday}
                  <br />
                  Sunday: {hours.sunday}
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Our Specialties
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                  {categories.map(cat => cat.name).join(", ")}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Location Map */}
      {latitude && longitude && (
        <div className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center mb-10">
              <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">
                Find Us
              </h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Our Location
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <Map
                zip={zip}
                latitude={latitude}
                longitude={longitude}
                name={name}
                address={address}
                state={state}
                city={city}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
