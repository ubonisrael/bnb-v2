"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/services/api-service";

interface OverrideHours {
  id: number;
  date: string;
  opening_time: number | null;
  closing_time: number | null;
}

interface OverrideHoursSectionProps {
  memberId: number;
  overrideHours: OverrideHours[];
}

const minutesToTime = (minutes: number | null): string => {
  if (minutes === null) return "Closed";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

export function OverrideHoursSection({
  memberId,
  overrideHours,
}: OverrideHoursSectionProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (overrideId: number) => {
      const response = await api.delete(
        `members/${memberId}/override-hours/${overrideId}`
      );
      return response;
    },
    onMutate: () => {
      toast.loading("Deleting override...", { id: "delete-override" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Override deleted successfully", {
        id: "delete-override",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete override", {
        id: "delete-override",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Override Hours</CardTitle>
      </CardHeader>
      <CardContent>
        {overrideHours.length === 0 ? (
          <div className="text-center py-8 text-[#6E6E73]">
            No override hours configured
          </div>
        ) : (
          <div className="space-y-2">
            {overrideHours.map((override) => (
              <div
                key={override.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">
                    {new Date(override.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="text-sm text-[#6E6E73]">
                    {minutesToTime(override.opening_time)} -{" "}
                    {minutesToTime(override.closing_time)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(override.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
