import api from "@/services/api-service";
import { BookingConfirmation } from "../../tabs/booking-confirmation";
import { ProgramRegistrationConfirmation } from "../../tabs/program-registration-confirmation";
import Link from "next/link";

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
    
    // Handle failed or unexpected session results
    const sessionData = sessionResult.data as any;
    const status = sessionData?.status || 'unknown';
    
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-md text-center space-y-4">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900">
            {status === 'failed' ? 'Payment Failed' : 'Session Error'}
          </h1>
          <p className="text-gray-600">
            {sessionData.status === 'failed' 
              ? 'Your payment could not be processed. Please try again or contact support if the problem persists.'
              : 'We encountered an issue processing your session. Please try again or contact support.'}
          </p>
          <div className="text-sm text-gray-500">
            Session Status: <span className="font-mono">{status}</span>
          </div>
          <div className="flex gap-3 justify-center pt-4">
            <Link 
              href={`/booking/${businessUrl}`}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Booking
            </Link>
            <Link 
              href="/"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    )
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
