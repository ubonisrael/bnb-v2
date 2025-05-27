"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { UserSettingsProvider } from "@/contexts/user-settings-context";
import api, { getCsrfTokenFromCookie } from "@/services/api-service";

function CSRFInitializer() {
  useEffect(() => {
    // Check if CSRF token is already set in the API service
    console.log("Checking CSRF token in API service...");
    console.log("Current CSRF token:", api.getCsrfToken());
    
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
        <Sidebar />
        <div
          className="flex flex-1 flex-col transition-all duration-300"
          style={{ marginLeft: sidebarWidth }}
        >
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </UserSettingsProvider>
  );
}
