"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { Plus, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import dayjs from "@/utils/dayjsConfig";
import { ProgramsList } from "@/components/programs/programs-list";
import { ProgramDetailsView } from "@/components/programs/program-details-view";
import { ProgramFormDialog } from "@/components/programs/program-form-dialog";
import { ClassFormDialog } from "@/components/programs/class-form-dialog";
import { ClassDetailsView } from "@/components/programs/class-details-view";
import { useProgramMutations } from "@/hooks/use-program-mutations";
import { convertToUTC } from "@/utils/time";
import { useCompanyDetails } from "@/hooks/use-company-details";

export default function ProgramsPageRefactored() {
  const { data: settings } = useCompanyDetails();
  const router = useRouter();
  const userTimezone = dayjs.tz.guess();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<INewProgram | null>(
    null
  );
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showEditClassModal, setShowEditClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<IProgramClass | null>(null);
  const [showDetailsView, setShowDetailsView] = useState(false);
  const [showClassView, setShowClassView] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<INewProgram | null>(
    null
  );
  const [selectedClass, setSelectedClass] = useState<IProgramClass | null>(
    null
  );

  const { data: programsData, isLoading: isProgramsLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const response = await api.get<GetAllProgramsResponse>("programs");
      return response;
    },
  });
  const { data: programData, isLoading: isProgramLoading } = useQuery({
    queryKey: ["program", selectedProgram?.id],
    queryFn: async () => {
      if (!selectedProgram?.id) return null;
      return await api.get<GetProgramByIdResponse>(
        `programs/${selectedProgram?.id}`
      );
    },
    enabled: !!selectedProgram?.id,
  });

  const { data: classData, isLoading: isClassLoading } = useQuery({
    queryKey: ["program-class", selectedClass?.id],
    queryFn: async () => {
      if (!selectedClass?.id) return null;
      return await api.get<GetProgramClassByIdResponse>(
        `programs/classes/${selectedClass.id}`
      );
    },
    enabled: !!selectedClass?.id,
  });

  const programs = programsData?.data?.programs || [];
  const programDetails: {
    classes: IProgramClass[];
    students: IProgramStudent[];
    stats: IProgramStat;
  } | null = programData?.data
    ? {
        classes: programData.data.classes,
        students: programData.data.students,
        stats: programData.data.stats,
      }
    : null;
  const classDetails: { students: any[] } | undefined = classData?.data
    ? { students: classData.data.students || [] } // Add fallback for students
    : undefined;

  const {
    createProgramMutation,
    updateProgramMutation,
    deleteProgramMutation,
    createClassMutation,
    updateClassMutation,
    deleteClassMutation,
  } = useProgramMutations();

  // Filter and search programs
  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!filterBy) return matchesSearch;

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

  const handleViewDetails = (program: INewProgram) => {
    setSelectedProgram(program);
    setShowDetailsView(true);
  };

  const handleBackFromDetails = () => {
    setShowDetailsView(false);
    setSelectedProgram(null);
  };

  const handleBackFromClassDetails = () => {
    setShowClassView(false);
    setSelectedClass(null);
  };

  const handleDeleteProgram = () => {
    if (!selectedProgram) return;

    if (selectedProgram.is_published) {
      toast.error(
        "Cannot delete a published program. Please deactivate it instead.",
        {
          duration: 4000,
        }
      );
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete "${selectedProgram.name}"?`
      )
    ) {
      deleteProgramMutation.mutate(selectedProgram.id, {
        onSuccess: () => {
          setShowDetailsView(false);
          setSelectedProgram(null);
        },
      });
    }
  };

  const handleCreateProgram = async (values: any) => {
    const payload = {
      ...values,
      owner_id: settings?.memberId,
    };

    createProgramMutation.mutate(payload, {
      onSuccess: () => {
        setShowCreateModal(false);
      },
    });
  };

  const handleEditProgram = (program: INewProgram) => {
    setEditingProgram(program);
    setShowEditModal(true);
  };

  const handleUpdateProgram = async (values: any) => {
    if (!editingProgram) return;

    updateProgramMutation.mutate(
      { id: editingProgram.id, values },
      {
        onSuccess: () => {
          setShowEditModal(false);
          setEditingProgram(null);
        },
      }
    );
  };

  const handleCreateClass = () => {
    setShowCreateClassModal(true);
  };

  const handleCreateClassSubmit = (values: any) => {
    if (!selectedProgram) return;

    createClassMutation.mutate(
      {
        programId: selectedProgram.id,
        values: {
          ...values,
          program_id: selectedProgram.id,
          owner_id: settings?.memberId,
        },
      },
      {
        onSuccess: () => {
          setShowCreateClassModal(false);
        },
      }
    );
  };

  const handleEditClass = (cls: IProgramClass) => {
    setEditingClass(cls);
    setShowEditClassModal(true);
  };

  const handleUpdateClass = (values: any) => {
    if (!editingClass) return;

    updateClassMutation.mutate(
      { id: editingClass.id, values },
      {
        onSuccess: () => {
          setShowEditClassModal(false);
          setEditingClass(null);
        },
      }
    );
  };

  const handleViewClass = (cls: IProgramClass) => {
    setSelectedClass(cls);
    setShowClassView(true);
  };

  const handleDeleteClass = (cls: IProgramClass) => {
    if (cls.is_published) {
      toast.error(
        "Cannot delete a published class. Please deactivate it instead.",
        {
          duration: 4000,
        }
      );
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${cls.name}"?`)) {
      deleteClassMutation.mutate(cls.id, {
        onSuccess: () => {
          if (showClassView) {
            handleBackFromClassDetails();
          }
        },
      });
    }
  };

  // Restrict access to admin and owner only
  useEffect(() => {
    if (settings && settings.role !== "owner" && settings.role !== "admin") {
      toast.error("You don't have permission to access this page");
      router.push("/dashboard");
    }
  }, [settings, router]);

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
                  <DropdownMenuItem
                    onClick={() => setFilterBy("without_classes")}
                  >
                    Without Classes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Create New Program Button */}
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <Button
                  className="gap-2"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  Create Program
                </Button>
              </Dialog>
            </div>
          </div>

          {/* Programs List */}
          <ProgramsList
            programs={programs}
            filteredPrograms={filteredPrograms}
            isLoading={isProgramsLoading}
            onEdit={handleEditProgram}
            onViewDetails={handleViewDetails}
            onCreateClick={() => setShowCreateModal(true)}
          />
        </div>
      </div>

      {/* Details View */}
      <div
        className={`absolute top-0 left-0 w-full h-full md:px-4 xl:px-8 overflow-y-auto transition-transform duration-300 ease-in-out ${
          showDetailsView && !showClassView ? "translate-x-0" : showClassView ? "-translate-x-full" : "translate-x-full"
        }`}
        style={{ zIndex: 15 }}
      >
        {selectedProgram && (
          <ProgramDetailsView
            program={selectedProgram}
            programDetails={programDetails}
            isLoading={isProgramLoading}
            userTimezone={userTimezone}
            onBack={handleBackFromDetails}
            onDelete={handleDeleteProgram}
            onCreateClass={handleCreateClass}
            onEditClass={handleEditClass}
            onViewClass={handleViewClass}
            onDeleteClass={handleDeleteClass}
          />
        )}
      </div>

      {/* Class Details View */}
      <div
        className={`absolute top-0 left-0 w-full h-full md:px-4 xl:px-8 overflow-y-auto transition-transform duration-300 ease-in-out ${
          showClassView ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 20 }}
      >
        {selectedClass && selectedProgram && (
          <ClassDetailsView
            selectedClass={selectedClass}
            selectedProgram={selectedProgram}
            classDetails={classDetails}
            isLoadingClassDetails={isClassLoading}
            userTimezone={userTimezone}
            onBack={handleBackFromClassDetails}
            onEdit={handleEditClass}
            onDelete={handleDeleteClass}
          />
        )}
      </div>

      {/* Create Program Dialog */}
      <ProgramFormDialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        program={null}
        onSubmit={handleCreateProgram}
        isSubmitting={createProgramMutation.isPending}
      />

      {/* Edit Program Dialog */}
      <ProgramFormDialog
        open={showEditModal}
        onOpenChange={setShowEditModal}
        program={editingProgram}
        onSubmit={handleUpdateProgram}
        isSubmitting={updateProgramMutation.isPending}
      />

      {/* Create Class Dialog */}
      {selectedProgram && (
        <ClassFormDialog
          open={showCreateClassModal}
          onOpenChange={setShowCreateClassModal}
          program={selectedProgram}
          classData={null}
          onSubmit={handleCreateClassSubmit}
          isSubmitting={createClassMutation.isPending}
        />
      )}

      {/* Edit Class Dialog */}
      {selectedProgram && (
        <ClassFormDialog
          open={showEditClassModal}
          onOpenChange={setShowEditClassModal}
          program={selectedProgram}
          classData={editingClass}
          onSubmit={handleUpdateClass}
          isSubmitting={updateClassMutation.isPending}
        />
      )}
    </div>
  );
}
