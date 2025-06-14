"use client";

import ImageCarousel from "./components/image-carousel";
import BusinessInfo from "./components/business-info";
import ServicesSection from "./components/services-section";
import ReviewsSection from "./components/reviews-section";
import BusinessDetails from "./components/business-details";
import { BusinessDataResponse } from "@/types/response";

export function BusinessLanding(
  props: BusinessDataResponse & { gotoBooking: (index: number) => void }
) {
  const { gotoBooking } = props;
  return (
    <div className="w-full min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 min-h-screen">
        {/* First Section: Left on Desktop, Top on Mobile */}
        <div className="lg:col-span-2 space-y-8">
          <ImageCarousel images={props.images} />
          <BusinessInfo
            name={props.name}
            location={`${props.address}, ${props.city}, ${props.state}`}
          />
          <ServicesSection
            index={0}
            serviceCategories={props.serviceCategories}
            gotoTab={gotoBooking}
          />
          <ReviewsSection reviews={props.reviews} />
        </div>

        {/* Second Section: Right on Desktop, Bottom on Mobile */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          <BusinessDetails businessData={props} />
        </div>
      </div>
    </div>
  );
}
