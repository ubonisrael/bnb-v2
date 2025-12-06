"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import api from "@/services/api-service";
import { storage } from "@/services/firebase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { countries } from "../onboarding/steps/business-info";
import { Checkbox } from "../ui/checkbox";
import { UnsavedChangesBanner } from "../UnSavedChangesBanner";
import { Skeleton } from "../ui/skeleton";

const profileSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Please enter a valid address"),
  display_address: z.boolean(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postal_code: z.string().min(4, "Postal code must be at least 4 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  logo: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface BusinessProfile {
  logo: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  display_address: boolean;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    profile: BusinessProfile;
  };
}

export function ProfileSettings() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Fetch business profile
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["business-profile"],
    queryFn: async () => {
      const response = await api.get<ProfileResponse>("sp/profile");
      return response.data.profile;
    },
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: profileData
      ? {
          address: profileData.address,
          display_address: profileData.display_address,
          city: profileData.city,
          state: profileData.state,
          postal_code: profileData.postal_code,
          country: profileData.country,
          name: profileData.name,
          phone: profileData.phone,
          logo: profileData.logo || "",
        }
      : {
          address: "",
          display_address: false,
          city: "",
          state: "",
          postal_code: "",
          country: "",
          name: "",
          phone: "",
          logo: "",
        },
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  const logoUrl = form.watch("logo") || null;

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

  // Handle logo upload
  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const storageRef = ref(
        storage,
        `bnb/${profileData?.email}/logo/${Date.now()}`
      );
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
          }
        },
        (error) => {
          toast.error(error.message);
          setIsUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            form.setValue("logo", downloadURL, { shouldDirty: true });
            toast.success("Logo uploaded successfully");
          });
          setIsUploading(false);
        }
      );
    } catch (error: unknown) {
      console.error("Failed to upload logo:", error);
      toast.error("Failed to upload logo");
      setIsUploading(false);
    }
  };

  const removeLogo = () => {
    form.setValue("logo", "", { shouldDirty: true });
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const response = await api.patch<ProfileResponse>("sp/profile", values);
      return response.data;
    },
    onMutate: () => {
      toast.loading("Saving profile...", { id: "profile-save" });
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully", { id: "profile-save" });
      queryClient.invalidateQueries({ queryKey: ["business-profile"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update profile",
        {
          id: "profile-save",
        }
      );
    },
  });

  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateProfileMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }

  const { isDirty } = form.formState;

  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-40 w-40 rounded-full mx-auto" />
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      {isDirty && <UnsavedChangesBanner form={form} />}
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
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={profileData?.email || ""} disabled />
                <FormDescription>Email cannot be changed</FormDescription>
              </FormItem>

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

            <FormField
              control={form.control}
              name="display_address"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Display address on booking page</FormLabel>
                    <FormDescription>
                      Allow customers to see your business address on your
                      booking page
                    </FormDescription>
                  </div>
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
                    key={field.value || 'empty'}
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

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                updateProfileMutation.isPending || isUploading || !isDirty
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
    </>
  );
}
