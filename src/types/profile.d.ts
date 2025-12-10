// Staff Member Details Types
interface WorkSchedule {
  id: number;
  day?:
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";
  day_of_week: number;
  enabled: boolean;
  opening_time: number | null;
  closing_time: number | null;
}

interface StaffBreak {
  id: number;
  day_of_week: number;
  start: number;
  end: number;
}

interface TimeOff {
  id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
}

interface OverrideHours {
  id: number;
  date: string;
  opening_time: number | null;
  closing_time: number | null;
}

interface MemberUser {
  id: number;
  full_name: string;
  phone: string | null;
  email: string;
  is_email_verified: boolean;
  avatar: string | null;
}

interface StaffMemberDetails {
  member: {
    id: number;
    uuid: string;
    role: "owner" | "admin" | "staff";
    status: "pending" | "accepted" | "declined" | null;
    dateJoined: string;
    user: MemberUser;
  };
  workingHours: (WorkSchedule & {
    breaks: StaffBreak[];
  })[];
  upcomingTimeOffs: TimeOff[];
  upcomingOverrideHours: OverrideHours[];
}

interface StaffMemberDetailsResponse {
  success: boolean;
  message: string;
  data: StaffMemberDetails;
}
