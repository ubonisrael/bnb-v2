interface VoidResponse {
  status: boolean;
  message: string;
}

interface AnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    period: string;
    revenue: {
      totalRevenue: number;
      revenueChange: number;
    };
    bookings: {
      totalBookings: number;
      bookingChange: number;
    };
    clients: {
      totalClients: number;
      clientChange: number;
    };
    daysSinceCreation: number;
  };
}

interface PeriodicStatsResponse {
  success: boolean;
  message: string;
  data: {
    period: string;
    stats: {
      name: string;
      bookings: number;
      revenue: number;
      clients: number;
    }[];
  };
}

interface AnalyticsServiceDataResponse {
  success: boolean;
  message: string;
  data: {
    period: string;
    serviceCount: {
      serviceId: number;
      name: string;
      value: number;
      percentageChange?: number;
    }[];
  };
}

interface StaffPerformanceResponse {
  success: boolean;
  message: string;
  data: {
    period: string;
    staffPerformance: {
      staffId: number;
      staffUuid: string;
      staffName: string;
      staffEmail: string;
      role: string;
      completedBookings: number;
      revenue: number;
    }[];
  };
}

interface DayBookingStatsResponse {
  success: boolean;
  message: string;
  data: {
    stats: {
      day: string;
      bookings: number;
    }[];
  };
}

interface Summary {
  total_bookings: number;
  total_earnings: number;
  total_unique_customers: number;
  total_upcoming_bookings: number;
}

interface AnalyticsData {
  summary: Summary;
  ageCategory: any[];
  gender: any[];
  topCustomers: any[];
}

interface SettingsResponse {
  status: boolean;
  message: string;
  data: SettingsData;
}

interface SettingsData {
  url: string;
  minimum_notice: number;
  maximum_notice: number;
  time_zone: string;
  welcome_message: string;
  sunday_enabled: boolean;
  sunday_opening: number;
  sunday_closing: number;
  monday_enabled: boolean;
  monday_opening: number;
  monday_closing: number;
  tuesday_enabled: boolean;
  tuesday_opening: number;
  tuesday_closing: number;
  wednesday_enabled: boolean;
  wednesday_opening: number;
  wednesday_closing: number;
  thursday_enabled: boolean;
  thursday_opening: number;
  thursday_closing: number;
  friday_enabled: boolean;
  friday_opening: number;
  friday_closing: number;
  saturday_enabled: boolean;
  saturday_opening: number;
  saturday_closing: number;
}

interface BusinessData {
  name: string;
  type: string;
  email: string;
  phone: string;
  logo: string | undefined;
  desc: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  cancellation_policy: number;
  email_confirmation: boolean;
  appointment_reminders: boolean;
  reminder_time: number;
  cancellation_notices: boolean;
  no_show_notifications: boolean;
  follow_up_emails: boolean;
  follow_up_delay: number;
  primary_clr: string;
  accent_clr: null;
  website_url: null;
  facebook_url: null;
  linkedin_url: null;
  twitter_url: null;
  instagram_url: null;
  tiktok_url: null;
  youtube_url: null;
  uuid: string;
}

interface BusinessSocialData {
  website_url: null;
  facebook_url: null;
  linkedin_url: null;
  twitter_url: null;
  instagram_url: null;
  tiktok_url: null;
  youtube_url: null;
}

