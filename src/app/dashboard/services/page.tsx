"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Clock,
  Edit,
  Trash2,
  FolderPlus,
  Calendar,
  PoundSterling,
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
import { Service, ServiceCategory } from "@/components/onboarding/type";
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

const defaultValues = {
  name: "",
  categoryId: 0,
  price: 0,
  duration: 60,
  description: "",
  availableDays: [...days],
};

export default function ServicesPage() {
  const { settings, updateSettings } = useUserSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [isAddingService, setIsAddingService] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showDeleteServiceModal, setShowDeleteServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategory | null>(null);

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
    defaultValues,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (values: z.infer<typeof categorySchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post(
          editingCategory
            ? `sp/categories/${editingCategory.id}`
            : "sp/categories",
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
      toast.loading(`${editingCategory ? "Editing" : "Creating"} category...`, {
        id: `${editingCategory ? "edit" : "create"}-category`,
      });
    },
    onSuccess: (response: any) => {
      toast.success(
        `Category ${editingCategory ? "updated" : "created"} successfully`,
        { id: `${editingCategory ? "edit" : "create"}-category` }
      );
      if (settings) {
        if (editingCategory) {
          const updatedCat = settings.categories.map((cat) =>
            cat.id === editingCategory.id ? response.data : cat
          );
          updateSettings("categories", updatedCat);
        } else {
          // Add the new service to the existing services
          updateSettings("categories", [...settings.categories, response.data]);
        }
      }
    },
    onError: (error: Error) => {
      toast.error(
        error?.message ||
          `Failed to ${editingCategory ? "update" : "create new"} category`,
        { id: `${editingCategory ? "edit" : "create"}-category` }
      );
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
        for (const day of days) {
          if (values.availableDays.includes(day)) {
            daysStatus[`${day}_enabled`] = true;
            continue;
          }
          daysStatus[`${day}_enabled`] = false;
        }
        const response = await api.post(
          editingService ? `sp/services/${editingService.id}` : "/sp/services",
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
      toast.loading(
        editingService ? "Updating service" : "Creating service...",
        { id: editingService ? "update-service" : "create-service" }
      );
    },
    onSuccess: (response: any) => {
      toast.success(
        `Service ${editingService ? "updated" : "created"} successfully`,
        { id: editingService ? "update-service" : "create-service" }
      );
      if (settings) {
        if (editingService) {
          const updatedServices = settings.services.map((service) =>
            service.id === editingService.id ? response.data : service
          );
          updateSettings("services", updatedServices);
        } else {
          // Add the new service to the existing services
          updateSettings("services", [...settings.services, response.data]);
        }
      }
      setShowServiceModal(false);
      setEditingService(null);
    },
    onError: (error: Error) => {
      toast.error(
        error?.message ||
          `Failed to ${editingService ? "update" : "create new"} service`,
        {
          id: editingService ? "update-service" : "create-service",
        }
      );
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        await api.delete(`sp/categories/${id}`, { signal });
        return { id };
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Deleting category", { id: "delete-category" });
    },
    onSuccess: (response: any) => {
      toast.success(`Category deleted successfully`, { id: "delete-category" });
      if (settings) {
        const updatedCats = settings.categories.filter(
          (cat) => cat.id !== response.id
        );
        const updatedServices = settings.services.filter(
          (service) => service.CategoryId !== response.id
        );
        updateSettings("batch", {
          categories: updatedCats,
          services: updatedServices,
        });
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || `Failed to delete category`, {
        id: "delete-category",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        await api.delete(`sp/services/${id}`, { signal });
        return { id };
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Deleting service", { id: "delete-service" });
    },
    onSuccess: (response: any) => {
      toast.success(`Service deleted successfully`, { id: "delete-service" });
      if (settings) {
        const updatedServices = settings.services.filter(
          (service) => service.id !== response.id
        );
        updateSettings("services", updatedServices);
      }
      setShowServiceModal(false);
      setEditingService(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || `Failed to delete service`, {
        id: "delete-service",
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
    serviceForm.reset(defaultValues);
  };

  const handleServiceDelete = async (id: string) => {
    try {
      await deleteServiceMutation.mutateAsync(id);
    } catch (e) {
      // console.error(error);
    }
  };

  const handleCategoryDelete = async (id: number) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
    } catch (e) {
      // console.error(error);
    }
  };

  const handleEditService = (service: Service) => {
    const days_enabled: string[] = [];
    if (service.monday_enabled) days_enabled.push("monday");
    if (service.tuesday_enabled) days_enabled.push("tuesday");
    if (service.wednesday_enabled) days_enabled.push("wednesday");
    if (service.thursday_enabled) days_enabled.push("thursday");
    if (service.friday_enabled) days_enabled.push("friday");
    if (service.saturday_enabled) days_enabled.push("saturday");
    if (service.sunday_enabled) days_enabled.push("sunday");

    setEditingService(service);
    serviceForm.reset({
      ...service,
      categoryId: service.CategoryId,
      price: service.fullPrice,
      availableDays: [...days_enabled],
    });
    setShowServiceModal(true);
  };

  const handleEditCategory = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    categoryForm.reset(cat);
    setShowCategoryModal(true);
  };

  const filteredServices = useMemo(() => {
    if (!settings?.services) return [];

    if (!searchQuery) return settings.services;

    const query = searchQuery.toLowerCase().trim();

    return settings.services.filter((service) => {
      const matchesName = service.name.toLowerCase().includes(query);
      const matchesDescription = service.description
        ?.toLowerCase()
        .includes(query);
      const matchesCategory = settings.categories
        .find((cat) => cat.id === service.CategoryId)
        ?.name.toLowerCase()
        .includes(query);

      return (
        matchesName ||
        matchesDescription ||
        matchesCategory
      );
    });
  }, [settings?.services, settings?.categories, searchQuery]);

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
          <Dialog
            open={showCategoryModal}
            onOpenChange={(val) => {
              if (!val) {
                categoryForm.reset({
                  name: "",
                });
              }
              setShowCategoryModal(val);
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-screen">
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
                    <Button type="submit">
                      {editingCategory ? "Edit Category" : "Add Category"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog
            open={showServiceModal}
            onOpenChange={(val) => {
              if (!val) {
                serviceForm.reset(defaultValues);
              }
              setShowServiceModal(val);
            }}
          >
            <DialogTrigger asChild>
              <Button
                disabled={settings?.categories.length === 0}
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-screen">
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
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
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
                            {settings &&
                              settings.categories.map((category) => (
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
                        setShowServiceModal(false);
                        serviceForm.reset(defaultValues);
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
          <CardTitle>Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          {settings?.categories.length === 0 ? (
            <div className="rounded-md border border-dashed border-[#E0E0E5] p-6 text-center">
              <p className="text-sm text-[#6E6E73]">
                No categories yet. Add your first service category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
              {settings?.categories.map((category) => (
                <div
                  key={category.id}
                  className="flex justify-between rounded-md border border-[#E0E0E5] bg-[#F5F5F7]/50 p-3"
                >
                  <div className="flex flex-col">
                    <div className="font-medium">{category.name}</div>
                    <div className="mt-1 text-xs text-[#6E6E73]">
                      {
                        settings?.services.filter(
                          (svc) => svc.CategoryId === category.id
                        ).length
                      }{" "}
                      services
                    </div>
                  </div>
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
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setShowDeleteCategoryModal(true)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Dialog
                    open={showDeleteCategoryModal}
                    onOpenChange={(val) => setShowDeleteCategoryModal(val)}
                  >
                    <DialogContent className="sm:max-w-[480px] overflow-y-auto max-h-screen">
                      <DialogHeader>
                        <DialogTitle>
                          Are you sure you want to delete this category?
                        </DialogTitle>
                        <DialogDescription>
                          Deleting this category is irreversible and associated
                          services will be deleted too.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowDeleteCategoryModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            handleCategoryDelete(category.id);
                            setShowDeleteCategoryModal(false);
                          }}
                          type="button"
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>Service List</CardTitle>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          {settings?.services.length === 0 ? (
            <div className="rounded-md border border-dashed border-[#E0E0E5] p-6 text-center">
              <p className="text-sm text-[#6E6E73]">
                No services yet. Add your first service.
              </p>
            </div>
          ) : searchQuery ? (
            <div>
              {filteredServices.length === 0 ? (
                <div className="rounded-md border border-dashed border-[#E0E0E5] p-6 text-center">
                  <p className="text-sm text-[#6E6E73]">
                    No services match your search query: "{searchQuery}"
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm text-muted-foreground">
                      Showing results for: "{searchQuery}"
                    </h3>
                  </div>
                  <div className="rounded-md border">
                    <table className="table w-full">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                          <th className="px-4 py-3">Service</th>
                          <th className="hidden md:table-cell px-4 py-3">
                            Category
                          </th>
                          <th className="hidden md:table-cell px-4 py-3">
                            Duration
                          </th>
                          <th className="hidden md:table-cell px-4 py-3">
                            Price
                          </th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredServices.map((service) => (
                          <tr key={service.id} className="border-b">
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium">{service.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {service.description}
                                </div>
                              </div>
                              <div className="flex md:hidden text-sm items-center gap-4 mt-1">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {service.duration}
                                </div>
                                <div className="flex items-center gap-1">
                                  £{service.fullPrice}
                                </div>
                              </div>
                            </td>
                            <td className="hidden md:table-cell px-4 py-3">
                              <Badge variant="outline">
                                {
                                  settings?.categories.find(
                                    (cat) => cat.id === service.CategoryId
                                  )!.name
                                }
                              </Badge>
                            </td>
                            <td className="hidden md:table-cell px-4 py-3">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {service.duration}
                              </div>
                            </td>
                            <td className="hidden md:table-cell px-4 py-3">
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
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                </div>
              )}
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Services</TabsTrigger>
                {settings &&
                  settings.categories.map((cat) => (
                    <TabsTrigger key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </TabsTrigger>
                  ))}
              </TabsList>
              {settings &&
                settings.categories.map((cat) => (
                  <TabsContent
                    key={cat.id}
                    value={cat.id.toString()}
                    className="w-full m-0"
                  >
                    {settings &&
                    settings.services.filter(
                      (service) => service.CategoryId === cat.id
                    ).length ? (
                      <div className="rounded-md border">
                        <table className="table w-full">
                          <thead>
                            <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                              <th className="px-4 py-3">Service</th>
                              <th className="hidden md:table-cell px-4 py-3">
                                Category
                              </th>
                              <th className="hidden md:table-cell px-4 py-3">
                                Duration
                              </th>
                              <th className="hidden md:table-cell px-4 py-3">
                                Price
                              </th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {settings &&
                              settings.services
                                .filter(
                                  (service) => service.CategoryId === cat.id
                                )
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
                                      <div className="flex md:hidden text-sm items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-4 w-4 text-muted-foreground" />
                                          {service.duration}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          £{service.fullPrice}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="hidden md:table-cell px-4 py-3">
                                      <Badge variant="outline">
                                        {
                                          settings.categories.find(
                                            (cat) =>
                                              cat.id === service.CategoryId
                                          )!.name
                                        }
                                      </Badge>
                                    </td>
                                    <td className="hidden md:table-cell px-4 py-3">
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        {service.duration}
                                      </div>
                                    </td>
                                    <td className="hidden md:table-cell px-4 py-3">
                                      £{service.fullPrice}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                              Actions
                                            </span>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuLabel>
                                            Actions
                                          </DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem
                                            onClick={() =>
                                              handleEditService(service)
                                            }
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
              <TabsContent value="all" className="w-full m-0">
                <div className="rounded-md border">
                  <table className="table w-full">
                    <thead>
                      <tr className="border-b bg-muted/50 text-left text-sm font-medium">
                        <th className="px-4 py-3">Service</th>
                        <th className="hidden md:table-cell px-4 py-3">
                          Category
                        </th>
                        <th className="hidden md:table-cell px-4 py-3">
                          Duration
                        </th>
                        <th className="hidden md:table-cell px-4 py-3">
                          Price
                        </th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredServices.map((service) => (
                        <tr
                          key={`service_${service.id}_${service.name}`}
                          className="border-b"
                        >
                          <td className="px-4 py-3">
                            <div>
                              <div className="font-medium">{service.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {service.description}
                              </div>
                            </div>
                            <div className="flex md:hidden text-sm items-center gap-4 mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {service.duration}
                              </div>
                              <div className="flex items-center gap-1">
                                £{service.fullPrice}
                              </div>
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-4 py-3">
                            {settings?.categories.find(
                              (cat) => cat.id === service.CategoryId
                            ) && (
                              <Badge variant="outline">
                                {
                                  settings?.categories.find(
                                    (cat) => cat.id === service.CategoryId
                                  )!.name
                                }
                              </Badge>
                            )}
                          </td>
                          <td className="hidden md:table-cell px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {service.duration}
                            </div>
                          </td>
                          <td className="hidden md:table-cell px-4 py-3">
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
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    handleEditService(service);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                  View bookings
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() =>
                                    setShowDeleteServiceModal(true)
                                  }
                                >
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Dialog
                              open={showDeleteServiceModal}
                              onOpenChange={setShowDeleteServiceModal}
                            >
                              <DialogContent className="sm:max-w-[480px] overflow-y-auto max-h-screen">
                                <DialogHeader>
                                  <DialogTitle>
                                    Are you sure you want to delete this
                                    service?
                                  </DialogTitle>
                                  <DialogDescription>
                                    Deleting this service is irreversible.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                      setShowDeleteServiceModal(false)
                                    }
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      handleServiceDelete(service.id);
                                      setShowDeleteServiceModal(false);
                                    }}
                                    type="button"
                                    variant="destructive"
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
