"use client";

import ImageCarousel from "./tabs/components/image-carousel";
import BusinessInfo from "./tabs/components/business-info";
import BusinessDetails from "./tabs/components/business-details";
import { BusinessDataResponse } from "@/types/response";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { CardContent } from "@/components/templates/default/ui/card";
import { useEffect } from "react";
import api from "@/services/api-service";
import dayjs from "@/utils/dayjsConfig";
import { getRandomColor } from "@/utils/color";
import { formatDateRange } from "@/utils/time";
import { getProgramPrice } from "@/utils/programs";

const userTimezone = dayjs.tz.guess();

export function BusinessLanding(props: BusinessDataResponse) {
  // get number of services
  const totalServices = props.serviceCategories.reduce(
    (sum, category) => sum + category.services.length,
    0
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    // Check for cancellation status in URL
    const status = searchParams.get("status");
    const productId = searchParams.get("productId");
    const productType = searchParams.get("productType");

    if (status === "canceled" && productId && productType) {
      const handleCancellation = async () => {
        try {
          await api.post("/cancel-reservation", {
            productId,
            productType,
          });
        } catch (error) {
          console.error("Failed to process cancellation:", error);
        }
      };

      handleCancellation();
    }
  }, []);

  return (
    <div className="w-full bg-slate-100 py-16 sm:pb-20 lg:pb-24">
      <div className="sm:px-6 pb-4 sm:py-6 lg:py-8 mx-auto max-w-7xl">
        <div className="w-full min-h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 min-h-screen">
            {/* First Section: Left on Desktop, Top on Mobile */}
            <div className="lg:col-span-2 space-y-8">
              <ImageCarousel images={props.images} />
              <BusinessInfo
                name={props.name}
                location={
                  props.address && props.city && props.city
                    ? `${props.address}, ${props.city}, ${props.state}`
                    : null
                }
              />
              <Card className="">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Our Services ({totalServices})
                  </h2>
                  <Link
                    href={`/booking/${props.bUrl}/booking-wizard`}
                    className="bg-blue-400 text-white px-6 py-3 rounded-md inline-flex items-center justify-center font-medium hover:bg-blue-500 transition-colors"
                  >
                    Book Now
                  </Link>
                </CardHeader>
                <CardContent className="grid gap-4 p-4 md:p-8 !pt-0">
                  {props.serviceCategories.map((category) => (
                    <div key={category.id} className="flex flex-col">
                      <h3 className="text-lg capitalize font-semibold text-slate-800 mb-2">
                        {category.name}
                      </h3>
                      <ul className="grid md:grid-cols-2 xl:grid-cols-3">
                        {category.services.map((service) => (
                          <li
                            key={service.id}
                            className="capitalize text-slate-600 text-sm mb-1"
                          >
                            {service.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Link
                href={`/booking/${props.bUrl}/booking-wizard`}
                className="w-full bg-blue-400 text-white px-6 py-3 rounded-md inline-flex items-center justify-center font-medium hover:bg-blue-500 transition-colors"
              >
                Book Now
              </Link>
              {/* <ReviewsSection reviews={props.reviews} /> */}

              {/* Display Programs section */}
              {props.programs && props.programs.length > 0 && (
                <Card className="">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Our Programs ({props.programs.length})
                    </h2>
                    <Link
                      href={`/booking/${props.bUrl}/program-reg-wizard`}
                      className="bg-green-500 text-white px-6 py-3 rounded-md inline-flex items-center justify-center font-medium hover:bg-green-600 transition-colors"
                    >
                      Register for Programs
                    </Link>
                  </CardHeader>
                  <CardContent className="p-4 md:p-8 !pt-0">
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {props.programs
                        .filter(
                          (program) => program.is_published && program.is_active
                        )
                        .map((program) => (
                          <div
                            key={program.id}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                          >
                            {/* Banner Image or Random Color */}
                            <div className="relative h-48 w-full">
                              {program.banner_image_url ? (
                                <img
                                  src={program.banner_image_url}
                                  alt={program.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div
                                  className={`h-full w-full ${getRandomColor(
                                    program.id
                                  )} flex items-center justify-center`}
                                >
                                  <span className="text-white text-lg font-semibold text-center px-4">
                                    {program.name}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Program Content */}
                            <div className="p-4 space-y-3">
                              <h3 className="text-xl font-semibold text-slate-800 line-clamp-2">
                                {program.name}
                              </h3>

                              {/* Date Range */}
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Dates: </span>
                                {formatDateRange(
                                  program.start_date,
                                  program.end_date,
                                  userTimezone
                                )}
                              </div>

                              {/* Capacity and Available Seats */}
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Capacity: </span>
                                {program.capacity ? (
                                  <>
                                    {program.capacity} participants
                                    {/* Note: Available seats would need participant count from API */}
                                    <span className="text-green-600 ml-2">
                                      ({program.availableSeats} seats available)
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-blue-600">
                                    Unlimited
                                  </span>
                                )}
                              </div>

                              {/* Price */}
                              <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                  {program.allow_deposits && program.deposit_amount ? (
                                    <>
                                      <div className="text-lg font-bold text-green-600">
                                        £{getProgramPrice(program)} 
                                        <span className="text-sm font-normal text-gray-600 ml-1">
                                          (Deposit)
                                        </span>
                                      </div>
                                      <div className="text-sm font-bold text-gray-500">
                                        Balance: £{(parseFloat(program.price) - parseFloat(program.deposit_amount.toString() || '0')).toFixed(2)}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-lg font-bold text-green-600">
                                      £{getProgramPrice(program)}
                                    </div>
                                  )}
                                </div>
                                <Link
                                  href={`/booking/${props.bUrl}/program-reg-wizard`}
                                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                                >
                                  Register Now
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Second Section: Right on Desktop, Bottom on Mobile */}
            <div className="lg:col-span-1 space-y-4 md:space-y-6">
              <BusinessDetails businessData={props} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
