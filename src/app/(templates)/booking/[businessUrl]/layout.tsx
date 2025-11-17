"use client";

import React from "react";
import { AppProvider } from "@/contexts/AppContext";
import Footer from "@/app/(home)/Footer";
import Header from "@/app/(home)/Header";
import { SupportModalTrigger } from "@/components/ui/support-modal-trigger";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <AppProvider>
        <Header />
        {children}
        <SupportModalTrigger />
      </AppProvider>
  );
}
