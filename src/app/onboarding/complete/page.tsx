import Link from "next/link"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/actions/auth"

export default async function OnboardingCompletePage() {
  // Ensure the user is authenticated
  const user = await requireAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F5F7] p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4CD964]/10">
            <CheckCircle className="h-6 w-6 text-[#4CD964]" />
          </div>
          <CardTitle className="text-2xl">Setup Complete!</CardTitle>
          <CardDescription>Your BanknBook account is ready to use</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Congratulations, {user.name || ""}! Your account has been successfully set up and is now ready to accept
            bookings.
          </p>
          <p className="text-sm text-[#6E6E73]">
            You can now access your dashboard to start managing your beauty business. Your services, booking template,
            and notification settings have been configured according to your preferences.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" asChild>
            <Link href="/dashboard/appointments">View Appointments Calendar</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/services">Manage Services</Link>
          </Button>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/dashboard/settings">Complete Your Profile</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

