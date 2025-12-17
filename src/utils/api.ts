import api from "@/services/api-service";

export const mediumRefreshInterval = 5 * 60 * 1000; // 5 minutes
export async function fetchMembers() {
  const response = await api.get<MembersResponse>("members");
  return response.data.members;
}
