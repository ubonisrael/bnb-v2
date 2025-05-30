"use client";

import { BusinessData, businessData } from "../types";
import ImageCarousel from "./components/image-carousel";
import BusinessInfo from "./components/business-info";
import ServicesSection from "./components/services-section";
import ReviewsSection from "./components/reviews-section";
import BusinessDetails from "./components/business-details";

export function BusinessLanding(props: BusinessData & { gotoBooking: (index: number) => void }) {
  const { gotoBooking } = props;
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-screen">
          {/* First Section: Left on Desktop, Top on Mobile */}
          <div className="lg:col-span-2 space-y-8">
            <ImageCarousel images={businessData.images} />
            <BusinessInfo
              name={businessData.name} 
              location={businessData.address} 
            />
            <ServicesSection index={0} serviceCategories={businessData.serviceCategories} gotoTab={gotoBooking}  />
            <ReviewsSection reviews={businessData.reviews} />
          </div>

          {/* Second Section: Right on Desktop, Bottom on Mobile */}
          <div className="lg:col-span-1 space-y-6">
            <BusinessDetails businessData={businessData} />
          </div>
        </div>
      </div>
    </div>
  );
}
