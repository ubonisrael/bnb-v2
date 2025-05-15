import { Service } from "@/components/onboarding/type";
import { boolean } from "zod";

export interface VoidResponse {
  status: boolean;
  message: string;
}

export interface AnalyticsResponse {
  [key: string]: any;
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

export interface BookingsResponse extends Service {
  Customer: {
    name: string;
    email: string;
  };
  service_ids: string[];
  event_date: string;
  event_time: string;
  event_duration: number;
}

export interface BookingDataResponse {
  status: boolean;
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

export interface LandingTemplate {
    type: string;
    name: string;
    bannerHeader: string;
    bannerMessage: string;
    aboutSubHeader: string;
    bUrl: string;
    banner: string;
    logo: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    minNotice: number;
    maxNotice: number;
    description: string;
    hours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
    };
    categories: {
      id: string;
      name: string;
    }[];
    services: {
      id: string;
      CategoryId: string;
      categoryId: string;
      name: string;
      description: string;
      price: number;
      duration: number;
      availableDays: string[];
    }[];
    utcOffset: number;
    latitude?: number;
    longitude?: number;
  }

export interface TemplateResponse {
  status: boolean;
  data: LandingTemplate;
}

export interface AvailableTimeSlotsResponse {
  status: boolean;
  message: string;
  timeSlots: number[];
}

export interface BookingResponse {
  status: boolean;
  message: string;
}
