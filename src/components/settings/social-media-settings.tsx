"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Instagram, Facebook, Twitter, Linkedin, Youtube, TwitterIcon as TikTok, Globe, Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useUserSettings } from "@/contexts/user-settings-context"
import api from "@/services/api-service"
import { BusinessDataResponse } from "@/types/response"
import { useEffect } from "react"

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

  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: settings?.socialMedia,
  })

    useEffect(() => {
      if (settings) {
        form.reset({
          website: settings.socialMedia.website,
          tiktok: settings.socialMedia.tiktok,
          twitter: settings.socialMedia.twitter,
          instagram: settings.socialMedia.instagram,
          linkedin: settings.socialMedia.linkedin,
          youtube: settings.socialMedia.youtube,
          facebook: settings.socialMedia.facebook
        });
      }
    }, [form, settings?.socialMedia]);

  const updateSocialMediaMutation = useMutation({
    mutationFn: async (values: SocialMediaFormValues) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.patch<BusinessDataResponse>(
          '/sp/socials',
          {
            website_url: values.website,
            instagram_url: values.instagram,
            facebook_url: values.facebook,
            twitter_url: values.twitter,
            linkedin_url: values.linkedin,
            youtube_url: values.youtube,
            tiktok_url: values.tiktok,
          },
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          toast.error('Request was cancelled');
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading('Saving social media links...', { id: 'social-media-save' });
    },
    onSuccess: (response) => {
      toast.success('Social media links updated successfully', { id: 'social-media-save' });
      updateSettings("socialMedia", response.data);
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update social media links', { id: 'social-media-save' });
    },
  });

  async function onSubmit(values: SocialMediaFormValues) {
    try {
      await updateSocialMediaMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to save social media links:", error);
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
          <Button
            type="submit"
            disabled={updateSocialMediaMutation.isPending || settingsLoading}
          >
            {updateSocialMediaMutation.isPending ? (
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

