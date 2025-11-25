import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import { removeNullish } from "@/utils/flatten";
import { convertToUTC } from "@/utils/time";
import {
  CreateProgramResponse,
  UpdateProgramResponse,
  CreateProgramClassResponse,
  UpdateProgramClassResponse,
} from "@/types/response";
import { z } from "zod";
import { newProgramSchema, programClassSchema } from "@/schemas/schema";

type NewProgramFormValues = z.infer<typeof newProgramSchema>;
type ProgramClassFormValues = z.infer<typeof programClassSchema>;

export function useProgramMutations() {
  const queryClient = useQueryClient();

  const createProgramMutation = useMutation<
    CreateProgramResponse,
    Error,
    NewProgramFormValues
  >({
    mutationFn: async (values: NewProgramFormValues) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post<CreateProgramResponse>(
          "programs",
          removeNullish(values),
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Creating program...", {
        id: "create-program",
      });
    },
    onSuccess: (response: CreateProgramResponse) => {
      toast.success(response.message, { id: "create-program" });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create new program", {
        id: "create-program",
      });
    },
  });

  const updateProgramMutation = useMutation<
    UpdateProgramResponse,
    Error,
    { id: number; values: NewProgramFormValues }
  >({
    mutationFn: async ({
      id,
      values,
    }: {
      id: number;
      values: NewProgramFormValues;
    }) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.patch<UpdateProgramResponse>(
          `programs/${id}`,
          removeNullish(values),
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Updating program...", {
        id: "update-program",
      });
    },
    onSuccess: (response: UpdateProgramResponse) => {
      toast.success(response.message, { id: "update-program" });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["program"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update program", {
        id: "update-program",
      });
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (id: number) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.delete(`programs/${id}`, { signal });
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Deleting program...", {
        id: "delete-program",
      });
    },
    onSuccess: (response: any) => {
      toast.success(response.message || "Program deleted successfully", {
        id: "delete-program",
      });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete program", {
        id: "delete-program",
      });
    },
  });

  const createClassMutation = useMutation<
    CreateProgramClassResponse,
    Error,
    { programId: number; values: ProgramClassFormValues }
  >({
    mutationFn: async ({ programId, values }) => {
      const controller = new AbortController();
      const signal = controller.signal;

      const utcData = {
        ...values,
        start_date: convertToUTC(values.start_date),
        end_date: convertToUTC(values.end_date),
        start_booking_date: convertToUTC(values.start_booking_date),
        end_booking_date: convertToUTC(values.end_booking_date),
        early_bird_deadline: convertToUTC(values.early_bird_deadline),
      };

      try {
        const response = await api.post<CreateProgramClassResponse>(
          `programs/${programId}`,
          removeNullish(utcData),
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Creating class...", {
        id: "create-class",
      });
    },
    onSuccess: (response: CreateProgramClassResponse) => {
      toast.success(response.message, { id: "create-class" });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["program"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create class", {
        id: "create-class",
      });
    },
  });

  const updateClassMutation = useMutation<
    UpdateProgramClassResponse,
    Error,
    { id: number; values: ProgramClassFormValues }
  >({
    mutationFn: async ({ id, values }) => {
      const controller = new AbortController();
      const signal = controller.signal;

      const utcData = {
        ...values,
        start_date: convertToUTC(values.start_date),
        end_date: convertToUTC(values.end_date),
        start_booking_date: convertToUTC(values.start_booking_date),
        end_booking_date: convertToUTC(values.end_booking_date),
        early_bird_deadline: convertToUTC(values.early_bird_deadline),
      };

      try {
        const response = await api.patch<UpdateProgramClassResponse>(
          `programs/classes/${id}`,
          removeNullish(utcData),
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Updating class...", {
        id: "update-class",
      });
    },
    onSuccess: (response: UpdateProgramClassResponse) => {
      toast.success(response.message, { id: "update-class" });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["program"] });
      queryClient.invalidateQueries({ queryKey: ["program-class", response.data.programClass.id] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update class", {
        id: "update-class",
      });
    },
  });

  const deleteClassMutation = useMutation({
    mutationFn: async (id: number) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.delete(`programs/classes/${id}`, { signal });
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Deleting class...", {
        id: "delete-class",
      });
    },
    onSuccess: (response: any) => {
      toast.success(response.message || "Class deleted successfully", {
        id: "delete-class",
      });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      queryClient.invalidateQueries({ queryKey: ["program"] });
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete class", {
        id: "delete-class",
      });
    },
  });

  return {
    createProgramMutation,
    updateProgramMutation,
    deleteProgramMutation,
    createClassMutation,
    updateClassMutation,
    deleteClassMutation,
  };
}
