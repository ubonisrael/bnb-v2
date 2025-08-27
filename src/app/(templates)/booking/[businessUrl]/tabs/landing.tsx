"use client";

import ImageCarousel from "./components/image-carousel";
import BusinessInfo from "./components/business-info";
import ServicesSection from "./components/services-section";
import ReviewsSection from "./components/reviews-section";
import BusinessDetails from "./components/business-details";
import { BusinessDataResponse } from "@/types/response";
import Link from "next/link";
import { Button } from "@/components/templates/default/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CardContent } from "@/components/templates/default/ui/card";
import { ChevronRight } from "lucide-react";

export function BusinessLanding(
  props: BusinessDataResponse & { gotoBooking: (index: number) => void }
) {
  const { gotoBooking } = props;

  // get number of services
  const totalServices = props.serviceCategories.reduce(
    (sum, category) => sum + category.services.length,
    0
  );
  return (
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
                Categories We Offer Services In ({totalServices})
              </h2>
              <Button className="" onClick={() => gotoBooking(1)}>
                Book Now
              </Button>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 md:p-8 !pt-0">
              {props.serviceCategories.map((category) => (
                <div key={category.id} className="flex flex-col">
                  <h3 className="text-lg capitalize font-semibold text-slate-800 mb-2">
                    {category.name}
                  </h3>
                  <ul>
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
          <Button
            className="w-full text-base font-medium"
            onClick={() => gotoBooking(1)}
          >
            Schedule An Appointment
          </Button>
          {/* <ReviewsSection reviews={props.reviews} /> */}
        </div>

        {/* Second Section: Right on Desktop, Bottom on Mobile */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <BusinessDetails businessData={props} />
        </div>
      </div>
    </div>
  );
}
