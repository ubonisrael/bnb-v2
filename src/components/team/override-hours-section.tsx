"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Trash2, Plus, Edit2, X } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  });
  const [multiMode, setMultiMode] = useState({
    startDate: "",
    endDate: "",
    selectedDays: [] as number[], // 0 = Sunday, 6 = Saturday
    opening_time: "",
    closing_time: "",
  });

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
        data
      );
      return response;
    },
    onMutate: () => {
      toast.loading("Creating override(s)...", { id: "create-override" });
    },
    onSuccess: (data: any) => {
      toast.dismiss("create-override");
      
      // Handle partial success with errors/warnings
      if (data.errors && data.errors.length > 0) {
        const errorCount = data.errors.length;
        
        // Show warning message
        if (data.warning) {
          toast.error(data.warning, {
            duration: 6000,
          });
        }
        
        // Show detailed error messages for each failed date
        data.errors.forEach((error: { date: string; message: string }, index: number) => {
          setTimeout(() => {
            toast.error(`${error.date}: ${error.message}`, {
              duration: 5000,
              id: `error-${error.date}`,
            });
          }, index * 100); // Stagger the error toasts slightly
        });
        
        // Still show success if some overrides were created
        if (data.message) {
          toast.success(data.message, {
            duration: 4000,
          });
        }
      } else {
        // Full success - no errors
        toast.success(data.message || "Override(s) created successfully", {
          id: "create-success",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["staff-details", memberId] });
      setIsDialogOpen(false);
      resetForm();
      resetMultiForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create override", {
        id: "create-override",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ overrideId, data }: { overrideId: number; data: any }) => {
      const response = await api.patch(
        `members/${memberId}/override-hours/${overrideId}`,
        data
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
    });
  };

  const resetMultiForm = () => {
    setMultiMode({
      startDate: "",
      endDate: "",
      selectedDays: [],
      opening_time: "",
      closing_time: "",
    });
  };

  const toggleDay = (day: number) => {
    setMultiMode(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter(d => d !== day)
        : [...prev.selectedDays, day]
    }));
  };

  const generateMultipleOverrides = () => {
    const overrides = [];
    const start = new Date(multiMode.startDate);
    const end = new Date(multiMode.endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dayOfWeek = date.getDay();
      if (multiMode.selectedDays.includes(dayOfWeek)) {
        overrides.push({
          date: date.toISOString().split('T')[0],
          opening_time: timeToMinutes(multiMode.opening_time),
          closing_time: timeToMinutes(multiMode.closing_time),
        });
      }
    }
    return overrides;
  };

  const handleOpenDialog = (override?: OverrideHours) => {
    if (override) {
      setEditingOverride(override);
      setFormData({
        date: override.date,
        opening_time: override.opening_time !== null ? minutesToTime(override.opening_time) : "",
        closing_time: override.closing_time !== null ? minutesToTime(override.closing_time) : "",
      });
    } else {
      setEditingOverride(null);
      resetForm();
      resetMultiForm();
    }
    setIsDialogOpen(true);
  };

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      date: formData.date,
      opening_time: timeToMinutes(formData.opening_time),
      closing_time: timeToMinutes(formData.closing_time),
    };

    if (editingOverride) {
      updateMutation.mutate({ overrideId: editingOverride.id, data: payload });
    } else {
      createMutation.mutate({ overrides: [payload] });
    }
  };

  const handleMultipleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (multiMode.selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    const overrides = generateMultipleOverrides();
    
    if (overrides.length === 0) {
      toast.error("No dates match the selected criteria");
      return;
    }

    createMutation.mutate({ overrides });
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingOverride ? "Edit Override Hours" : "Add Override Hours"}
              </DialogTitle>
            </DialogHeader>
            
            {editingOverride ? (
              <form onSubmit={handleSingleSubmit} className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="opening_time">Opening Time</Label>
                  <Input
                    id="opening_time"
                    type="time"
                    value={formData.opening_time}
                    onChange={(e) =>
                      setFormData({ ...formData, opening_time: e.target.value })
                    }
                    required
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
                    required
                  />
                </div>

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
                    disabled={updateMutation.isPending}
                  >
                    Update
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single Date</TabsTrigger>
                  <TabsTrigger value="multiple">Multiple Dates</TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-4">
                  <form onSubmit={handleSingleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="single-date">Date</Label>
                      <Input
                        id="single-date"
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="single-opening_time">Opening Time</Label>
                      <Input
                        id="single-opening_time"
                        type="time"
                        value={formData.opening_time}
                        onChange={(e) =>
                          setFormData({ ...formData, opening_time: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="single-closing_time">Closing Time</Label>
                      <Input
                        id="single-closing_time"
                        type="time"
                        value={formData.closing_time}
                        onChange={(e) =>
                          setFormData({ ...formData, closing_time: e.target.value })
                        }
                        required
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createMutation.isPending}
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </form>
                </TabsContent>

                <TabsContent value="multiple" className="space-y-4">
                  <form onSubmit={handleMultipleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={multiMode.startDate}
                          onChange={(e) =>
                            setMultiMode({ ...multiMode, startDate: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input
                          id="end-date"
                          type="date"
                          value={multiMode.endDate}
                          onChange={(e) =>
                            setMultiMode({ ...multiMode, endDate: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Days</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {dayNames.map((day, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`day-${index}`}
                              checked={multiMode.selectedDays.includes(index)}
                              onCheckedChange={() => toggleDay(index)}
                            />
                            <Label
                              htmlFor={`day-${index}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {day.slice(0, 3)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="multi-opening_time">Opening Time</Label>
                      <Input
                        id="multi-opening_time"
                        type="time"
                        value={multiMode.opening_time}
                        onChange={(e) =>
                          setMultiMode({ ...multiMode, opening_time: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="multi-closing_time">Closing Time</Label>
                      <Input
                        id="multi-closing_time"
                        type="time"
                        value={multiMode.closing_time}
                        onChange={(e) =>
                          setMultiMode({ ...multiMode, closing_time: e.target.value })
                        }
                        required
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetMultiForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createMutation.isPending}
                      >
                        Create Overrides
                      </Button>
                    </DialogFooter>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
