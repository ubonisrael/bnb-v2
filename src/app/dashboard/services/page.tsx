"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  FolderPlus,
  Calendar,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Service } from "@/components/onboarding/type";
import {
  categorySchema,
  daysOfWeek,
  durationOptions,
  serviceSchema,
} from "@/components/onboarding/steps/services-setup";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import { useUserSettings } from "@/contexts/user-settings-context";
import { Checkbox } from "@/components/ui/checkbox";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
const daysStatus = days.map((d) => `${d}_enabled`);
type daysStatusType = (typeof daysStatus)[number];

export default function ServicesPage() {
  const { settings, updateSettings } = useUserSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
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
      categoryId: "",
      price: 0,
      duration: 60,
      description: "",
      availableDays: [...days],
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (values: z.infer<typeof categorySchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post(
          "/sp/categories",
          {
            ...values,
          },
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
      toast.loading("Creating category...", { id: "create-category" });
    },
    onSuccess: (response: any) => {
      toast.success("Category updated successfully", { id: "create-category" });
      if (settings) {
        updateSettings("categories", [...settings.categories, response.data]);
      }
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create new category", {
        id: "create-category",
      });
    },
  });

  const onSubmitCategory = async (data: z.infer<typeof categorySchema>) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      setShowCategoryModal(false);
      categoryForm.reset();
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const createServiceMutation = useMutation({
    mutationFn: async (values: z.infer<typeof serviceSchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const daysStatus: { [key in daysStatusType]: boolean } = {};
        values.availableDays.forEach((day) => {
          daysStatus[`${day}_enabled`] = true;
        });
        const response = await api.post(
          "/sp/services",
          {
            ...values,
            fullPrice: values.price,
            ...daysStatus,
          },
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
      toast.loading("Creating service...", { id: "create-service" });
    },
    onSuccess: (response: any) => {
      toast.success("Service created successfully", { id: "create-service" });
      if (settings) {
        updateSettings("services", [...settings.services, response.data]);
      }
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create new service", {
        id: "create-service",
      });
    },
  });

  const handleServiceSubmit = async (data: z.infer<typeof serviceSchema>) => {
    // TODO: Implement service creation
    try {
      await createServiceMutation.mutateAsync(data);
    } catch (e) {
      // console.error(error);
    }
    setShowServiceModal(false);
    setShowAvailabilityModal(false);
    setEditingService(null);
    serviceForm.reset();
  };

  const handleEditService = (service: Service) => {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1>Services</h1>
          <p className="text-muted-foreground">
            Manage your service offerings.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category for your services.
                </DialogDescription>
              </DialogHeader>
              <Form {...categoryForm}>
                <form
                  onSubmit={categoryForm.handleSubmit(onSubmitCategory)}
                  className="space-y-4"
                >
                  <FormField
                    control={categoryForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Category</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Service" : "Add New Service"}
                </DialogTitle>
                <DialogDescription>
                  Enter the basic details of your service
                </DialogDescription>
              </DialogHeader>
              <Form {...serviceForm}>
                <form
                  onSubmit={serviceForm.handleSubmit(handleServiceSubmit)}
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
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {settings && settings.categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
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
                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
      </div>

      <Card className="shadow-card">
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Service List</CardTitle>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Services</TabsTrigger>
              {settings && settings.categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {settings && settings.categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="m-0">
                {settings && settings.services.filter(
                  (service) => service.CategoryId === cat.id
                ).length ? (
                  <div className="rounded-md border">
                    <table className="hidden w-full md:table">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                          <th className="px-4 py-3">Service</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Duration</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {settings && settings.services
                          .filter((service) => service.CategoryId === cat.id)
                          .map((service) => (
                            <tr key={service.id} className="border-b">
                              <td className="px-4 py-3">
                                <div>
                                  <div className="font-medium">
                                    {service.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {service.description}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="outline">
                                  {
                                    settings.categories.find(
                                      (cat) => cat.id === service.CategoryId
                                    )!.name
                                  }
                                </Badge>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {service.duration}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                £{service.fullPrice}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Actions</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleEditService(service)}
                                    >
                                      Edit service
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      View bookings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                      Delete service
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-sm text-muted-foreground">
                      No services available in this category.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
            <TabsContent value="all" className="m-0">
              <div className="rounded-md border">
                <table className="hidden w-full md:table">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {settings && settings.services.map((service) => (
                      <tr key={service.id} className="border-b">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {service.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">
                            {
                              settings.categories.find(
                                (cat) => cat.id === service.CategoryId
                              )!.name
                            }
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {service.duration}
                          </div>
                        </td>
                        <td className="px-4 py-3">£{service.fullPrice}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleEditService(service)}
                              >
                                Edit service
                              </DropdownMenuItem>
                              <DropdownMenuItem>View bookings</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete service
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
