"use server"

import { cookies } from "next/headers"

export async function completeOnboarding(data: any) {
  // This would be where you'd connect to a database or API to save the onboarding data
  // For demo purposes, we'll just simulate saving the data
  console.log("Completing onboarding with data:", data)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Update the user cookie with onboarding data
  const userCookie = cookies().get("banknbook-user")

  if (!userCookie) {
    throw new Error("User not found")
  }

  try {
    const user = JSON.parse(userCookie.value)

    // Add onboarding data to the user object
    const updatedUser = {
      ...user,
      onboarded: true,
      businessInfo: data.businessInfo,
      businessType: data.businessType,
      location: data.location,
      teamSize: data.teamSize,
      visualSettings: data.visualSettings,
      servicesSetup: data.servicesSetup,
      bookingTemplate: data.bookingTemplate,
      paymentDetails: data.paymentDetails,
      notificationSettings: data.notificationSettings,
      onboardedAt: new Date().toISOString(),
    }

    // Update the cookie
    cookies().set("banknbook-user", JSON.stringify(updatedUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to update user data:", error)
    throw new Error("Failed to complete onboarding")
  }
}

