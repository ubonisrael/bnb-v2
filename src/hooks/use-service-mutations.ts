import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/services/api-service";
import { categorySchema, serviceSchema } from "@/schemas/schema";

export function useServiceMutations() {
  const queryClient = useQueryClient();

  // Create/Update Category
  const createCategoryMutation = useMutation({
    mutationFn: async ({
      values,
      categoryId,
    }: {
      values: z.infer<typeof categorySchema>;
      categoryId?: number;
    }) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post(
          categoryId ? `sp/categories/${categoryId}` : "sp/categories",
          values,
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
    onMutate: ({ categoryId }) => {
      toast.loading(`${categoryId ? "Updating" : "Creating"} category...`, {
        id: `${categoryId ? "update" : "create"}-category`,
      });
    },
    onSuccess: (response: any, { categoryId }) => {
      toast.success(
        `Category ${categoryId ? "updated" : "created"} successfully`,
        { id: `${categoryId ? "update" : "create"}-category` }
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: Error, { categoryId }) => {
      toast.error(
        error?.message ||
          `Failed to ${categoryId ? "update" : "create"} category`,
        { id: `${categoryId ? "update" : "create"}-category` }
      );
    },
  });

  // Delete Category
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
      toast.loading("Deleting category...", { id: "delete-category" });
    },
    onSuccess: () => {
      toast.success("Category deleted successfully", { id: "delete-category" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete category", {
        id: "delete-category",
      });
    },
  });

  // Create/Update Service
  const createServiceMutation = useMutation({
    mutationFn: async ({
      values,
      serviceId,
    }: {
      values: z.infer<typeof serviceSchema>;
      serviceId?: number;
    }) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post(
          serviceId ? `sp/services/${serviceId}` : "/sp/services",
          values,
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
    onMutate: ({ serviceId }) => {
      toast.loading(`${serviceId ? "Updating" : "Creating"} service...`, {
        id: `${serviceId ? "update" : "create"}-service`,
      });
    },
    onSuccess: (response: any, { serviceId }) => {
      toast.success(
        `Service ${serviceId ? "updated" : "created"} successfully`,
        { id: `${serviceId ? "update" : "create"}-service` }
      );
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error, { serviceId }) => {
      toast.error(
        error?.message || `Failed to ${serviceId ? "update" : "create"} service`,
        { id: `${serviceId ? "update" : "create"}-service` }
      );
    },
  });

  // Delete Service
  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
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
      toast.loading("Deleting service...", { id: "delete-service" });
    },
    onSuccess: () => {
      toast.success("Service deleted successfully", { id: "delete-service" });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete service", {
        id: "delete-service",
      });
    },
  });

  // Bulk Delete Services
  const bulkDeleteServicesMutation = useMutation({
    mutationFn: async (serviceIds: number[]) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        await api.post(
          "sp/services/bulk-delete",
          { serviceIds },
          { signal }
        );
        return { serviceIds };
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: (serviceIds) => {
      toast.loading(
        `Deleting ${serviceIds.length} service${serviceIds.length > 1 ? "s" : ""}...`,
        { id: "bulk-delete-services" }
      );
    },
    onSuccess: (data) => {
      toast.success(
        `${data.serviceIds.length} service${data.serviceIds.length > 1 ? "s" : ""} deleted successfully`,
        { id: "bulk-delete-services" }
      );
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete services", {
        id: "bulk-delete-services",
      });
    },
  });

  // Bulk Delete Categories
  const bulkDeleteCategoriesMutation = useMutation({
    mutationFn: async (categoryIds: number[]) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        await api.post(
          "sp/categories/bulk-delete",
          { categoryIds },
          { signal }
        );
        return { categoryIds };
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: (categoryIds) => {
      toast.loading(
        `Deleting ${categoryIds.length} categor${categoryIds.length > 1 ? "ies" : "y"}...`,
        { id: "bulk-delete-categories" }
      );
    },
    onSuccess: (data) => {
      toast.success(
        `${data.categoryIds.length} categor${data.categoryIds.length > 1 ? "ies" : "y"} deleted successfully`,
        { id: "bulk-delete-categories" }
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete categories", {
        id: "bulk-delete-categories",
      });
    },
  });

  return {
    createCategoryMutation,
    deleteCategoryMutation,
    createServiceMutation,
    deleteServiceMutation,
    bulkDeleteServicesMutation,
    bulkDeleteCategoriesMutation,
  };
}
