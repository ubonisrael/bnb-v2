"use client";

import { useRef, useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Upload, X, Clock, Calendar, MapPin } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { UnsavedChangesBanner } from "../UnSavedChangesBanner";
import {
  formatDate,
  formatTime,
  getRoleBadgeVariant,
  getStatusBadgeVariant,
} from "@/lib/helpers";
import { removeNullish } from "@/utils/flatten";

const userProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof userProfileSchema>;

export function UserProfileSettings() {
  const [isUploading, setIsUploading] = useState(false);

  const query = useQueryClient();

  // Fetch staff member details
  const { data: staffDetails, isLoading: isLoadingStaffDetails } = useQuery({
    queryKey: ["staff-member-details"],
    queryFn: async () => {
      const response = await api.get<StaffMemberDetailsResponse>(
        "members/my-details"
      );
      return response.data;
    },
    staleTime: 60 * 60 * 1000,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    values: staffDetails?.member?.user
      ? {
          full_name: staffDetails.member.user.full_name,
          email: staffDetails.member.user.email,
          phone: staffDetails.member.user.phone ?? "",
          avatar: staffDetails.member.user.avatar ?? "",
        }
      : {
          full_name: "",
          email: "",
          phone: "",
          avatar: "",
        },
  });

  const formRef = useRef<HTMLFormElement | null>(null);
  // Update form when data is loaded

  const avatar = form.watch("avatar");

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

  // Handle avatar upload
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const storageRef = ref(
        storage,
        `bnb/${staffDetails?.member?.user?.email}/avatar/${Date.now()}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          toast.loading(`Uploading avatar... ${Math.round(progress)}%`, {
            id: "avatar-upload-percentage",
          });
          if (progress === 100) {
            toast.dismiss("avatar-upload-percentage");
          }
        },
        (error) => {
          toast.error(error.message);
          setIsUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            form.setValue("avatar", downloadURL);
            toast.success("Avatar uploaded successfully");
          });
          setIsUploading(false);
        }
      );
    } catch (error: unknown) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar");
      setIsUploading(false);
    }
  };

  const removeAvatar = () => {
    form.setValue("avatar", "", { shouldDirty: true });
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.patch(
          "user/profile",
          removeNullish(values),
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
      query.invalidateQueries({ queryKey: ["staff-member-details"] });
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

  const { isDirty } = form.formState;

  if (isLoadingStaffDetails) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const member = staffDetails?.member;
  const workingHours = staffDetails?.workingHours || [];
  const upcomingTimeOffs = staffDetails?.upcomingTimeOffs || [];
  const upcomingOverrideHours = staffDetails?.upcomingOverrideHours || [];

  return (
    <>
      {isDirty && <UnsavedChangesBanner form={form} />}

      {/* Member Info Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Staff Member Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 relative">
              {member?.user?.avatar ? (
                <Image
                  src={member.user.avatar}
                  alt={member.user.full_name || "Avatar"}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold">
                  {member?.user?.full_name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(member?.role || "staff")}>
                  {member?.role?.toUpperCase()}
                </Badge>
                {member?.status && (
                  <Badge variant={getStatusBadgeVariant(member.status)}>
                    {member.status.toUpperCase()}
                  </Badge>
                )}
                {member?.user?.is_email_verified && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Joined:{" "}
                {member?.dateJoined ? formatDate(member.dateJoined) : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours Card */}
      {workingHours.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Working Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workingHours.map((schedule) => (
                <div
                  key={schedule.day}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="font-medium capitalize">{schedule.day}</span>
                  {schedule.enabled ? (
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {formatTime(schedule.opening_time)} -{" "}
                        {formatTime(schedule.closing_time)}
                      </span>
                      {schedule.breaks.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Breaks:{" "}
                          {schedule.breaks
                            .map(
                              (b) =>
                                `${formatTime(b.start)}-${formatTime(b.end)}`
                            )
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Badge variant="outline">Closed</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Time Offs */}
      {upcomingTimeOffs.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Time Off
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTimeOffs.map((timeOff) => (
                <div
                  key={timeOff.id}
                  className="flex items-start justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {formatDate(timeOff.start_date)} -{" "}
                      {formatDate(timeOff.end_date)}
                    </p>
                    {timeOff.reason && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {timeOff.reason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Override Hours */}
      {upcomingOverrideHours.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Schedule Overrides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingOverrideHours.map((override) => (
                <div
                  key={override.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <span className="font-medium">{override.date}</span>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(override.opening_time)} -{" "}
                    {formatTime(override.closing_time)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-6" />

      {/* Profile Edit Form */}
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-6"
        >
          <div>
            <h3 className="text-lg font-medium">Edit Profile</h3>
            <p className="text-sm text-muted-foreground">
              Update your personal information
            </p>
          </div>

          <div className="space-y-4">
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <div className="mt-2">
                {avatar ? (
                  <div className="relative h-32 w-32 mx-auto">
                    <Image
                      src={avatar}
                      alt="Profile Picture"
                      fill
                      className="rounded-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute -right-2 -top-2 h-7 w-7 rounded-full border-gray-200 bg-white"
                      onClick={removeAvatar}
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
                          htmlFor="avatar-upload"
                          className="relative cursor-pointer rounded-md font-semibold text-[#7B68EE]"
                        >
                          <span>Upload a file</span>
                          <input
                            id="avatar-upload"
                            name="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleAvatarUpload}
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
                Your profile picture will be visible to other team members
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    Email cannot be changed. Contact your administrator if you
                    need to update it.
                  </FormDescription>
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
