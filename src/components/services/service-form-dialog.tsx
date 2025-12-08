"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, PoundSterling, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ServiceFormValues, serviceSchema } from "@/schemas/schema";
import {
  days,
  defaultServiceValues,
  serviceDurationOptions,
} from "@/lib/helpers";

interface StaffMember {
  id: number;
  UserId: number;
  ServiceProviderId: number;
  role: "owner" | "admin" | "staff";
  status: "pending" | "accepted" | "rejected";
  User: MemberUser;
}

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: ServiceWithStaff | null;
  categories: { id: number; name: string }[];
  staffMembers: StaffMember[];
  onSubmit: (values: ServiceFormValues, serviceId?: number) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  categories,
  staffMembers,
  onSubmit,
  isSubmitting,
  disabled = false,
}: ServiceFormDialogProps) {
  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: defaultServiceValues,
  });

  // Reset form when service changes or dialog opens
  useEffect(() => {
    if (open) {
      if (service) {
        // Extract staff IDs from service staff members
        const staffIds = service.staff.map((s) => s.id) || [];
        form.reset({
          ...service,
          staff_ids: staffIds,
        });
      } else {
        form.reset(defaultServiceValues);
      }
    }
  }, [open, service, form]);

  const handleSubmit = (values: z.infer<typeof serviceSchema>) => {
    onSubmit(values, service?.id);
  };

  // Get staff member details by ID
  const getStaffMemberById = (staffId: number) => {
    return staffMembers.find((member) => member.id === staffId);
  };

  // Get initials from full name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={disabled} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>
            {service ? "Edit Service" : "Add New Service"}
          </DialogTitle>
          <DialogDescription>
            {service
              ? "Update the service details"
              : "Enter the basic details of your service"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Haircut, Manicure" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={
                      field.value && field.value !== 0
                        ? field.value.toString()
                        : ""
                    }
                    value={
                      field.value && field.value !== 0
                        ? field.value.toString()
                        : ""
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="fullPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <div className="relative">
                      <PoundSterling className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-8"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(Number.parseInt(value))
                      }
                      defaultValue={field.value.toString()}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceDurationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Brief description of the service"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Available Days</FormLabel>
              <FormDescription>
                Select the days when this service is available
              </FormDescription>
              {days.map((day) => (
                <FormField
                  key={day}
                  control={form.control}
                  name={
                    `${day}_enabled` as
                      | "monday_enabled"
                      | "tuesday_enabled"
                      | "wednesday_enabled"
                      | "thursday_enabled"
                      | "friday_enabled"
                      | "saturday_enabled"
                      | "sunday_enabled"
                  }
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-1 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-xs font-normal">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <FormField
              control={form.control}
              name="staff_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Staff</FormLabel>
                  <FormDescription>
                    Select staff members who can provide this service (at least
                    one required)
                  </FormDescription>

                  {/* Selected Staff List */}
                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {field.value.map((staffId) => {
                        const staff = getStaffMemberById(staffId);
                        if (!staff) return null;
                        return (
                          <Badge
                            key={staffId}
                            variant="secondary"
                            className="flex items-center gap-2 py-1.5 px-3"
                          >
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={staff.User.avatar || undefined}
                                alt={staff.User.full_name}
                              />
                              <AvatarFallback className="text-xs">
                                {getInitials(staff.User.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {staff.User.full_name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                field.onChange(
                                  field.value.filter((id) => id !== staffId)
                                );
                              }}
                              className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Staff Selection Dropdown */}
                  <Select
                    value=""
                    onValueChange={(value) => {
                      const staffId = Number(value);
                      if (!field.value.includes(staffId)) {
                        field.onChange([...field.value, staffId]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff to add" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staffMembers
                        .filter((member) => !field.value.includes(member.id))
                        .map((member) => (
                          <SelectItem
                            key={member.id}
                            value={member.id.toString()}
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {getInitials(member.User.full_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-sm">
                                  {member.User.full_name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {member.User.email}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      {staffMembers.filter(
                        (member) => !field.value.includes(member.id)
                      ).length === 0 && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          All staff members have been added
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? service
                    ? "Updating..."
                    : "Creating..."
                  : service
                  ? "Update Service"
                  : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
