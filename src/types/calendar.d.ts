interface FilterProps {
  category: ServiceCategory[];
  service: Service[];
}

interface CalendarControlsProps {
  date: Date;
  setDate: (date: Date) => void;
  filters: FilterType;
  setFilters: (filters: FilterType) => void;
  settings: UserSettings | null;
  view: "day" | "week";
}

interface CalendarHeaderProps {
  date: Date;
  view: "day" | "week";
  setDate: (date: Date) => void;
  setView: (view: "day" | "week") => void;
}

interface DayViewProps {
  data: BookingDataResponse;
  date: Date;
  timeSlots: string[];
  filteredBookings: BookingsResponse[];
  setAppointment: (appointment: BookingsResponse) => void;
  settings: UserSettings | null;
}

interface WeekViewProps {
  timeSlots: string[];
  weekDays: Date[];
  data: BookingDataResponse[];
  filteredBookings: BookingsResponse[][];
  settings: UserSettings | null;
  setAppointment: (appointment: BookingsResponse) => void;
}
