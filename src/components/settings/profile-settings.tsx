"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
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
import { useUserSettings } from "@/contexts/UserSettingsContext";
import api from "@/services/api-service";
import { storage } from "@/services/firebase";
import { BusinessProfileResponse } from "@/types/response";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countries } from "../onboarding/steps/business-info";

const profileSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postal_code: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  logo: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const {
    settings,
    updateSettings,
    isLoading: settingsLoading,
  } = useUserSettings();

  const [isUploading, setIsUploading] = useState(false);

  const [logoUrl, setLogoUrl] = useState<string | null>(
    settings?.profile.logo || null
  );

  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.profile.logo)
    }
  }, [settings])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      address: settings?.profile.address,
      city: settings?.profile.city,
      state: settings?.profile.state,
      postal_code: settings?.profile.postal_code,
      country: settings?.profile.country,
      name: settings?.profile.name,
      email: settings?.profile.email,
      phone: settings?.profile.phone,
      logo: settings?.profile.logo || "",
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

  useEffect(() => {
    if (settings) {
      form.reset({
        address: settings.profile.address,
        city: settings.profile.city,
        state: settings.profile.state,
        postal_code: settings.profile.postal_code,
        country: settings.profile.country,
        name: settings.profile.name,
        email: settings.profile.email,
        phone: settings.profile.phone,
        logo: settings.profile.logo || "",
      });
    }
  }, [form, settings?.profile]);

  // Handle logo upload
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      // toast.loading('Uploading logo...', { id: 'logo-upload' });
      const storageRef = ref(storage, `bnb/${settings?.profile?.email}/logo`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.loading(`Uploading logo... ${Math.round(progress)}%`, {
            id: "logo-upload-percentage",
          });
          if (progress === 100) {
            toast.dismiss("logo-upload-percentage");
            toast.success("Logo uploaded successfully", { id: "logo-upload" });
          }
        },
        (error) => toast.error(error.message),
        () =>
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLogoUrl(downloadURL);
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
    setLogoUrl(null);
    form.setValue("logo", "");
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.patch<BusinessProfileResponse>(
          "sp/info",
          {
            ...values,
            logo: logoUrl || "",
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
      toast.loading("Saving profile...", { id: "profile-save" });
    },
    onSuccess: (response) => {
      toast.success("Profile updated successfully", { id: "profile-save" });
      updateSettings("profile", response.data);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update profile", {
        id: "profile-save",
      });
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateProfileMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div>
          <h3 className="text-lg font-medium">Business Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your business information and profile
          </p>
        </div>

        <div className="space-y-4">
          <FormItem>
            <FormLabel>Business Logo</FormLabel>
            <div className="mt-2">
              {logoUrl ? (
                <div className="relative h-40 w-40 mx-auto">
                  <Image
                    src={logoUrl}
                    alt="Business Logo"
                    fill
                    className="rounded-full"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute -right-2 -top-2 h-7 w-7 rounded-full border-gray-200 bg-white"
                    onClick={removeLogo}
                    disabled={isUploading}
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
                          disabled={isUploading}
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
              disabled
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
              name="postal_code"
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
                <Select
                  name="country"
                  onValueChange={field.onChange}
                  value={field.value}
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

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={
              updateProfileMutation.isPending || settingsLoading || isUploading
            }
          >
            {updateProfileMutation.isPending ? (
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
  );
}
