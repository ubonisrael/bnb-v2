"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SecuritySettings } from "@/components/settings/security-settings"
import { SocialMediaSettings } from "@/components/settings/social-media-settings"
import { ProfileSettings } from "@/components/settings/profile-settings"
import { NotificationPreferences } from "@/components/settings/notification-preferences"
import { UserSettingsProvider } from "@/contexts/user-settings-context"
import { BookingDaysSettings } from "@/components/settings/booking-days-settings"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <UserSettingsProvider>
      <div className="space-y-6">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Settings</h1>
          <p className="text-[#6E6E73]">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="booking-days">Booking Days</TabsTrigger>
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

          <TabsContent value="booking-days">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Booking Days & Hours</CardTitle>
                <CardDescription>Set up your business working hours and availability</CardDescription>
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

