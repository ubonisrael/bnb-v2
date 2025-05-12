"use client"

import React from "react";
import ServiceCard from "@/components/templates/default/ServiceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/contexts/AppContext";
import { Service } from "@/components/onboarding/type";

const ServiceCardGrid: React.FC = () => {
  const { activeCategoryTab, setActiveCategoryTab } = useApp();

  const handleTabChange = (value: string) => {
    setActiveCategoryTab(value);
  };

  const haircareServices: Service[] = [];

  return (
    <div className="w-full">
      <Tabs defaultValue={activeCategoryTab} onValueChange={handleTabChange} className="w-full">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <TabsList className="flex w-full justify-between -mb-px">
            <TabsTrigger 
              value="haircare" 
              className="py-4 px-6 border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap font-medium text-sm flex-1 text-center"
            >
              Hair Care
            </TabsTrigger>
            <TabsTrigger 
              value="facials" 
              className="py-4 px-6 border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap font-medium text-sm flex-1 text-center"
            >
              Facials
            </TabsTrigger>
            <TabsTrigger 
              value="nails" 
              className="py-4 px-6 border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap font-medium text-sm flex-1 text-center"
            >
              Nails
            </TabsTrigger>
            <TabsTrigger 
              value="massage" 
              className="py-4 px-6 border-b-2 data-[state=active]:border-primary-500 data-[state=active]:text-primary-600 dark:data-[state=active]:text-primary-400 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:data-[state=inactive]:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600 whitespace-nowrap font-medium text-sm flex-1 text-center"
            >
              Massage
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="haircare" className="mt-6 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {haircareServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceCardGrid;
