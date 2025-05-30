"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check, Upload, X } from "lucide-react";
import {
  ref as fRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

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
import { Textarea } from "@/components/ui/textarea";
import { Ref, useImperativeHandle, useRef, useState } from "react";
import { storage } from "@/services/firebase";
import toast from "react-hot-toast";
import Image from "next/image";
import { Button } from "@/components/templates/default/ui/button";
import { BookingTemplateData } from "../type";
import { da } from "date-fns/locale";

export const bookingTemplateSchema = z.object({
  templateType: z
    .string()
    .min(1, { message: "Please select a booking template" }),
  aboutUs: z
    .string()
    .min(24, { message: "About Us must be at least 24 characters" })
    .max(500, { message: "Banner header must be at most 500 characters" }),
  additionalPolicies: z
    .string()
    .max(1024, {
      message: "Additional Policies must be at most 1024 characters",
    })
    .optional(),
});

interface BookingTemplateStepProps {
  data: BookingTemplateData;
  onUpdate: (data: BookingTemplateData) => void;
  ref: Ref<{ validate: () => Promise<boolean> }>;
}

export function BookingTemplateStep({
  data,
  onUpdate,
  ref,
}: BookingTemplateStepProps) {
  const [images, setImages] = useState<
    {
      id: string;
      src: string;
      alt: string;
    }[]
  >([...data.images]);
  const form = useForm<Omit<BookingTemplateData, "images">>({
    resolver: zodResolver(bookingTemplateSchema),
    defaultValues: {
      templateType: data.templateType || "",
      aboutUs: data.aboutUs || "",
      additionalPolicies: data.additionalPolicies || "",
    },
  });
  const formRef = useRef<HTMLFormElement | null>(null);

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

  useImperativeHandle(ref, () => ({
    async validate() {
      const imagePresent = !!images.length;
      if (!imagePresent) {
        toast.error("Please upload at least one image");
        return false;
      }
      const isValid = await form.trigger(); // runs validation
      if (!isValid) {
        onError(form.formState.errors);
      }
      if (isValid) {
        onUpdate({
          ...form.getValues(),
          images: [...images],
        });
      }
      return isValid && imagePresent;
    },
  }));

  const handleBannerImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || (data.images && data.images.length >= 4)) return;
    try {
      // toast.loading('Uploading logo...', { id: 'logo-upload' });
      const storageRef = fRef(storage, `bnb/${Date.now()}/banner-image`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.loading(`Uploading logo... ${Math.round(progress)}%`, {
            id: "image-upload",
          });
          if (progress === 100) {
            toast.dismiss("image-upload");
            toast.success("Logo uploaded successfully", { id: "image-upload" });
          }
        },
        (error) => toast.error(error.message),
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const id = Date.now();
            setImages((prev) => [
              ...prev,
              { id: `${id}`, src: downloadURL, alt: `image-${id}` },
            ]);
          })
      );

      toast.success("Banner image uploaded successfully", {
        id: "image-upload",
      });
    } catch (error: unknown) {
      console.error("Failed to upload image:", error);
      toast.error("Failed to upload image", {
        id: "image-upload",
      });
    }
  };

  const removeBanner = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    const currentValues = form.getValues();
    onUpdate({
      ...currentValues,
      images: [...data.images.filter((img) => img.id !== id)],
    });
  };

  return (
    <Form {...form}>
      <form ref={formRef} className="space-y-6">
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
                  name="templateType"
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
          <FormLabel>Upload banner images (min: 1, max: 4)</FormLabel>
          <div className="mt-2">
            {images.length < 4 && (
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
            {images.map((img) => (
              <div key={img.id} className="relative h-80 w-full mt-2">
                <Image
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  fill
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8++JFPQAIRQMetjSWgwAAAABJRU5ErkJggg=="
                  className="rounded-md object-contain"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="absolute -right-2 -top-2 h-7 w-7 rounded-full border-gray-200 bg-white"
                  onClick={() => removeBanner(img.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <FormDescription className="text-center">
            Your images will appear on the hero section of your booking page
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
                Write a friendly introduction to your business. This will appear
                in the “About” section of your booking page. Mention what you
                do, who you serve, and what makes your service special.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="additionalPolicies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Policies (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                General policies for deposits, cancellations, rescheduling and
                no shows will be generated based on your settings in the booking
                settings section. Specify any additional rules, or special
                requirements that clients should know before booking. This helps
                set clear expectations and ensures smooth service delivery.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
