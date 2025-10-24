"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  PoundSterling,
  ArrowLeft,
  Edit2,
  Trash2,
  Loader2,
  BookOpen,
  Eye,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import dayjs from "@/utils/dayjsConfig";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import { newProgramSchema, programClassSchema } from "@/schemas/schema";
import { getRandomColor } from "@/utils/color";
import { convertToUTC, formatDateRange } from "@/utils/time";
import { removeNullish } from "@/utils/flatten";
import { 
  INewProgram, 
  IProgramClass,
  IProgramStudent,
  GetAllProgramsResponse, 
  GetProgramByIdResponse,
  GetProgramClassByIdResponse,
  CreateProgramResponse,
  CreateProgramClassResponse,
  UpdateProgramResponse,
  UpdateProgramClassResponse
} from "@/types/response";

type NewProgramFormValues = z.infer<typeof newProgramSchema>;
type ProgramClassFormValues = z.infer<typeof programClassSchema>;

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<INewProgram[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<INewProgram | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<INewProgram | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [programDetails, setProgramDetails] = useState<{
    classes: IProgramClass[];
    students: IProgramStudent[];
    stats: any;
  } | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Class management states
  const [showClassView, setShowClassView] = useState(false);
  const [selectedClass, setSelectedClass] = useState<IProgramClass | null>(null);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<IProgramClass | null>(null);
  const [classDetails, setClassDetails] = useState<{
    students: IProgramStudent[];
    stats: any;
  } | null>(null);
  const [isLoadingClassDetails, setIsLoadingClassDetails] = useState(false);

  // Get user's timezone
  const userTimezone = dayjs.tz.guess();

  // Program form
  const programForm = useForm<NewProgramFormValues>({
    resolver: zodResolver(newProgramSchema),
    defaultValues: {
      name: "",
      about: "",
      capacity: null,
      set_capacity_per_class: false,
      banner_image_url: null,
      is_active: true,
      is_published: false,
      set_deposit_instructions_per_class: false,
      allow_deposits: false,
      deposit_amount: null,
      absorb_service_charge: false,
      allow_refunds: false,
      refund_deadline_in_hours: null,
      refund_percentage: null,
    },
  });

  // Edit form
  const editForm = useForm<NewProgramFormValues>({
    resolver: zodResolver(newProgramSchema),
    defaultValues: {
      name: "",
      about: "",
      capacity: null,
      set_capacity_per_class: false,
      banner_image_url: null,
      is_active: true,
      is_published: false,
      set_deposit_instructions_per_class: false,
      allow_deposits: false,
      deposit_amount: null,
      absorb_service_charge: false,
      allow_refunds: false,
      refund_deadline_in_hours: null,
      refund_percentage: null,
    },
  });

  // Class forms
  const classForm = useForm<ProgramClassFormValues>({
    resolver: zodResolver(programClassSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: undefined,
      end_date: undefined,
      price: 0,
      capacity: null,
      is_active: true,
      is_published: false,
      start_booking_immediately: true,
      start_booking_date: null,
      end_booking_when_class_ends: true,
      end_booking_date: null,
      offer_early_bird: false,
      early_bird_discount_type: null,
      early_bird_discount_value: null,
      early_bird_deadline: null,
      allow_deposits: false,
      deposit_amount: null,
    },
  });

  const editClassForm = useForm<ProgramClassFormValues>({
    resolver: zodResolver(programClassSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: undefined,
      end_date: undefined,
      price: 0,
      capacity: null,
      is_active: true,
      is_published: false,
      start_booking_immediately: true,
      start_booking_date: null,
      end_booking_when_class_ends: true,
      end_booking_date: null,
      offer_early_bird: false,
      early_bird_discount_type: null,
      early_bird_discount_value: null,
      early_bird_deadline: null,
      allow_deposits: false,
      deposit_amount: null,
    },
  });

  const createProgramMutation = useMutation<CreateProgramResponse, Error, NewProgramFormValues>({
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
      programForm.reset();
      setPrograms((prev) => [...prev, response.data.program]);
      setShowCreateModal(false);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create new program", {
        id: "create-program",
      });
    },
  });

  const updateProgramMutation = useMutation<UpdateProgramResponse, Error, { id: number; values: NewProgramFormValues }>({
    mutationFn: async ({ id, values }: { id: number; values: NewProgramFormValues }) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.put<UpdateProgramResponse>(
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
      editForm.reset();
      setPrograms((prev) =>
        prev.map((program) =>
          program.id === response.data.program.id
            ? response.data.program
            : program
        )
      );
      setShowEditModal(false);
      setEditingProgram(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update program", {
        id: "update-program",
      });
    },
  });

  const onSubmitProgram = async (data: NewProgramFormValues) => {
    try {
      await createProgramMutation.mutateAsync(data);
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmitEdit = async (data: NewProgramFormValues) => {
    if (!editingProgram) return;

    try {
      await updateProgramMutation.mutateAsync({
        id: editingProgram.id,
        values: data,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseEditModal = () => {
    if (editForm.formState.isDirty) {
      setShowConfirmDialog(true);
    } else {
      setShowEditModal(false);
      setEditingProgram(null);
    }
  };

  const handleConfirmClose = () => {
    setShowEditModal(false);
    setEditingProgram(null);
    setShowConfirmDialog(false);
    editForm.reset();
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };

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
      setPrograms((prev) =>
        prev.filter((program) => program.id !== selectedProgram?.id)
      );
      setShowDetailsView(false);
      setSelectedProgram(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete program", {
        id: "delete-program",
      });
    },
  });

  // Class mutations
  const createClassMutation = useMutation<CreateProgramClassResponse, Error, { programId: number; values: ProgramClassFormValues }>({
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
          `programs/${programId}/classes`,
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
      classForm.reset();
      setShowCreateClassModal(false);
      // Refresh program details to show new class
      if (selectedProgram) {
        fetchProgramDetails(selectedProgram.id);
      }
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create class", {
        id: "create-class",
      });
    },
  });

  const updateClassMutation = useMutation<UpdateProgramClassResponse, Error, { id: number; values: ProgramClassFormValues }>({
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
        const response = await api.put<UpdateProgramClassResponse>(
          `program-classes/${id}`,
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
      editClassForm.reset();
      setShowEditClassModal(false);
      setEditingClass(null);
      // Refresh program details to show updated class
      if (selectedProgram) {
        fetchProgramDetails(selectedProgram.id);
      }
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
        const response = await api.delete(`program-classes/${id}`, { signal });
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
      // Refresh program details
      if (selectedProgram) {
        fetchProgramDetails(selectedProgram.id);
      }
      if (showClassView) {
        setShowClassView(false);
        setSelectedClass(null);
      }
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete class", {
        id: "delete-class",
      });
    },
  });

  const fetchProgramDetails = async (programId: number) => {
    setIsLoadingDetails(true);
    try {
      const response = await api.get<GetProgramByIdResponse>(`programs/${programId}`);
      setProgramDetails({
        classes: response.data.classes,
        students: response.data.students,
        stats: response.data.stats,
      });
    } catch (error) {
      console.error("Error fetching program details:", error);
      toast.error("Failed to load program details");
      setProgramDetails({
        classes: [],
        students: [],
        stats: null,
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const fetchClassDetails = async (classId: number) => {
    setIsLoadingClassDetails(true);
    try {
      const response = await api.get<GetProgramClassByIdResponse>(`program-classes/${classId}`);
      setClassDetails({
        students: response.data.students,
        stats: response.data.stats,
      });
    } catch (error) {
      console.error("Error fetching class details:", error);
      toast.error("Failed to load class details");
      setClassDetails({
        students: [],
        stats: null,
      });
    } finally {
      setIsLoadingClassDetails(false);
    }
  };

  const handleViewDetails = (program: INewProgram) => {
    setSelectedProgram(program);
    setShowDetailsView(true);
    fetchProgramDetails(program.id);
  };

  const handleViewClassDetails = (programClass: IProgramClass) => {
    setSelectedClass(programClass);
    setShowClassView(true);
    fetchClassDetails(programClass.id);
  };

  const handleBackFromDetails = () => {
    setShowDetailsView(false);
    setSelectedProgram(null);
    setProgramDetails(null);
  };

  const handleBackFromClassDetails = () => {
    setShowClassView(false);
    setSelectedClass(null);
    setClassDetails(null);
  };

  const handleEditFromDetails = () => {
    if (selectedProgram) {
      handleEditProgram(selectedProgram);
      setShowDetailsView(false);
    }
  };

  const handleDeleteProgram = () => {
    if (!selectedProgram) return;
    
    // Check if program is published
    if (selectedProgram.is_published) {
      toast.error("Cannot delete a published program. Please deactivate it instead.", {
        duration: 4000,
      });
      return;
    }
    
    setShowDeleteAlert(true);
  };

  const confirmDeleteProgram = async () => {
    if (selectedProgram) {
      await deleteProgramMutation.mutateAsync(selectedProgram.id);
      setShowDeleteAlert(false);
    }
  };

  const handleEditProgram = (program: INewProgram) => {
    setEditingProgram(program);
    editForm.reset({
      name: program.name,
      about: program.about,
      capacity: program.capacity,
      set_capacity_per_class: program.set_capacity_per_class,
      banner_image_url: program.banner_image_url,
      is_active: program.is_active,
      is_published: program.is_published,
      set_deposit_instructions_per_class: program.set_deposit_instructions_per_class,
      allow_deposits: program.allow_deposits,
      deposit_amount: program.deposit_amount,
      absorb_service_charge: program.absorb_service_charge,
      allow_refunds: program.allow_refunds,
      refund_deadline_in_hours: program.refund_deadline_in_hours,
      refund_percentage: program.refund_percentage,
    });
    setShowEditModal(true);
  };

  // Class handlers
  const handleCreateClass = () => {
    if (!selectedProgram) return;
    setShowCreateClassModal(true);
  };

  const handleEditClass = (programClass: IProgramClass) => {
    // Convert UTC dates back to user's timezone for editing
    const convertFromUTC = (dateString: string | undefined) => {
      if (!dateString) return undefined;
      return dayjs.utc(dateString).tz(userTimezone).toDate();
    };

    setEditingClass(programClass);
    editClassForm.reset({
      name: programClass.name,
      description: programClass.description,
      start_date: convertFromUTC(programClass.start_date),
      end_date: convertFromUTC(programClass.end_date),
      price: programClass.price,
      capacity: programClass.capacity,
      is_active: programClass.is_active,
      is_published: programClass.is_published,
      start_booking_immediately: programClass.start_booking_immediately,
      start_booking_date: convertFromUTC(programClass.start_booking_date),
      end_booking_when_class_ends: programClass.end_booking_when_class_ends,
      end_booking_date: convertFromUTC(programClass.end_booking_date),
      offer_early_bird: programClass.offer_early_bird,
      early_bird_discount_type: programClass.early_bird_discount_type,
      early_bird_discount_value: programClass.early_bird_discount_value,
      early_bird_deadline: convertFromUTC(programClass.early_bird_deadline),
      allow_deposits: programClass.allow_deposits,
      deposit_amount: programClass.deposit_amount,
    });
    setShowEditClassModal(true);
  };

  const handleDeleteClass = (programClass: IProgramClass) => {
    if (programClass.is_published) {
      toast.error("Cannot delete a published class. Please deactivate it instead.", {
        duration: 4000,
      });
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete "${programClass.name}"?`)) {
      deleteClassMutation.mutate(programClass.id);
    }
  };

  const onSubmitClass = async (data: ProgramClassFormValues) => {
    if (!selectedProgram) return;

    try {
      await createClassMutation.mutateAsync({
        programId: selectedProgram.id,
        values: data,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmitEditClass = async (data: ProgramClassFormValues) => {
    if (!editingClass) return;

    try {
      await updateClassMutation.mutateAsync({
        id: editingClass.id,
        values: data,
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Filter and search programs
  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!filterBy) return matchesSearch;

    // Apply filters based on filterBy value
    switch (filterBy) {
      case "published":
        return matchesSearch && program.is_published;
      case "unpublished":
        return matchesSearch && !program.is_published;
      case "with_classes":
        return matchesSearch && (program.class_count || 0) > 0;
      case "without_classes":
        return matchesSearch && (program.class_count || 0) === 0;
      default:
        return matchesSearch;
    }
  });

  useEffect(() => {
    // Fetch programs data
    const fetchPrograms = async () => {
      try {
        const response = await api.get<GetAllProgramsResponse>("programs");
        setPrograms(response.data.programs);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <div className="relative overflow-hidden h-full">
      {/* Main View */}
      <div
        className={`transition-transform duration-700 ease-in-out ${
          showDetailsView ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#121212]">Programs</h1>
              <p className="text-[#6E6E73]">
                Manage your programs and workshops.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterBy("")}>
                    All Programs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("published")}>
                    Published Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("unpublished")}>
                    Unpublished Only
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterBy("with_classes")}>
                    With Classes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("without_classes")}>
                    Without Classes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Create New Program Button */}
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Program
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>

          {/* Programs Grid */}
          {filteredPrograms.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-center">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {programs.length === 0
                    ? "No programs yet"
                    : "No programs found"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {programs.length === 0
                    ? "Create your first program to get started."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {programs.length === 0 && (
                  <Button
                    className="gap-2"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Program
                  </Button>
                )}
              </div>
            </div>
          ) : (
            /* Programs Grid */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPrograms.map((program) => (
                <Card
                  key={program.id}
                  className="border-0 shadow-card overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Banner Image or Random Color */}
                  <div className="relative h-48 w-full">
                    {program.banner_image_url ? (
                      <img
                        src={program.banner_image_url}
                        alt={program.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full w-full ${getRandomColor(
                          program.id.toString()
                        )} flex items-center justify-center`}
                      >
                        <span className="text-white text-xl font-semibold">
                          {program.name}
                        </span>
                      </div>
                    )}

                    {/* Published Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={program.is_published ? "default" : "secondary"}
                      >
                        {program.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold text-[#121212] line-clamp-2">
                      {program.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Classes Count */}
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#6E6E73]" />
                      <span className="text-sm text-[#6E6E73]">
                        {program.classes?.length || 0} Classes
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-[#6E6E73] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#6E6E73]">
                        {formatDateRange(program.start_date, program.end_date, userTimezone)}
                      </span>
                    </div>

                    {/* Total Enrolled Students */}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#6E6E73]" />
                      <span className="text-sm text-[#6E6E73]">
                        {program.classes?.reduce((total, cls) => total + (cls.students?.length || 0), 0) || 0} students enrolled
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditProgram(program)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleViewDetails(program)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details View */}
      <div
        className={`absolute top-0 left-0 w-full h-full md:px-4 xl:px-8 overflow-y-auto transition-transform duration-300 ease-in-out ${
          showDetailsView ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedProgram && (
          <div className="space-y-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackFromDetails}
                  className="p-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-[#121212]">
                    {selectedProgram.name}
                  </h1>
                  <p className="text-[#6E6E73]">Program Details</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {/* <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditFromDetails()}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button> */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteProgram}
                  disabled={selectedProgram.is_published}
                  title={selectedProgram.is_published ? "Cannot delete published programs. Deactivate instead." : "Delete program"}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Three Sections */}
            <div className="flex flex-col gap-6">
              {/* Section 1: Overview */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Banner Image Section */}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12">
                    {/* Banner Image or Random Color - Top on mobile, Left on tablet+ */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                      <div className="relative h-48 lg:h-60 w-full rounded-lg overflow-hidden">
                        {selectedProgram.banner_image_url ? (
                          <img
                            src={selectedProgram.banner_image_url}
                            alt={selectedProgram.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className={`h-full w-full ${getRandomColor(
                              selectedProgram.id.toString()
                            )} flex items-center justify-center`}
                          >
                            <span className="text-white text-sm font-semibold text-center px-2">
                              {selectedProgram.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Program Details - Below on mobile, Right on tablet+ */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Date Range
                        </label>
                        <p className="mt-1 text-sm">
                          {formatDateRange(
                            selectedProgram.start_date,
                            selectedProgram.end_date,
                            userTimezone
                          )}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Classes
                        </label>
                        <p className="mt-1 text-lg font-semibold">
                          {selectedProgram.classes?.length || 0}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Students
                        </label>
                        <p className="mt-1 text-sm">
                          {selectedProgram.classes?.reduce((total, cls) => total + (cls.students?.length || 0), 0) || 0}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Status
                        </label>
                        <div className="mt-1">
                          <Badge
                            variant={
                              selectedProgram.is_published
                                ? "default"
                                : "secondary"
                            }
                          >
                            {selectedProgram.is_published
                              ? "Published"
                              : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Description
                        </label>
                        <p className="mt-1 text-sm">
                          {selectedProgram.about || "No description provided"}
                        </p>
                      </div>
                      
                      {/* Program Rules Notice */}
                      {selectedProgram.is_published && (
                        <div className="md:col-span-3 mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div className="flex items-start gap-2">
                            <div className="w-4 h-4 mt-0.5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs text-amber-900">!</span>
                            </div>
                            <div className="text-sm text-amber-800 dark:text-amber-200">
                              <strong>Published Program:</strong> This program cannot be deleted or unpublished. 
                              You can deactivate it to stop new bookings while keeping existing data.
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Classes Management */}
              <Card className="flex-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Classes</CardTitle>
                    <Button 
                      size="sm" 
                      onClick={() => setShowCreateClassModal(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Class
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedProgram.classes && selectedProgram.classes.length > 0 ? (
                    <div className="space-y-3">
                      {selectedProgram.classes.map((cls) => (
                        <div
                          key={cls.id}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">
                              {cls.name}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDateRange(cls.start_date, cls.end_date, userTimezone)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {cls.students?.length || 0} students
                              </span>
                              <span className="flex items-center gap-1">
                                <PoundSterling className="h-3 w-3" />
                                £{cls.price}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewClassDetails(cls)}
                              className="p-2"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClass(cls)}
                              className="p-2"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClass(cls)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                        No classes added yet
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => setShowCreateClassModal(true)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add First Class
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Section 3: Statistics & Analytics */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedProgram.classes?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Classes
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {selectedProgram.classes?.reduce((total, cls) => total + (cls.students?.length || 0), 0) || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Students
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        £{selectedProgram.classes?.reduce((total, cls) => total + (cls.price * (cls.students?.length || 0)), 0).toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Revenue
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {selectedProgram.classes?.reduce((total, cls) => total + (cls.capacity || 0), 0) || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Capacity
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Create Program Dialog */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Program</DialogTitle>
            <DialogDescription>
              Create a new program for your customers to book.
            </DialogDescription>
          </DialogHeader>

          <Form {...programForm}>
            <form
              onSubmit={programForm.handleSubmit(onSubmitProgram)}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={programForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Yoga Workshop" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={programForm.control}
                    name="banner_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/banner.jpg"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={programForm.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your program..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tell customers what this program is about (10-2000
                        characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Capacity & Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Capacity & Settings</h3>

                <FormField
                  control={programForm.control}
                  name="set_capacity_per_class"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Set Capacity Per Class
                        </FormLabel>
                        <FormDescription>
                          Each class will have its own capacity limit instead of a program-wide limit.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {!programForm.watch("set_capacity_per_class") && (
                  <FormField
                    control={programForm.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Leave empty for unlimited"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of participants across all classes (leave empty for unlimited).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Booking Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Booking Settings</h3>

                <div className="space-y-4">
                  <FormField
                    control={programForm.control}
                    name="start_booking_immediately"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Start Booking Immediately
                          </FormLabel>
                          <FormDescription>
                            Allow customers to book as soon as the program is
                            published.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!programForm.watch("start_booking_immediately") && (
                    <FormField
                      control={programForm.control}
                      name="start_booking_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Start Date *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={
                                field.value
                                  ? dayjs(field.value).format(
                                      "YYYY-MM-DDTHH:mm"
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={programForm.control}
                    name="end_booking_when_program_ends"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            End Booking When Program Ends
                          </FormLabel>
                          <FormDescription>
                            Stop accepting bookings when the program ends.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!programForm.watch("end_booking_when_program_ends") && (
                    <FormField
                      control={programForm.control}
                      name="end_booking_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking End Date *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={
                                field.value
                                  ? dayjs(field.value).format(
                                      "YYYY-MM-DDTHH:mm"
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Must be before the program start date.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Early Bird Offer */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Early Bird Offer</h3>

                <FormField
                  control={programForm.control}
                  name="offer_early_bird"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Offer Early Bird Discount
                        </FormLabel>
                        <FormDescription>
                          Provide a discount for customers who book early.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {programForm.watch("offer_early_bird") && (
                  <div className="space-y-4 ml-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={programForm.control}
                        name="early_bird_discount_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select discount type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">
                                  Percentage
                                </SelectItem>
                                <SelectItem value="fixed_amount">
                                  Fixed Amount
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={programForm.control}
                        name="early_bird_discount_value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Discount Value{" "}
                              {programForm.watch("early_bird_discount_type") ===
                              "percentage"
                                ? "(%)"
                                : "(£)"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max={
                                  programForm.watch(
                                    "early_bird_discount_type"
                                  ) === "percentage"
                                    ? "100"
                                    : undefined
                                }
                                placeholder="0"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={programForm.control}
                      name="early_bird_deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Early Bird Deadline</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={
                                field.value
                                  ? dayjs(field.value).format(
                                      "YYYY-MM-DDTHH:mm"
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Must be before the program start date.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Deposits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Deposits</h3>

                <FormField
                  control={programForm.control}
                  name="allow_deposits"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Allow Deposits
                        </FormLabel>
                        <FormDescription>
                          Allow customers to pay a deposit instead of the full
                          amount.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {programForm.watch("allow_deposits") && (
                  <FormField
                    control={programForm.control}
                    name="deposit_amount"
                    render={({ field }) => (
                      <FormItem className="ml-4">
                        <FormLabel>Deposit Amount (£) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="1"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Refunds */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Refunds</h3>

                <FormField
                  control={programForm.control}
                  name="allow_refunds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Allow Refunds
                        </FormLabel>
                        <FormDescription>
                          Allow customers to request refunds for this program.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {programForm.watch("allow_refunds") && (
                  <div className="space-y-4 ml-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={programForm.control}
                        name="refund_deadline_in_hours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refund Deadline (Hours) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="24"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Hours before program start when refunds are no
                              longer allowed.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={programForm.control}
                        name="refund_percentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refund Percentage (%) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="100"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Percentage of the payment to refund (0-100).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Status Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status Settings</h3>

                <div className="grid grid-cols-1 gap-4">
                  <FormField
                    control={programForm.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Program is currently active and can accept bookings.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={programForm.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <FormDescription>
                            Program is visible to customers on your booking page. 
                            <strong className="text-amber-600"> Warning:</strong> Once published, start/end dates cannot be changed and program cannot be unpublished.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                {programForm.watch("is_published") && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-blue-900">i</span>
                      </div>
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Publishing this program will:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 ml-2">
                          <li>Make it visible to customers on your booking page</li>
                          <li>Lock the start and end dates (cannot be changed later)</li>
                          <li>Prevent the program from being unpublished</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <FormField
                  control={programForm.control}
                  name="absorb_service_charge"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Absorb Service Charge
                        </FormLabel>
                        <FormDescription>
                          You pay the service charges instead of passing them to
                          customers.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Program</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Program Dialog */}
      <Dialog
        open={showEditModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseEditModal();
          } else {
            setShowEditModal(open);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
            <DialogDescription>
              Update the program details and settings.
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onSubmitEdit)}
              className="space-y-6"
            >
              {/* Published Program Notice */}
              {editingProgram?.is_published && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 mt-0.5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-amber-900 font-bold">!</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Published Program Restrictions
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        This program is published and visible to customers. Some fields cannot be modified:
                      </p>
                      <ul className="text-sm text-amber-700 dark:text-amber-300 list-disc list-inside space-y-0.5 ml-2">
                        <li>Start and end dates are locked to maintain booking integrity</li>
                        <li>Program cannot be unpublished (can be deactivated instead)</li>
                        <li>Other settings can still be updated as needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Yoga Workshop" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="banner_image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banner Image URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/banner.jpg"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your program..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tell customers what this program is about (10-2000
                        characters).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dates and Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dates and Pricing</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            disabled={editingProgram?.is_published}
                            value={
                              field.value
                                ? dayjs(field.value).format("YYYY-MM-DDTHH:mm")
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? new Date(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        {editingProgram?.is_published && (
                          <FormDescription className="text-amber-600">
                            Start date cannot be changed for published programs
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            disabled={editingProgram?.is_published}
                            value={
                              field.value
                                ? dayjs(field.value).format("YYYY-MM-DDTHH:mm")
                                : ""
                            }
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? new Date(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        {editingProgram?.is_published && (
                          <FormDescription className="text-amber-600">
                            End date cannot be changed for published programs
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (£) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Leave empty for unlimited"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum number of participants (leave empty for
                          unlimited).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Booking Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Booking Settings</h3>

                <div className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="start_booking_immediately"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Start Booking Immediately
                          </FormLabel>
                          <FormDescription>
                            Allow customers to book as soon as the program is
                            published.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              // Clear start_booking_date when enabling immediate booking
                              if (checked) {
                                editForm.setValue("start_booking_date", null);
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!editForm.watch("start_booking_immediately") && (
                    <FormField
                      control={editForm.control}
                      name="start_booking_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking Start Date *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={
                                field.value
                                  ? dayjs(field.value).format(
                                      "YYYY-MM-DDTHH:mm"
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={editForm.control}
                    name="end_booking_when_program_ends"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            End Booking When Program Ends
                          </FormLabel>
                          <FormDescription>
                            Stop accepting bookings when the program ends.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              // Clear end_booking_date when enabling program end booking
                              if (checked) {
                                editForm.setValue("end_booking_date", null);
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {!editForm.watch("end_booking_when_program_ends") && (
                    <FormField
                      control={editForm.control}
                      name="end_booking_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Booking End Date *</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={
                                field.value
                                  ? dayjs(field.value).format(
                                      "YYYY-MM-DDTHH:mm"
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Must be before the program start date.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Early Bird Offer */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Early Bird Offer</h3>

                <FormField
                  control={editForm.control}
                  name="offer_early_bird"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Offer Early Bird Discount
                        </FormLabel>
                        <FormDescription>
                          Provide a discount for customers who book early.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {editForm.watch("offer_early_bird") && (
                  <div className="space-y-4 ml-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={editForm.control}
                        name="early_bird_discount_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select discount type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">
                                  Percentage
                                </SelectItem>
                                <SelectItem value="fixed_amount">
                                  Fixed Amount
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editForm.control}
                        name="early_bird_discount_value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Discount Value{" "}
                              {editForm.watch("early_bird_discount_type") ===
                              "percentage"
                                ? "(%)"
                                : "(£)"}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max={
                                  editForm.watch("early_bird_discount_type") ===
                                  "percentage"
                                    ? "100"
                                    : undefined
                                }
                                placeholder="0"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={editForm.control}
                      name="early_bird_deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Early Bird Deadline</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={
                                field.value
                                  ? dayjs(field.value).format(
                                      "YYYY-MM-DDTHH:mm"
                                    )
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value
                                    ? new Date(e.target.value)
                                    : null
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Must be before the program start date.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Deposits */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Deposits</h3>

                <FormField
                  control={editForm.control}
                  name="allow_deposits"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Allow Deposits
                        </FormLabel>
                        <FormDescription>
                          Allow customers to pay a deposit instead of the full
                          amount.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Clear deposit_amount when disabling deposits
                            if (!checked) {
                              editForm.setValue("deposit_amount", null);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {editForm.watch("allow_deposits") && (
                  <FormField
                    control={editForm.control}
                    name="deposit_amount"
                    render={({ field }) => (
                      <FormItem className="ml-4">
                        <FormLabel>Deposit Amount (£) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="1"
                            placeholder="0.00"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Refunds */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Refunds</h3>

                <FormField
                  control={editForm.control}
                  name="allow_refunds"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Allow Refunds
                        </FormLabel>
                        <FormDescription>
                          Allow customers to request refunds for this program.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // Clear refund fields when disabling refunds
                            if (!checked) {
                              editForm.setValue("refund_deadline_in_hours", null);
                              editForm.setValue("refund_percentage", null);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {editForm.watch("allow_refunds") && (
                  <div className="space-y-4 ml-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={editForm.control}
                        name="refund_deadline_in_hours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refund Deadline (Hours) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="24"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Hours before program start when refunds are no
                              longer allowed.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={editForm.control}
                        name="refund_percentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Refund Percentage (%) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="100"
                                {...field}
                                value={field.value || ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Percentage of the payment to refund (0-100).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Status Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Program is currently active and can accept bookings.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <FormDescription>
                            {field.value 
                              ? "Program is published and visible to customers. Cannot be unpublished but can be deactivated."
                              : "Program is visible to customers on your booking page."
                            }
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              // Prevent unpublishing - only allow publishing
                              if (!field.value || checked) {
                                field.onChange(checked);
                              }
                            }}
                            disabled={field.value} // Disable if already published
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editForm.control}
                  name="absorb_service_charge"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Absorb Service Charge
                        </FormLabel>
                        <FormDescription>
                          You pay the service charges instead of passing them to
                          customers.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEditModal}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Program</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Are you sure you want to discard them
              and close the form?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleCancelClose}>
              Keep Editing
            </Button>
            <Button variant="destructive" onClick={handleConfirmClose}>
              Discard Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Program</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProgram?.name}"? This action cannot be undone.
              All program data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteProgram}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Program
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Class Dialog */}
      <Dialog open={showCreateClassModal} onOpenChange={setShowCreateClassModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Add a new class to "{selectedProgram?.name}" program.
            </DialogDescription>
          </DialogHeader>

          <Form {...classForm}>
            <form
              onSubmit={classForm.handleSubmit(onSubmitClass)}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Class Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={classForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter class name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={classForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (£) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={classForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter class description"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={classForm.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date & Time *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value ? dayjs(field.value).format("YYYY-MM-DDTHH:mm") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? dayjs(e.target.value).toISOString() : undefined;
                              field.onChange(date);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={classForm.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date & Time *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value ? dayjs(field.value).format("YYYY-MM-DDTHH:mm") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? dayjs(e.target.value).toISOString() : undefined;
                              field.onChange(date);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={classForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Leave empty for unlimited"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of students for this class. Leave empty for unlimited capacity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Publishing & Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Publishing & Status</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={classForm.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Inactive classes won't be available for booking
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={classForm.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Published</FormLabel>
                          <FormDescription>
                            Published classes are visible to customers
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateClassModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createClassMutation.isPending}>
                  {createClassMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Class
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={showEditClassModal} onOpenChange={setShowEditClassModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Edit class details for "{editingClass?.name}".
            </DialogDescription>
          </DialogHeader>

          <Form {...editClassForm}>
            <form
              onSubmit={editClassForm.handleSubmit(onSubmitEditClass)}
              className="space-y-6"
            >
              {/* Same form fields as create class but with editClassForm */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Class Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editClassForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter class name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editClassForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (£) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editClassForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter class description"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editClassForm.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date & Time *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value ? dayjs(field.value).format("YYYY-MM-DDTHH:mm") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? dayjs(e.target.value).toISOString() : undefined;
                              field.onChange(date);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editClassForm.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date & Time *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={field.value ? dayjs(field.value).format("YYYY-MM-DDTHH:mm") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? dayjs(e.target.value).toISOString() : undefined;
                              field.onChange(date);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={editClassForm.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Leave empty for unlimited"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of students for this class. Leave empty for unlimited capacity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Publishing & Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Publishing & Status</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editClassForm.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Inactive classes won't be available for booking
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editClassForm.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Published</FormLabel>
                          <FormDescription>
                            Published classes are visible to customers
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditClassModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateClassMutation.isPending}>
                  {updateClassMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Class
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
