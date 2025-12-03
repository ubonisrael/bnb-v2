import api from "@/services/api-service";
import { useQuery } from "@tanstack/react-query";

interface FetchServicesParams {
  servicePage?: number;
  servicePageSize?: number;
  serviceSearch?: string;
  minPrice?: string;
  maxPrice?: string;
  minDuration?: string;
  maxDuration?: string;
  availableOn?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  all?: boolean; 
}

export function useFetchServices({
  servicePage,
  servicePageSize,
  serviceSearch,
  minPrice,
  maxPrice,
  minDuration,
  maxDuration,
  availableOn,
  sortBy,
  sortOrder,
  all = false,
}: FetchServicesParams) {
  return useQuery({
    queryKey: [
      "services",
      servicePage,
      servicePageSize,
      serviceSearch,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      availableOn,
      sortBy,
      sortOrder,
      all
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        ...(servicePage && { page: servicePage.toString() }),
        ...(servicePageSize && { size: servicePageSize.toString() }),
        ...(serviceSearch && { search: serviceSearch }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(minDuration && { minDuration }),
        ...(maxDuration && { maxDuration }),
        ...(availableOn && { availableOn }),
        ...(sortBy && { sortBy }),
        ...(sortOrder && { sortOrder }),
        ...(all && { all: "true" }),
      });
      return await api.get<FetchServicesSuccessResponse>(
        `/sp/services?${params}`
      );
    },
    staleTime: 60 * 60 * 1000,
  });
}
