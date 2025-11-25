"use client";

import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { StaffDashboard } from "@/components/dashboard/StaffDashboard";
import {
  Card,
  CardHeader,
} from "@/components/ui/card";
import { useUserSettings } from "@/contexts/UserSettingsContext";

export default function DashboardPage() {
  const { settings, isLoading } = useUserSettings();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-card">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-8 w-20 animate-pulse rounded bg-gray-200" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render based on user role
  const isAdminOrOwner =
    settings?.role === "owner" || settings?.role === "admin";

  return isAdminOrOwner ? <AdminDashboard /> : <StaffDashboard />;
}
