import CancelBookingClient from "@/components/appointments/cancel-booking";
import api from "@/services/api-service";
import Link from "next/link";

interface CancelBookingPageProps {
  params: {
    bookingId: string;
    url: string;
    appointmentId: string;
  };
}

export default async function CancelBookingPage({
  params,
}: CancelBookingPageProps) {
  const { bookingId, appointmentId } = await params;

  try {
    const bookingRes = await api.get<FetchBookingByIdResponse>(
      `sp/bookings/${bookingId}`
    );

    const { data: booking } = bookingRes;

    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <CancelBookingClient appointmentId={appointmentId} booking={booking} />
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
