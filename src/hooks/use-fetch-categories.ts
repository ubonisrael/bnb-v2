import api from "@/services/api-service";
import { useQuery } from "@tanstack/react-query";

interface FetchCategoriesParams {
  categoryPage?: number;
  categoryPageSize?: number;
  categorySearch?: string;
  all?: boolean;
}

export default function useFetchCategories({
  categoryPage,
  categoryPageSize,
  categorySearch,
  all = false,
}: FetchCategoriesParams) {
  return useQuery({
    queryKey: ["categories", categoryPage, categorySearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(categoryPage && { page: categoryPage.toString() }),
        ...(categoryPageSize && { size: categoryPageSize.toString() }),
        ...(categorySearch && { search: categorySearch }),
        ...(all && { all: "true" }),
      });
      return await api.get<CategoriesDataResponse>(`/sp/categories?${params}`);
    },
    staleTime: 60 * 60 * 1000,
  });
}
