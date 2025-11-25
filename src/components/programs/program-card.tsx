import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users } from "lucide-react";
import { INewProgram } from "@/types/response";
import { getRandomColor } from "@/utils/color";

interface ProgramCardProps {
  program: INewProgram;
  onEdit: (program: INewProgram) => void;
  onViewDetails: (program: INewProgram) => void;
}

export function ProgramCard({ program, onEdit, onViewDetails }: ProgramCardProps) {
  return (
    <Card className="border-0 shadow-card overflow-hidden hover:shadow-lg transition-shadow">
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
          <Badge variant={program.is_published ? "default" : "secondary"}>
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
            {program.class_count || 0} Classes
          </span>
        </div>

        {/* Total Enrolled Students */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#6E6E73]" />
          <span className="text-sm text-[#6E6E73]">
            {program.enrolled_students_count ?? 0} students enrolled
          </span>
        </div>

        {/* Program Status */}
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              program.is_active ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span className="text-sm text-[#6E6E73]">
            {program.is_active ? "Active" : "Inactive"} •{" "}
            {program.is_published ? "Published" : "Draft"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(program)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(program)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
