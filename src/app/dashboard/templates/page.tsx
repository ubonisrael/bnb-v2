"use client";

import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { bookingTemplateSchema } from "@/components/onboarding/steps/booking-template";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  ref as fRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/services/firebase";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api-service";
import { TemplateDataResponse } from "@/types/response";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplatesPage() {
  const queryClient = useQueryClient();
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch template data
  const { data: templateData, isLoading: isLoadingTemplate } = useQuery({
    queryKey: ["template"],
    queryFn: async () => {
      const response = await api.get<TemplateDataResponse>("sp/templates");
      return response.data.template;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const form = useForm<Omit<BookingTemplateData, "images">>({
    resolver: zodResolver(bookingTemplateSchema),
    defaultValues: {
      templateType: "",
      aboutUs: "",
    },
  });

  // Update form when template data is loaded
  useEffect(() => {
    if (templateData) {
      form.reset({
        templateType: "default", // Based on the schema, this seems to be the template type
        aboutUs: templateData.about_us || "",
      });
      setImages(templateData.image_urls || []);
    }
  }, [templateData, form]);

  const formRef = useRef<HTMLFormElement | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onError = (errors: any) => {
    if (!formRef.current) return;
    const firstErrorField = Object.keys(errors)[0];
    const errorElement = formRef.current.querySelector(
      `[name="${firstErrorField}"]`
    );
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      (errorElement as HTMLElement).focus();
    }
  };

  useEffect(() => {
    const onSelect = () => {
      setSelectedIndex(emblaApi?.selectedScrollSnap() || 0);
    };

    emblaApi?.on("select", onSelect);
    return () => {
      emblaApi?.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleBannerImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || (images && images.length >= 10)) return;
    setIsUploading(true);
    try {
      const storageRef = fRef(storage, `bnb/${Date.now()}/banner-image`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.loading(`Uploading banner image... ${Math.round(progress)}%`, {
            id: "banner-image-upload",
          });
          if (progress === 100) {
            toast.dismiss("banner-image-upload");
            toast.success("Banner image uploaded successfully", {
              id: "banner-image-upload",
            });
          }
        },
        (error) => toast.error(error.message),
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImages((prev: string[]) => [...prev, downloadURL]);
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

  const removeBanner = (id: string) => {
    setImages((prev: string[]) => prev.filter((img: string) => img !== id));
  };

  const updateTemplateMutation = useMutation({
    mutationFn: async (values: Omit<BookingTemplateData, "images">) => {
      const response = await api.patch<TemplateDataResponse>(
        "sp/templates",
        {
          about_us: values.aboutUs,
          image_urls: [...images],
        }
      );
      return response.data.template;
    },
    onMutate: () => {
      toast.loading("Saving template updates...", {
        id: "template-save",
      });
    },
    onSuccess: () => {
      toast.success("Template data updated successfully", {
        id: "template-save",
      });
      // Invalidate and refetch template data
      queryClient.invalidateQueries({ queryKey: ["template"] });
      form.reset({
        templateType: form.getValues("templateType"),
        aboutUs: form.getValues("aboutUs"),
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update template";
      toast.error(errorMessage, {
        id: "template-save",
      });
    },
  });

  async function onSubmit(values: Omit<BookingTemplateData, "images">) {
    if (images.length < 1) {
      toast.error("Please upload a banner image");
      return;
    }
    try {
      await updateTemplateMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
    }
  }

  const CarouselButton = ({
    direction,
    onClick,
  }: {
    direction: "left" | "right";
    onClick: () => void;
  }) => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-gray-200 bg-white/80 z-10"
      style={{ [direction]: "1rem" }}
      onClick={onClick}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );

  const DotButton = ({
    selected,
    onClick,
  }: {
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      className={`relative h-2 w-2 rounded-full mx-1 ${
        selected ? "bg-[#7B68EE]" : "bg-[#E0E0E5]"
      }`}
      type="button"
      onClick={onClick}
    />
  );

  // Show loading skeleton while fetching data
  if (isLoadingTemplate) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-32 ml-auto" />
          </div>
        </div>
      </div>
    );
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
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="space-y-6"
          >
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
                            <button
                              type="button"
                              onClick={() => window.open("/sample", "_blank")}
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
              <FormLabel>
                Upload banner images [{images.length}/10] (min: 1, max: 10)
              </FormLabel>
              <div className="mt-2">
                {images.length < 10 && (
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
                {images.length > 0 && (
                  <div className="relative h-80 w-full mt-2">
                    <div className="h-full w-full">
                      <div className="overflow-hidden h-full" ref={emblaRef}>
                        <div className="flex h-full">
                          {images.map((img: string, i: number) => (
                            <div
                              key={img}
                              className="relative flex-[0_0_100%] min-w-0"
                            >
                              <Image
                                src={img || "/placeholder.svg"}
                                alt={`Banner Image ${i}`}
                                fill
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8++JFPQAIRQMetjSWgwAAAABJRU5ErkJggg=="
                                className="rounded-md object-contain"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute right-2 top-2 h-7 w-7 rounded-full border-gray-200 bg-white"
                                onClick={() => removeBanner(img)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                      {images.length > 1 && (
                        <>
                          <CarouselButton
                            direction="left"
                            onClick={() => emblaApi?.scrollPrev()}
                          />
                          <CarouselButton
                            direction="right"
                            onClick={() => emblaApi?.scrollNext()}
                          />
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            {images.map((_: string, index: number) => (
                              <DotButton
                                key={index}
                                selected={index === selectedIndex}
                                onClick={() => emblaApi?.scrollTo(index)}
                              />
                            ))}
                          </div>
                        </>
                      )}
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
              name="aboutUs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About Us</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g Discover beauty at BeautySpot"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a friendly introduction to your business. This will
                    appear in the “About” section of your booking page. Mention
                    what you do, who you serve, and what makes your service
                    special.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  updateTemplateMutation.isPending ||
                  !form.formState.isDirty ||
                  isUploading
                }
              >
                {updateTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Template"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
