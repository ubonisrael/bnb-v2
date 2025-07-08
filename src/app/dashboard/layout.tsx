"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { UserSettingsProvider } from "@/contexts/UserSettingsContext";
import api, { getCsrfTokenFromCookie } from "@/services/api-service";
import { InfoBar } from "@/components/dashboard/info-bar";
import { SupportModalTrigger } from "@/components/ui/support-modal-trigger";

function CSRFInitializer() {
  useEffect(() => {
    // Check if CSRF token is already set in the API service
    if (api.getCsrfToken()) {
      return;
    }
    // If not, fetch it from the cookie or API endpoint
    // and set it in the API service
    // This ensures that the CSRF token is available for subsequent requests
    // when the app is loaded
    // This is especially important for state-changing requests
    // like POST, PUT, DELETE, etc.
    const token = getCsrfTokenFromCookie();
    if (token) {
      api.setCsrfToken(token);
      return;
    }
    async function fetchCsrfToken() {
      try {
        const response = await api.get<{ csrfToken: string }>("/csrf-token");
        api.setCsrfToken(response.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
      }
    }
    // Fetch CSRF token from the API endpoint
    fetchCsrfToken();
  }, []);

  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState("16rem");
  const [collapsed, setCollapsed] = useState(false);

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarChange = (e: StorageEvent) => {
      if (e.key === "sidebar-collapsed") {
        setSidebarWidth(e.newValue === "true" ? "4rem" : "16rem");
      }
    };

    // Check initial state
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
    setSidebarWidth(isCollapsed ? "4rem" : "16rem");

    // Listen for changes
    window.addEventListener("storage", handleSidebarChange);

    return () => {
      window.removeEventListener("storage", handleSidebarChange);
    };
  }, []);

  return (
    <UserSettingsProvider>
      <CSRFInitializer />
      <div className="flex min-h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div
          className={`flex flex-1 flex-col transition-all duration-300 ${
            collapsed ? "md:ml-16" : "md:ml-64"
          }`}
        >
          <Header />
          <InfoBar />
          <main className="flex-1 p-6">{children}</main>
        </div>
        <SupportModalTrigger />
      </div>
    </UserSettingsProvider>
  );
}
