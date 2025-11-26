interface StaffMemberDetailsResponse {
  success: boolean;
  message: string;
  data: {
    member: {
      id: number;
      uuid: string;
      role: "owner" | "admin" | "staff";
      status: "pending" | "accepted" | "declined" | null;
      dateJoined: string;
      user: {
        id: number;
        full_name: string | null;
        phone: string | null;
        email: string | null;
        is_email_verified: boolean;
        avatar: string | null;
      } | null;
    };
    workingHours: Array<{
      day:
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
      breaks: Array<{
        id: number;
        start: number;
        end: number;
      }>;
    }>;
    upcomingTimeOffs: Array<{
      id: number;
      start_date: string;
      end_date: string;
      reason: string | null;
    }>;
    upcomingOverrideHours: Array<{
      id: number;
      date: string;
      opening_time: number | null;
      closing_time: number | null;
    }>;
  };
}