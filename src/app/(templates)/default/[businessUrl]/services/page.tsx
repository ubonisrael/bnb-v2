import React from "react";
import { Params } from "../page";
import BusinessServices from "./client";


export default async function ServicesPage(props: Params) {
  const { businessUrl } = await props.params;

  return <BusinessServices url={businessUrl} />;
}