interface BusinessProfileData {
  name: string;
  email: string;
  phone: string;
  logo: string | undefined;
  desc: string;
  address: string;
  display_address: boolean;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

interface BusinessProfileResponse {
  status: boolean;
  message: string;
  data: BusinessProfileData;
}

interface BusinessSocialResponse {
  status: boolean;
  message: string;
  data: BusinessSocialData;
}

interface BookingDataResponse {
  status: boolean;
  message: string;
  timeSlotDuration: number;
  dayEnabled: boolean;
  closingTime: number;
  openingTime: number;
  timezone: string;
  bookings: BookingsResponse[];
}

interface BusinessSettingsResponse {
  status: boolean;
  message: string;
  data: SettingsData;
}

interface SignupResponse {
  status: boolean;
  message: string;
  token: string;
}

interface UserResponse {
  status: boolean;
  message: string;
  data: UserData;
}

interface UserData {
  uuid: string;
  name: string;
  email: string;
  has_google: boolean;
  has_password: boolean;
}

interface SignoutResponse {
  status: boolean;
  message: string;
}

interface AuthResponse {
  status: boolean;
  message: string;
  data: Data;
  csrfToken: string;
  onBoardingCompleted: boolean;
}

interface ResendVerificationResponse {
  status: boolean;
  message: string;
}

interface Data {
  uuid: string;
  name: string;
  email: string;
}

interface Token {
  token: string;
  tokenExpires: number;
  refreshToken: string;
  refreshTokenExpires: number;
}

interface ErrorResponse {
  status: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

interface AvailableTimeSlotsResponse {
  status: boolean;
  message: string;
  data: {
    allAvailableSlots: number[];
    staffCombinations: Array<{
      staffIds: number[];
      staffDetails: [
        {
          staffId: number;
          staffName: string;
          staffAvatar: string | null;
          serviceId: number;
        }
      ];
      availableSlots: number[];
    }>;
  };
}

interface BookingResponse {
  status: boolean;
  url: string;
}

interface NotificationSettingsResponse {
  status: boolean;
  message: string;
  data: {
    cancellation_policy: number;
    email_confirmation: boolean;
    appointment_reminders: boolean;
    reminder_time: number;
    cancellation_notices: boolean;
    no_show_notifications: boolean;
    follow_up_emails: boolean;
    follow_up_delay: number;
  };
}

interface TemplateDataResponse {
  success: boolean;
  message: string;
  data: {
    template: {
      id: number;
      ServiceProviderId: number;
      about_us: string;
      image_urls: string[];
      createdAt: string;
      updatedAt: string;
    };
  };
}

interface BookingData {
  id: number;
  event_date: string;
  event_duration: number;
  amount_paid: number;
  amount_due: number;
  status: string;
  payment_status: string;
  services: { id: number | string; name: string }[];
}

interface FetchBookingByIdResponse {
  status: boolean;
  serviceProviderTimezone: string;
  data: BookingData;
}

type generatePolicyType =
  | "no show"
  | "cancellation"
  | "rescheduling"
  | "refund"
  | "deposit";

interface PolicyData {
  type: generatePolicyType;
  policy: string;
}

interface FetchBookingPolicyResponse {
  status: boolean;
  policies: PolicyData[];
  minNotice: number;
  maxNotice: number;
  utcOffset: number;
}

interface CancellationSettings {
  allowed: boolean;
  noticeHours: number;
  feePercent: number;
}

interface ReschedulingOptions extends CancellationSettings {
  penaltyEnabled: boolean;
  minNotice: number;
  maxNotice: number;
  utcOffset: number;
}

interface FetchCancellationPolicyResponse {
  status: boolean;
  cancellation: CancellationSettings;
}

interface FetchReschedulingPolicyResponse {
  status: boolean;
  rescheduleOptions: ReschedulingOptions;
}

interface ServiceFrontend {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  availableDays: string[];
}

interface ServiceCategory {
  id: number;
  name: string;
  services: ServiceFrontend[];
}

interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
  color: string;
  hoverColor: string;
}

interface CarouselImage {
  src: string;
  alt: string;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  service?: string;
}

interface IProgramCapacityInfo {
  type: "per_class" | "program_level";
  total_capacity: number | null;
  program_capacity: number | null;
}

interface IProgramDataResponse extends IProgram {
  ServiceProvider: {
    id: number;
    name: string;
    logo: string | null;
  };
  capacity_info: IProgramCapacityInfo;
  available_seats: number | null;
  upcoming_classes: (IProgramClass & {
    capacity_info: {
      type: "per_class" | "program_level";
    };
    available_seats: number | null;
  })[];
  classes_count: number;
}

interface BusinessDataResponse {
  programs: IProgramDataResponse[];
  cancellationAllowed: boolean;
  absorbServiceCharge: boolean;
  currencySymbol: string;
  bUrl: string;
  logo: string;
  name: string;
  email: string;
  aboutUs: string;
  state?: string;
  zip: string;
  address?: string;
  city?: string;
  serviceCategories: ServiceCategory[];
  businessHours: { day: string; hours: string }[];
  phone: string;
  latitude?: number;
  longitude?: number;
  staffs: MemberUser[];
  reviews: Review[];
  bookingPolicy: PolicyData[];
  customPolicies: CustomPolicy[];
  allowDeposits: boolean;
  depositAmount: number;
  images: CarouselImage[];
  socialMedia: SocialMedia[];
  utcOffset: number;
  maxNotice: number;
  minNotice: number;
}

interface BookingWizardServiceData {
  cancellationAllowed: boolean;
  absorbServiceCharge: boolean;
  currencySymbol: string;
  bUrl: string;
  logo: string;
  name: string;
  email: string;
  serviceCategories: ServiceCategory[];
  bookingPolicy: PolicyData[];
  customPolicies: CustomPolicy[];
  allowDeposits: boolean;
  depositAmount: number;
  utcOffset: number;
  maxNotice: number;
  minNotice: number;
}

interface ServicesTabPropsInterface {
  name: string;
  logo: string;
  businessUrl: string;
  serviceCategories: ServiceCategory[];
  gotoNextTab: () => void;
}

type ConfirmationStatus = "success" | "failed" | "expired" | "pending";

interface ProgramRegistrationResultData {
  program: {
    id: number;
    name: string;
    absorb_service_charge: boolean;
  };
  programClasses: {
    id: number;
    name: string;
    price: number;
    start_date: string;
    end_date: string;
    allow_deposits: boolean;
    deposit_amount: number;
  }[];
  total_discount: number;
  serviceProvider: {
    id: number;
    name: string;
    email: string;
    logo: string | null;
    location: string;
  };
  status: ConfirmationStatus;
}

interface ProgramRegisterationResponse {
  status: boolean;
  data: ProgramRegistrationResultData;
}

interface BookingConfirmationResponse {
  status: ConfirmationStatus;
  selectedServices?: {
    id: number;
    name: string;
    price: number;
    duration: number;
  }[];
  selectedDate?: string;
  selectedTime?: number;
  businessLocation?: string;
  businessUtcOffset?: number;
  url: string;
}

interface ConfirmationPageData {
  status: boolean;
  type: "program" | "booking";
  data: ProgramRegistrationResultData | BookingConfirmationResponse;
}

interface IExtendedProgram extends IProgram {
  availableSeats: number;
  ServiceProvider: {
    id: number;
    name: string;
    logo: string | null;
  };
}

interface ProgramsWizardResponse {
  success: boolean;
  message: string;
  program: IProgramDataResponse;
  error?: any;
}

// New Program Types for the updated backend structure
interface INewProgram {
  id: number;
  name: string;
  about: string;
  start_date: string;
  end_date: string;
  capacity: number | null;
  set_capacity_per_class: boolean;
  banner_image_url: string | null;
  is_active: boolean;
  is_published: boolean;
  set_deposit_instructions_per_class: boolean;
  allow_deposits: boolean;
  deposit_amount: number | null;
  absorb_service_charge: boolean;
  allow_refunds: boolean;
  refund_deadline_in_hours: number | null;
  refund_percentage: number | null;
  ServiceProviderId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  classes?: IProgramClass[];
  class_count?: number;
  enrolled_students_count?: number;
  capacity_info?: {
    type: "per_class" | "program_level";
    total_capacity: number | null;
    program_capacity: number | null;
  };
  available_seats?: number | null;
  ServiceProvider?: {
    id: number;
    name: string;
    logo: string | null;
  };
  availableSeats?: number | null;
}

interface IProgramClass {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  capacity: number | null;
  is_active: boolean;
  is_published: boolean;
  start_booking_immediately: boolean;
  start_booking_date?: string;
  end_booking_when_class_ends: boolean;
  end_booking_date?: string;
  offer_early_bird: boolean;
  early_bird_discount_type: "percentage" | "fixed_amount" | null;
  early_bird_discount_value: number | null;
  early_bird_deadline?: string;
  allow_deposits: boolean;
  deposit_amount: number | null;
  ProgramId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  enrollmentCount?: number;
  revenue?: number;
  availableSeatsInRedis?: number | null;
  students?: IProgramStudent[];
}

interface IProgramStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  Enrollments: Array<{
    id: number;
    payment_status: string;
    amount_paid: number;
    amount_due: number;
    is_active: boolean;
    is_approved: boolean;
    notes: string | null;
    enrollment_date: string;
    completion_date: string | null;
    attended_class: boolean;
    ProgramClassId: number;
    ProgramStudentId: number;
    createdAt: string;
    updatedAt: string;
    ProgramClass: {
      id: number;
      name: string;
    };
  }>;
}

