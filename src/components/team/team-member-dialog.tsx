"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  isActive: z.boolean().default(true),
})

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>

// Available services
const availableServices = [
  { id: "haircut", label: "Haircut" },
  { id: "styling", label: "Styling" },
  { id: "coloring", label: "Hair Coloring" },
  { id: "highlights", label: "Highlights" },
  { id: "extensions", label: "Hair Extensions" },
  { id: "mens-haircut", label: "Men's Haircut" },
  { id: "beard-trim", label: "Beard Trim" },
  { id: "hot-towel-shave", label: "Hot Towel Shave" },
  { id: "manicure", label: "Manicure" },
  { id: "pedicure", label: "Pedicure" },
  { id: "gel-nails", label: "Gel Nails" },
  { id: "nail-art", label: "Nail Art" },
  { id: "facial", label: "Facial" },
  { id: "massage", label: "Massage" },
  { id: "waxing", label: "Waxing" },
]

// Available roles
const availableRoles = [
  { id: "hair-stylist", label: "Hair Stylist" },
  { id: "barber", label: "Barber" },
  { id: "nail-technician", label: "Nail Technician" },
  { id: "esthetician", label: "Esthetician" },
  { id: "massage-therapist", label: "Massage Therapist" },
  { id: "makeup-artist", label: "Makeup Artist" },
  { id: "salon-assistant", label: "Salon Assistant" },
  { id: "receptionist", label: "Receptionist" },
  { id: "manager", label: "Manager" },
]

interface TeamMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: any
  onSave: (member: any) => void
}

export function TeamMemberDialog({ open, onOpenChange, member, onSave }: TeamMemberDialogProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(member?.avatar || null)

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
      bio: "",
      services: [],
      isActive: true,
    },
  })

  // Update form when member changes
  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name,
        role: member.role,
        email: member.email,
        phone: member.phone,
        bio: member.bio,
        services: member.services,
        isActive: member.isActive,
      })
      setAvatarUrl(member.avatar)
    } else {
      form.reset({
        name: "",
        role: "",
        email: "",
        phone: "",
        bio: "",
        services: [],
        isActive: true,
      })
      setAvatarUrl(null)
    }
  }, [member, form])

  async function onSubmit(values: TeamMemberFormValues) {
    setIsSaving(true)

    try {
      // In a real app, you would upload the avatar and save the member data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave({
        ...values,
        avatar: avatarUrl || "/placeholder.svg",
      })
    } catch (error) {
      console.error("Failed to save team member:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload this to a server and get back a URL
      // For demo purposes, we're using a local object URL
      const objectUrl = URL.createObjectURL(file)
      setAvatarUrl(objectUrl)
    }
  }

  const removeAvatar = () => {
    setAvatarUrl(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
          <DialogDescription>
            {member ? "Update the details for this team member" : "Add a new team member to your business"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Profile Photo - Not part of the form schema */}
              <div>
                <Label htmlFor="avatar-upload">Profile Photo</Label>
                <div className="mt-2">
                  {avatarUrl ? (
                    <div className="relative h-24 w-24">
                      <Image
                        src={avatarUrl || "/placeholder.svg"}
                        alt="Team Member"
                        fill
                        className="rounded-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="absolute -right-2 -top-2 h-7 w-7 rounded-full border-gray-200 bg-white"
                        onClick={removeAvatar}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-[#E0E0E5]">
                      <div className="text-center">
                        <Upload className="mx-auto h-6 w-6 text-[#6E6E73]" />
                        <label
                          htmlFor="avatar-upload"
                          className="mt-1 cursor-pointer text-xs font-medium text-[#7B68EE]"
                        >
                          Upload
                          <input
                            id="avatar-upload"
                            name="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleAvatarUpload}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Upload a profile photo for this team member</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRoles.map((role) => (
                            <SelectItem key={role.id} value={role.label}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        <Input type="email" placeholder="email@example.com" {...field} />
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
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of experience and specialties"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This will be displayed on your booking page</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services</FormLabel>
                    <FormDescription>Select the services this team member can provide</FormDescription>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 mt-2">
                      {availableServices.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service.id}`}
                            checked={field.value?.includes(service.label)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, service.label])
                              } else {
                                field.onChange(field.value?.filter((value) => value !== service.label))
                              }
                            }}
                          />
                          <Label htmlFor={`service-${service.id}`} className="text-sm font-normal">
                            {service.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>Inactive team members won't appear on the booking page</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Team Member"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

