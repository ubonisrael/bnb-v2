import { fetchBookingSettings, mediumRefreshInterval } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export function useFetchBookingSettings() {
  return useQuery({
    queryKey: ["booking-settings"],
    queryFn: async () => {
      const response = await fetchBookingSettings();
      return response;
    },
    staleTime: mediumRefreshInterval,
  });
}