import React from "react";
import Link from "next/link";
import { BookingWizard } from "./booking-wizard";
import api from "@/services/api-service";
import { LandingTemplate, TemplateResponse } from "@/types/response";
import DynamicComponentWrapper from "./dynamic-component-wrapper";

export type Params = {
  params: Promise<{
    businessUrl: string;
  }>;
};

async function getServiceProviderDetails(url: string) {
  try {
    if (url === "sample") {
      return {
        type: "sample",
        name: "BeautySpot",
        bannerHeader: "Discover beauty at BeautySpot",
        bannerMessage:
          "Elevate your look with our premium salon and spa services...",
        aboutSubHeader: "Your Beauty, Our Passion",
        bUrl: "1234",
        banner:
          "https://images.unsplash.com/photo-1562322140-8baeececf3df?...q=80",
        logo: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80",
        email: "info@beautyspot.com",
        phone: "(555) 123-4567",
        address: "123 Beauty Lane",
        city: "Stylish City",
        state: "SC",
        zip: "12345",
        minNotice: 1,
        maxNotice: 21,
        description:
          "Since 2010, BeautySpot has been helping clients look and feel their best with expert services and premium products.",
        hours: {
          monday: "9AM - 8PM",
          tuesday: "9AM - 8PM",
          wednesday: "9AM - 8PM",
          thursday: "9AM - 8PM",
          friday: "9AM - 8PM",
          saturday: "10AM - 6PM",
          sunday: "Closed",
        },
        latitude: 40.7128,
        longitude: -74.006,
        utcOffset: 0,
        categories: [
          {
            id: 1,
            name: "Hair cut",
          },
          {
            id: 2,
            name: "Hair style",
          },
          {
            id: 3,
            name: "Make up",
          },
        ],
        services: [
          {
            id: "1",
            CategoryId: 1,
            categoryId: 1,
            name: "Skin cut",
            description: "Get a nice hair cut",
            price: 20,
            duration: 90,
            availableDays: ["monday", "tuesday", "wednesday"],
          },
          {
            id: "3",
            CategoryId: 2,
            categoryId: 2,
            name: "Weave",
            description: "Get a nice hair cut",
            price: 20,
            duration: 90,
            availableDays: ["monday", "tuesday", "wednesday"],
          },
          {
            id: "5",
            CategoryId: 3,
            categoryId: 3,
            name: "Natural Glam",
            description: "Get a nice hair cut",
            price: 20,
            duration: 90,
            availableDays: ["monday", "tuesday", "wednesday"],
          },
        ],
      };
    } 
    const reponse = await api.get<TemplateResponse>(`sp/${url}`);
    return reponse.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function LandingPage(props: Params) {
  const { businessUrl } = await props.params;
  let data = await getServiceProviderDetails(businessUrl) as LandingTemplate;

  if (businessUrl === "preview") {
    return <DynamicComponentWrapper />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-gray-600 mb-4">
            We couldn't load the business details.
          </p>
          <p className="text-gray-500 mb-4">
            Please try again later or contact support.
          </p>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  // return <div>Sample Page</div>
  return <BookingWizard {...data} />;
}
