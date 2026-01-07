import { bookingSettingsSchema } from "@/schemas/schema";
import api from "@/services/api-service";
import { z } from "zod";

interface BookingSettingsProps extends z.infer<typeof bookingSettingsSchema> {
  url: string;
}

interface BookingSettingsResponse {
  success: boolean;
  message: string;
  data: BookingSettingsProps;
}

export const mediumRefreshInterval = 15 * 60 * 1000; // 15 minutes

export async function fetchMembers() {
  const response = await api.get<MembersResponse>("members");
  return response.data.members;
}

export async function fetchBookingSettings() {
  const response = await api.get<BookingSettingsResponse>(
    "sp/booking_settings"
  );
  return response.data;
}

export async function updateBookingSettings(
  values: z.infer<typeof bookingSettingsSchema>
) {
  const response = await api.patch<BookingSettingsResponse>(
    "sp/booking_settings",
    values
  );
  return response.data;
}
