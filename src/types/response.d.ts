import { Service } from "@/types/onboarding";
import { boolean } from "zod";

export interface VoidResponse {
  status: boolean;
  message: string;
}

export interface AnalyticsResponse {
  [key: string]: any;
}

export interface PeriodicStatsResponse {
  status: boolean;
  data: { name: string; bookings: number; revenue: number; clients: number }[];
}

export interface AnalyticsServiceDataResponse {
  status: boolean;
  data: { serviceId: number; name: string; value: number }[];
}

export interface Summary {
  total_bookings: number;
  total_earnings: number;
  total_unique_customers: number;
  total_upcoming_bookings: number;
}

export interface AnalyticsData {
  summary: Summary;
  ageCategory: any[];
  gender: any[];
  topCustomers: any[];
}

export interface SettingsResponse {
  status: boolean;
  message: string;
  data: SettingsData;
}

export interface SettingsData {
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

export interface BusinessData {
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

export interface BusinessSocialData {
  website_url: null;
  facebook_url: null;
  linkedin_url: null;
  twitter_url: null;
  instagram_url: null;
  tiktok_url: null;
  youtube_url: null;
}

export interface BusinessProfileData {
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

export interface BusinessProfileResponse {
  status: boolean;
  message: string;
  data: BusinessProfileData;
}

export interface BusinessSocialResponse {
  status: boolean;
  message: string;
  data: BusinessSocialData;
}

interface BookingsResponse extends Service {
  Customer: {
    name: string;
    email: string;
  };
  service_ids: string[];
  event_date: string;
  event_time: string;
  event_duration: number;
  dns: boolean;
  id: number;
  amount_paid: number;
}

export interface BookingDataResponse {
  status: boolean;
  message: string;
  timeSlotDuration: number;
  dayEnabled: string;
  closingTime: number;
  openingTime: number;
  timezone: string;
  bookings: BookingsResponse[];
}

export interface BusinessSettingsResponse {
  status: boolean;
  message: string;
  data: SettingsData;
}

export interface SignupResponse {
  status: boolean;
  message: string;
  token: string;
}

export interface UserResponse {
  status: boolean;
  message: string;
  data: UserData;
}

export interface UserData {
  uuid: string;
  name: string;
  email: string;
  has_google: boolean;
  has_password: boolean;
}

export interface SignoutResponse {
  status: boolean;
  message: string;
}

export interface AuthResponse {
  status: boolean;
  message: string;
  data: Data;
  csrfToken: string;
  onBoardingCompleted: boolean;
}

export interface ResendVerificationResponse {
  status: boolean;
  message: string;
}

export interface Data {
  uuid: string;
  name: string;
  email: string;
}

export interface Token {
  token: string;
  tokenExpires: number;
  refreshToken: string;
  refreshTokenExpires: number;
}

export interface ErrorResponse {
  status: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

export interface AvailableTimeSlotsResponse {
  status: boolean;
  message: string;
  timeSlots: number[];
}

export interface BookingResponse {
  status: boolean;
  url: string;
}

export interface NotificationSettingsResponse {
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

export interface TemplateDataResponse {
  status: boolean;
  message: string;
  data: {
    templateType: string;
    bannerHeader: string;
    bannerMessage: string;
    aboutSubHeader: string;
    description: string;
    bannerUrl: string;
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

export interface ServiceFrontend {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  availableDays: string[];
}

export interface ServiceCategory {
  id: number;
  name: string;
  services: ServiceFrontend[];
}

export interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
  color: string;
  hoverColor: string;
}

export interface CarouselImage {
  src: string;
  alt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  service?: string;
}

interface BusinessDataResponse {
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

export interface ServicesTabPropsInterface {
  name: string;
  logo: string;
  serviceCategories: ServiceCategory[];
  gotoNextTab: () => void;
  gotoPrevTab: () => void;
}

interface ConfirmationPageData {
  status: "success" | "failed" | "expired" | "pending";
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
