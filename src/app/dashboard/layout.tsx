"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarWidth, setSidebarWidth] = useState("16rem")

  // Listen for sidebar collapse state changes
  useEffect(() => {
    const handleSidebarChange = (e: StorageEvent) => {
      if (e.key === "sidebar-collapsed") {
        setSidebarWidth(e.newValue === "true" ? "4rem" : "16rem")
      }
    }

    // Check initial state
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true"
    setSidebarWidth(isCollapsed ? "4rem" : "16rem")

    // Listen for changes
    window.addEventListener("storage", handleSidebarChange)

    return () => {
      window.removeEventListener("storage", handleSidebarChange)
    }
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

