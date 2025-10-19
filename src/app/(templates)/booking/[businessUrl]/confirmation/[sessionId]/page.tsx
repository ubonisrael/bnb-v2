import api from "@/services/api-service";
import { BookingConfirmation } from "../../tabs/booking-confirmation";
import { ProgramRegistrationConfirmation } from "../../tabs/program-registration-confirmation";
import Link from "next/link";
import { ConfirmationPageData, BookingConfirmationResponse, ProgramRegisterationResponse, ProgramRegistrationResultData } from "@/types/response";

interface ConfirmationBookingPageProps {
  params: {
    sessionId: string;
    businessUrl: string;
  };
}

export default async function ConfirmationPage({
  params,
}: ConfirmationBookingPageProps) {
  try {
    const { sessionId, businessUrl } = await params;
    // fetch booking payment status and booking details using sessionId
    const sessionResult = await api.get<ConfirmationPageData>(`stripe/session/${sessionId}`);

    if (sessionResult.type === 'booking') {
      const bookingData = sessionResult.data as BookingConfirmationResponse;
      return <BookingConfirmation {...bookingData} url={businessUrl} />; 
    }
    
    if (sessionResult.type === 'program') {
      const programData = sessionResult.data as ProgramRegistrationResultData;
      return <ProgramRegistrationConfirmation {...programData} url={businessUrl} />;
    }
    
    return null
  } catch (error: any) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="p-4 text-red-500 space-y-2">
          <div>Error loading page data.</div>
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
