import CancelBookingClient from "@/components/appointments/cancel-booking";
import api from "@/services/api-service";
import { FetchBookingByIdResponse, FetchCancellationPolicyResponse } from "@/types/response";
import Link from "next/link";

interface CancelBookingPageProps {
  params: {
    id: string;
    url: string;
  };
}

export default async function CancelBookingPage({
  params,
}: CancelBookingPageProps) {
  const { id, url } = await params;

  try {
    const [bookingRes, policyRes] = await Promise.all([
      api.get<FetchBookingByIdResponse>(`sp/bookings/${id}`),
      api.get<FetchCancellationPolicyResponse>(
        `sp/${url}/cancellation-settings`
      ),
    ]);
    const { data: booking } = bookingRes;
    const { cancellation } = policyRes;

    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <CancelBookingClient
          id={id}
          setting={cancellation}
          booking={booking}
        />
      </div>
    );
  } catch (error: any) {
    console.error("Error loading booking or policy data:", error);
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="p-4 text-red-500 space-y-2">
          <div>Error loading booking or policy data.</div>
          {error?.message && (
            <div className="text-sm text-muted-foreground">{error.message}</div>
          )}
          <Link href="/" className="text-blue-600 underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
}
