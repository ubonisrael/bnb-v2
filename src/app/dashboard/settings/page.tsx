"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SocialMediaSettings } from "@/components/settings/social-media-settings";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { NotificationPreferences } from "@/components/settings/notification-preferences";
import {
  useUserSettings,
} from "@/contexts/UserSettingsContext";
import { BookingDaysSettings } from "@/components/settings/booking-days-settings";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { settings } = useUserSettings();
  const [activeTab, setActiveTab] = useState("profile");

  const router = useRouter();

  // Restrict access to admin and owner only
  useEffect(() => {
    if (settings && settings.role !== "owner" && settings.role !== "admin") {
      toast.error("You don't have permission to access this page");
      router.push("/dashboard");
    }
  }, [settings, router]);
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Settings</h1>
          <p className="text-[#6E6E73]">
            Manage your business account settings and preferences.
          </p>
        </div>

        <Tabs
          defaultValue="profile"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="h-full flex flex-col space-y-2 sm:grid sm:grid-cols-3 md:grid-cols-5 sm:space-y-0 sm:gap-2">
            <TabsTrigger value="profile" className="w-full">
              Business Profile
            </TabsTrigger>
            <TabsTrigger value="social" className="w-full">
              Social Media
            </TabsTrigger>
            <TabsTrigger value="notifications" className="w-full">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="booking-settings" className="w-full">
              Booking Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Business Profile Settings</CardTitle>
                <CardDescription>
                  Manage your business profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Connect your social media accounts to your business profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialMediaSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationPreferences />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="booking-settings">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Booking Settings</CardTitle>
                <CardDescription>
                  Set up your booking policies, business working hours and
                  availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookingDaysSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
