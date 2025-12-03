import api from "@/services/api-service";
import { useQuery } from "@tanstack/react-query";

export function useCompanyDetails() {
  return useQuery({
    queryKey: ["company-details"],
    queryFn: async () => {
      const response = await api.get<UserSettingsResponse>("sp");
      return response.data;
    },
    staleTime: 60 * 60 * 1000,
  });
}
