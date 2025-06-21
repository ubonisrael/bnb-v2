interface OffDay {
  id: string;
  start_date?: string; // for single dates
  dates?: string[]; // for multiple dates
  end_date?: string;  // for ranges
  reason?: string;
  is_recurring?: boolean;
  mode: "single" | "multiple" | "range";
}

interface BreakTime {
  id: string;
  day_of_week: string; // monday, tuesday, etc.
  start_time: number; // in minutes from midnight
  end_time: number; // in minutes from midnight
  name?: string; // e.g., "Lunch Break", "Coffee Break"
}

interface CustomPolicy {
  id: string;
  title: string;
  policies: string[];
}
