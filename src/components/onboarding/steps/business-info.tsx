"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, Ref, useImperativeHandle, useState, useRef } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OnboardingFormData } from "../type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ref as fRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/services/firebase";
import useLocalStorage from "use-local-storage";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const countries = [{ value: "United Kingdom", label: "United Kingdom" }];

const businessInfoSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z
    .string()
    .min(2, { message: "State/province must be at least 2 characters" }),
  postalCode: z
    .string()
    .min(4, { message: "Postal code must be at least 4 characters" }),
  country: z.string().min(1, { message: "Please select a country" }),
});

type BusinessInfoData = z.infer<typeof businessInfoSchema>;

interface BusinessInfoStepProps {
  data: OnboardingFormData;
  onUpdate: (data: BusinessInfoData & { logoUrl: string }) => void;
  ref: Ref<{ validate: () => Promise<boolean> }>;
}

export function BusinessInfoStep({
  data,
  onUpdate,
  ref,
}: BusinessInfoStepProps) {
  const [previewLogo, setPreviewLogo] = useLocalStorage<string>(
    "previewLogo",
    data.businessInfo.logoUrl || ""
  );
  const form = useForm<BusinessInfoData>({
    mode: "all",
    resolver: zodResolver(businessInfoSchema),
    defaultValues: data.businessInfo,
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
      const isValid = await form.trigger(); // runs validation
      if (!isValid) {
        onError(form.formState.errors);
      }
      if (isValid) {
        onUpdate({
          ...form.getValues(),
          logoUrl: previewLogo ? previewLogo : "",
        });
      }
      return isValid;
    },
  }));
  // Handle logo upload
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      // toast.loading('Uploading logo...', { id: 'logo-upload' });
      const storageRef = fRef(storage, `bnb/${Date.now()}/logo`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            toast.loading(
              `Uploading logo... ${Math.round(progress)}%`,
              { id: "logo-upload-percentage" }
            );
            if (progress === 100) {
              toast.dismiss("logo-upload-percentage");
              toast.success("Logo uploaded successfully", { id: "logo-upload" });
            }
        },
        (error) => toast.error(error.message),
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setPreviewLogo(downloadURL);
          })
      );
    } catch (error: unknown) {
      console.error("Failed to upload logo:", error);
      toast.error("Failed to upload logo", { id: "logo-upload" });
    }
  };

  const removeLogo = () => {
    setPreviewLogo("");
    const currentValues = form.getValues();
    onUpdate({
      ...currentValues,
      logoUrl: "",
    });
  };

  return (
    <Form {...form}>
      <form ref={formRef} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">
            Business Information
          </h2>
          <p className="text-sm text-[#6E6E73]">Tell us about your business</p>
        </div>
        <FormItem>
          <FormLabel>Business Logo</FormLabel>
          <div className="mt-2">
            {previewLogo ? (
              <div className="relative h-40 w-40 mx-auto">
                <Image
                  src={previewLogo || "/placeholder.svg"}
                  width={160}
                  height={160}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM8++JFPQAIRQMetjSWgwAAAABJRU5ErkJggg=="
                  alt="Business Logo"
                  className="rounded-full h-40 w-40 shadow-xl"
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
                  <p className="text-xs text-[#6E6E73]">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
          <FormDescription className="text-center">
            Your logo will appear on your booking page and receipts
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business name" {...field} />
              </FormControl>
              <FormDescription>
                This is how your business will appear to clients
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Phone</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormDescription>
                A phone number where clients can reach you
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">
            Business Location
          </h2>
          <p className="text-sm text-[#6E6E73]">
            Where is your business located?
          </p>
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
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
                  <Input placeholder="State/Province" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Postal Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select
                  name="country"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormDescription className="pt-2">
          This information will be displayed on your booking page and helps
          clients find your business
        </FormDescription>
      </form>
    </Form>
  );
}
