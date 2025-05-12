"use client"

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useApp } from "@/contexts/AppContext";
import { Service } from "@/components/onboarding/type";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { selectedServices, addService, removeService } = useApp();
  const isSelected = selectedServices.some(s => s.id === service.id);

  const handleServiceToggle = () => {
    if (isSelected) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{service.name}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              {service.description}
            </p>
          </div>
          <div className="flex items-center">
            <Checkbox
              id={service.id}
              checked={isSelected}
              onCheckedChange={handleServiceToggle}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{service.duration} min</span>
          </div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            ${service.price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
