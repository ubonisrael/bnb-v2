type ServiceAnalyticsPeriod = "last7Days" | "last2Weeks" | "lastMonth" | "lastQuarter" | "lastYear" | "allTime"

interface CategoryData {
  id: number;
  name: string;
  serviceCount: number;
}

interface CategoryResponse {
  success: boolean;
  message: string;
  data: {
    category: CategoryData;
  };
}

interface PaginationData {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

interface CategoriesDataResponse {
  success: boolean;
  message: string;
  data: {
    categories: CategoryData[];
    pagination?: PaginationData;
    total?: number;
  };
}

/**
 * TypeScript schemas for Service controller response objects
 */

/**
 * User information within staff member
 */
/**
 * Staff member information
 */
interface ServiceStaffMember {
  id: number;
  role: "owner" | "admin" | "staff";
  status: "pending" | "accepted" | "declined";
  user: MemberUser | null;
}

interface Service {
  id: number;
  name: string;
  duration: number;
  description: string;
  fullPrice: number;
  CategoryId: number;
  monday_enabled: boolean;
  tuesday_enabled: boolean;
  wednesday_enabled: boolean;
  thursday_enabled: boolean;
  friday_enabled: boolean;
  saturday_enabled: boolean;
  sunday_enabled: boolean;
}

/**
 * Service with staff members
 */
interface ServiceWithStaff extends Service {
  staff: ServiceStaffMember[];
}

/**
 * Validation error object
 */
interface ValidationError {
  field: string;
  message: string;
}

// ==================== FETCH SERVICES ====================

/**
 * Schema for fetchServices response data
 */
interface FetchServicesDataSchema {
  services: ServiceWithStaff[];
  pagination?: PaginationData;
  total?: number;
}

/**
 * Success response for fetchServices
 */
interface FetchServicesSuccessResponse {
  success: true;
  data: FetchServicesDataSchema;
  message: string;
}

/**
 * Error response for fetchServices
 */
interface FetchServicesErrorResponse {
  success: false;
  message: string;
}

/**
 * Complete API response type for fetchServices
 */
type FetchServicesApiResponse =
  | FetchServicesSuccessResponse
  | FetchServicesErrorResponse;

// ==================== CREATE SERVICE ====================

/**
 * Schema for createService response data
 */
interface CreateServiceDataSchema {
  service: ServiceWithStaff;
}

/**
 * Success response for createService
 */
interface CreateServiceSuccessResponse {
  success: true;
  message: string;
  data: CreateServiceDataSchema;
}

/**
 * Error response for createService (with validation errors)
 */
interface CreateServiceErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}

/**
 * Complete API response type for createService
 */
type CreateServiceApiResponse =
  | CreateServiceSuccessResponse
  | CreateServiceErrorResponse;

// ==================== UPDATE SERVICE ====================

/**
 * Schema for updateService response data
 */
interface UpdateServiceDataSchema {
  service: ServiceWithStaff;
}

/**
 * Success response for updateService
 */
interface UpdateServiceSuccessResponse {
  success: true;
  message: string;
  data: UpdateServiceDataSchema;
}

/**
 * Error response for updateService (with validation errors)
 */
interface UpdateServiceErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}

/**
 * Complete API response type for updateService
 */
type UpdateServiceApiResponse =
  | UpdateServiceSuccessResponse
  | UpdateServiceErrorResponse;

interface ServiceDetailsAnalytics {
  bookings: {
    last7Days: { count: number; percentageChange: number };
    last2Weeks: { count: number; percentageChange: number };
    lastMonth: { count: number; percentageChange: number };
    lastQuarter: { count: number; percentageChange: number };
    lastYear: { count: number; percentageChange: number };
    allTime: { count: number };
  };
  totalRevenue: number;
  uniqueClients: number;
}

interface ServiceWithStaffAndCategory extends ServiceWithStaff {
  category: {
    id: number;
    name: string;
  } | null;
}
interface ServiceDetailsData {
  service: ServiceWithStaffAndCategory;
  analytics: ServiceDetailsAnalytics;
}
interface ServiceClient {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  bookingCount: number;
}

interface ServiceAppointment {
  id: number;
  start_time: string;
  end_time: string;
  duration: number;
  price: number;
  status: string;
  notes: string | null;
  staff: {
    id: number;
    role: string;
    status: string;
    user: {
      id: number;
      full_name: string;
      email: string;
      avatar: string | null;
    } | null;
  } | null;
  booking: {
    id: number;
    uuid: string;
    status: string;
    payment_status: string;
  };
  customer: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  } | null;
}

interface ServiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: number | null;
  onEdit: () => void;
  onDelete: () => void;
}
