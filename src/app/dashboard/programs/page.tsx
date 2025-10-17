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
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import dayjs from "@/utils/dayjsConfig";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import { programSchema } from "@/schemas/schema";

type ProgramFormValues = z.infer<typeof programSchema>;

// Generate random colors for programs without banner images
const getRandomColor = (id: string) => {
  const colors = [
    "bg-gradient-to-r from-purple-500 to-pink-500",
    "bg-gradient-to-r from-blue-500 to-cyan-500",
    "bg-gradient-to-r from-green-500 to-teal-500",
    "bg-gradient-to-r from-orange-500 to-red-500",
    "bg-gradient-to-r from-indigo-500 to-purple-500",
    "bg-gradient-to-r from-yellow-500 to-orange-500",
  ];
  const index = parseInt(id) % colors.length;
  return colors[index];
};

// Convert dates from user's timezone to UTC
const convertToUTC = (date: Date | null | undefined) => {
  if (!date) return null;
  return dayjs(date).utc().toISOString();
};

const formatData = (val: any) => {
  const result: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(val)) {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<IProgram | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<IProgram | null>(null);

  // Get user's timezone
  const userTimezone = dayjs.tz.guess();

  // Program form
  const programForm = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      about: "",
      start_date: undefined,
      end_date: undefined,
      price: 0,
      capacity: null,
      start_booking_immediately: true,
      start_booking_date: null,
      end_booking_when_program_ends: true,
      end_booking_date: null,
      is_active: true,
      is_published: false,
      offer_early_bird: false,
      early_bird_discount_type: null,
      early_bird_discount_value: null,
      early_bird_deadline: null,
      banner_image_url: null,
      allow_deposits: false,
      deposit_amount: null,
      absorb_service_charge: false,
      allow_refunds: false,
      refund_deadline_in_hours: null,
      refund_percentage: null,
    },
  });

  // Edit form
  const editForm = useForm<ProgramFormValues>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      name: "",
      about: "",
      start_date: undefined,
      end_date: undefined,
      price: 0,
      capacity: null,
      start_booking_immediately: true,
      start_booking_date: null,
      end_booking_when_program_ends: true,
      end_booking_date: null,
      is_active: true,
      is_published: false,
      offer_early_bird: false,
      early_bird_discount_type: null,
      early_bird_discount_value: null,
      early_bird_deadline: null,
      banner_image_url: null,
      allow_deposits: false,
      deposit_amount: null,
      absorb_service_charge: false,
      allow_refunds: false,
      refund_deadline_in_hours: null,
      refund_percentage: null,
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (values: any) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post(
          "programs",
          {
            ...values,
          },
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
    onSuccess: (response: any) => {
      toast.success(response.message, { id: "create-program" });
      programForm.reset();
      setPrograms((prev) => [...prev, response.data.program]);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create new program", {
        id: "create-program",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: any }) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.patch(
          `programs/${id}`,
          {
            ...values,
          },
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
    onSuccess: (response: any) => {
      toast.success(response.message, { id: "update-program" });
      editForm.reset();
      setPrograms((prev) =>
        prev.map((program) =>
          program.id === response.data.program.id
            ? response.data.program
            : program
        )
      );
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update program", {
        id: "update-program",
      });
    },
  });

  const onSubmitProgram = async (data: ProgramFormValues) => {
    // Convert dates from user's timezone to UTC
    const convertToUTC = (date: Date | null | undefined) => {
      if (!date) return null;
      return dayjs(date).utc().toISOString();
    };

    const formatData = (val: any) => {
      const result: { [key: string]: any } = {};
      for (const [key, value] of Object.entries(val)) {
        if (value !== null && value !== undefined) {
          result[key] = value;
        }
      }
      return result;
    };

    const utcData = {
      ...data,
      start_date: convertToUTC(data.start_date),
      end_date: convertToUTC(data.end_date),
      start_booking_date: convertToUTC(data.start_booking_date),
      end_booking_date: convertToUTC(data.end_booking_date),
      early_bird_deadline: convertToUTC(data.early_bird_deadline),
    };

    try {
      await createProjectMutation.mutateAsync(formatData(utcData));
      setShowCreateModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmitEdit = async (data: ProgramFormValues) => {
    if (!editingProgram) return;

    // Convert dates from user's timezone to UTC
    const convertToUTC = (date: Date | null | undefined) => {
      if (!date) return null;
      return dayjs(date).utc().toISOString();
    };

    const formatData = (val: any) => {
      const result: { [key: string]: any } = {};
      for (const [key, value] of Object.entries(val)) {
        if (value !== null && value !== undefined) {
          result[key] = value;
        }
      }
      return result;
    };

    const utcData = {
      ...data,
      start_date: convertToUTC(data.start_date),
      end_date: convertToUTC(data.end_date),
      start_booking_date: convertToUTC(data.start_booking_date),
      end_booking_date: convertToUTC(data.end_booking_date),
      early_bird_deadline: convertToUTC(data.early_bird_deadline),
    };

    try {
      await updateProjectMutation.mutateAsync({
        id: editingProgram.id,
        values: formatData(utcData),
      });
      setShowEditModal(false);
      setEditingProgram(null);
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

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
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
      toast.success(response.message || "Program deleted successfully", { id: "delete-program" });
      setPrograms((prev) => prev.filter((program) => program.id !== selectedProgram?.id));
      setShowDetailsView(false);
      setSelectedProgram(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to delete program", {
        id: "delete-program",
      });
    },
  });

  const handleViewDetails = (program: IProgram) => {
    setSelectedProgram(program);
    setShowDetailsView(true);
  };

  const handleBackFromDetails = () => {
    setShowDetailsView(false);
    setSelectedProgram(null);
  };

  const handleEditFromDetails = () => {
    if (selectedProgram) {
      handleEditProgram(selectedProgram);
      setShowDetailsView(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (selectedProgram && window.confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      await deleteProjectMutation.mutateAsync(selectedProgram.id);
    }
  };

  const handleEditProgram = (program: IProgram) => {
    // Convert UTC dates back to user's timezone for editing
    const convertFromUTC = (dateString: string | undefined) => {
      if (!dateString) return undefined;
      return dayjs.utc(dateString).tz(userTimezone).toDate();
    };

    setEditingProgram(program);
    editForm.reset({
      name: program.name,
      about: program.about,
      start_date: convertFromUTC(program.start_date),
      end_date: convertFromUTC(program.end_date),
      price: parseFloat(program.price),
      capacity: program.capacity ? parseInt(program.capacity.toString()) : null,
      start_booking_immediately: program.start_booking_immediately,
      start_booking_date: convertFromUTC(program.start_booking_date),
      end_booking_when_program_ends: program.end_booking_when_program_ends,
      end_booking_date: convertFromUTC(program.end_booking_date),
      is_active: program.is_active,
      is_published: program.is_published,
      offer_early_bird: program.offer_early_bird,
      early_bird_discount_type: program.early_bird_discount_type,
      early_bird_discount_value: program.early_bird_discount_value
        ? parseFloat(program.early_bird_discount_value.toString())
        : null,
      early_bird_deadline: convertFromUTC(program.early_bird_deadline),
      banner_image_url: program.banner_image_url,
      allow_deposits: program.allow_deposits,
      deposit_amount: program.deposit_amount
        ? parseFloat(program.deposit_amount.toString())
        : null,
      absorb_service_charge: program.absorb_service_charge,
      allow_refunds: program.allow_refunds,
      refund_deadline_in_hours: program.refund_deadline_in_hours
        ? parseInt(program.refund_deadline_in_hours.toString())
        : null,
      refund_percentage: program.refund_percentage
        ? parseInt(program.refund_percentage.toString())
        : null,
    });
    setShowEditModal(true);
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
      case "price_very_high":
        return matchesSearch && parseInt(program.price, 10) > 500;
      case "price_high":
        return (
          matchesSearch &&
          parseInt(program.price, 10) > 100 &&
          parseInt(program.price, 10) <= 500
        );
      case "price_medium":
        return (
          matchesSearch &&
          parseInt(program.price, 10) > 50 &&
          parseInt(program.price, 10) <= 100
        );
      case "price_low":
        return matchesSearch && parseInt(program.price, 10) <= 50;
      default:
        return matchesSearch;
    }
  });

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = dayjs(startDate).tz(userTimezone);
    const end = dayjs(endDate).tz(userTimezone);

    if (start.isSame(end, "day")) {
      return `${start.format("MMM D, YYYY")} • ${start.format(
        "h:mm A"
      )} - ${end.format("h:mm A")}`;
    } else {
      return `${start.format("MMM D, YYYY h:mm A")} - ${end.format(
        "MMM D, YYYY h:mm A"
      )}`;
    }
  };

  useEffect(() => {
    // Fetch programs data
    const fetchPrograms = async () => {
      try {
        const response = await api.get<IProgramResponse>("programs");
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
      <div className={`transition-transform duration-700 ease-in-out ${showDetailsView ? '-translate-x-full' : 'translate-x-0'}`}>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#121212]">Programs</h1>
              <p className="text-[#6E6E73]">Manage your programs and workshops.</p>
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
                  <DropdownMenuItem onClick={() => setFilterBy("price_very_high")}>
                    Price &gt; £500
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("price_high")}>
                    Price &gt;= £100 and &lt; £500
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("price_medium")}>
                    Price &gt;= £50 and &lt; £100
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy("price_low")}>
                    Price &lt;= £50
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
                  {programs.length === 0 ? "No programs yet" : "No programs found"}
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
                          program.id
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
                    {/* Date Range */}
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-[#6E6E73] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#6E6E73]">
                        {formatDateRange(program.start_date, program.end_date)}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-1">
                      <PoundSterling className="h-4 w-4 text-[#6E6E73]" />
                      <span className="font-semibold text-[#121212]">
                        {program.price}
                      </span>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#6E6E73]" />
                      <span className="text-sm text-[#6E6E73]">
                        {program.capacity
                          ? `Up to ${program.capacity} participants`
                          : "Unlimited participants"}
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
      <div className={`absolute top-0 left-0 w-full h-full overflow-y-auto transition-transform duration-300 ease-in-out ${showDetailsView ? 'translate-x-0' : 'translate-x-full'}`}>
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
                  <h1 className="text-3xl font-bold text-[#121212]">{selectedProgram.name}</h1>
                  <p className="text-[#6E6E73]">Program Details</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditFromDetails()}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteProgram}
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
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Banner Image or Random Color - Top on mobile, Left on tablet+ */}
                    <div className="w-full md:w-1/3 lg:w-1/4">
                      <div className="relative h-32 md:h-24 lg:h-32 w-full rounded-lg overflow-hidden">
                        {selectedProgram.banner_image_url ? (
                          <img
                            src={selectedProgram.banner_image_url}
                            alt={selectedProgram.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className={`h-full w-full ${getRandomColor(
                              selectedProgram.id
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
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                        <p className="mt-1 text-sm">{selectedProgram.about || 'No description provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Date Range</label>
                        <p className="mt-1 text-sm">{formatDateRange(selectedProgram.start_date, selectedProgram.end_date)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Price</label>
                        <p className="mt-1 text-lg font-semibold">£{selectedProgram.price}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Capacity</label>
                        <p className="mt-1 text-sm">{selectedProgram.capacity ? `${selectedProgram.capacity} participants` : 'Unlimited'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Early Bird</label>
                        <p className="mt-1 text-sm">{selectedProgram.offer_early_bird ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                        <div className="mt-1">
                          <Badge variant={selectedProgram.is_published ? "default" : "secondary"}>
                            {selectedProgram.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Participants & Revenue */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Participants & Revenue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Participants</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">£0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">0</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Completed Sessions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Participant List */}
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Recent Participants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No participants yet
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      View All Participants
                    </Button>
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

              {/* Dates and Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dates and Pricing</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={programForm.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={programForm.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date *</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={programForm.control}
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
                    control={programForm.control}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            Program is visible to customers on your booking
                            page.
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
      <Dialog open={showEditModal} onOpenChange={(open) => {
        if (!open) {
          handleCloseEditModal();
        } else {
          setShowEditModal(open);
        }
      }}>
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
                            onCheckedChange={field.onChange}
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
                            onCheckedChange={field.onChange}
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
                          onCheckedChange={field.onChange}
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
                          onCheckedChange={field.onChange}
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
                            Program is visible to customers on your booking
                            page.
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
              You have unsaved changes. Are you sure you want to discard them and close the form?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleCancelClose}
            >
              Keep Editing
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmClose}
            >
              Discard Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
