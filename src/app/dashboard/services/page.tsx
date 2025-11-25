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
import { categorySchema, serviceSchema } from "@/schemas/schema";
import { useServiceMutations } from "@/hooks/use-service-mutations";
import { CategoryFormDialog } from "@/components/services/category-form-dialog";
import { ServiceFormDialog } from "@/components/services/service-form-dialog";
import { CategoriesList } from "@/components/services/categories-list";
import { ServicesTable } from "@/components/services/services-table";

export default function ServicesPage() {
  const { settings } = useUserSettings();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  
  // Pagination and search state for categories
  const [categoryPage, setCategoryPage] = useState(1);
  const [categorySearch, setCategorySearch] = useState("");
  const categoryPageSize = 9; // 3x3 grid

  // Pagination and search state for services
  const [servicePage, setServicePage] = useState(1);
  const [serviceSearch, setServiceSearch] = useState("");
  const servicePageSize = 10;

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
  })

  const { data: servicesData, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services", servicePage, serviceSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: servicePage.toString(),
        size: servicePageSize.toString(),
        ...(serviceSearch && { search: serviceSearch }),
      });
      return await api.get<FetchServicesSuccessResponse>(`/sp/services?${params}`);
    },
    staleTime: 5 * 60 * 1000,
  })

  const categories = categoriesData?.data.categories || [];
  const categoriesPagination = categoriesData?.data.pagination;
  const services = servicesData?.data.services || [];
  const servicesPagination = servicesData?.data.pagination;

  // Get mutations from custom hook
  const {
    createCategoryMutation,
    deleteCategoryMutation,
    createServiceMutation,
    deleteServiceMutation,
  } = useServiceMutations();

  // Restrict access to admin and owner only
  useEffect(() => {
    if (settings && settings.role !== "owner" && settings.role !== "admin") {
      toast.error("You don't have permission to access this page");
      router.push("/dashboard");
    }
  }, [settings, router]);

  // Category handlers
  const handleCategorySubmit = async (values: z.infer<typeof categorySchema>) => {
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

  // Service handlers
  const handleServiceSubmit = async (values: z.infer<typeof serviceSchema>, serviceId?: number) => {
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

  const handleServiceEdit = (service: Service) => {
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleServiceDelete = async (serviceId: number) => {
    try {
      await deleteServiceMutation.mutateAsync(serviceId);
    } catch (error) {
      console.error("Failed to delete service:", error);
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
          <div className="text-center text-muted-foreground py-8">
            Loading categories...
          </div>
        ) : (
          <CategoriesList
            categories={categories}
            pagination={categoriesPagination}
            searchQuery={categorySearch}
            onSearchChange={setCategorySearch}
            onPageChange={setCategoryPage}
            onEdit={handleCategoryEdit}
            onDelete={handleCategoryDelete}
            isDeleting={deleteCategoryMutation.isPending}
          />
        )}
      </div>

      {/* Services Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Services</h2>
        </div>
        {isLoadingServices ? (
          <div className="text-center text-muted-foreground py-8">
            Loading services...
          </div>
        ) : (
          <ServicesTable
            services={services}
            categories={categories}
            pagination={servicesPagination}
            searchQuery={serviceSearch}
            onSearchChange={setServiceSearch}
            onPageChange={setServicePage}
            onEdit={handleServiceEdit}
            onDelete={handleServiceDelete}
            isDeleting={deleteServiceMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
