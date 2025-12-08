"use client";

import ImageCarousel from "./tabs/components/image-carousel";
import BusinessInfo from "./tabs/components/business-info";
import BusinessDetails from "./tabs/components/business-details";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect } from "react";
import api from "@/services/api-service";
import dayjs from "@/utils/dayjsConfig";
import { getRandomColor } from "@/utils/color";
import { formatDateRange } from "@/utils/time";
import { getProgramClassPriceWithDiscount } from "@/utils/programs";

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
                  <Link
                    href={`/booking/${props.bUrl}/booking-wizard`}
                    className="w-full bg-blue-400 text-white px-6 py-3 rounded-md inline-flex items-center justify-center font-medium hover:bg-blue-500 transition-colors"
                  >
                    Book Now
                  </Link>
                </CardContent>
              </Card>
              {/* <ReviewsSection reviews={props.reviews} /> */}

              {/* Staff Section */}
              {props.staffs && props.staffs.length > 0 && (
                <Card className="">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Our Team ({props.staffs.length})
                    </h2>
                  </CardHeader>
                  <CardContent className="p-4 md:p-8 !pt-0">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {props.staffs
                        .map((staff) => (
                          <div
                            key={staff.id}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white p-4"
                          >
                            <div className="flex flex-col items-center text-center space-y-3">
                              {/* Avatar */}
                              <Avatar className="h-24 w-24">
                                <AvatarImage src={staff.avatar || undefined} alt={staff.full_name} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-semibold">
                                  {staff.full_name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              {/* Name */}
                              <h3 className="text-lg font-semibold text-slate-800">
                                {staff.full_name}
                              </h3>

                              {/* Email */}
                              {staff.email && (
                                <p className="text-sm text-gray-600 break-all">
                                  {staff.email}
                                </p>
                              )}

                              {/* Phone */}
                              {staff.phone && (
                                <p className="text-sm text-gray-600 break-all">
                                  {staff.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Display Programs section */}
              {props.programs && props.programs.length > 0 && (
                <Card className="">
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Our Programs ({props.programs.length})
                    </h2>
                  </CardHeader>
                  <CardContent className="p-4 md:p-8 !pt-0">
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {props.programs
                        .filter(
                          (program) => program.is_published && program.is_active
                        )
                        .map((program) => {
                          return (
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

                                {/* About */}
                                <p className="text-sm text-gray-600 line-clamp-3">
                                  {program.about}
                                </p>

                                {/* Price Range */}
                                {/* <div className="text-sm text-gray-600">
                                  <span className="font-medium">Price: </span>
                                  {program.classes_count > 0 ? (
                                    minPrice === maxPrice ? (
                                      <span className="text-green-600 font-semibold">
                                        £{minPrice.toFixed(2)}
                                      </span>
                                    ) : (
                                      <span className="text-green-600 font-semibold">
                                        £{minPrice.toFixed(2)} - £
                                        {maxPrice.toFixed(2)}
                                      </span>
                                    )
                                  ) : (
                                    <span className="text-gray-500">
                                      No classes available
                                    </span>
                                  )}
                                </div> */}

                                {/* Capacity and Available Seats */}
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">
                                    Capacity:{" "}
                                  </span>
                                  {program.set_capacity_per_class ? (
                                    <span>Capacity set per class</span>
                                  ) : program.capacity ? (
                                    <>
                                      <span>
                                        {program.capacity} participants
                                      </span>
                                      <span className="text-green-600 ml-2">
                                        ({program.available_seats} seats
                                        available)
                                      </span>
                                    </>
                                  ) : (
                                    <span>Unlimited</span>
                                  )}
                                </div>

                                {/* Classes Section */}
                                {program.upcoming_classes &&
                                  program.upcoming_classes.length > 0 && (
                                    <div className="border-t pt-3 mt-3">
                                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Classes ({program.classes_count})
                                      </h4>
                                      <div className="space-y-2">
                                        {program.upcoming_classes
                                          .slice(0, 3)
                                          .map((cls) => {
                                            const capacitySetup =
                                              program.set_capacity_per_class;

                                            return (
                                              <div
                                                key={cls.id}
                                                className="bg-gray-50 p-3 rounded-md text-xs"
                                              >
                                                <div className="font-medium text-gray-800 mb-1">
                                                  {cls.name}
                                                </div>
                                                <div className="space-y-1 text-gray-600">
                                                  <div>
                                                    {formatDateRange(
                                                      cls.start_date,
                                                      cls.end_date,
                                                      userTimezone
                                                    )}
                                                  </div>
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-green-600 font-semibold">
                                                      £
                                                      {getProgramClassPriceWithDiscount(
                                                        cls,
                                                        program
                                                      ).toFixed(2)}
                                                    </span>
                                                    <span className="text-green-600 ml-2">
                                                      {!capacitySetup ? (
                                                        "Set per program"
                                                      ) : cls.capacity !==
                                                          null &&
                                                        cls.capacity !==
                                                          undefined ? (
                                                        <>
                                                          {cls.capacity}{" "}
                                                          capacity (
                                                          {cls.available_seats}{" "}
                                                          available)
                                                        </>
                                                      ) : (
                                                        "Unlimited"
                                                      )}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}

                                        {program.classes_count > 3 && (
                                          <div className="text-center">
                                            <Link
                                              href={`/booking/${props.bUrl}/program-reg-wizard/${program.id}`}
                                              className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                                            >
                                              View {program.classes_count - 3}{" "}
                                              more classes
                                            </Link>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {/* Register Button */}
                                <div className="flex justify-end pt-2">
                                  <Link
                                    href={`/booking/${props.bUrl}/program-reg-wizard/${program.id}`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                                  >
                                    Register
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
