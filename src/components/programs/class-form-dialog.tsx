"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { programClassSchema } from "@/schemas/schema";
import { z } from "zod";
import dayjs from "@/utils/dayjsConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { INewProgram } from "@/types/response";

type ClassFormValues = z.infer<typeof programClassSchema>;

interface ClassFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: INewProgram;
  classData?: any; // For edit mode - TODO: create proper type
  onSubmit: (values: ClassFormValues) => void;
  isSubmitting: boolean;
}

export function ClassFormDialog({
  open,
  onOpenChange,
  program,
  classData,
  onSubmit,
  isSubmitting,
}: ClassFormDialogProps) {
  const isEditMode = !!classData;

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(programClassSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: undefined,
      end_date: undefined,
      price: 0,
      capacity: null,
      is_active: true,
      is_published: false,
      start_booking_immediately: true,
      start_booking_date: null,
      end_booking_when_class_ends: true,
      end_booking_date: null,
      offer_early_bird: false,
      early_bird_discount_type: null,
      early_bird_discount_value: null,
      early_bird_deadline: null,
      allow_deposits: false,
      deposit_amount: null,
    },
  });

  // Reset form when classData changes or dialog opens/closes
  useEffect(() => {
    if (open) {
      if (isEditMode && classData) {
        form.reset({
          name: classData.name || "",
          description: classData.description || "",
          start_date: classData.start_date ? new Date(classData.start_date) : undefined,
          end_date: classData.end_date ? new Date(classData.end_date) : undefined,
          price: classData.price || 0,
          capacity: classData.capacity || null,
          is_active: classData.is_active ?? true,
          is_published: classData.is_published ?? false,
          start_booking_immediately: classData.start_booking_immediately ?? true,
          start_booking_date: classData.start_booking_date
            ? new Date(classData.start_booking_date)
            : null,
          end_booking_when_class_ends: classData.end_booking_when_class_ends ?? true,
          end_booking_date: classData.end_booking_date
            ? new Date(classData.end_booking_date)
            : null,
          offer_early_bird: classData.offer_early_bird ?? false,
          early_bird_discount_type: classData.early_bird_discount_type || null,
          early_bird_discount_value: classData.early_bird_discount_value || null,
          early_bird_deadline: classData.early_bird_deadline
            ? new Date(classData.early_bird_deadline)
            : null,
          allow_deposits: classData.allow_deposits ?? false,
          deposit_amount: classData.deposit_amount || null,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          start_date: undefined,
          end_date: undefined,
          price: 0,
          capacity: null,
          is_active: true,
          is_published: false,
          start_booking_immediately: true,
          start_booking_date: null,
          end_booking_when_class_ends: true,
          end_booking_date: null,
          offer_early_bird: false,
          early_bird_discount_type: null,
          early_bird_discount_value: null,
          early_bird_deadline: null,
          allow_deposits: false,
          deposit_amount: null,
        });
      }
    }
  }, [open, isEditMode, classData, form]);

  const handleSubmit = (values: ClassFormValues) => {
    onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Class" : "Create New Class"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Edit class details for ${program.name}`
              : `Add a new class to ${program.name}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Week 1 - Introduction" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what students will learn in this class..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (£) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : 0
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date & Time *</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value
                              ? dayjs(field.value).format("YYYY-MM-DDTHH:mm")
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.value
                              ? dayjs(e.target.value).toDate()
                              : undefined;
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date & Time *</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value
                              ? dayjs(field.value).format("YYYY-MM-DDTHH:mm")
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.value
                              ? dayjs(e.target.value).toDate()
                              : undefined;
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Capacity - Only show if program allows per-class capacity settings */}
              {program.set_capacity_per_class && (
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Leave empty for unlimited"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseInt(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of students for this class. Leave empty for
                        unlimited capacity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Booking Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Booking Settings</h3>

              <FormField
                control={form.control}
                name="start_booking_immediately"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Start Booking Immediately
                      </FormLabel>
                      <FormDescription>
                        Allow customers to book as soon as the class is published.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!form.watch("start_booking_immediately") && (
                <FormField
                  control={form.control}
                  name="start_booking_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Start Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value
                              ? dayjs(field.value).format("YYYY-MM-DDTHH:mm")
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.value
                              ? dayjs(e.target.value).toDate()
                              : null;
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="end_booking_when_class_ends"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        End Booking When Class Ends
                      </FormLabel>
                      <FormDescription>
                        Stop accepting bookings when the class ends.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!form.watch("end_booking_when_class_ends") && (
                <FormField
                  control={form.control}
                  name="end_booking_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking End Date *</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value
                              ? dayjs(field.value).format("YYYY-MM-DDTHH:mm")
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.value
                              ? dayjs(e.target.value).toDate()
                              : null;
                            field.onChange(date);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Must be before the class start date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Early Bird Offer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Early Bird Offer</h3>

              <FormField
                control={form.control}
                name="offer_early_bird"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Offer Early Bird Discount
                      </FormLabel>
                      <FormDescription>
                        Provide a discount for customers who book early.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("offer_early_bird") && (
                <div className="space-y-4 ml-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="early_bird_discount_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Type *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select discount type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="percentage">
                                Percentage
                              </SelectItem>
                              <SelectItem value="fixed_amount">
                                Fixed Amount
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="early_bird_discount_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Discount Value{" "}
                            {form.watch("early_bird_discount_type") === "percentage"
                              ? "(%)"
                              : "(£)"}{" "}
                            *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max={
                                form.watch("early_bird_discount_type") ===
                                "percentage"
                                  ? "100"
                                  : undefined
                              }
                              placeholder="0"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value ? parseFloat(e.target.value) : null
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="early_bird_deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Early Bird Deadline *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={
                              field.value
                                ? dayjs(field.value).format("YYYY-MM-DDTHH:mm")
                                : ""
                            }
                            onChange={(e) => {
                              const date = e.target.value
                                ? dayjs(e.target.value).toDate()
                                : null;
                              field.onChange(date);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Must be before the class start date.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Deposits - Only show if program allows per-class deposit settings */}
            {program.set_deposit_instructions_per_class && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Deposits</h3>

                <FormField
                  control={form.control}
                  name="allow_deposits"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow Deposits</FormLabel>
                        <FormDescription>
                          Allow customers to pay a deposit instead of the full
                          amount.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("allow_deposits") && (
                  <FormField
                    control={form.control}
                    name="deposit_amount"
                    render={({ field }) => (
                      <FormItem className="ml-4">
                        <FormLabel>Deposit Amount (£) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="1"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseFloat(e.target.value) : null
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Publishing & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Publishing & Status</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Inactive classes won't be available for booking
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Published Status
                        </FormLabel>
                        <FormDescription>
                          Publish this class to make it visible to customers
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Class"
                  : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
