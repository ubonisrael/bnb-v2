"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/services/api-service";

interface TimeOff {
  id: number;
  start_date: string;
  end_date: string;
  reason: string | null;
}

interface TimeOffSectionProps {
  memberId: number;
  timeOffs: TimeOff[];
}

export function TimeOffSection({ memberId, timeOffs }: TimeOffSectionProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (timeOffId: number) => {
      const response = await api.delete(`members/${memberId}/time-off/${timeOffId}`);
      return response;
    },
    onMutate: () => {
      toast.loading("Deleting time off...", { id: "delete-timeoff" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Time off deleted successfully", {
        id: "delete-timeoff",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete time off", {
        id: "delete-timeoff",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Off Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {timeOffs.length === 0 ? (
          <div className="text-center py-8 text-[#6E6E73]">
            No time off requests
          </div>
        ) : (
          <div className="space-y-3">
            {timeOffs.map((timeOff) => (
              <div
                key={timeOff.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="font-medium text-[#121212]">
                    {new Date(timeOff.start_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(timeOff.end_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  {timeOff.reason && (
                    <p className="text-sm text-[#6E6E73]">{timeOff.reason}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(timeOff.id)}
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
