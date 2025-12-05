"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import api from "@/services/api-service";
import { days } from "@/lib/helpers";

interface BreaksSectionProps {
  memberId: number;
  breaks: StaffBreak[];
}

const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};

export function BreaksSection({ memberId, breaks }: BreaksSectionProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (breakId: number) => {
      const response = await api.delete(`members/${memberId}/breaks/${breakId}`);
      return response;
    },
    onMutate: () => {
      toast.loading("Deleting break...", { id: "delete-break" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Break deleted successfully", {
        id: "delete-break",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete break", {
        id: "delete-break",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Breaks</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {breaks.length === 0 ? (
          <div className="text-center py-8 text-[#6E6E73]">
            No breaks configured
          </div>
        ) : (
          <div className="space-y-2">
            {breaks.map((breakItem) => (
              <div
                key={breakItem.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <span className="font-medium">
                    {days[breakItem.day_of_week]}
                  </span>
                  <span className="text-[#6E6E73] ml-2">
                    {minutesToTime(breakItem.start)} - {minutesToTime(breakItem.end)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(breakItem.id)}
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
