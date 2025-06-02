import CancelBookingClient from "@/components/appointments/cancel-booking";
import api from "@/services/api-service";
import {
  FetchBookingByIdResponse,
  FetchBookingPolicyResponse,
  PolicyData,
} from "@/types/response";
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
      api.get<FetchBookingPolicyResponse>(`sp/${url}/booking-policies?type=cancellation`),
    ]);
    const { booking } = bookingRes;
    const { policies } = policyRes;
    // const booking = {
    //   id: Number(id),
    //   event_date: "2025-06-02T10:28:39.250Z",
    //   event_duration: 100,
    //   amount_paid: 50,
    //   amount_due: 70,
    //   status: "confirmed",
    //   payment_status: "succeeded",
    //   services: [{ id: 1, name: "Haircut"}],
    // };
    // const policies = [
    //   {
    //     type: "rescheduling",
    //     policy:
    //       "Rescheduling is allowed up to 24 hours before the appointment.",
    //   },
    //   {
    //     type: "rescheduling",
    //     policy:
    //       "One reschedule is allowed per booking without additional charges.",
    //   },
    // ];

    return (
      <CancelBookingClient booking={booking} policies={policies as PolicyData[]} id={id} />
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
