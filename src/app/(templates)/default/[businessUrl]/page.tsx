import React from "react";
import BusinessLanding from "./client";
import Link from "next/link";

export type Params = {
  params: Promise<{
    businessUrl: string;
  }>;
};


export default async function LandingPage(props: Params) {
  const { businessUrl } = await props.params;

  return <BusinessLanding url={businessUrl} />;
}
