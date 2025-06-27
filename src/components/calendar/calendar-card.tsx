import { BookingsResponse } from "@/types/response";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { cn } from "@/lib/utils";
import {
  getAppointmentColor,
  getTimeSlotIndex,
  heightOfCalendarRow,
} from "@/utils/calendar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useUserSettings } from "@/contexts/UserSettingsContext";

dayjs.extend(utc);
dayjs.extend(timezone);
export default function CalendarCard({
  appointment,
  setAppointment,
  timeSlots,
  timezone,
}: {
  appointment: BookingsResponse;
  setAppointment: (appointment: BookingsResponse) => void;
  timeSlots: string[];
  timezone: string;
}) {
    console.log(appointment)
  const { settings } = useUserSettings();
  const date = dayjs(appointment.event_date).tz(timezone || "UTC");
  const startTime = date.format("HH:mm");
  const endTime = date
    .add(appointment.event_duration, "minutes")
    .format("HH:mm");
  const startTimeIndex = getTimeSlotIndex(startTime, timeSlots);
  const duration = appointment.event_duration / 15;

  if (startTimeIndex === -1) return null;
  return (
    <div
      key={appointment.id}
      className={cn("absolute rounded-md p-3 shadow-sm", getAppointmentColor())}
      style={{
        top: `${startTimeIndex * heightOfCalendarRow}px`,
        height: `${heightOfCalendarRow * (duration + 1)}px`,
        left: "0",
        width: "100%",
        // transform: `translateY(${startTimeIndex * 48}px)`,
      }}
    >
      <div className="relative flex flex-col">
        <div className="flex flex-col gap-2">
          <div className="font-medium text-[#121212]">
            {appointment.Customer?.name}
          </div>
          <div className="text-sm text-[#121212]">
            {appointment.Customer?.email}
          </div>
          {appointment.dns && (
            <Badge className="w-12 bg-red-400 text-white">DNS</Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute top-0 right-0" asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-black/5"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={appointment.dns}
              onClick={() => setAppointment(appointment)}
            >
              Mark as DNS
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-1 md:mt-2 text-sm text-[#121212]">
        {appointment.service_ids
          .map((s: string) => {
            const service = settings?.services.find(
              (service: Service) => Number(service.id) === Number(s)
            );
            return service?.name;
          })
          .join(", ")}
      </div>
      <div className="text-xs text-[#6E6E73]">
        {startTime} - {endTime}
      </div>
    </div>
  );
}
