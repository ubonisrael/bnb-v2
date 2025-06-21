"use client";

import { Ref, useImperativeHandle, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, Clock, Calendar, Edit, Trash, PoundSterling } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

interface ServicesSetupStepProps {
  data: OnboardingFormData;
  onUpdate: (data: ServicesSetupData) => void;
  ref: Ref<{ validate: () => Promise<boolean> }>;
}

// Days of the week
export const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

// Duration options in minutes
export const durationOptions = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "75", label: "1 hour 15 minutes" },
  { value: "90", label: "1 hour 30 minutes" },
  { value: "105", label: "1 hour 45 minutes" },
  { value: "120", label: "2 hours" },
  { value: "150", label: "2 hours 30 minutes" },
  { value: "180", label: "3 hours" },
];

// Form schemas
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters" }),
});

export const serviceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Service name must be at least 2 characters" }),
  categoryId: z.coerce.number().min(1, { message: "Please select a category" }),
  price: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number" }),
  duration: z.coerce
    .number()
    .min(5, { message: "Duration must be at least 5 minutes" }),
  description: z.string().min(16, { message: "Description must be at least 16 characters"}),
  availableDays: z
    .array(z.string())
    .min(1, { message: "Select at least one day" }),
});

export function ServicesSetupStep({
  data,
  onUpdate,
  ref,
}: ServicesSetupStepProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Category form
  const categoryForm = useForm<{ name: string }>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  // Service form
  const serviceForm = useForm<Omit<Service, "id">>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      categoryId: 0,
      price: 0,
      duration: 60,
      description: "",
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  });

  useImperativeHandle(ref, () => ({
    async validate() {
      const isValid =
        data.servicesSetup.categories.length > 0 &&
        data.servicesSetup.services.length > 0;
        if (!isValid) {
          toast.error("Please add at least one category and one service.");
        }
      return isValid;
    },
  }));

  // Add a new category
  const handleAddCategory = (values: { name: string }) => {
    const newCategory: ServiceCategory = {
      id: Date.now(),
      name: values.name,
    };

    onUpdate({
        ...data.servicesSetup,
        categories: [...data.servicesSetup.categories, newCategory],
      });

    categoryForm.reset();
    setIsAddingCategory(false);
  };

  // Add or update a service
  const handleAddService = (values: Omit<Service, "id">) => {
    if (editingService) {
      // Update existing service
      const updatedServices = data.servicesSetup.services.map((service) =>
        service.id === editingService.id
          ? { ...values, id: service.id }
          : service
      );

      onUpdate({
        ...data.servicesSetup,
        services: updatedServices,
      });
    } else {
      // Add new service
      const newService: Service = {
        ...values,
        id: `svc_${Date.now()}`,
      };

      onUpdate({
        ...data.servicesSetup,
        services: [...data.servicesSetup.services, newService],
      });
    }

    serviceForm.reset();
    setIsAddingService(false);
    setEditingService(null);
  };

  // Delete a service
  const handleDeleteService = (serviceId: string) => {
    onUpdate({
      ...data.servicesSetup,
      services: data.servicesSetup.services.filter(
        (service) => service.id !== serviceId
      ),
    });
  };

  // Edit a service
  const handleEditService = (service: Service) => {
    setEditingService(service);
    serviceForm.reset(service);
    setIsAddingService(true);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#121212]">Services Setup</h2>
        <p className="text-sm text-[#6E6E73]">
          Set up the services you offer, organize them into categories, and
          specify pricing and availability
        </p>
      </div>

      {/* Categories Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-md font-medium text-[#121212]">
            Service Categories
          </h3>
          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Service Category</DialogTitle>
                <DialogDescription>
                  Create a new category to organize your services
                </DialogDescription>
              </DialogHeader>
              <Form {...categoryForm}>
                <form
                  onSubmit={categoryForm.handleSubmit(handleAddCategory)}
                  className="space-y-4"
                >
                  <FormField
                    control={categoryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Hair Services, Nail Care"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingCategory(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Category</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {data.servicesSetup.categories.length === 0 ? (
          <div className="rounded-md border border-dashed border-[#E0E0E5] p-6 text-center">
            <p className="text-sm text-[#6E6E73]">
              No categories yet. Add your first service category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {data.servicesSetup.categories.map((category) => (
              <div
                key={category.id}
                className="rounded-md border border-[#E0E0E5] bg-[#F5F5F7]/50 p-3"
              >
                <div className="font-medium">{category.name}</div>
                <div className="mt-1 text-xs text-[#6E6E73]">
                  {
                    data.servicesSetup.services.filter(
                      (svc) => svc.categoryId === category.id
                    ).length
                  }{" "}
                  services
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-md font-medium text-[#121212]">Services</h3>
          <Dialog
            open={isAddingService}
            onOpenChange={(open) => {
              setIsAddingService(open);
              if (!open) {
                setEditingService(null);
                serviceForm.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                disabled={data.servicesSetup.categories.length === 0}
                title={
                  data.servicesSetup.categories.length === 0
                    ? "Add a category first"
                    : "Add a service"
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-screen">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Service" : "Add New Service"}
                </DialogTitle>
                <DialogDescription>
                  {editingService
                    ? "Update the details of your service"
                    : "Define a new service with pricing and availability"}
                </DialogDescription>
              </DialogHeader>
              <Form {...serviceForm}>
                <form
                  onSubmit={serviceForm.handleSubmit(handleAddService)}
                  className="space-y-4"
                >
                  <FormField
                    control={serviceForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Haircut, Manicure"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={serviceForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value && field.value !== 0 ? field.value.toString() : ""}
                          value={field.value && field.value !== 0 ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {data.servicesSetup.categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
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
                      control={serviceForm.control}
                      name="price"
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
                      control={serviceForm.control}
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
                              {durationOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                    control={serviceForm.control}
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

                  <FormField
                    control={serviceForm.control}
                    name="availableDays"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Available Days</FormLabel>
                          <FormDescription>
                            Select the days when this service is available
                          </FormDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {daysOfWeek.map((day) => (
                            <FormField
                              key={day.id}
                              control={serviceForm.control}
                              name="availableDays"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={day.id}
                                    className="flex items-center space-x-1 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(day.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                day.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== day.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-xs font-normal">
                                      {day.label}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddingService(false);
                        setEditingService(null);
                        serviceForm.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingService ? "Update Service" : "Add Service"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {data.servicesSetup.services.length === 0 ? (
          <div className="rounded-md border border-dashed border-[#E0E0E5] p-6 text-center">
            <p className="text-sm text-[#6E6E73]">
              {data.servicesSetup.categories.length === 0
                ? "Add a category first, then add your services"
                : "No services yet. Add your first service."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data.servicesSetup.categories.map((category) => {
              const categoryServices = data.servicesSetup.services.filter(
                (svc) => svc.categoryId === category.id
              );
              if (categoryServices.length === 0) return null;

              return (
                <Card key={category.id} className="border-0 shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {categoryServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between rounded-md border border-[#E0E0E5] p-3"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{service.name}</div>
                            {service.description && (
                              <div className="mt-1 text-sm text-[#6E6E73]">
                                {service.description}
                              </div>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                              <div className="flex items-center text-xs text-[#6E6E73]">
                                <PoundSterling className="mr-1 h-3 w-3" />
                                {service.price.toFixed(2)}
                              </div>
                              <div className="flex items-center text-xs text-[#6E6E73]">
                                <Clock className="mr-1 h-3 w-3" />
                                {service.duration} min
                              </div>
                              <div className="flex items-center text-xs text-[#6E6E73]">
                                <Calendar className="mr-1 h-3 w-3" />
                                {service.availableDays.length === 7
                                  ? "Every day"
                                  : service.availableDays.length > 3
                                  ? `${service.availableDays.length} days/week`
                                  : service.availableDays
                                      .map((day) => day.substring(0, 3))
                                      .join(", ")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditService(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
