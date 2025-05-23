"use client";

import type React from "react";

import { Ref, useImperativeHandle, useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ref as fRef,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { Upload, X } from "lucide-react";
import { storage } from "@/services/firebase";
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
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const visualSettingsSchema = z.object({
  logoUrl: z.string().optional(),
  primaryColor: z.string().min(4, { message: "Please select a primary color" }),
  accentColor: z.string().optional(),
});

type VisualSettingsData = z.infer<typeof visualSettingsSchema>;

interface VisualSettingsStepProps {
  data: VisualSettingsData;
  onUpdate: (data: VisualSettingsData) => void;
  ref: Ref<{ validate: () => Promise<boolean> }>;
}

export function VisualSettingsStep({
  data,
  onUpdate,
  ref,
}: VisualSettingsStepProps) {
  const [previewLogo, setPreviewLogo] = useState<string | null>(
    data.logoUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<VisualSettingsData>({
    resolver: zodResolver(visualSettingsSchema),
    defaultValues: data,
  });

  useImperativeHandle(ref, () => ({
    async validate() {
      const isValid = await form.trigger(); // runs validation
      if (isValid) {
        onUpdate({
          ...form.getValues(),
          logoUrl: previewLogo ? previewLogo : ""
        });
      }
      return isValid;
    },
  }));

  // Handle logo upload
  // Handle logo upload
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      // toast.loading('Uploading logo...', { id: 'logo-upload' });
      const storageRef = fRef(storage, `bnb/${Date.now()}/logo`);
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
            setPreviewLogo(downloadURL);
          })
      );

      toast.success("Logo uploaded successfully", { id: "logo-upload" });
    } catch (error: unknown) {
      console.error("Failed to upload logo:", error);
      toast.error("Failed to upload logo", { id: "logo-upload" });
    } finally {
      setIsUploading(false);
    }
  };

  const removeLogo = () => {
    setPreviewLogo(null);
    const currentValues = form.getValues();
    onUpdate({
      ...currentValues,
      logoUrl: "",
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">
            Visual Settings
          </h2>
          <p className="text-sm text-[#6E6E73]">
            Customize the look and feel of your business
          </p>
        </div>

        <FormItem>
          <FormLabel>Business Logo</FormLabel>
          <div className="mt-2">
            {previewLogo ? (
              <div className="relative h-40 w-40">
                <img
                  src={previewLogo || "/placeholder.svg"}
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
          <FormDescription>
            Your logo will appear on your booking page and receipts
          </FormDescription>
        </FormItem>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <div className="flex space-x-2">
                  <div
                    className="h-10 w-10 rounded-md border"
                    style={{ backgroundColor: field.value }}
                  />
                  <FormControl>
                    <Input {...field} type="color" />
                  </FormControl>
                </div>
                <FormDescription>
                  Used for buttons, highlights, and active elements
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accentColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accent Color (Optional)</FormLabel>
                <div className="flex space-x-2">
                  <div
                    className="h-10 w-10 rounded-md border"
                    style={{ backgroundColor: field.value || "#FFFFFF" }}
                  />
                  <FormControl>
                    <Input
                      {...field}
                      type="color"
                      value={field.value || "#FFFFFF"}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </div>
                <FormDescription>
                  Used as a secondary color for variety
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="h-48 rounded-md border border-[#E0E0E5] bg-white p-4">
          <div className="mb-4 text-sm font-medium">Preview</div>
          <div
            className="flex h-10 items-center justify-center rounded-md text-white"
            style={{ backgroundColor: form.watch("primaryColor") || "#7B68EE" }}
          >
            <span>Button in Primary Color</span>
          </div>
        </div>
      </form>
    </Form>
  );
}
