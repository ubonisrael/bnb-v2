"use client";

import Cart from "@/components/templates/default/Cart";
import { Button } from "@/components/templates/default/ui/button";
import { Home } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useEffect } from "react";
import ServicesSection from "./components/services-section";
import { ServicesTabPropsInterface } from "@/types/response";

export function ServicesTab({
  name,
  logo,
  serviceCategories,
  gotoNextTab,
  gotoPrevTab,
}: ServicesTabPropsInterface) {
  const { resetBooking } = useApp();

  useEffect(() => {
    resetBooking();
  }, [])
  return (
      <div className="w-full min-h-screen sm:px-6 lg:px-8 py-10">
        <div className="px-4">
          <Button onClick={gotoPrevTab} className="flex items-center justify-center mb-4">
          <Home />
        </Button>
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
        </div>
        

        <div className="flex flex-col lg:flex-row">
          {/* Left Column: Services (3/5 width) */}
          <div className="w-full lg:w-3/5 pr-0 lg:pr-8 mb-6 lg:mb-0">
            <ServicesSection serviceCategories={serviceCategories} index={1} />
          </div>

          {/* Right Column: Cart (2/5 width) */}
          <div className="relative w-full lg:w-2/5">
            <Cart name={name} logo={logo} gotoBooking={gotoNextTab} />
          </div>
        </div>
      </div>
  );
}
