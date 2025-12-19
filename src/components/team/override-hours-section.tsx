"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2, Plus, Edit2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const timeToMinutes = (timeString: string): number | null => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

export function OverrideHoursSection({
  memberId,
  overrideHours,
}: OverrideHoursSectionProps) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOverride, setEditingOverride] = useState<OverrideHours | null>(null);
  const [formData, setFormData] = useState({
    date: "",
    opening_time: "",
    closing_time: "",
    is_closed: false,
  });

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

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post(
        `members/${memberId}/override-hours`,
        { overrides: [data]}
      );
      return response;
    },
    onMutate: () => {
      toast.loading("Creating override...", { id: "create-override" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Override created successfully", {
        id: "create-override",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create override", {
        id: "create-override",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ overrideId, data }: { overrideId: number; data: any }) => {
      const response = await api.put(
        `members/${memberId}/override-hours/${overrideId}`,
        { overrides: [data]}
      );
      return response;
    },
    onMutate: () => {
      toast.loading("Updating override...", { id: "update-override" });
    },
    onSuccess: (data: any) => {
      toast.success(data.message || "Override updated successfully", {
        id: "update-override",
      });
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
      setIsDialogOpen(false);
      resetForm();
      setEditingOverride(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update override", {
        id: "update-override",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      date: "",
      opening_time: "",
      closing_time: "",
      is_closed: false,
    });
  };

  const handleOpenDialog = (override?: OverrideHours) => {
    if (override) {
      setEditingOverride(override);
      setFormData({
        date: override.date,
        opening_time: override.opening_time !== null ? minutesToTime(override.opening_time) : "",
        closing_time: override.closing_time !== null ? minutesToTime(override.closing_time) : "",
        is_closed: override.opening_time === null && override.closing_time === null,
      });
    } else {
      setEditingOverride(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      date: formData.date,
      opening_time: formData.is_closed ? null : timeToMinutes(formData.opening_time),
      closing_time: formData.is_closed ? null : timeToMinutes(formData.closing_time),
    };

    if (editingOverride) {
      updateMutation.mutate({ overrideId: editingOverride.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Override Hours</CardTitle>
          <Button
            onClick={() => handleOpenDialog()}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Override
          </Button>
        </div>
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
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(override)}
                    disabled={updateMutation.isPending}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
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
              </div>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingOverride ? "Edit Override Hours" : "Add Override Hours"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_closed"
                  checked={formData.is_closed}
                  onChange={(e) =>
                    setFormData({ ...formData, is_closed: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="is_closed" className="text-sm font-normal">
                  Mark as closed
                </Label>
              </div>

              {!formData.is_closed && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="opening_time">Opening Time</Label>
                    <Input
                      id="opening_time"
                      type="time"
                      value={formData.opening_time}
                      onChange={(e) =>
                        setFormData({ ...formData, opening_time: e.target.value })
                      }
                      required={!formData.is_closed}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closing_time">Closing Time</Label>
                    <Input
                      id="closing_time"
                      type="time"
                      value={formData.closing_time}
                      onChange={(e) =>
                        setFormData({ ...formData, closing_time: e.target.value })
                      }
                      required={!formData.is_closed}
                    />
                  </div>
                </>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                    setEditingOverride(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingOverride ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
