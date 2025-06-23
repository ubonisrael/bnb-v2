"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SecuritySettings } from "@/components/settings/security-settings"
import { SocialMediaSettings } from "@/components/settings/social-media-settings"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { NotificationPreferences } from "@/components/settings/notification-preferences"
import { UserSettingsProvider } from "@/contexts/UserSettingsContext"
import { BookingDaysSettings } from "@/components/settings/booking-days-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <UserSettingsProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Settings</h1>
          <p className="text-[#6E6E73]">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="h-full flex flex-col space-y-2 sm:grid sm:grid-cols-3 md:grid-cols-5 sm:space-y-0 sm:gap-2">
            <TabsTrigger value="profile" className="w-full">Profile</TabsTrigger>
            <TabsTrigger value="security" className="w-full">Security</TabsTrigger>
            <TabsTrigger value="social" className="w-full">Social Media</TabsTrigger>
            <TabsTrigger value="notifications" className="w-full">Notifications</TabsTrigger>
            <TabsTrigger value="booking-settings" className="w-full">Booking Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your business profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and authentication methods</CardDescription>
              </CardHeader>
              <CardContent>
                <SecuritySettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Connect your social media accounts to your profile</CardDescription>
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
                <CardDescription>Manage how you receive notifications</CardDescription>
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
                <CardDescription>Set up your booking policies, business working hours and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingDaysSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UserSettingsProvider>
  )
}

