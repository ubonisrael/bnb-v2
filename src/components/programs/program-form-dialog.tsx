import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { newProgramSchema } from "@/schemas/schema";
import { INewProgram } from "@/types/response";
import { useEffect } from "react";

type NewProgramFormValues = z.infer<typeof newProgramSchema>;

interface ProgramFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewProgramFormValues) => Promise<void>;
  program?: INewProgram | null;
  isSubmitting?: boolean;
}

export function ProgramFormDialog({
  open,
  onOpenChange,
  onSubmit,
  program,
  isSubmitting,
}: ProgramFormDialogProps) {
  const isEdit = !!program;

  const form = useForm<NewProgramFormValues>({
    resolver: zodResolver(newProgramSchema),
    defaultValues: {
      name: "",
      about: "",
      capacity: null,
      set_capacity_per_class: false,
      banner_image_url: null,
      is_active: true,
      is_published: false,
      set_deposit_instructions_per_class: false,
      allow_deposits: false,
      deposit_amount: null,
      absorb_service_charge: false,
      allow_refunds: false,
      refund_deadline_in_hours: null,
      refund_percentage: null,
    },
  });

  // Reset form when program changes
  useEffect(() => {
    if (program) {
      form.reset({
        name: program.name,
        about: program.about,
        capacity: program.capacity,
        set_capacity_per_class: program.set_capacity_per_class,
        banner_image_url: program.banner_image_url,
        is_active: program.is_active,
        is_published: program.is_published,
        set_deposit_instructions_per_class: program.set_deposit_instructions_per_class,
        allow_deposits: program.allow_deposits,
        deposit_amount: program.deposit_amount,
        absorb_service_charge: program.absorb_service_charge,
        allow_refunds: program.allow_refunds,
        refund_deadline_in_hours: program.refund_deadline_in_hours,
        refund_percentage: program.refund_percentage,
      });
    } else {
      form.reset();
    }
  }, [program, form]);

  const handleSubmit = async (data: NewProgramFormValues) => {
    await onSubmit(data);
    if (!isEdit) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Program" : "Create New Program"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update program details" : "Create a new program for your customers to book"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Yoga Workshop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="banner_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/banner.jpg"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your program..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tell customers what this program is about (10-2000 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Capacity Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Capacity Settings</h3>

              <FormField
                control={form.control}
                name="set_capacity_per_class"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Set Capacity Per Class</FormLabel>
                      <FormDescription>
                        Each class will have its own capacity limit
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!form.watch("set_capacity_per_class") && (
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Leave empty for unlimited"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value ? parseInt(e.target.value) : null)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of participants across all classes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Deposits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Deposits</h3>

              <FormField
                control={form.control}
                name="set_deposit_instructions_per_class"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Set Deposit Instructions Per Class
                      </FormLabel>
                      <FormDescription>
                        Each class will have its own deposit settings
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!form.watch("set_deposit_instructions_per_class") && (
                <>
                  <FormField
                    control={form.control}
                    name="allow_deposits"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Allow Deposits</FormLabel>
                          <FormDescription>
                            Allow customers to pay a deposit instead of full amount
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                                field.onChange(e.target.value ? parseFloat(e.target.value) : null)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
            </div>

            {/* Refunds */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Refunds</h3>

              <FormField
                control={form.control}
                name="allow_refunds"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Allow Refunds</FormLabel>
                      <FormDescription>
                        Allow customers to request refunds for this program
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("allow_refunds") && (
                <div className="space-y-4 ml-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="refund_deadline_in_hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Refund Deadline (Hours) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="24"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseInt(e.target.value) : null)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Hours before program start when refunds are no longer allowed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="refund_percentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Refund Percentage (%) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="100"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) =>
                                field.onChange(e.target.value ? parseInt(e.target.value) : null)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Percentage of the payment to refund (0-100)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Status Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Status Settings</h3>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Program is currently active and can accept bookings
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
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
                        <FormLabel className="text-base">Published</FormLabel>
                        <FormDescription>
                          Program is visible to customers on your booking page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : isEdit ? "Update Program" : "Create Program"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
