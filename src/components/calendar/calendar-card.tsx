import { Dispatch, SetStateAction } from "react";
import { BookingsResponse } from "@/types/response";
import dayjs from "@/utils/dayjsConfig";
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
import { ClipboardList, Mail, MoreHorizontal, Phone } from "lucide-react";
import { useUserSettings } from "@/contexts/UserSettingsContext";

export default function CalendarCard({
  appointment,
  setAppointment,
  timeSlots,
  timezone,
  view,
}: {
  appointment: BookingsResponse;
  setAppointment: Dispatch<SetStateAction<AppointmentProps | null>>;
  timeSlots: string[];
  timezone: string;
  view: "day" | "week";
}) {
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
            <p className="flex items-center gap-2">
              <Mail size={16} />{" "}
              <span className="inline-block text-ellipsis overflow-hidden">
                {appointment.Customer?.email}
              </span>
            </p>
          </div>
          <div className="text-sm text-[#121212]">
            <p className="flex items-center gap-2">
              <Phone size={16} />{" "}
              <span className="inline-block">
                {appointment.Customer?.phone || "N/A"}
              </span>
            </p>
          </div>
          {appointment.dns && (
            <Badge className="w-12 bg-red-400 text-white">DNS</Badge>
          )}
        </div>
        {view === "day" && (
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
                onClick={() =>
                  setAppointment({ data: appointment, type: "cancel" })
                }
              >
                Cancel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={appointment.dns}
                onClick={() =>
                  setAppointment({ data: appointment, type: "reschedule" })
                }
              >
                Reschedule
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={appointment.dns}
                onClick={() =>
                  setAppointment({ data: appointment, type: "dns" })
                }
              >
                Mark as DNS
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="mt-1 md:mt-2 text-sm text-[#121212]">
        <p className="flex items-center gap-2">
          <ClipboardList size={16} />{" "}
          <span className="inline-block">
            {appointment.service_ids
              .map((s: string) => {
                const service = settings?.services.find(
                  (service: Service) => Number(service.id) === Number(s)
                );
                return service?.name;
              })
              .join(", ")}
          </span>
        </p>
      </div>
      <div className="text-xs text-[#6E6E73]">
        {startTime} - {endTime}
      </div>
    </div>
  );
}
