import { redirect } from 'next/navigation';

interface PageProps {
  params: { url: string; bookingId: string };
}

export default function CancelBookingRedirect({ params }: PageProps) {
  // Redirect old URL format to new format with 'all' as appointmentId
  redirect(`/sp/${params.url}/cancel-booking/${params.bookingId}/all`);
}
