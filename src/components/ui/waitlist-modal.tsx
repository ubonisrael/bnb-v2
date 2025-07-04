import React, { useEffect, useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { minutesToTimeString } from "@/utils/time";
import { AvailableTimeSlotsResponse } from "@/types/response";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api-service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import toast from "react-hot-toast";
import { flattenToDateTimePairs } from "@/utils/waitlist";
import { z } from "zod";

interface WaitlistModalProps {
  url: string;
  selectedDate: string;
  selectedServices: { id: string | number; name: string }[];
  totalDuration: number;
}

const waitListFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
});

export type WaitListFormValues = z.infer<typeof waitListFormSchema>;

export const WaitlistModal = ({
  url,
  selectedDate,
  selectedServices,
  totalDuration,
  mode,
  setMode,
  setShowModal,
}: WaitlistModalProps & {
  mode: TimeSelectionMode;
  setMode: (mode: TimeSelectionMode) => void;
  setShowModal: (show: boolean) => void;
}) => {
  const [selectedTimes, setSelectedTimes] = useState<number[]>([]);
  const [timeRange, setTimeRange] = useState<[number, number]>([0, 0]);

  const urlString = `sp/${url}/unavailable-time-slots?date=${selectedDate}&${selectedServices
    .map((s) => `&service_ids[]=${s.id}`)
    .join("")}&duration=${totalDuration}`;
  // fetch available time slots based on selected date
  const { data, isLoading, error } = useQuery<
    AvailableTimeSlotsResponse,
    AxiosError
  >({
    queryKey: [`unavailable-slots-${selectedDate}`],
    queryFn: async () => {
      if (url === "sample") {
        return Promise.resolve({
          status: true,
          timeSlots: [540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080],
          message: "Success",
        });
      }
      return await api.get(urlString);
    },
    retry: (failureCount, error) => {
      // Don't retry if we get a 400 status code
      if (error instanceof AxiosError && error.response?.status === 400) {
        return false;
      }
      // Default retry behavior for other errors
      return failureCount < 3;
    },
    // Reduce cache time to minimize stale data issues
    staleTime: 1000 * 60 * 5, // 5 minutes
    // Refetch when component regains focus to ensure fresh data
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const waitListForm = useForm<WaitListFormValues>({
    resolver: zodResolver(waitListFormSchema),
    defaultValues: { email: "", name: "", phone: "" },
  });

  const joinWaitlistMutation = useMutation({
    mutationFn: async (values: WaitListValues[]) => {
      toast.loading("Joining waitlist...", { id: "join-waitlist" });
      const response = await api.post(`sp/${url}/join-waitlist`, {
        waitlist: values,
      });
      return response;
    },
    onSuccess: (_) => {
      toast.success(
        "Waitlist addition successful. You will be notified if a slot becomes available",
        { id: "join-waitlist" }
      );
      setShowModal(false);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to join waitlist", {
        id: "join-waitlist",
      });
    },
  });

  async function onWaitlistSubmit(values: WaitListFormValues) {
    try {
      const entries =
        mode === "multiple" || mode === "single"
          ? selectedTimes
          : mode === "range"
          ? timeRange
          : data?.timeSlots || [];
      await joinWaitlistMutation.mutateAsync(
        flattenToDateTimePairs({
          email: values.email,
          name: values.name,
          phone: values.phone,
          mode,
          duration: totalDuration,
          date: selectedDate,
          entries,
          unavailableSlots: data?.timeSlots || [],
        })
      );
    } catch (err) {
      console.error(err);
    }
  }

  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      queryClient.removeQueries({
        queryKey: [`unavailable-slots-${selectedDate}`],
      });
    };
  }, [selectedDate, queryClient]);

  useEffect(() => {
    // Reset selected times when mode changes
    if (mode === "single") {
      setSelectedTimes([]);
      setTimeRange([0, 0]);
    } else if (mode === "multiple") {
      setTimeRange([0, 0]);
    } else if (mode === "range") {
      setSelectedTimes([]);
      if (timeRange[0] && timeRange[1]) {
        setTimeRange([0, 0]);
      }
    } else if (mode === "all") {
      setSelectedTimes(data?.timeSlots || []);
      setTimeRange([0, 0]);
    }
  }, [mode, data?.timeSlots]);

  const displayForm = Boolean(
    mode === "all" ||
      ((mode === "single" || mode === "multiple") &&
        selectedTimes.length > 0) ||
      (mode === "range" && timeRange[0] && timeRange[1])
  );
  const isSlotInRange = (slot: number) =>
    Boolean(
      (timeRange[0] <= slot && timeRange[1] >= slot) ||
        (timeRange[1] && timeRange[1] <= slot && timeRange[0] >= slot)
    );

  return (
    <DialogContent className="sm:max-w-lg max-h-screen overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          Join Waitlist for Unavailable Times on {selectedDate}
        </DialogTitle>
      </DialogHeader>

      <div className="py-4">
        <RadioGroup
          defaultValue="single"
          onValueChange={(value) => setMode(value as TimeSelectionMode)}
          className="grid grid-cols-2 gap-2 md:gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single">Single Time</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multiple" id="multiple" />
            <Label htmlFor="multiple">Multiple Times</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="range" id="range" />
            <Label htmlFor="range">Time Range</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All Times</Label>
          </div>
        </RadioGroup>

        {isLoading ? (
          <div className="mt-6">
            <div className="h-7 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="mt-4 text-red-500">
            Error:{" "}
            {(error.response?.data as { message: string }).message ||
              error.message}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-3 gap-2">
            {data?.timeSlots.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">
                All time slots for this date are currently available.
              </div>
            ) : (
              data?.timeSlots.map((slot) => (
                <Button
                  key={slot}
                  variant="outline"
                  className={`${
                    // Check if slot is selected based on mode
                    mode === "all" ||
                    ((mode === "single" || mode === "multiple") &&
                      selectedTimes.includes(slot)) ||
                    (mode === "range" && isSlotInRange(slot)) ||
                    (mode === "range" && timeRange[0] === slot)
                      ? "bg-blue-700 hover:bg-blue-400 text-white hover:text-white border border-blue-700"
                      : ""
                  } rounded-md`}
                  onClick={() => {
                    if (mode === "single") {
                      setSelectedTimes([slot]);
                    } else if (mode === "multiple") {
                      setSelectedTimes((prev) =>
                        prev.includes(slot)
                          ? prev.filter((t) => t !== slot)
                          : [...prev, slot]
                      );
                    } else if (mode === "range") {
                      if (!timeRange[0]) {
                        setTimeRange([slot, 0]);
                      } else if (!timeRange[1]) {
                        setTimeRange([timeRange[0], slot]);
                      } else {
                        setTimeRange([slot, 0]);
                      }
                    }
                  }}
                >
                  {minutesToTimeString(slot)}
                </Button>
              ))
            )}
          </div>
        )}
      </div>

      {displayForm && (
        <Form key="wait-list-form" {...waitListForm}>
          <form
            onSubmit={waitListForm.handleSubmit(onWaitlistSubmit)}
            className="flex flex-col space-y-4"
          >
            <FormField
              control={waitListForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormDescription>Enter your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={waitListForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bruce Wayne" {...field} />
                  </FormControl>
                  <FormDescription>Enter your name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={waitListForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 7400 123456" {...field} />
                  </FormControl>
                  <FormDescription>Enter your phone number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="self-end">
              Submit
            </Button>
          </form>
        </Form>
      )}
    </DialogContent>
  );
};
