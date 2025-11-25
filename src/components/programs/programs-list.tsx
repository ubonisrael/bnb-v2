import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { INewProgram } from "@/types/response";
import { ProgramCard } from "./program-card";

interface ProgramsListProps {
  programs: INewProgram[];
  filteredPrograms: INewProgram[];
  isLoading: boolean;
  onEdit: (program: INewProgram) => void;
  onViewDetails: (program: INewProgram) => void;
  onCreateClick: () => void;
}

export function ProgramsList({
  programs,
  filteredPrograms,
  isLoading,
  onEdit,
  onViewDetails,
  onCreateClick,
}: ProgramsListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-[#7B68EE]"></div>
        <p className="mt-4 text-[#6E6E73]">Loading programs...</p>
      </div>
    );
  }

  if (filteredPrograms.length === 0) {
    return (
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
            <Button className="gap-2" onClick={onCreateClick}>
              <Plus className="h-4 w-4" />
              Create Your First Program
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredPrograms.map((program) => (
        <ProgramCard
          key={program.id}
          program={program}
          onEdit={onEdit}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
