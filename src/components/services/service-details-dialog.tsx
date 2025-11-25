"use client";

import { Edit, Trash2, Clock, PoundSterling, Calendar, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ServiceStaffMember {
  id: number;
  role: "owner" | "admin" | "staff";
  status: "pending" | "accepted" | "declined";
  user: {
    id: number;
    full_name: string;
    email: string;
  } | null;
}

interface ServiceDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceWithStaff | null;
  category: string;
  onEdit: () => void;
  onDelete: () => void;
}

const getDurationLabel = (duration: number) => {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvailableDays = (service: ServiceWithStaff) => {
  const days = [
    { key: "monday_enabled", label: "Mon" },
    { key: "tuesday_enabled", label: "Tue" },
    { key: "wednesday_enabled", label: "Wed" },
    { key: "thursday_enabled", label: "Thu" },
    { key: "friday_enabled", label: "Fri" },
    { key: "saturday_enabled", label: "Sat" },
    { key: "sunday_enabled", label: "Sun" },
  ];

  return days.filter((day) => service[day.key as keyof ServiceWithStaff]).map((d) => d.label);
};

export function ServiceDetailsDialog({
  open,
  onOpenChange,
  service,
  category,
  onEdit,
  onDelete,
}: ServiceDetailsDialogProps) {
  if (!service) return null;

  const availableDays = getAvailableDays(service);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{service.name}</DialogTitle>
          <DialogDescription>Service details and information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Category Badge */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {category}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Description</h4>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>

          <Separator />

          {/* Price and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <PoundSterling className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Price</p>
                <p className="text-lg font-semibold">£{service.fullPrice.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-lg font-semibold">{getDurationLabel(service.duration)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Available Days */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Available Days</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableDays.map((day) => (
                <Badge key={day} variant="outline" className="text-xs">
                  {day}
                </Badge>
              ))}
              {availableDays.length === 0 && (
                <p className="text-sm text-muted-foreground">No days selected</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Assigned Staff */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">Assigned Staff</h4>
              <Badge variant="secondary" className="text-xs">
                {service.staff?.length || 0}
              </Badge>
            </div>
            {service.staff && service.staff.length > 0 ? (
              <div className="space-y-2">
                {service.staff.map((staffMember) => (
                  <div
                    key={staffMember.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {staffMember.user
                          ? getInitials(staffMember.user.full_name)
                          : "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {staffMember.user?.full_name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {staffMember.user?.email || "No email"}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {staffMember.role}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No staff assigned</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onDelete();
                onOpenChange(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button
              type="button"
              onClick={() => {
                onEdit();
                onOpenChange(false);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
