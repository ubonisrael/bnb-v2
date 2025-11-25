import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Trash2,
  Plus,
  Edit2,
  Eye,
  Calendar,
  Users,
  PoundSterling,
  BookOpen,
} from "lucide-react";
import dayjs from "@/utils/dayjsConfig";
import { getRandomColor } from "@/utils/color";
import { formatDateRange } from "@/utils/time";
import { INewProgram, IProgramClass, IProgramStat, IProgramStudent } from "@/types/response";

interface ProgramDetailsViewProps {
  program: INewProgram;
  programDetails: {
    classes: IProgramClass[];
    students: IProgramStudent[];
    stats: IProgramStat;
  } | null;
  isLoading: boolean;
  userTimezone: string;
  onBack: () => void;
  onDelete: () => void;
  onCreateClass: () => void;
  onEditClass: (cls: IProgramClass) => void;
  onViewClass: (cls: IProgramClass) => void;
  onDeleteClass: (cls: IProgramClass) => void;
}

export function ProgramDetailsView({
  program,
  programDetails,
  isLoading,
  userTimezone,
  onBack,
  onDelete,
  onCreateClass,
  onEditClass,
  onViewClass,
  onDeleteClass,
}: ProgramDetailsViewProps) {
  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#121212]">{program.name}</h1>
            <p className="text-[#6E6E73]">Program Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            disabled={program.is_published}
            title={
              program.is_published
                ? "Cannot delete published programs. Deactivate instead."
                : "Delete program"
            }
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
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12">
              {/* Banner Image */}
              <div className="w-full md:w-1/3 lg:w-1/4">
                <div className="relative h-48 lg:h-60 w-full rounded-lg overflow-hidden">
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
                      <span className="text-white text-sm font-semibold text-center px-2">
                        {program.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Program Details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Created
                  </label>
                  <p className="mt-1 text-sm">
                    {dayjs(program.createdAt).format("MMM D, YYYY")}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge variant={program.is_published ? "default" : "secondary"}>
                      {program.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Capacity
                  </label>
                  <p className="mt-1 text-sm">
                    {program.set_capacity_per_class
                      ? "Set per class"
                      : program.capacity !== null
                      ? program.capacity
                      : "No capacity limit"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Deposit Amount
                  </label>
                  <p className="mt-1 text-sm">
                    {program.set_deposit_instructions_per_class
                      ? "Set per class"
                      : program.allow_deposits
                      ? `£${parseFloat(program.deposit_amount?.toString() ?? "0").toFixed(2)}`
                      : "Deposits not allowed"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Allow Refunds
                  </label>
                  <p className="mt-1 text-sm">
                    {program.allow_refunds
                      ? `Yes - ${program.refund_percentage}% refund up to ${program.refund_deadline_in_hours} hours before class`
                      : "No"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Description
                  </label>
                  <p className="mt-1 text-sm">{program.about || "No description provided"}</p>
                </div>

                {program.is_published && (
                  <div className="md:col-span-3 mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-amber-900">!</span>
                      </div>
                      <div className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Published Program:</strong> This program cannot be deleted or
                        unpublished. You can deactivate it to stop new bookings while keeping
                        existing data.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Statistics */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {programDetails?.stats.totalClasses || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Classes</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {programDetails?.stats.uniqueStudents || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  £{programDetails?.stats.totalRevenue.toFixed(2) || "0.00"}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  £{programDetails?.stats.averageRevenuePerClass.toFixed(2) || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Average Revenue/Class
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Classes Management */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Classes</CardTitle>
              <Button size="sm" onClick={onCreateClass} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Class
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {programDetails?.classes && programDetails.classes.length > 0 ? (
              <div className="space-y-3">
                {programDetails.classes.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{cls.name}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateRange(cls.start_date, cls.end_date, userTimezone)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {cls.enrollmentCount || 0} students
                        </span>
                        <span className="flex items-center">
                          <PoundSterling className="h-3 w-3" />
                          {cls.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewClass(cls)}
                        className="p-2"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditClass(cls)}
                        className="p-2"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteClass(cls)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                  No classes added yet
                </p>
                <Button size="sm" onClick={onCreateClass} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Class
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
