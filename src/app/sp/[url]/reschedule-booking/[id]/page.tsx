import RescheduleBookingClient from "@/components/appointments/reschedule-booking";
import api from "@/services/api-service";
import Link from "next/link";

interface RescheduleBookingPageProps {
  params: {
    id: string;
    url: string;
  };
}

export default async function RescheduleBookingPage({
  params,
}: RescheduleBookingPageProps) {
  const { id, url } = await params;

  try {
    const [bookingRes, policyRes] = await Promise.all([
      api.get<FetchBookingByIdResponse>(`sp/bookings/${id}`),
      api.get<FetchReschedulingPolicyResponse>(
        `sp/${url}/rescheduling-settings`
      ),
    ]);
    const { data: booking } = bookingRes;
    const { rescheduleOptions } = policyRes;

    return (
      <RescheduleBookingClient
        booking={booking}
        id={id}
        url={url}
        rescheduleOptions={rescheduleOptions}
      />
    );
  } catch (error: any) {
    return (
      <div className="p-4 text-red-500 space-y-2">
        <div>Error loading booking or policy data.</div>
        {error?.message && (
          <div className="text-sm text-muted-foreground">{error.message}</div>
        )}
        <Link href="/" className="text-blue-600 underline">
          Return to Home
        </Link>
      </div>
    );
  }
}
