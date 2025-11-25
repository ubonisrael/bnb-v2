"use client";

import { useState, useEffect } from "react";
import { FolderPlus } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-service";
import { useUserSettings } from "@/contexts/UserSettingsContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { categorySchema, ServiceFormValues } from "@/schemas/schema";
import { useServiceMutations } from "@/hooks/use-service-mutations";
import { CategoryFormDialog } from "@/components/services/category-form-dialog";
import { ServiceFormDialog } from "@/components/services/service-form-dialog";
import { ServiceDetailsDialog } from "@/components/services/service-details-dialog";
import { CategoriesList } from "@/components/services/categories-list";
import { ServicesTable } from "@/components/services/services-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MembersResponse } from "@/types/response";

export default function ServicesPage() {
  const { settings } = useUserSettings();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showServiceDetailsModal, setShowServiceDetailsModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceWithStaff | null>(null);
  const [editingService, setEditingService] = useState<ServiceWithStaff | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategory | null>(null);

  // Pagination and search state for categories
  const [categoryPage, setCategoryPage] = useState(1);
  const [categorySearch, setCategorySearch] = useState("");
  const categoryPageSize = 9; // 3x3 grid

  // Pagination and search state for services
  const [servicePage, setServicePage] = useState(1);
  const [serviceSearch, setServiceSearch] = useState("");
  const servicePageSize = 10;

  // Filter and sort state for services
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minDuration, setMinDuration] = useState("");
  const [maxDuration, setMaxDuration] = useState("");
  const [availableOn, setAvailableOn] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const router = useRouter();

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories", categoryPage, categorySearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: categoryPage.toString(),
        size: categoryPageSize.toString(),
        ...(categorySearch && { search: categorySearch }),
      });
      return await api.get<CategoriesDataResponse>(`/sp/categories?${params}`);
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: [
      "services",
      servicePage,
      serviceSearch,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      availableOn,
      sortBy,
      sortOrder,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: servicePage.toString(),
        size: servicePageSize.toString(),
        ...(serviceSearch && { search: serviceSearch }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(minDuration && { minDuration }),
        ...(maxDuration && { maxDuration }),
        ...(availableOn && { availableOn }),
        sortBy,
        sortOrder,
      });
      return await api.get<FetchServicesSuccessResponse>(
        `/sp/services?${params}`
      );
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: membersData, isLoading: isMembersLoading } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await api.get<MembersResponse>("members");
      return response;
    },
  });

  const categories = categoriesData?.data.categories || [];
  const categoriesPagination = categoriesData?.data.pagination;
  const services = servicesData?.data.services || [];
  const servicesPagination = servicesData?.data.pagination;
  const staffMembers = membersData?.data.members || [];

  // Get mutations from custom hook
  const {
    createCategoryMutation,
    deleteCategoryMutation,
    createServiceMutation,
    deleteServiceMutation,
    bulkDeleteServicesMutation,
    bulkDeleteCategoriesMutation,
  } = useServiceMutations();

  // Restrict access to admin and owner only
  useEffect(() => {
    if (settings && settings.role !== "owner" && settings.role !== "admin") {
      toast.error("You don't have permission to access this page");
      router.push("/dashboard");
    }
  }, [settings, router]);

  // Category handlers
  const handleCategorySubmit = async (
    values: z.infer<typeof categorySchema>
  ) => {
    try {
      await createCategoryMutation.mutateAsync({
        values,
        categoryId: editingCategory?.id,
      });
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleCategoryEdit = (category: { id: number; name: string }) => {
    setEditingCategory(category as ServiceCategory);
    setShowCategoryModal(true);
  };

  const handleCategoryDelete = async (categoryId: number) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleBulkCategoryDelete = async (categoryIds: number[]) => {
    try {
      await bulkDeleteCategoriesMutation.mutateAsync(categoryIds);
    } catch (error) {
      console.error("Failed to bulk delete categories:", error);
    }
  };

  // Service handlers
  const handleServiceSubmit = async (
    values: ServiceFormValues,
    serviceId?: number
  ) => {
    try {
      await createServiceMutation.mutateAsync({
        values,
        serviceId,
      });
      setShowServiceModal(false);
      setEditingService(null);
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const handleServiceView = (service: ServiceWithStaff) => {
    setSelectedService(service);
    setShowServiceDetailsModal(true);
  };

  const handleServiceEdit = (service: ServiceWithStaff) => {
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleServiceEditFromDetails = () => {
    if (selectedService) {
      setEditingService(selectedService);
      setShowServiceModal(true);
    }
  };

  const handleServiceDelete = async (serviceId: number) => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId);
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const handleServiceDeleteFromDetails = () => {
    if (selectedService) {
      handleServiceDelete(selectedService.id);
    }
  };

  const handleBulkServiceDelete = async (serviceIds: number[]) => {
    try {
      await bulkDeleteServicesMutation.mutateAsync(serviceIds);
    } catch (error) {
      console.error("Failed to bulk delete services:", error);
    }
  };

  // Close modals and reset editing state
  const handleCategoryModalChange = (open: boolean) => {
    setShowCategoryModal(open);
    if (!open) {
      setEditingCategory(null);
    }
  };

  const handleServiceModalChange = (open: boolean) => {
    setShowServiceModal(open);
    if (!open) {
      setEditingService(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1>Services</h1>
          <p className="text-muted-foreground">
            Manage your service offerings.
          </p>
        </div>
        <div className="flex gap-2">
          <CategoryFormDialog
            open={showCategoryModal}
            onOpenChange={handleCategoryModalChange}
            category={editingCategory}
            onSubmit={handleCategorySubmit}
            isSubmitting={createCategoryMutation.isPending}
          />
          <ServiceFormDialog
            open={showServiceModal}
            onOpenChange={handleServiceModalChange}
            service={editingService}
            categories={categories}
            staffMembers={staffMembers}
            onSubmit={handleServiceSubmit}
            isSubmitting={createServiceMutation.isPending}
            disabled={categories.length === 0}
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Categories</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCategoryModal(true)}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
        {isLoadingCategories ? (
          <>
            {/* Search Bar Skeleton */}
            <Skeleton className="h-10 w-full" />

            {/* Categories Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-12" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <CategoriesList
            categories={categories}
            pagination={categoriesPagination}
            searchQuery={categorySearch}
            onSearchChange={setCategorySearch}
            onPageChange={setCategoryPage}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
            onBulkDelete={handleBulkCategoryDelete}
            isDeleting={deleteCategoryMutation.isPending}
            isBulkDeleting={bulkDeleteCategoriesMutation.isPending}
          />
        )}
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Services</h2>
        </div>
        {isLoadingServices ? (
          <div className="space-y-4">
            {/* Search Bar Skeleton */}
            <Skeleton className="h-10 w-full" />

            {/* Tabs Skeleton */}
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            {/* Table Skeleton */}
            <div className="rounded-md border">
              <div className="p-4">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 border-b pb-3 mb-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24 hidden md:block" />
                  <Skeleton className="h-4 w-20 hidden sm:block" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>

                {/* Table Rows */}
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-6 gap-4 py-3 border-b last:border-0"
                  >
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full hidden md:block" />
                    <Skeleton className="h-6 w-20 hidden sm:block rounded-full" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ServicesTable
            services={services}
            categories={categories}
            pagination={servicesPagination}
            searchQuery={serviceSearch}
            onSearchChange={setServiceSearch}
            onPageChange={setServicePage}
            filters={{
              minPrice,
              maxPrice,
              minDuration,
              maxDuration,
              availableOn,
            }}
            onFiltersChange={{
              setMinPrice,
              setMaxPrice,
              setMinDuration,
              setMaxDuration,
              setAvailableOn,
            }}
            sorting={{
              sortBy,
              sortOrder,
            }}
            onSortingChange={{
              setSortBy,
              setSortOrder,
            }}
            onEdit={handleServiceEdit}
            onView={handleServiceView}
            onDelete={handleServiceDelete}
            onBulkDelete={handleBulkServiceDelete}
            isDeleting={deleteServiceMutation.isPending}
            isBulkDeleting={bulkDeleteServicesMutation.isPending}
          />
        )}
      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <ServiceDetailsDialog
          open={showServiceDetailsModal}
          onOpenChange={setShowServiceDetailsModal}
          serviceId={selectedService.id}
          onEdit={handleServiceEditFromDetails}
          onDelete={handleServiceDeleteFromDetails}
        />
      )}
    </div>
  );
}
