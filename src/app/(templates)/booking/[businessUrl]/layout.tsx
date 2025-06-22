"use client";

import React from "react";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/components/templates/default/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Footer from "@/app/(home)/Footer";
import Header from "@/app/(home)/Header";

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <AppProvider>
        <Header />
        {/* <Navbar /> */}
        {children}
        <Footer />
      </AppProvider>
  );
}
