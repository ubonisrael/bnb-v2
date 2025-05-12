import React from "react";
import api from "@/services/api-service";
import BusinessLanding from "./client"

export type Params = {
  params: {
    businessUrl: string;
  };
};

async function getBusinessTemplateDetails(businessUrl: string) {
  try {
    // const response = await api.get(businessUrl);
    // template info
    const response = {
      name: "BeautySpot",
      banner: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
      email: "info@beautyspot.com",
      phone: "(555) 123-4567",
      address: "123 Beauty Lane",
      city: "Stylish City",
      state: "SC",
      zip: "12345",
      description: "Since 2010, BeautySpot has been helping clients look and feel their best with expert services and premium products.",
      hours: {
        monday: "9AM - 8PM",
        tuesday: "9AM - 8PM",
        wednesday: "9AM - 8PM",
        thursday: "9AM - 8PM",
        friday: "9AM - 8PM",
        saturday: "10AM - 6PM",
        sunday: "Closed"
      },
      latitude: 40.7128,
      longitude: -74.0060
    };
    return response;
  } catch (error) {
    console.error("Error fetching business details:", error);
    return null;
  }
}

export default async function LandingPage({ params }: Params) {
  const businessData = await getBusinessTemplateDetails(params.businessUrl);

  if (!businessData) {
    return <div>Error loading business details.</div>;
  }

  return <BusinessLanding businessData={businessData} />;
}