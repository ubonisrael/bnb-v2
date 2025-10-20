"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/services/api-service";
import dayjs from "@/utils/dayjsConfig";
import { IExtendedProgram } from "@/types/response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getRandomColor } from "@/utils/color";
import { formatDateRange } from "@/utils/time";
import {
  Calendar,
  Users,
  PoundSterling,
  Plus,
  Minus,
  ShoppingCart,
  Eye,
  Clock,
  AlertCircle,
  CirclePercent,
  Home,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getProgramPrice, getServiceFee } from "@/utils/programs";

const registrationFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  agree_to_terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type ProgramRegistrationFormValues = z.infer<typeof registrationFormSchema>;

interface IProgramRegistrationResponse {
  success: boolean;
  message: string;
  data: {
    studentId: string;
    customerId: string;
    totalAmount: number;
    programsRegistered: number;
    paymentUrl: string;
  };
}

interface ProgramRegistrationWizardProps {
  programs: IExtendedProgram[];
  businessUrl: string;
}

export function ProgramRegistrationWizard(
  props: ProgramRegistrationWizardProps
) {
  const [showProgRegistrationModal, setShowProgRegistrationModal] =
    useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<IExtendedProgram[]>(
    []
  );
  const [selectedProgramForModal, setSelectedProgramForModal] =
    useState<IExtendedProgram | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userTimezone = dayjs.tz.guess();

  // Get service provider info from first program (assuming all programs are from same provider)
  const serviceProvider =
    props.programs.length > 0 ? props.programs[0].ServiceProvider : null;

  const addToCart = (program: IExtendedProgram) => {
    if (!selectedPrograms.find((p) => p.id === program.id)) {
      const updatedPrograms = [...selectedPrograms, program];
      setSelectedPrograms(updatedPrograms);
    }
  };

  const removeFromCart = (programId: string) => {
    const updatedPrograms = selectedPrograms.filter((p) => p.id !== programId);
    setSelectedPrograms(updatedPrograms);
  };

  const getTotalPrice = () => {
    return selectedPrograms.reduce((total, program) => {
      const basePrice =
        program.allow_deposits && program.deposit_amount
          ? parseFloat(program.deposit_amount.toString())
          : parseFloat(program.price);

      // Add service fee if not absorbed
      const serviceFee = program.absorb_service_charge
        ? 0
        : Math.max(1, basePrice * 0.1);

      return total + basePrice + serviceFee;
    }, 0);
  };

  const isProgramDeposit = (program: IExtendedProgram) => {
    return program.allow_deposits && program.deposit_amount;
  };

  const canAddToCart = (program: IExtendedProgram) => {
    const now = dayjs();

    // Check available seats
    if (program.availableSeats !== undefined && program.availableSeats < 1) {
      return false;
    }

    // Check if booking hasn't started yet (only if not starting immediately)
    if (
      !program.start_booking_immediately &&
      program.start_booking_date &&
      now.isBefore(dayjs(program.start_booking_date))
    ) {
      return false;
    }

    // Check if booking has ended (custom end date or program end date)
    if (
      !program.end_booking_when_program_ends &&
      program.end_booking_date &&
      now.isAfter(dayjs(program.end_booking_date))
    ) {
      return false;
    } else if (
      program.end_booking_when_program_ends &&
      now.isAfter(dayjs(program.end_date))
    ) {
      return false;
    }

    return true;
  };

  const getDisabledReason = (program: IExtendedProgram) => {
    const now = dayjs();

    if (program.availableSeats !== undefined && program.availableSeats < 1) {
      return "No seats available";
    }

    if (
      !program.start_booking_immediately &&
      program.start_booking_date &&
      now.isBefore(dayjs(program.start_booking_date))
    ) {
      return `Booking opens ${dayjs(program.start_booking_date)
        .tz(userTimezone)
        .format("LLL")}`;
    }

    if (
      !program.end_booking_when_program_ends &&
      program.end_booking_date &&
      now.isAfter(dayjs(program.end_booking_date))
    ) {
      return "Booking deadline has passed";
    } else if (
      program.end_booking_when_program_ends &&
      now.isAfter(dayjs(program.end_date))
    ) {
      return "Booking deadline has passed";
    }

    return "";
  };

  const truncateText = (text: string, wordLimit: number = 20) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return { truncated: text, hasMore: false };
    }
    return {
      truncated: words.slice(0, wordLimit).join(" ") + "...",
      hasMore: true,
    };
  };

  const openProgramModal = (program: IExtendedProgram) => {
    setSelectedProgramForModal(program);
    setIsModalOpen(true);
  };

  const closeProgramModal = () => {
    setSelectedProgramForModal(null);
    setIsModalOpen(false);
  };

  const form = useForm<ProgramRegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      agree_to_terms: false,
    },
  });

  const registrationMutation = useMutation<
    IProgramRegistrationResponse,
    Error,
    ProgramRegistrationFormValues
  >({
    mutationFn: async (
      data: ProgramRegistrationFormValues
    ): Promise<IProgramRegistrationResponse> => {
      toast.loading("Processing registration...", { id: "prog-registration" });
      return api.post(
        `programs/register`,
        data
      ) as Promise<IProgramRegistrationResponse>;
    },
    onSuccess: async (data: IProgramRegistrationResponse) => {
      toast.dismiss("prog-registration");
      toast.success("Registration successful! Redirecting to payment...");
      setIsRedirecting(true); // Show loading overlay

      if (data?.data.paymentUrl) {
        window.location.href = data.data.paymentUrl;
      } else {
        // Fallback - close modal and reset form
        setShowProgRegistrationModal(false);
        form.reset();
        setSelectedPrograms([]);
      }
    },
    onError: (error: any) => {
      toast.dismiss("prog-registration");
      toast.remove("prog-registration");
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        "Error while registering for program(s)";
      toast.error(errorMessage, {
        id: "prog-registration-error",
      });
    },
  });

  async function onSubmit(data: ProgramRegistrationFormValues) {
    try {
      // Add selected program IDs to the form data
      const formDataWithPrograms = {
        ...data,
        programIds: selectedPrograms.map((p) => p.id),
      };

      await registrationMutation.mutateAsync(formDataWithPrograms);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  return (
    <div className="w-full bg-slate-100 py-16 sm:pb-20 lg:pb-24">
      <div className="sm:px-6 pb-4 sm:py-6 lg:py-8 mx-auto max-w-7xl">
        <div className="w-full bg-slate-100 min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Program Registration
                  </h1>
                  <p className="text-gray-600">
                    Select the programs you'd like to register for and proceed
                    to checkout.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `/booking/${props.businessUrl}`)
                  }
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Section: Programs (3/5 width) */}
              <div className="flex-1 lg:w-3/5 space-y-6">
                {props.programs
                  .filter(
                    (program) => program.is_published && program.is_active
                  )
                  .map((program) => (
                    <Card
                      key={program.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Banner Image or Random Color */}
                        <div className="relative w-full md:w-64 h-48 md:h-72">
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
                              <span className="text-white text-xl font-semibold text-center px-4">
                                {program.name}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Program Details */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col mb-4">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {program.name}
                            </h3>
                            <div className="">
                              {program.allow_deposits &&
                              program.deposit_amount ? (
                                <>
                                  <div className="text-2xl font-bold text-green-600">
                                    £{getProgramPrice(program)}
                                    <span className="text-sm font-normal text-gray-600 ml-1">
                                      (Deposit)
                                    </span>
                                  </div>
                                  <div className="text-sm font-bold text-gray-500">
                                    Balance: £
                                    {(
                                      parseFloat(program.price) -
                                      parseFloat(
                                        program.deposit_amount.toString() || "0"
                                      )
                                    ).toFixed(2)}
                                  </div>
                                </>
                              ) : (
                                <div className="text-2xl font-bold text-green-600">
                                  £{getProgramPrice(program)}
                                </div>
                              )}
                              <div className="text-sm text-gray-500">
                                Inclusive of a non-refundable service fee of £
                                {getServiceFee(program).toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {program.about && (
                            <div className="mb-4">
                              <p className="text-gray-600">
                                {truncateText(program.about).truncated}
                              </p>
                              {truncateText(program.about).hasMore && (
                                <button
                                  onClick={() => openProgramModal(program)}
                                  className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                                >
                                  See more
                                </button>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-1 gap-4 mb-6">
                            {/* Date Range */}
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-gray-500" />
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  Duration
                                </div>
                                <div className="text-sm text-gray-600">
                                  {formatDateRange(
                                    program.start_date,
                                    program.end_date,
                                    userTimezone
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Capacity */}
                            <div className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-gray-500" />
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  Capacity
                                </div>
                                <div className="flex gap-1 text-sm text-gray-600">
                                  <div>
                                    {program.capacity
                                      ? `${program.capacity} participants`
                                      : "Unlimited"}
                                  </div>
                                  {program.availableSeats !== undefined && (
                                    <div className="">
                                      <span
                                        className={`font-medium ${
                                          program.availableSeats < 1
                                            ? "text-red-600"
                                            : program.availableSeats <= 5
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                        }`}
                                      >
                                        (
                                        {program.availableSeats < 1
                                          ? "Sold out"
                                          : `${program.availableSeats} seats available`}
                                        )
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Deposits */}
                            <div className="flex items-center gap-2">
                              <PoundSterling className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  Deposit Option
                                </div>
                                {program.allow_deposits &&
                                program.deposit_amount ? (
                                  <div className="text-sm text-gray-600">
                                    £{program.deposit_amount} deposit available
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-sm text-gray-600">
                                      No deposit option available
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Early Bird */}
                            <div className="flex items-center gap-2">
                              <CirclePercent className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-sm font-medium text-gray-700">
                                  Early Bird Discount
                                </div>
                                {program.early_bird_deadline ? (
                                  <div className="text-sm ">
                                    <span className="font-medium text-green-600">
                                      {program.early_bird_discount_type ===
                                      "percentage"
                                        ? `${program.early_bird_discount_value}% off`
                                        : `£${program.early_bird_discount_value} off`}
                                    </span>
                                    {"  "}
                                    Until{" "}
                                    {dayjs(program.early_bird_deadline)
                                      .tz(userTimezone)
                                      .format("LLL")}
                                  </div>
                                ) : (
                                  <span className="text-xs font-medium text-red-600">
                                    No discount available
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Refund Policy */}
                            <div className="">
                              {program.allow_refunds ? (
                                <>
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 border-green-600"
                                  >
                                    Refundable
                                  </Badge>
                                  <div className="text-sm mt-1 text-gray-600">
                                    {program.refund_percentage && (
                                      <span>
                                        {program.refund_percentage}% refund
                                      </span>
                                    )}
                                    {program.refund_deadline_in_hours && (
                                      <span className="ml-1">
                                        (within{" "}
                                        {program.refund_deadline_in_hours}{" "}
                                        hours)
                                      </span>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-red-600 border-red-600"
                                >
                                  Non-refundable
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex justify-between items-center p-4">
                        <Button
                          variant="outline"
                          onClick={() => openProgramModal(program)}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>

                        <div className="flex flex-col items-end gap-2">
                          {!canAddToCart(program) ? (
                            <div className="flex items-center gap-1 text-sm text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              <span>{getDisabledReason(program)}</span>
                            </div>
                          ) : selectedPrograms.some(
                              (p) => p.id === program.id
                            ) ? (
                            <Button
                              onClick={() => removeFromCart(program.id)}
                              variant="destructive"
                              className="flex items-center gap-2"
                            >
                              <Minus className="h-4 w-4" />
                              Remove from Cart
                            </Button>
                          ) : (
                            <Button
                              onClick={() => addToCart(program)}
                              disabled={!canAddToCart(program)}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>

              {/* Right Section: Cart (2/5 width) - Sticky */}
              <div className="lg:w-2/5">
                <div className="sticky top-24">
                  <Card>
                    {/* Cart Header with Service Provider Info */}
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        {serviceProvider?.logo ? (
                          <img
                            src={serviceProvider.logo}
                            alt={serviceProvider.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold text-lg">
                              {serviceProvider?.name.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {serviceProvider?.name || "Program Registration"}
                          </h2>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ShoppingCart className="h-4 w-4" />
                            {selectedPrograms.length} program
                            {selectedPrograms.length !== 1 ? "s" : ""} selected
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {selectedPrograms.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No programs selected</p>
                          <p className="text-sm text-gray-400">
                            Add programs to your cart to get started
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4 mb-6">
                            {selectedPrograms.map((program) => (
                              <div
                                key={program.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                              >
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 mb-1">
                                    {program.name}
                                  </h4>
                                  <div className="text-sm text-gray-600 mb-1">
                                    Starts:{" "}
                                    {dayjs(program.start_date)
                                      .tz(userTimezone)
                                      .format("LLLL")}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <div className="text-lg font-semibold text-green-600">
                                        £{getProgramPrice(program).toFixed(2)}
                                      </div>
                                      {isProgramDeposit(program) && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Deposit
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Inclusive of a non-refundable service fee
                                      of £{getServiceFee(program).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFromCart(program.id)}
                                  className="ml-4"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          {/* Total and Checkout */}
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-lg font-semibold text-gray-900">
                                Total:
                              </span>
                              <span className="text-2xl font-bold text-green-600">
                                £{getTotalPrice().toFixed(2)}
                              </span>
                            </div>
                            <Button
                              onClick={() => setShowProgRegistrationModal(true)}
                              className="w-full"
                              size="lg"
                              disabled={selectedPrograms.length === 0}
                            >
                              Proceed to Registration
                            </Button>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Program Details Modal */}
          <Dialog open={isModalOpen} onOpenChange={closeProgramModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedProgramForModal && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {selectedProgramForModal.name}
                    </DialogTitle>
                    <DialogDescription>
                      Complete program details and information
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Left Section - Image and Basic Info */}
                    <div className="space-y-4">
                      {selectedProgramForModal.banner_image_url ? (
                        <img
                          src={selectedProgramForModal.banner_image_url}
                          alt={selectedProgramForModal.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ) : (
                        <div
                          className={`w-full h-64 ${getRandomColor(
                            selectedProgramForModal.id
                          )} rounded-lg flex items-center justify-center`}
                        >
                          <span className="text-white text-2xl font-semibold text-center px-4">
                            {selectedProgramForModal.name}
                          </span>
                        </div>
                      )}

                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          £{getProgramPrice(selectedProgramForModal).toFixed(2)}
                          {isProgramDeposit(selectedProgramForModal) && (
                            <span className="text-base ml-2 text-gray-600">
                              (Deposit Amount)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Inclusive of a non-refundable service fee of £
                          {getServiceFee(selectedProgramForModal).toFixed(2)}
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Full price: £{selectedProgramForModal.price}</div>
                        {isProgramDeposit(selectedProgramForModal) && (
                          <div>
                            Deposit amount: £
                            {selectedProgramForModal.deposit_amount}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Details */}
                    <div className="space-y-6">
                      {selectedProgramForModal.about && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">About</h3>
                          <p className="text-gray-600 leading-relaxed">
                            {selectedProgramForModal.about}
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Date Range */}
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-700">
                              Duration
                            </div>
                            <div className="text-gray-600">
                              {formatDateRange(
                                selectedProgramForModal.start_date,
                                selectedProgramForModal.end_date,
                                userTimezone
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Capacity and Available Seats */}
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-700">
                              Capacity
                            </div>
                            <div className="flex gap-1 text-sm text-gray-600">
                              <div>
                                {selectedProgramForModal.capacity
                                  ? `${selectedProgramForModal.capacity} participants`
                                  : "Unlimited"}
                              </div>
                              {selectedProgramForModal.availableSeats !==
                                undefined && (
                                <div className="">
                                  <span
                                    className={`font-medium ${
                                      selectedProgramForModal.availableSeats < 1
                                        ? "text-red-600"
                                        : selectedProgramForModal.availableSeats <=
                                          5
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    (
                                    {selectedProgramForModal.availableSeats < 1
                                      ? "Sold out"
                                      : `${selectedProgramForModal.availableSeats} seats available`}
                                    )
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Booking Timeline */}
                        {(!selectedProgramForModal.start_booking_immediately ||
                          !selectedProgramForModal.end_booking_when_program_ends) && (
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-700">
                                Booking Window
                              </div>
                              <div className="text-gray-600">
                                {!selectedProgramForModal.start_booking_immediately &&
                                  selectedProgramForModal.start_booking_date && (
                                    <div>
                                      Opens:{" "}
                                      {dayjs(
                                        selectedProgramForModal.start_booking_date
                                      ).format("MMM D, YYYY")}
                                    </div>
                                  )}
                                {selectedProgramForModal.start_booking_immediately && (
                                  <div>Opens: Immediately</div>
                                )}
                                {!selectedProgramForModal.end_booking_when_program_ends &&
                                  selectedProgramForModal.end_booking_date && (
                                    <div>
                                      Closes:{" "}
                                      {dayjs(
                                        selectedProgramForModal.end_booking_date
                                      ).format("MMM D, YYYY")}
                                    </div>
                                  )}
                                {selectedProgramForModal.end_booking_when_program_ends && (
                                  <div>
                                    Closes: When program ends (
                                    {dayjs(
                                      selectedProgramForModal.end_date
                                    ).format("MMM D, YYYY")}
                                    )
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Early Bird */}
                        {selectedProgramForModal.offer_early_bird && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Badge variant="secondary" className="mb-2">
                              Early Bird Available
                            </Badge>
                            {selectedProgramForModal.early_bird_deadline && (
                              <div className="text-sm text-gray-600">
                                Available until{" "}
                                {dayjs(
                                  selectedProgramForModal.early_bird_deadline
                                ).format("MMM D, YYYY")}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Deposits */}
                        {selectedProgramForModal.allow_deposits &&
                          selectedProgramForModal.deposit_amount && (
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <PoundSterling className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-700">
                                  Deposit Option Available
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Pay £{getProgramPrice(selectedProgramForModal)}{" "}
                                now, balance due later
                              </div>
                            </div>
                          )}

                        {/* Refund Policy */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {selectedProgramForModal.allow_refunds ? (
                            <>
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600 mb-2"
                              >
                                Refundable
                              </Badge>
                              <div className="text-sm text-gray-600">
                                {selectedProgramForModal.refund_percentage && (
                                  <div>
                                    {selectedProgramForModal.refund_percentage}%
                                    refund available
                                  </div>
                                )}
                                {selectedProgramForModal.refund_deadline_in_hours && (
                                  <div>
                                    Refund must be requested within{" "}
                                    {
                                      selectedProgramForModal.refund_deadline_in_hours
                                    }{" "}
                                    hours
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              <Badge
                                variant="outline"
                                className="text-red-600 border-red-600 mb-2"
                              >
                                Non-refundable
                              </Badge>
                              <div className="text-sm text-gray-600">
                                This program does not offer refunds
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 border-t">
                        {!canAddToCart(selectedProgramForModal) ? (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <span>
                              {getDisabledReason(selectedProgramForModal)}
                            </span>
                          </div>
                        ) : selectedPrograms.some(
                            (p) => p.id === selectedProgramForModal.id
                          ) ? (
                          <Button
                            onClick={() => {
                              removeFromCart(selectedProgramForModal.id);
                              closeProgramModal();
                            }}
                            variant="destructive"
                            className="w-full"
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            Remove from Cart
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              addToCart(selectedProgramForModal);
                              closeProgramModal();
                            }}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Registration Form Modal */}
          <Dialog
            open={showProgRegistrationModal}
            onOpenChange={(open) => {
              setShowProgRegistrationModal(open);
              if (!open) {
                form.reset();
              }
            }}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Complete Your Registration</DialogTitle>
                <DialogDescription>
                  Please provide your details to proceed with the registration.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agree_to_terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I agree to the{" "}
                            <a
                              href="/terms_and_conditions"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Terms and Conditions
                            </a>{" "}
                            *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Selected Programs Summary */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Selected Programs ({selectedPrograms.length})
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedPrograms.map((program) => (
                        <div
                          key={program.id}
                          className="text-sm text-gray-600 flex justify-between"
                        >
                          <span>{program.name}</span>
                          <span className="font-medium">
                            £{getProgramPrice(program).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-2 pt-2 flex justify-between font-medium">
                      <span>Total:</span>
                      <span className="text-green-600">
                        £{getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowProgRegistrationModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={registrationMutation.isPending}
                    >
                      {registrationMutation.isPending
                        ? "Processing..."
                        : "Complete Registration"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Loading Overlay */}
          {isRedirecting && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white font-medium">
                  Redirecting to checkout...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
