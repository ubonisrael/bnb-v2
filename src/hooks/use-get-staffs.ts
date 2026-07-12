import { fetchMembers, mediumRefreshInterval } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export function useGetStaffs(enabled: boolean = true) {
  return useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
    staleTime: mediumRefreshInterval,
    enabled,
  });
}
