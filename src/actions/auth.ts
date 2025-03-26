"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function registerUser(data: {
  name: string
  email: string
  password: string
}) {
  // This would be where you'd connect to a database or API to create the user
  // For demo purposes, we'll just simulate the registration process
  console.log("Registering user:", data)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Set a cookie to "authenticate" the user for this demo
  cookies().set(
    "banknbook-user",
    JSON.stringify({
      id: "user_" + Math.random().toString(36).substring(2, 11),
      name: data.name,
      email: data.email,
      registeredAt: new Date().toISOString(),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    },
  )

  return { success: true }
}

export async function loginUser(data: {
  email: string
  password: string
  remember?: boolean
}) {
  // This would be where you'd connect to a database or API to validate the user
  // For demo purposes, we'll just simulate the login process
  console.log("Logging in user:", data)

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Set a cookie to "authenticate" the user for this demo
  cookies().set(
    "banknbook-user",
    JSON.stringify({
      id: "user_" + Math.random().toString(36).substring(2, 11),
      email: data.email,
      loggedInAt: new Date().toISOString(),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24, // 30 days or 1 day
      path: "/",
    },
  )

  return { success: true }
}

export async function logoutUser() {
  cookies().delete("banknbook-user")
  redirect("/auth/login")
}

export async function getCurrentUser() {
  const userCookie = cookies().get("banknbook-user")

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value)
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

