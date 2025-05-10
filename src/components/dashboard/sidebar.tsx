"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Scissors,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  BarChart3,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserSettings } from "@/contexts/user-settings-context";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
  },

  {
    title: "Services",
    href: "/dashboard/services",
    icon: Scissors,
  },
  // {
  //   title: "Payments",
  //   href: "/dashboard/payments",
  //   icon: CreditCard,
  // },
  // {
  //   title: "Templates",
  //   href: "/dashboard/templates",
  //   icon: FileText,
  // },
  // {
  //   title: "Analytics",
  //   href: "/dashboard/analytics",
  //   icon: BarChart3,
  // },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const { settings } = useUserSettings();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Check for saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState) {
      setCollapsed(savedState === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
    // Dispatch storage event for the layout to detect
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "sidebar-collapsed",
        newValue: String(newState),
      })
    );
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-[#1a1f36] text-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#2a3352] px-4">
        {collapsed ? (
          <span className="mx-auto flex h-8 w-8  text-xs items-center justify-center text-white">
            BNB
          </span>
        ) : (
          <span className="flex h-8 px-2 items-center justify-center text-white">
            BankNBook
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-white hover:bg-[#2a3352]",
            collapsed && "ml-auto"
          )}
          onClick={toggleSidebar}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-6 px-2">
          <TooltipProvider delayDuration={0}>
            {sidebarItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    asChild
                    className={cn(
                      "flex h-12 items-center justify-start rounded-md px-3 text-[#a4b0d3] hover:bg-[#2a3352] hover:text-white",
                      collapsed && "justify-center px-0",
                      pathname === item.href && "bg-[#2a3352] text-white"
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex w-full items-center gap-3"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{item.title}</TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </div>
      <div className="mt-auto p-4">
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-lg bg-[#2a3352] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
              {/* {business?.data.name.charAt(0)} */}
            </div>
            <div>
              <p className="text-sm font-medium">
                {settings?.profile.name || "Business"}
              </p>
              <p className="text-xs text-[#a4b0d3]">Business Account</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
              {settings?.profile.name[0] || "BS"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
