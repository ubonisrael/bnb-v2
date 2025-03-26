"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Instagram, Facebook, Twitter, Linkedin, Youtube, TwitterIcon as TikTok, Globe, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { useUserSettings } from "@/contexts/user-settings-context"

const socialMediaSchema = z.object({
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)),
  instagram: z.string().or(z.string().length(0)),
  facebook: z.string().or(z.string().length(0)),
  twitter: z.string().or(z.string().length(0)),
  linkedin: z.string().or(z.string().length(0)),
  youtube: z.string().or(z.string().length(0)),
  tiktok: z.string().or(z.string().length(0)),
})

type SocialMediaFormValues = z.infer<typeof socialMediaSchema>

export function SocialMediaSettings() {
  const { settings, updateSettings, isLoading: settingsLoading } = useUserSettings()
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: settings.socialMedia,
  })

  async function onSubmit(values: SocialMediaFormValues) {
    setIsSaving(true)

    try {
      await updateSettings("socialMedia", values)

      toast({
        title: "Social media links updated",
        description: "Your social media links have been saved successfully.",
      })
    } catch (error) {
      console.error("Failed to save social media links:", error)
      toast({
        title: "Error",
        description: "Failed to save your social media links. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Social Media Links</h3>
          <p className="text-sm text-muted-foreground">Connect your social media accounts to your business profile</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://yourbusiness.com" {...field} />
                </FormControl>
                <FormDescription>Your business website URL</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </FormLabel>
                <FormControl>
                  <Input placeholder="@yourbusiness" {...field} />
                </FormControl>
                <FormDescription>Your Instagram handle</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="facebook"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </FormLabel>
                <FormControl>
                  <Input placeholder="yourbusiness" {...field} />
                </FormControl>
                <FormDescription>Your Facebook page name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </FormLabel>
                <FormControl>
                  <Input placeholder="@yourbusiness" {...field} />
                </FormControl>
                <FormDescription>Your Twitter handle</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </FormLabel>
                <FormControl>
                  <Input placeholder="company/yourbusiness" {...field} />
                </FormControl>
                <FormDescription>Your LinkedIn company page</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtube"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube
                </FormLabel>
                <FormControl>
                  <Input placeholder="@yourbusiness" {...field} />
                </FormControl>
                <FormDescription>Your YouTube channel</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tiktok"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <TikTok className="h-4 w-4" />
                  TikTok
                </FormLabel>
                <FormControl>
                  <Input placeholder="@yourbusiness" {...field} />
                </FormControl>
                <FormDescription>Your TikTok handle</FormDescription>
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

