"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SecuritySettings } from "@/components/profile/security-settings";
import { UserProfileSettings } from "@/components/profile/user-profile-settings";

export default function MyProfilePage() {

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-[#121212] text-3xl font-bold">Profile</h1>
          <p className="text-[#6E6E73]">Manage your profile and preferences.</p>
        </div>

        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Manage your business profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfileSettings />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage your account security and authentication methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecuritySettings />
          </CardContent>
        </Card>
      </div>
  );
}
