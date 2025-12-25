export function sendOtpURL({
  id,
  appointmentId,
}: {
  id: number;
  appointmentId: string;
}) {
  return appointmentId === "all"
    ? `sp/bookings/${id}/request-otp`
    : `sp/bookings/${id}/items/${appointmentId}/request-otp`;
}

export function verifyOtpURL({
  id,
  appointmentId,
}: {
  id: number;
  appointmentId: string;
}) {
  return appointmentId === "all"
    ? `sp/bookings/${id}/verify-otp`
    : `sp/bookings/${id}/items/${appointmentId}/verify-otp`;
}
