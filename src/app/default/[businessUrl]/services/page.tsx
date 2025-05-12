import React from "react";
import ServiceCardGrid from "@/components/templates/default/ServiceCardGrid";
import Cart from "@/components/templates/default/Cart";
import { Params } from "../page";

async function getBusinessServices(businessUrl: string) {
  try {
    // const response = await api.get(businessUrl);
    // template info
    const response = {
      name: "BeautySpot",
      logo: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
      categories: [
        {
          id: 1,
          name: "Hair cut"
        },
        {
          id: 2,
          name: "Hair style"
        },
        {
          id: 3,
          name: 'Make up'
        }
      ],
      services: [
        {
          id: 1,
          CategoryId: 1,
          name: "Skin cut",
          description: "Get a nice hair cut",
          price: 20,
          duration: 90,
          availableDays: ['monday', 'tuesday', 'wednesday']
        },
        {
          id: 2,
          CategoryId: 1,
          name: "Fade",
          description: "Get a nice hair cut",
          price: 20,
          duration: 90,
          availableDays: ['monday', 'tuesday', 'wednesday']
        },
        {
          id: 3,
          CategoryId: 2,
          name: 'Weave',
          description: "Get a nice hair cut",
          price: 20,
          duration: 90,
          availableDays: ['monday', 'tuesday', 'wednesday']
        },
        {
          id: 4,
          CategoryId: 2,
          name: 'Braids',
          description: "Get a nice hair cut",
          price: 20,
          duration: 90,
          availableDays: ['monday', 'tuesday', 'wednesday']
        },
        {
          id: 5,
          CategoryId: 3,
          name: 'Natural Glam',
          description: "Get a nice hair cut",
          price: 20,
          duration: 90,
          availableDays: ['monday', 'tuesday', 'wednesday']
        },
        {
          id: 6,
          CategoryId: 3,
          name: 'Soft Glam',
          description: "Get a nice hair cut",
          price: 20,
          duration: 90,
          availableDays: ['monday', 'tuesday', 'wednesday']
        },
      ]
    };
    return response;
  } catch (error) {
    console.error("Error fetching business details:", error);
    return null;
  }
}

export default async function ServicesPage({ params }: Params) {
  const businessData = await getBusinessServices(params.businessUrl);

  if (!businessData) {
    return <div>Error loading business details.</div>;
  }
  const handleContinueToBooking = () => {
    console.log('continue to boking')
  }

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
            <Cart name={businessData.name} logo={businessData.logo} onContinue={handleContinueToBooking} />
          </div>
        </div>
      </div>
    </div>
  );
};
