"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useUserSettings } from "@/contexts/UserSettingsContext"
import { Label } from "@/components/ui/label"
import api from "@/services/api-service"

const passwordSchema = z
  .object({
    old_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Password must be at least 8 characters"),
    verificationCode: z.string().optional(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export function SecuritySettings() {
  const router = useRouter()
  const { settings, updateSettings, isLoading: settingsLoading } = useUserSettings()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  //const [is2FADialogOpen, setIs2FADialogOpen] = useState(false)
 // const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
      verificationCode: "",
    },
  })


  /* async function handleToggle2FA(enabled: boolean) {
    if (enabled) {
      setIs2FADialogOpen(true)
    } else {
      try {
        await updateSettings("security", { twoFactorEnabled: false })
        toast.success("Two-factor authentication has been disabled for your account.")
      } catch (error) {
        console.error("Failed to disable 2FA:", error)
        toast.error("Failed to disable two-factor authentication. Please try again.")
      }
    }
  } 

  async function handleVerify2FA() {
    setIsVerifying(true)

    try {
      // This would verify the code with a server action in a real app
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (verificationCode === "123456") {
        await updateSettings("security", { twoFactorEnabled: true })
        setIs2FADialogOpen(false)
        toast.success("Two-factor authentication has been enabled for your account.")
      } else {
        toast.error("The verification code you entered is invalid. Please try again.")
      }
    } catch (error) {
      console.error("Failed to verify 2FA code:", error)
      toast.error("Failed to verify two-factor authentication. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }*/
const updatePasswordMutation = useMutation({
mutationFn: async (values: z.infer<typeof passwordSchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        await api.post('user/password/change', {
			...values },
			{ signal });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          toast('Request was cancelled', { icon: '❌' });
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading('Updating password...', { id: 'update-passwd' });
    },
    onSuccess: () => {
      toast.success('Password successfully changed', { id: 'update-passwd' });
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update password', { id: 'update-passwd' });
    },
  });


  const deleteBusinessMutation = useMutation({
    mutationFn: async () => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        await api.delete('sp', { signal });
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          toast('Request was cancelled', { icon: '❌' });
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading('Deleting business...', { id: 'delete-business' });
    },
    onSuccess: () => {
      toast.success('Business deleted successfully', { id: 'delete-business' });
      router.push('/auth/login');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to delete business', { id: 'delete-business' });
    },
  });

  const handleDeleteBusiness = async () => {
    try {
      await deleteBusinessMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to delete business:", error);
    }
  };
const onChangePassword = async (values: z.infer<typeof passwordSchema>) => {
	setIsChangingPassword(true);
    try {
      await updatePasswordMutation.mutateAsync(values);
    } catch (error) {
      console.error("Failed to update password:", error);
    }
	setIsChangingPassword(false);
  };


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Password</h3>
        <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
      </div>

      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
          <FormField
            control={passwordForm.control}
            name="old_password"
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
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>Password must be at least 8 characters long</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={passwordForm.control}
            name="confirm_password"
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

          <Button type="submit" disabled={isChangingPassword || settingsLoading}>
            {isChangingPassword ? (
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

      {/* <div>
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>

        <div className="mt-4 flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">
                Protect your account with an additional verification step
              </div>
            </div>
          </div>
          <Switch
            checked={settings.security.twoFactorEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={settingsLoading}
          />
        </div>

        <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Scan the QR code with your authenticator app or enter the setup key manually.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="h-48 w-48 bg-[#F5F5F7] flex items-center justify-center">
                <KeyRound className="h-12 w-12 text-[#7B68EE]" />
              </div>

              <div className="text-center">
                <p className="text-sm font-medium">Setup Key</p>
                <p className="font-mono text-xs">ABCD EFGH IJKL MNOP</p>
              </div>

              <div className="w-full space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIs2FADialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleVerify2FA} disabled={isVerifying || verificationCode.length !== 6}>
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Enable"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Login Sessions</h3>
        <p className="text-sm text-muted-foreground">Manage your active login sessions</p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Current Session</div>
                  <div className="text-xs text-muted-foreground">
                    Chrome on Windows • IP: 192.168.1.1 • Last active: Just now
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium text-[#4CD964]">Active</div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="mt-4">
          Sign Out of All Sessions
        </Button>
      </div>

      <Separator /> */}

      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="text-sm text-muted-foreground">Permanently delete your account and all of your data</p>

        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </AlertDescription>
        </Alert>

        <Button
          variant="destructive"
          className="mt-4"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={deleteBusinessMutation.isPending}
        >
          {deleteBusinessMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete Account"
          )}
        </Button>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Business</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete your business? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This will permanently delete your business account and all associated data.
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteBusiness}
                disabled={deleteBusinessMutation.isPending}
              >
                {deleteBusinessMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Business"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

