"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, Trash2, Users, Loader2 } from "lucide-react";
import dayjs from "@/utils/dayjsConfig";

interface ClassStudent {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  Enrollments: Array<{
    createdAt: string;
  }>;
}

interface ClassDetails {
  students: ClassStudent[];
}

interface ClassDetailsViewProps {
  selectedClass: any; // TODO: Create proper type
  selectedProgram: any; // TODO: Create proper type
  classDetails?: ClassDetails;
  isLoadingClassDetails: boolean;
  userTimezone: string;
  onBack: () => void;
  onEdit: (classData: any) => void;
  onDelete: (classData: any) => void;
}

export function ClassDetailsView({
  selectedClass,
  selectedProgram,
  classDetails,
  isLoadingClassDetails,
  userTimezone,
  onBack,
  onEdit,
  onDelete,
}: ClassDetailsViewProps) {
  return (
    <div className="space-y-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-[#6E6E73] mb-1">
              <span
                className="hover:text-[#121212] cursor-pointer"
                onClick={onBack}
              >
                {selectedProgram?.name}
              </span>
              <span className="mx-2">/</span>
              <span className="text-[#121212] font-medium">
                {selectedClass.name}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#121212]">
              {selectedClass.name}
            </h1>
            <p className="text-[#6E6E73]">Class Details</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(selectedClass)}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(selectedClass)}
            disabled={selectedClass.is_published}
            title={
              selectedClass.is_published
                ? "Cannot delete published classes. Deactivate instead."
                : "Delete class"
            }
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Class Overview */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Class Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Start Date & Time
              </label>
              <p className="mt-1 text-sm">
                {dayjs
                  .utc(selectedClass.start_date)
                  .tz(userTimezone)
                  .format("MMM D, YYYY [at] h:mm A")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                End Date & Time
              </label>
              <p className="mt-1 text-sm">
                {dayjs
                  .utc(selectedClass.end_date)
                  .tz(userTimezone)
                  .format("MMM D, YYYY [at] h:mm A")}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Price
              </label>
              <p className="mt-1 text-sm">
                £{parseFloat(selectedClass.price.toString()).toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Capacity
              </label>
              <p className="mt-1 text-sm">
                {selectedClass.capacity || "Unlimited"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </label>
              <div className="mt-1 flex gap-2">
                <Badge
                  variant={
                    selectedClass.is_published ? "default" : "secondary"
                  }
                >
                  {selectedClass.is_published ? "Published" : "Draft"}
                </Badge>
                <Badge
                  variant={selectedClass.is_active ? "default" : "secondary"}
                >
                  {selectedClass.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Enrolled Students
              </label>
              <p className="mt-1 text-sm">
                {classDetails?.students?.length || 0}
              </p>
            </div>
            {selectedClass.description && (
              <div className="md:col-span-2 xl:col-span-3">
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Description
                </label>
                <p className="mt-1 text-sm">{selectedClass.description}</p>
              </div>
            )}
          </div>

          {/* Booking Settings */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Booking Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Booking Start
                </label>
                <p className="mt-1 text-sm">
                  {selectedClass.start_booking_immediately
                    ? "Immediately"
                    : selectedClass.start_booking_date
                    ? dayjs
                        .utc(selectedClass.start_booking_date)
                        .tz(userTimezone)
                        .format("MMM D, YYYY [at] h:mm A")
                    : "Not set"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Booking End
                </label>
                <p className="mt-1 text-sm">
                  {selectedClass.end_booking_when_class_ends
                    ? "When class ends"
                    : selectedClass.end_booking_date
                    ? dayjs
                        .utc(selectedClass.end_booking_date)
                        .tz(userTimezone)
                        .format("MMM D, YYYY [at] h:mm A")
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* Early Bird & Deposits */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-3">Early Bird Offer</h4>
                {selectedClass.offer_early_bird ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Discount:</span>{" "}
                      {selectedClass.early_bird_discount_type === "percentage"
                        ? `${selectedClass.early_bird_discount_value}%`
                        : `£${selectedClass.early_bird_discount_value}`}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Deadline:</span>{" "}
                      {selectedClass.early_bird_deadline
                        ? dayjs
                            .utc(selectedClass.early_bird_deadline)
                            .tz(userTimezone)
                            .format("MMM D, YYYY [at] h:mm A")
                        : "Not set"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No early bird offer</p>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-3">Deposits</h4>
                {selectedClass.allow_deposits ? (
                  <p className="text-sm">
                    <span className="font-medium">Amount:</span> £
                    {selectedClass.deposit_amount?.toFixed(2) || "0.00"}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Deposits not allowed</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingClassDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : classDetails?.students && classDetails.students.length > 0 ? (
            <div className="space-y-3">
              {classDetails.students.map((student, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {student.email} || {student.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Enrolled:{" "}
                      {dayjs(student.Enrollments[0]?.createdAt).format("lll")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                No students enrolled yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
