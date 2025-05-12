import React from "react";
import { useApp } from "@/contexts/AppContext";
import ServiceCardGrid from "@/components/ServiceCardGrid";
import Cart from "@/components/Cart";

const Services: React.FC = () => {
  const { setActiveStep } = useApp();

  const handleContinueToBooking = () => {
    setActiveStep("datetime");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:text-center mb-10">
          <h2 className="text-base text-primary-600 dark:text-primary-400 font-semibold tracking-wide uppercase">Our Services</h2>
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
            <ServiceCardGrid />
          </div>

          {/* Right Column: Cart (2/5 width) */}
          <div className="w-full lg:w-2/5">
            <Cart onContinue={handleContinueToBooking} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
