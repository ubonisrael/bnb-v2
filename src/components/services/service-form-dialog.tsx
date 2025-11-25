"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, PoundSterling } from "lucide-react";
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
import { serviceSchema } from "@/schemas/schema";
import { days, defaultServiceValues, serviceDurationOptions } from "@/lib/helpers";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  categories: { id: number; name: string }[];
  onSubmit: (values: z.infer<typeof serviceSchema>, serviceId?: number) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  categories,
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
        form.reset(service);
      } else {
        form.reset(defaultServiceValues);
      }
    }
  }, [open, service, form]);

  const handleSubmit = (values: z.infer<typeof serviceSchema>) => {
    onSubmit(values, service?.id);
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
