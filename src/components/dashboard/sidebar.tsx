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
  Menu,
  X,
  School,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: FileText,
  },
  {
    title: "Programs",
    href: "/dashboard/programs",
    icon: School,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (state: boolean) => void;
}) {
  const { settings } = useUserSettings();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Check for saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar-collapsed");
    if (savedState) {
      setCollapsed(savedState === "true");
    }
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {
      // Desktop behavior
      const newState = !collapsed;
      setCollapsed(newState);
      localStorage.setItem("sidebar-collapsed", String(newState));
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "sidebar-collapsed",
          newValue: String(newState),
        })
      );
    } else {
      // Mobile behavior
      setIsMobileOpen(!isMobileOpen);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col bg-[#1a1f36] text-white transition-all duration-300",
          // Desktop styles
          "md:left-0",
          collapsed ? "md:w-16" : "md:w-64",
          // Mobile styles
          "w-64 -left-64",
          isMobileOpen && "left-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#2a3352] px-4">
          {/* Add mobile menu button for smaller screens */}
          <span
            className={`flex h-8 px-2 items-center justify-center text-white ${
              collapsed ? "md:hidden" : ""
            }`}
          >
            BankNBook
          </span>
          <div className="block md:hidden p-2">
            {isMobileOpen ? (
              <Button
                onClick={() => setIsMobileOpen((prev) => !prev)}
                variant={"ghost"}
              >
                <X className="h-6 w-6 text-white" />
              </Button>
            ) : (
              <Button
                onClick={() => setIsMobileOpen((prev) => !prev)}
                variant={"ghost"}
                className="absolute top-2 left-full"
              >
                <Menu className="h-6 w-6 text-black" />
              </Button>
            )}
          </div>

          <button
            className="hidden md:block p-2 text-white"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
          >
            {collapsed ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </button>
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
                        className={`flex w-full items-center gap-3`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span
                          className={`text-sm font-medium md:${
                            collapsed ? "hidden" : ""
                          }`}
                        >
                          {item.title}
                        </span>
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
              {settings?.profile.logo ? (
                <div className="relative h-9 w-9">
                  <Image
                    src={settings.profile.logo}
                    alt="Business Logo"
                    fill
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white"></div>
              )}
              <div>
                <p className="text-sm font-medium">
                  {settings?.profile.name || "Business"}
                </p>
                <p className="text-xs text-[#a4b0d3]">Business Account</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              {settings && (
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={settings.profile.logo || "/placeholder.svg"}
                    alt="User"
                  />
                  <AvatarFallback className="text-black">
                    {settings?.profile.name[0]}
                    {settings?.profile.name[1]}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
