"use client"

import React, { useState } from "react";
import Image from "next/image";
import { BookingTemplateData } from "@/components/onboarding/type";
import { bookingTemplateSchema } from "@/components/onboarding/steps/booking-template";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserSettings } from "@/contexts/user-settings-context";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  ref as fRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/services/firebase";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import { TemplateDataResponse } from "@/types/response";

export default function TemplatesPage() {
  const {
    settings,
    updateSettings,
    isLoading: settingsLoading,
  } = useUserSettings();
  const [bannerUrl, setBannerUrl] = useState(
    settings?.template.bannerUrl ?? ""
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<Omit<BookingTemplateData, "bannerImageUrl">>({
    resolver: zodResolver(bookingTemplateSchema),
    defaultValues: {
      templateType: settings?.template.templateType || "",
      bannerHeader: settings?.template.bannerHeader || "",
      bannerMessage: settings?.template.bannerMessage || "",
      aboutSubHeader: settings?.template.aboutSubHeader || "",
      description: settings?.template.description || "",
    },
  });

  const handleBannerImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      // toast.loading('Uploading logo...', { id: 'logo-upload' });
      const storageRef = fRef(storage, `bnb/${Date.now()}/banner-image`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => toast.error(error.message),
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setBannerUrl(downloadURL);
          })
      );

      toast.success("Banner image uploaded successfully", {
        id: "banner-image-upload",
      });
    } catch (error: unknown) {
      console.error("Failed to upload banner image:", error);
      toast.error("Failed to upload banner image", {
        id: "banner-image-upload",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeBanner = () => setBannerUrl("");

  const updateTemplateMutation = useMutation({
    mutationFn: async (values: Omit<BookingTemplateData, "bannerImageUrl">) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.patch<TemplateDataResponse>(
          "sp/templates",
          {
            template_type: values.templateType,
            desc: values.description,
            banner_header: values.bannerHeader,
            banner_message: values.bannerMessage,
            about_subheader: values.aboutSubHeader,
            banner_image_url: bannerUrl,
          },
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Saving template updates...", {
        id: "template-save",
      });
    },
    onSuccess: (response) => {
      toast.success("Template data updated successfully", {
        id: "template-save",
      });
      updateSettings("template", response.data);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update template", {
        id: "template-save",
      });
    },
  });

  async function onSubmit(values: Omit<BookingTemplateData, "bannerImageUrl">) {
    if (!bannerUrl) {
      toast.error("Please upload a banner image");
      return
    }
    try {
      await updateTemplateMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="mt-2 text-gray-600">
            Choose from our professionally designed templates to create your
            perfect business page.
          </p>
        </div>

        {/* Templates Grid */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[#121212]">
                Booking Template
              </h2>
              <p className="text-sm text-[#6E6E73]">
                Choose how your clients will book appointments with you
              </p>
            </div>

            <FormField
              control={form.control}
              name="templateType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Booking Template</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                      {[
                        {
                          value: "default",
                          title: "Simple Booking",
                          description:
                            "Basic appointment booking with minimal client information",
                        },
                      ].map((template) => (
                        <div
                          key={template.value}
                          className={`relative rounded-lg border p-4 ${
                            field.value === template.value
                              ? "border-[#7B68EE] bg-[#7B68EE]/5"
                              : "border-[#E0E0E5] hover:border-[#E0E0E5]/80"
                          }`}
                        >
                          {field.value === template.value && (
                            <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#7B68EE]">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <FormItem className="flex items-start space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={template.value} />
                            </FormControl>
                            <div className="space-y-1">
                              <FormLabel className="font-medium">
                                {template.title}
                              </FormLabel>
                              <FormDescription className="text-xs">
                                {template.description}
                              </FormDescription>
                            </div>
                          </FormItem>
                          <div className="mt-3 flex space-x-2">
                            {/* <button
              type="button"
              onClick={() => window.open('/template-preview', '_blank')}
              className="text-xs px-3 py-1 rounded bg-[#7B68EE] text-white hover:bg-[#7B68EE]/90"
            >
              Preview
            </button> */}
                            <button
                              type="button"
                              onClick={() =>
                                window.open("/default/sample", "_blank")
                              }
                              className="text-xs px-3 py-1 rounded border border-[#7B68EE] text-[#7B68EE] hover:bg-[#7B68EE]/5"
                            >
                              View Sample
                            </button>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <div className="mt-2">
                {bannerUrl ? (
                  <div className="relative h-80 w-full">
                    <Image
                      src={bannerUrl || "/placeholder.svg"}
                      alt="Business Logo"
                      fill
                      className="rounded-md object-contain"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute -right-2 -top-2 h-7 w-7 rounded-full border-gray-200 bg-white"
                      onClick={removeBanner}
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
                          htmlFor="banner-image-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-[#7B68EE]"
                        >
                          <span>Upload a file</span>
                          <input
                            id="banner-image-upload"
                            name="banner-image-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleBannerImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-[#6E6E73]">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <FormDescription>
                Your logo will appear on your booking page and receipts
              </FormDescription>
            </FormItem>
            <FormField
              control={form.control}
              name="bannerHeader"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Header</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g Discover beauty at BeautySpot"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a short, bold sentence or phrase that captures what
                    your business offers. Think of it as a quick hook to draw
                    attention.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g Elevate your look with our premium salon and spa services..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your services and what clients can expect in one
                    short sentence. This should support your banner header and
                    encourage bookings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aboutSubHeader"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About subheader</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g Your Beauty, Our Passion"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a short tagline that reflects your business’s values
                    or what you’re passionate about.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g Since 2010, BeautySpot has been helping clients look and feel their best with expert services and premium products."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a short, friendly introduction to your business. This
                    will appear in the “About” section of your booking page.
                    Mention what you do, who you serve, and what makes your
                    service special.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={updateTemplateMutation.isPending || settingsLoading}
              >
                {updateTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
