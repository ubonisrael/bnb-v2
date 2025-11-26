"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { Label } from "@/components/ui/label";
import api from "@/services/api-service";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

const deleteAccountSchema = z
  .object({
    password: z.string().min(1, "Password is required to delete account"),
    confirmText: z.string().min(1, "Please type DELETE to confirm"),
  })
  .refine((data) => data.confirmText === "DELETE", {
    message: "Please type DELETE to confirm",
    path: ["confirmText"],
  });

export function SecuritySettings() {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const deleteAccountForm = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmText: "",
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (values: z.infer<typeof passwordSchema>) => {
      const response = await api.post("auth/change-password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      return response;
    },
    onMutate: () => {
      toast.loading("Changing password...", { id: "change-password" });
    },
    onSuccess: () => {
      toast.success("Password changed successfully", { id: "change-password" });
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to change password",
        { id: "change-password" }
      );
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await api.delete("auth/account", {
        data: { password },
      });
      return response;
    },
    onMutate: () => {
      toast.loading("Deleting account...", { id: "delete-account" });
    },
    onSuccess: () => {
      toast.success("Account deleted successfully", { id: "delete-account" });
      // Clear session and redirect to home page
      setTimeout(() => {
        router.push("/");
      }, 1000);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete account",
        { id: "delete-account" }
      );
    },
  });

  const onChangePassword = async (values: z.infer<typeof passwordSchema>) => {
    try {
      await changePasswordMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to change password:", error);
    }
  };

  const onDeleteAccount = async (
    values: z.infer<typeof deleteAccountSchema>
  ) => {
    try {
      await deleteAccountMutation.mutateAsync(values.password);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">
          Update your password to keep your account secure
        </p>
      </div>

      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          className="space-y-4"
        >
          <FormField
            control={passwordForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </Form>

      <Separator />
      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all of your data
        </p>

        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDescription>
        </Alert>

        <Button
          variant="destructive"
          className="mt-4"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete Account
        </Button>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="destructive">
              <AlertTitle>⚠️ Warning</AlertTitle>
              <AlertDescription>
                All your data will be permanently deleted. If you are a service
                provider owner, you must transfer ownership or delete your
                business first.
              </AlertDescription>
            </Alert>

            <Form {...deleteAccountForm}>
              <form
                onSubmit={deleteAccountForm.handleSubmit(onDeleteAccount)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={deleteAccountForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter your password to confirm</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deleteAccountForm.control}
                  name="confirmText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type &quot;DELETE&quot; to confirm</FormLabel>
                      <FormControl>
                        <Input placeholder="DELETE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDeleteDialogOpen(false);
                      deleteAccountForm.reset();
                    }}
                    disabled={deleteAccountMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={deleteAccountMutation.isPending}
                  >
                    {deleteAccountMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Confirm Delete"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
