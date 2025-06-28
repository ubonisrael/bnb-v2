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
  setAppointment: Dispatch<SetStateAction<AppointmentProps | null>>;
  settings: UserSettings | null;
}

interface WeekViewProps {
  timeSlots: string[];
  weekDays: Date[];
  data: BookingDataResponse[];
  filteredBookings: BookingsResponse[][];
  settings: UserSettings | null;
  setAppointment: Dispatch<SetStateAction<AppointmentProps | null>>;
}

interface AppointmentProps {
  data: BookingsResponse;
  type: "cancel" | "reschedule" | "dns";
}

type AppointmentDialogProps = {
  appointment: BookingsResponse;
  date: string;
  setAppointment: Dispatch<SetStateAction<AppointmentProps | null>>;
  settings: UserSettings | null;
  tz: string;
};