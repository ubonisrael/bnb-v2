interface IProgram {
  id: string;
  name: string;
  about: string;
  banner_image_url?: string;
  set_capacity_per_class: boolean;
  capacity?: number;
  is_published: boolean;
  createdAt: string;
  is_active: boolean; // indicates if the program is currently active
  set_deposit_instructions_per_class: boolean; // indicates if deposit instructions vary per class
  allow_deposits: boolean; // indicates if the program allows deposits
  deposit_amount?: number; // amount required for deposit, null if deposits not allowed
  absorb_service_charge: boolean; // indicates if the program absorbs service charges
  allow_refunds: boolean; // indicates if the program allows refunds
  refund_deadline_in_hours?: number; // deadline in hours for refund eligibility
  refund_percentage?: number;
}

interface IProgramClass {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  start_booking_immediately: boolean;
  start_booking_date?: string;
  end_booking_when_class_ends: boolean;
  end_booking_date?: string;
  price: number;
  capacity: number | null;
  is_active: boolean;
  is_published: boolean;
  offer_early_bird: boolean;
  early_bird_discount_type: 'percentage' | 'fixed_amount' | null;
  early_bird_discount_value: number | null;
  early_bird_deadline?: string;
  allow_deposits: boolean;
  deposit_amount: number | null;
  ProgramId: number;
  createdAt: string;
  updatedAt: string;
}

interface IStudent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  deposit_amount_paid?: number;
  balance_amount_paid?: number;
}

interface IProgramDetails {
    program: IProgram;
    students: IStudent[];
    totalRevenue: number;
  };

interface IProgramDetailsResponse {
  success: true;
  message: string;
  data: IProgramDetails;
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
