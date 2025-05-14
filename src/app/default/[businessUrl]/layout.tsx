"use client";

import React from "react";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/components/templates/default/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AppProvider>
        <Navbar />
        {children}
      </AppProvider>
    </ThemeProvider>
  );
}
