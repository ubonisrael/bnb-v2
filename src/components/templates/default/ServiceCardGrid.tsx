"use client";

import React from "react";
import ServiceCard from "@/components/templates/default/ServiceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Service, ServiceCategory } from "@/components/onboarding/type";

interface ServiceCardGridProps {
  services: Service[];
  categories: ServiceCategory[];
}

const ServiceCardGrid: React.FC<ServiceCardGridProps> = ({
  services,
  categories,
}) => {
  return (
    <div className="w-full">
      <Tabs defaultValue={categories[0].id} className="w-full">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <TabsList className="overflow-x-auto overflow-y-hidden scrollbar-thin flex w-full justify-between -mb-px">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="py-4 px-6 border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap font-medium text-sm flex-1 text-center"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {categories.map((category) => (
            <TabsContent
            key={category.id}
            value={category.id}
            className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-2"
            >
            {services.filter((service) => service.CategoryId === category.id).length > 0 ? (
              services
              .filter((service) => service.CategoryId === category.id)
              .map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            ) : (
              <p className="text-gray-500 text-center">No services available in this category</p>
            )}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ServiceCardGrid;
