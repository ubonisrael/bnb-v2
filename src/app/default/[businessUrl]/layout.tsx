"use client";

import React from "react";
import { AppProvider } from "@/contexts/AppContext";
import Navbar from "@/components/templates/default/Navbar";

export default function LandingPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <AppProvider>
            <Navbar />
            {children}
        </AppProvider>
    );
}