// API Response Interfaces
interface GetAllProgramsResponse {
  success: boolean;
  message: string;
  data: {
    programs: INewProgram[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

interface IProgramStat {
  totalClasses: number;
  totalEnrollments: number;
  uniqueStudents: number;
  totalRevenue: number;
  averageRevenuePerClass: number;
  averageEnrollmentsPerClass: number;
}

interface GetProgramByIdResponse {
  success: boolean;
  message: string;
  data: {
    program: INewProgram;
    classes: IProgramClass[];
    students: IProgramStudent[];
    stats: IProgramStat;
  };
}

interface GetProgramClassByIdResponse {
  success: boolean;
  message: string;
  data: {
    programClass: IProgramClass;
    program: {
      id: number;
      name: string;
      set_capacity_per_class: boolean;
    };
    students: IProgramStudent[];
    stats: {
      activeEnrollments: number;
      totalEnrollments: number;
      totalRevenue: number;
      pendingRevenue: number;
      totalPotentialRevenue: number;
      capacity: number | null;
      availableSeats: number | null;
      occupancyRate: number | null;
      averageRevenuePerStudent: number;
      enrollmentsByStatus: Array<{
        payment_status: string;
        count: number;
        total_paid: number;
        total_due: number;
      }>;
    };
  };
}

interface CreateProgramResponse {
  success: boolean;
  message: string;
  data: {
    program: INewProgram;
  };
}

interface CreateProgramClassResponse {
  success: boolean;
  message: string;
  data: {
    class: IProgramClass;
  };
}

interface UpdateProgramResponse {
  success: boolean;
  message: string;
  data: {
    program: INewProgram;
  };
}

interface UpdateProgramClassResponse {
  success: boolean;
  message: string;
  data: {
    programClass: IProgramClass;
  };
}

interface DeleteProgramResponse {
  success: boolean;
  message: string;
  data: {
    deletedProgram: {
      id: number;
      name: string;
    };
  };
}

interface DeleteProgramClassResponse {
  success: boolean;
  message: string;
  data: {
    deletedClass: {
      id: number;
      name: string;
      programId: number;
    };
  };
}

// Dashboard Types for Admin/Owner
interface KeyMetricsData {
  period: "week" | "month";
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalBookings: number;
  activeClients: number;
  staffWithBookings: number;
  utilization: number;
  timezone: string;
}

interface KeyMetricsResponse {
  success: boolean;
  message: string;
  data: KeyMetricsData;
}

interface TodayOverviewStaffBreakdown {
  staffId: number;
  staffName: string;
  staffEmail: string;
  staffAvatar: string | null;
  role: string;
  firstAppointmentTime: string;
  appointmentsCount: number;
  statusBreakdown: {
    confirmed: number;
    pending: number;
    cancelled: number;
  };
}

interface TodayOverviewUpcomingBooking {
  id: number;
  bookingId: number;
  bookingUuid: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
  service: {
    id: number;
    name: string;
  };
  staff: {
    id: number;
    name: string;
    email: string;
  };
  bookingStatus: string;
  paymentStatus: string;
}

interface TodayOverviewData {
  date: string;
  timezone: string;
  summary: {
    totalAppointments: number;
    confirmed: number;
    pending: number;
    cancelled: number;
  };
  staffBreakdown: TodayOverviewStaffBreakdown[];
  upcomingBookings: TodayOverviewUpcomingBooking[];
}

interface TodayOverviewResponse {
  success: boolean;
  message: string;
  data: TodayOverviewData;
}

// Dashboard Types for Staff
interface StaffDashboardOverviewData {
  appointmentsToday: number;
  appointmentsThisWeek: number;
  todayOccupancy: number;
  newCustomers: number;
  date: string;
  timezone: string;
}

interface StaffDashboardOverviewResponse {
  success: boolean;
  message: string;
  data: StaffDashboardOverviewData;
}

interface StaffBookingItem {
  id: number;
  bookingId: number;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  Booking: {
    id: number;
    uuid: string;
    status: string;
    paymentStatus: string;
    amountPaid: number;
    amountDue: number;
    Customer: {
      id: number;
      name: string;
      email: string;
      phone: string;
    };
  };
  Service: {
    id: number;
    title: string;
    description: string | null;
    category: string;
    duration: number;
    price: number;
  };
}

interface StaffBookingsByDateData {
  date: string;
  timezone: string;
  bookings: StaffBookingItem[];
  sunday_enabled?: boolean;
  sunday_opening?: number | null;
  sunday_closing?: number | null;
  monday_enabled?: boolean;
  monday_opening?: number | null;
  monday_closing?: number | null;
  tuesday_enabled?: boolean;
  tuesday_opening?: number | null;
  tuesday_closing?: number | null;
  wednesday_enabled?: boolean;
  wednesday_opening?: number | null;
  wednesday_closing?: number | null;
  thursday_enabled?: boolean;
  thursday_opening?: number | null;
  thursday_closing?: number | null;
  friday_enabled?: boolean;
  friday_opening?: number | null;
  friday_closing?: number | null;
  saturday_enabled?: boolean;
  saturday_opening?: number | null;
  saturday_closing?: number | null;
  pagination?: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
  total?: number;
}

interface StaffBookingsByDateResponse {
  success: boolean;
  message: string;
  data: StaffBookingsByDateData;
}

// Members Types
interface MemberUser {
  id: number;
  full_name: string;
  email: string;
  is_email_verified: boolean;
  avatar: string | null;
}

interface Member {
  id: number;
  UserId: number;
  ServiceProviderId: number;
  role: "owner" | "admin" | "staff";
  status: "pending" | "accepted" | "rejected";
  invitedBy: number | null;
  invitedAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  User: MemberUser;
  Inviter: {
    id: number;
    full_name: string;
    email: string;
  } | null;
}

interface MembersResponse {
  success: boolean;
  message: string;
  data: {
    members: Member[];
  };
}

// Bookings List Types (for upcoming/past appointments)
interface BookingListItem {
  id: number;
  start_time: string;
  end_time: string;
  duration: number;
  status: string;
  Booking: {
    id: number;
    uuid: string;
    status: string;
    payment_status: string;
    amount_paid: number;
    amount_due: number;
    dns: boolean;
    Customer: {
      id: number;
      name: string;
      email: string;
      phone: string;
    };
  };
  Service: {
    id: number;
    name: string;
    description: string | null;
  };
}

interface BookingsListData {
  bookings: BookingListItem[];
  pagination: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

interface BookingsListResponse {
  success: boolean;
  message: string;
  data: BookingsListData;
}
