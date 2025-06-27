
export type GeneratePolicyType = "all" | "deposit" | "cancellation" | "rescheduling" | "no_show";

export function generateBookingPolicy(
  bs: Partial<BookingSettingsData>,
  type: GeneratePolicyType = "all"
) {
    const policies = [];

  if (type === 'all' || type === 'deposit') {
    // Deposit messages
    if (bs.allow_deposits) {
      policies.push({
        type: 'deposit',
        policy: `A fixed deposit of £${bs.deposit_amount} is required to secure the booking.`,
      });
      policies.push({
        type: 'deposit',
        policy: 'Your deposit will be applied toward the total service cost.',
      });
    } else {
      policies.push({
        type: 'deposit',
        policy:
          'No deposit required; full payment must be made to secure the booking.',
      });
    }
  }

  if (type === 'all' || type === 'cancellation') {
    // Cancellation messages
    if (!bs.cancellation_allowed) {
      policies.push({
        type: 'cancellation',
        policy: 'Cancellations are not allowed. Full fee will be charged.',
      });
    } else if (!bs.cancellation_notice_hours || bs.cancellation_notice_hours === 0 || bs.cancellation_fee_percent === 0) {
      // If no cancellation notice hours or fee percent, allow cancellations without fees
      policies.push({
        type: 'cancellation',
        policy: 'Cancellations are allowed at any time prior to the appointment without notice.',
      });
    } else {
      policies.push({
        type: 'cancellation',
        policy: `Cancellations must be made at least ${bs.cancellation_notice_hours} hour(s) in advance to avoid fees.`,
      });
      policies.push({
        type: 'cancellation',
        policy: `A cancellation fee of ${bs.cancellation_fee_percent}% will be charged for late cancellations.`,
      });
    }
  }

  if (type === 'all') {
    // no show messages
    if (bs.no_show_fee_percent && bs.no_show_fee_percent > 0) {
      policies.push({
        type: 'no show',
        policy: `No-shows will be charged a fee of ${bs.no_show_fee_percent}%.`,
      });
    }
  }

  if (type === 'all' || type === 'rescheduling') {
    if (!bs.reschedule_allowed) {
      policies.push({
        type: 'rescheduling',
        policy: 'Rescheduling is not allowed. Changes to bookings are final.',
      });
    } else {
      policies.push({
        type: 'rescheduling',
        policy: `Reschedules must be made at least ${bs.reschedule_notice_hours} hour(s) in advance to avoid fees.`,
      });
      policies.push({
        type: 'rescheduling',
        policy: `A reschedule fee of ${bs.reschedule_fee_percent}% will be charged for late reschedules.`,
      });
    }
  }

  return policies;
}