"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  TwitterIcon as TikTok,
  Globe,
  Loader2,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/services/api-service";
import { UnsavedChangesBanner } from "../UnSavedChangesBanner";
import { Skeleton } from "../ui/skeleton";

const socialMediaSchema = z.object({
  website: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
  instagram: z.string().optional().or(z.string().length(0)),
  facebook: z.string().optional().or(z.string().length(0)),
  twitter: z.string().optional().or(z.string().length(0)),
  linkedin: z.string().optional().or(z.string().length(0)),
  youtube: z.string().optional().or(z.string().length(0)),
  tiktok: z.string().optional().or(z.string().length(0)),
});

type SocialMediaFormValues = z.infer<typeof socialMediaSchema>;

interface SocialMediaData {
  web_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
}

interface SocialMediaResponse {
  success: boolean;
  message: string;
  data: {
    social: SocialMediaData;
  };
}

export function SocialMediaSettings() {
  const queryClient = useQueryClient();

  // Fetch social media data
  const { data: socialData, isLoading: isLoadingSocial } = useQuery({
    queryKey: ["business-socials"],
    queryFn: async () => {
      const response = await api.get<SocialMediaResponse>("sp/socials");
      return response.data.social;
    },
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    values: socialData
      ? {
          website: socialData.web_url || "",
          tiktok: socialData.tiktok_url || "",
          twitter: socialData.twitter_url || "",
          instagram: socialData.instagram_url || "",
          linkedin: socialData.linkedin_url || "",
          youtube: socialData.youtube_url || "",
          facebook: socialData.facebook_url || "",
        }
      : {
          website: "",
          tiktok: "",
          twitter: "",
          instagram: "",
          linkedin: "",
          youtube: "",
          facebook: "",
        },
  });

  const updateSocialMediaMutation = useMutation({
    mutationFn: async (values: SocialMediaFormValues) => {
      const response = await api.patch<SocialMediaResponse>("sp/socials", {
        website_url: values.website || null,
        instagram_url: values.instagram || null,
        facebook_url: values.facebook || null,
        twitter_url: values.twitter || null,
        linkedin_url: values.linkedin || null,
        youtube_url: values.youtube || null,
        tiktok_url: values.tiktok || null,
      });
      return response.data;
    },
    onMutate: () => {
      toast.loading("Saving social media links...", {
        id: "social-media-save",
      });
    },
    onSuccess: () => {
      toast.success("Social media links updated successfully", {
        id: "social-media-save",
      });
      queryClient.invalidateQueries({ queryKey: ["business-socials"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update social media links",
        {
          id: "social-media-save",
        }
      );
    },
  });

  async function onSubmit(values: SocialMediaFormValues) {
    try {
      await updateSocialMediaMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to save social media links:", error);
    }
  }

  const { isDirty } = form.formState;

  if (isLoadingSocial) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      {isDirty && <UnsavedChangesBanner form={form} />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Social Media Links</h3>
            <p className="text-sm text-muted-foreground">
              Connect your social media accounts to your business profile
            </p>
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
              disabled={updateSocialMediaMutation.isPending || !isDirty}
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
    </>
  );
}
