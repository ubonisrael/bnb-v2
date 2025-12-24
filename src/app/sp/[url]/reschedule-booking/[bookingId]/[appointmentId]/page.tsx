import RescheduleBookingClient from "@/components/appointments/reschedule-booking";
import api from "@/services/api-service";
import Link from "next/link";

interface RescheduleBookingPageProps {
  params: {
    url: string;
    bookingId: string;
    appointmentId: string;
  };
}

export default async function RescheduleBookingPage({
  params,
}: RescheduleBookingPageProps) {
  const { url, bookingId, appointmentId } = await params;

  try {
    const bookingRes = await api.get<FetchBookingByIdResponse>(
      `sp/bookings/${bookingId}`
    );
    return (
      <RescheduleBookingClient
        booking={bookingRes.data}
        appointmentId={appointmentId}
        url={url}
      />
    );
  } catch (error: any) {
    console.error("Error fetching booking data:", error);
    return (
      <div className="p-4 text-red-500 space-y-2">
        <div>Error loading booking data.</div>
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
