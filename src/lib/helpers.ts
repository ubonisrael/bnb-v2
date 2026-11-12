import {
  endOfMonth,
  endOfQuarter,
  endOfWeek,
  format,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
} from "date-fns";

export const COLORS = [
  "#7B68EE",
  "#5AC8FA",
  "#4CD964",
  "#FFCC00",
  "#FF6B6B",
  "#E0E0E5",
];

export const days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export const defaultServiceValues = {
  name: "",
  CategoryId: 0,
  fullPrice: 0,
  duration: 60,
  description: "",
  monday_enabled: true,
  tuesday_enabled: true,
  wednesday_enabled: true,
  thursday_enabled: true,
  friday_enabled: true,
  saturday_enabled: true,
  sunday_enabled: true,
  staff_ids: [] as number[],
};

export const daysStatus = days.map((d) => `${d}_enabled`);
export type daysStatusType = (typeof daysStatus)[number];

export const onboardingSteps = [
  { id: "business-info", title: "Business Information" },
  { id: "services-setup", title: "Services" },
  { id: "booking-settings", title: "Booking Settings" },
  { id: "notification-settings", title: "Notifications" },
];

export const serviceDaysEnabled = (service: Service) => {
  return days.filter((day) => service[`${day}_enabled`]);
};

export const getStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-50 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getPaymentBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "pending":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "partial":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const getDurationLabel = (duration: number) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours === 0) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  if (minutes === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
  return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes === 1 ? "" : "s"}`;
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export const getAvailableDays = (service: any) => {
  if (!service) return [];
  const days = [
    { key: "monday_enabled", label: "Mon" },
    { key: "tuesday_enabled", label: "Tue" },
    { key: "wednesday_enabled", label: "Wed" },
    { key: "thursday_enabled", label: "Thu" },
    { key: "friday_enabled", label: "Fri" },
    { key: "saturday_enabled", label: "Sat" },
    { key: "sunday_enabled", label: "Sun" },
  ];
  return days
    .filter((day) => service[day.key as keyof typeof service])
    .map((d) => d.label);
};

export const formatTime = (minutes: number | null) => {
  if (minutes === null) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
};

export const getRoleBadgeVariant = (
  role: string
): "default" | "secondary" | "outline" => {
  switch (role) {
    case "owner":
      return "default";
    case "admin":
      return "secondary";
    default:
      return "outline";
  }
};

// Get the date range string
export const getDateRangeString = (
  date: Date,
  dateRange: "week" | "month" | "quarter"
) => {
  switch (dateRange) {
    case "week":
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      return `${format(weekStart, "MMM d, yyyy")} - ${format(
        weekEnd,
        "MMM d, yyyy"
      )}`;
    case "month":
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      return `${format(monthStart, "MMM d, yyyy")} - ${format(
        monthEnd,
        "MMM d, yyyy"
      )}`;
    case "quarter":
      const quarterStart = startOfQuarter(date);
      const quarterEnd = endOfQuarter(date);
      return `${format(quarterStart, "MMM d, yyyy")} - ${format(
        quarterEnd,
        "MMM d, yyyy"
      )}`;
    default:
      return "";
  }
};
