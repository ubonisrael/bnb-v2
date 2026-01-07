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
}

interface CalendarHeaderProps {
  date: Date;
  setDate: (date: Date) => void;
}

interface DayViewProps {
  data: BookingDataResponse;
  date: Date;
  timeSlots: string[];
  filteredBookings: BookingsResponse[];
  setAppointment: Dispatch<SetStateAction<AppointmentProps | null>>;
  settings: UserSettings | null;
}

interface AppointmentProps {
  data: BookingsResponse;
  type: "cancel" | "reschedule" | "dns";
}

type AppointmentDialogProps = {
  appointment: BookingListItem;
  date: string;
  setAppointment: Dispatch<SetStateAction<AppointmentProps | null>>;
  tz: string;
};