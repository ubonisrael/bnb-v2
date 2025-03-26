"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { useUserSettings } from "@/contexts/user-settings-context"

const profileSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  logoUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileSettings() {
  const { settings, updateSettings, isLoading: settingsLoading } = useUserSettings()
  const [isSaving, setIsSaving] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(settings.profile.logoUrl)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...settings.profile,
      logoUrl: settings.profile.logoUrl || "",
    },
  })

  async function onSubmit(values: ProfileFormValues) {
    setIsSaving(true)

    try {
      // Include the logo URL in the form values
      const updatedValues = {
        ...values,
        logoUrl: logoUrl || "",
      }

      await updateSettings("profile", updatedValues)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to a server and get back a URL
      // For demo purposes, we're using a local object URL
      const objectUrl = URL.createObjectURL(file)
      setLogoUrl(objectUrl)
      form.setValue("logoUrl", objectUrl)
    }
  }

  const removeLogo = () => {
    setLogoUrl(null)
    form.setValue("logoUrl", "")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Business Profile</h3>
          <p className="text-sm text-muted-foreground">Update your business information and profile</p>
        </div>

        <div className="space-y-4">
          {/* Use FormField for the logo to fix the context issue */}
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Logo</FormLabel>
                <div className="mt-2">
                  {logoUrl ? (
                    <div className="relative h-40 w-40">
                      <Image
                        src={logoUrl || "/placeholder.svg"}
                        alt="Business Logo"
                        fill
                        className="rounded-md object-contain"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute -right-2 -top-2 h-7 w-7 rounded-full border-gray-200 bg-white"
                        onClick={removeLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center rounded-md border border-dashed border-[#E0E0E5] px-6 py-10">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-[#6E6E73]" />
                        <div className="mt-2 flex text-sm leading-6 text-[#6E6E73]">
                          <label
                            htmlFor="logo-upload"
                            className="relative cursor-pointer rounded-md font-semibold text-[#7B68EE]"
                          >
                            <span>Upload a file</span>
                            <input
                              id="logo-upload"
                              name="logo-upload"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleLogoUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-[#6E6E73]">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <FormDescription>Your logo will appear on your booking page and receipts</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State/Province</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Tell clients about your business..." className="resize-none" {...field} />
                </FormControl>
                <FormDescription>This will be displayed on your public profile</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSaving || settingsLoading}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

