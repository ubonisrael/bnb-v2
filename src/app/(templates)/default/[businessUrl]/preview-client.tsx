"use client";

import { useEffect, useState } from "react";
import { BookingWizard } from "./booking-wizard";
import { LandingTemplate } from "@/types/response";

export default function PreviewClientComponent() {
  const [data, setData] = useState<LandingTemplate | null>(null);

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;
    const hours = JSON.parse(searchParams.get("hours") || "{}");
    const services = JSON.parse(searchParams.get("services") || "[]");
    const categories = JSON.parse(searchParams.get("categories") || "[]");

    const previewData: LandingTemplate = {
      type: searchParams.get("type") || "",
      name: searchParams.get("name") || "",
      bannerHeader: searchParams.get("bannerHeader") || "",
      bannerMessage: searchParams.get("bannerMessage") || "",
      aboutSubHeader: searchParams.get("aboutSubHeader") || "",
      bUrl: searchParams.get("bUrl") || "",
      banner: searchParams.get("banner") || "",
      logo: searchParams.get("logo") || "",
      email: searchParams.get("email") || "",
      phone: searchParams.get("phone") || "",
      address: searchParams.get("address") || "",
      city: searchParams.get("city") || "",
      state: searchParams.get("state") || "",
      zip: searchParams.get("zip") || "",
      description: searchParams.get("description") || "",
      minNotice: parseInt(searchParams.get("minNotice") || "0"),
      maxNotice: parseInt(searchParams.get("maxNotice") || "0"),
      latitude: parseFloat(searchParams.get("latitude") || "0"),
      longitude: parseFloat(searchParams.get("longitude") || "0"),
      utcOffset: parseInt(searchParams.get("utcOffset") || "0"),
      hours,
      services,
      categories,
    };

    setData(previewData);
  }, []);

  if (!data) return <div className="text-center py-10">Loading preview...</div>;

  return <BookingWizard {...data} />;
}
