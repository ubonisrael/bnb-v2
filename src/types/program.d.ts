interface IProgram {
  id: string;
  name: string;
  banner_image_url?: string;
  start_date: string;
  end_date: string;
  price: string;
  capacity?: number;
  is_published: boolean;
  createdAt: string;
  start_booking_immediately: boolean; // indicates if booking can start immediately
  start_booking_date?: string; // date when booking starts, null if booking starts immediately
  end_booking_when_program_ends: boolean; // indicates if booking ends when the program ends
  end_booking_date?: string; // date when booking ends, null if booking ends with the program
  is_active: boolean; // indicates if the program is currently active
  offer_early_bird: boolean; // indicates if the program has an early bird offer
  early_bird_discount_type?: "percentage" | "fixed_amount"; // type of early bird discount
  early_bird_discount_value?: number; // value of the early bird discount
  early_bird_deadline?: string; // deadline for early bird discount
  allow_deposits: boolean; // indicates if the program allows deposits
  deposit_amount?: number; // amount required for deposit, null if deposits not allowed
  absorb_service_charge: boolean; // indicates if the program absorbs service charges
  allow_refunds: boolean; // indicates if the program allows refunds
  refund_deadline_in_hours?: number; // deadline in hours for refund eligibility
  refund_percentage?: number;
}

interface IProgramResponse {
  success: boolean;
  message: string;
  data: {
    programs: IProgram[];
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
