"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "@/services/api-service";
import dayjs from "@/utils/dayjsConfig";
import {
  IProgramClass,
  IProgramDataResponse,
} from "@/types/response";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  BookOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getServiceFee,
  getProgramClassPrice,
  getProgramClassBasePrice,
  getProgramClassPriceWithDiscount,
  calculateProgramClassDiscount,
} from "@/utils/programs";

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
  program: IProgramDataResponse;
  businessUrl: string;
}

interface IExtendedProgramClass extends IProgramClass {
  availableSeats: number | null;
}

export function ProgramRegistrationWizard(
  props: ProgramRegistrationWizardProps
) {
  const [showProgRegistrationModal, setShowProgRegistrationModal] =
    useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<
    IExtendedProgramClass[]
  >([]);
  const [selectedClassForModal, setSelectedClassForModal] =
    useState<IExtendedProgramClass | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userTimezone = dayjs.tz.guess();

  // Get service provider info from the program
  const serviceProvider = props.program.ServiceProvider || null;

  // Get upcoming classes from the program
  const upcomingClasses: IExtendedProgramClass[] = (
    props.program.upcoming_classes || []
  ).map((cls: any) => ({
    ...cls,
    availableSeats: cls.available_seats ?? null,
  }));

  // Helper functions for class pricing (wrapping utility functions with program context)
  const getClassPrice = (programClass: IExtendedProgramClass) => {
    return getProgramClassPrice(programClass, props.program as any);
  };

  const getClassServiceFee = (programClass: IExtendedProgramClass) => {
    return getServiceFee(programClass, props.program as any);
  };

  const getClassBasePrice = (programClass: IExtendedProgramClass) => {
    return getProgramClassBasePrice(programClass, props.program as any);
  };

  const getClassDiscount = (programClass: IExtendedProgramClass) => {
    return calculateProgramClassDiscount(programClass);
  };

  const getClassPriceWithDiscount = (programClass: IExtendedProgramClass) => {
    return getProgramClassPriceWithDiscount(programClass, props.program as any);
  };

  const addToCart = (programClass: IExtendedProgramClass) => {
    if (!selectedClasses.find((c) => c.id === programClass.id)) {
      const updatedClasses = [...selectedClasses, programClass];
      setSelectedClasses(updatedClasses);
    }
  };

  const removeFromCart = (classId: number) => {
    const updatedClasses = selectedClasses.filter((c) => c.id !== classId);
    setSelectedClasses(updatedClasses);
  };

  const getTotalPrice = () => {
    return selectedClasses.reduce((total, programClass) => {
      return total + getClassPriceWithDiscount(programClass);
    }, 0);
  };

  const isClassDeposit = (programClass: IExtendedProgramClass) => {
    return programClass.allow_deposits && programClass.deposit_amount;
  };

  const canAddToCart = (programClass: IExtendedProgramClass) => {
    const now = dayjs();

    // Check available seats
    if (
      programClass.availableSeats !== null &&
      programClass.availableSeats < 1
    ) {
      return false;
    }

    // Check if booking hasn't started yet (only if not starting immediately)
    if (
      !programClass.start_booking_immediately &&
      programClass.start_booking_date &&
      now.isBefore(dayjs(programClass.start_booking_date))
    ) {
      return false;
    }

    // Check if booking has ended (custom end date or class end date)
    if (
      !programClass.end_booking_when_class_ends &&
      programClass.end_booking_date &&
      now.isAfter(dayjs(programClass.end_booking_date))
    ) {
      return false;
    } else if (
      programClass.end_booking_when_class_ends &&
      now.isAfter(dayjs(programClass.end_date))
    ) {
      return false;
    }

    return true;
  };

  const getDisabledReason = (programClass: IExtendedProgramClass) => {
    const now = dayjs();

    if (
      programClass.availableSeats !== null &&
      programClass.availableSeats < 1
    ) {
      return "No seats available";
    }

    if (
      !programClass.start_booking_immediately &&
      programClass.start_booking_date &&
      now.isBefore(dayjs(programClass.start_booking_date))
    ) {
      return `Booking opens ${dayjs(programClass.start_booking_date)
        .tz(userTimezone)
        .format("LLL")}`;
    }

    if (
      !programClass.end_booking_when_class_ends &&
      programClass.end_booking_date &&
      now.isAfter(dayjs(programClass.end_booking_date))
    ) {
      return "Booking deadline has passed";
    } else if (
      programClass.end_booking_when_class_ends &&
      now.isAfter(dayjs(programClass.end_date))
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

  const openClassModal = (programClass: IExtendedProgramClass) => {
    setSelectedClassForModal(programClass);
    setIsModalOpen(true);
  };

  const closeClassModal = () => {
    setSelectedClassForModal(null);
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
        setSelectedClasses([]);
      }
    },
    onError: (error: any) => {
      toast.dismiss("prog-registration");
      toast.remove("prog-registration");
      const errorMessage =
        error?.response?.data?.errors?.[0]?.message ||
        error?.message ||
        "Error while registering for class(es)";
      toast.error(errorMessage, {
        id: "prog-registration-error",
      });
    },
  });

  async function onSubmit(data: ProgramRegistrationFormValues) {
    try {
      // Add selected class IDs to the form data
      const formDataWithClasses = {
        ...data,
        programClassIds: selectedClasses.map((c) => c.id),
      };

      await registrationMutation.mutateAsync(formDataWithClasses);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }

  const capacitySetup = props.program.set_capacity_per_class;

  return (
    <div className="w-full bg-slate-100 py-16 sm:pb-20 lg:pb-24">
      <div className="sm:px-6 pb-4 sm:py-6 lg:py-8 mx-auto max-w-7xl">
        <div className="w-full bg-slate-100 min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col-reverse md:flex-row md:justify-between gap-4 mb-4">
                <div className="flex flex-col md:flex-row md:justify-between mb-4">
                  {/* Banner Image or Random Color */}
                  <div className="relative w-full md:w-64 h-48">
                    {props.program.banner_image_url ? (
                      <img
                        src={props.program.banner_image_url}
                        alt={props.program.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full w-full ${getRandomColor(
                          props.program.id.toString()
                        )} flex items-center justify-center`}
                      >
                        <span className="text-white text-xl font-semibold text-center px-4">
                          {props.program.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {props.program.name}
                      </h1>
                      {!props.program.set_capacity_per_class && (
                        <div className="flex items-center gap-1">
                          <Users className="h-5 w-5 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {props.program.capacity ? (
                              <>
                                {(props.program as any).available_seats !== null && (props.program as any).available_seats !== undefined ? (
                                  <span
                                    className={`${
                                      (props.program as any).available_seats < 1
                                        ? "text-red-600"
                                        : (props.program as any).available_seats <= 5
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {(props.program as any).available_seats} {(props.program as any).available_seats === 1 ? 'seat' : 'seats'} available
                                  </span>
                                ) : (
                                  <span className="text-gray-600">
                                    {props.program.capacity} {props.program.capacity === 1 ? 'seat' : 'seats'}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-600">Unlimited</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    {props.program.about && (
                      <p className="text-gray-500 mt-2 mb-4">
                        {props.program.about}
                      </p>
                    )}
                    <p className="text-gray-600">
                      Select the classes you'd like to register for and proceed
                      to checkout.
                    </p>
                  </div>
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
              {/* Left Section: Classes (3/5 width) */}
              <div className="flex-1 lg:w-3/5 space-y-6">
                {upcomingClasses.length === 0 ? (
                  <Card className="p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Classes Available
                    </h3>
                    <p className="text-gray-600">
                      There are currently no upcoming classes for this program.
                    </p>
                  </Card>
                ) : (
                  upcomingClasses
                    .filter(
                      (programClass) =>
                        programClass.is_published && programClass.is_active
                    )
                    .map((programClass) => (
                      <Card
                        key={programClass.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Class Details */}
                          <div className="flex-1 p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <h3 className="text-2xl font-bold text-gray-900">
                                {programClass.name}
                              </h3>
                              <div className="md:text-right">
                                {isClassDeposit(programClass) ? (
                                  <>
                                    <div className="text-2xl font-bold text-green-600">
                                      £{getClassPrice(programClass).toFixed(2)}
                                      <span className="text-sm font-normal text-gray-600 ml-1">
                                        (Deposit)
                                      </span>
                                    </div>
                                    <div className="text-sm font-bold text-gray-500">
                                      Balance: £
                                      {(
                                        parseFloat(
                                          programClass.price.toString()
                                        ) -
                                        parseFloat(
                                          programClass.deposit_amount?.toString() ||
                                            "0"
                                        )
                                      ).toFixed(2)}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-2xl font-bold text-green-600">
                                    £{getClassPrice(programClass).toFixed(2)}
                                  </div>
                                )}
                                <div className="text-sm text-gray-500">
                                  Inclusive of a non-refundable service fee of £
                                  {getClassServiceFee(programClass).toFixed(2)}
                                </div>
                              </div>
                            </div>

                            {programClass.description && (
                              <div className="mb-4">
                                <p className="text-gray-600">
                                  {
                                    truncateText(programClass.description)
                                      .truncated
                                  }
                                </p>
                                {truncateText(programClass.description)
                                  .hasMore && (
                                  <button
                                    onClick={() => openClassModal(programClass)}
                                    className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                                  >
                                    See more
                                  </button>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                              {/* Date Range */}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-500" />
                                <div>
                                  <div className="text-sm font-medium text-gray-700">
                                    Duration
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {formatDateRange(
                                      programClass.start_date,
                                      programClass.end_date,
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
                                      {!capacitySetup
                                        ? "Set per program"
                                        : programClass.capacity
                                        ? `${programClass.capacity} participants`
                                        : "Unlimited"}
                                    </div>
                                    {programClass.availableSeats !== null && (
                                      <div className="">
                                        <span
                                          className={`font-medium ${
                                            programClass.availableSeats < 1
                                              ? "text-red-600"
                                              : programClass.availableSeats <= 5
                                              ? "text-yellow-600"
                                              : "text-green-600"
                                          }`}
                                        >
                                          (
                                          {programClass.availableSeats < 1
                                            ? "Sold out"
                                            : `${programClass.availableSeats} seats available`}
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
                                  {programClass.allow_deposits &&
                                  programClass.deposit_amount ? (
                                    <div className="text-sm text-gray-600">
                                      £{programClass.deposit_amount} deposit
                                      available
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
                                  {programClass.early_bird_deadline ? (
                                    <div className="text-sm ">
                                      <span className="font-medium text-green-600">
                                        {programClass.early_bird_discount_type ===
                                        "percentage"
                                          ? `${programClass.early_bird_discount_value}% off`
                                          : `£${programClass.early_bird_discount_value} off`}
                                      </span>
                                      {"  "}
                                      Until{" "}
                                      {dayjs(programClass.early_bird_deadline)
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

                              {/* Refund Policy (from parent program) */}
                              <div className="">
                                {props.program.allow_refunds ? (
                                  <>
                                    <Badge
                                      variant="outline"
                                      className="text-green-600 border-green-600"
                                    >
                                      Refundable
                                    </Badge>
                                    <div className="text-sm mt-1 text-gray-600">
                                      {props.program.refund_percentage && (
                                        <span>
                                          {props.program.refund_percentage}%
                                          refund
                                        </span>
                                      )}
                                      {props.program
                                        .refund_deadline_in_hours && (
                                        <span className="ml-1">
                                          (within{" "}
                                          {
                                            props.program
                                              .refund_deadline_in_hours
                                          }{" "}
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
                        <div className="flex justify-between items-center p-4 pt-0">
                          <Button
                            variant="outline"
                            onClick={() => openClassModal(programClass)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>

                          <div className="flex flex-col items-end gap-2">
                            {!canAddToCart(programClass) ? (
                              <div className="flex items-center gap-1 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <span>{getDisabledReason(programClass)}</span>
                              </div>
                            ) : selectedClasses.some(
                                (c) => c.id === programClass.id
                              ) ? (
                              <Button
                                onClick={() => removeFromCart(programClass.id)}
                                variant="destructive"
                                className="flex items-center gap-2"
                              >
                                <Minus className="h-4 w-4" />
                                Remove from Cart
                              </Button>
                            ) : (
                              <Button
                                onClick={() => addToCart(programClass)}
                                disabled={!canAddToCart(programClass)}
                                className="flex items-center gap-2"
                              >
                                <Plus className="h-4 w-4" />
                                Add to Cart
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                )}
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
                            {serviceProvider?.name || "Class Registration"}
                          </h2>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <ShoppingCart className="h-4 w-4" />
                            {selectedClasses.length} class
                            {selectedClasses.length !== 1 ? "es" : ""} selected
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      {selectedClasses.length === 0 ? (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No classes selected</p>
                          <p className="text-sm text-gray-400">
                            Add classes to your cart to get started
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4 mb-6">
                            {selectedClasses.map((programClass) => {
                              const basePrice = getClassBasePrice(programClass);
                              const discount = getClassDiscount(programClass);
                              const serviceFee =
                                getClassServiceFee(programClass);
                              const finalPrice =
                                getClassPriceWithDiscount(programClass);

                              return (
                                <div
                                  key={programClass.id}
                                  className="p-4 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-medium text-gray-900">
                                      {programClass.name}
                                    </h4>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeFromCart(programClass.id)
                                      }
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="text-sm text-gray-600 mb-3">
                                    Starts:{" "}
                                    {dayjs(programClass.start_date)
                                      .tz(userTimezone)
                                      .format("LLLL")}
                                  </div>

                                  {/* Price Breakdown */}
                                  <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        {isClassDeposit(programClass)
                                          ? "Deposit"
                                          : "Class"}{" "}
                                        Price
                                      </span>
                                      <span className="text-gray-900">
                                        £{basePrice.toFixed(2)}
                                      </span>
                                    </div>

                                    {discount > 0 && (
                                      <div className="flex justify-between">
                                        <span className="text-green-600">
                                          Early Bird Discount
                                        </span>
                                        <span className="text-green-600">
                                          -£{discount.toFixed(2)}
                                        </span>
                                      </div>
                                    )}

                                    {serviceFee > 0 && (
                                      <div className="flex justify-between">
                                        <span className="text-gray-600">
                                          Service Fee
                                        </span>
                                        <span className="text-gray-900">
                                          £{serviceFee.toFixed(2)}
                                        </span>
                                      </div>
                                    )}

                                    <div className="pt-1 border-t border-gray-300">
                                      <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">
                                          Total
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {isClassDeposit(programClass) && (
                                            <Badge
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              Deposit
                                            </Badge>
                                          )}
                                          <span className="text-lg font-semibold text-green-600">
                                            £{finalPrice.toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
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
                              disabled={selectedClasses.length === 0}
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

          {/* Class Details Modal */}
          <Dialog open={isModalOpen} onOpenChange={closeClassModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedClassForModal && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {selectedClassForModal.name}
                    </DialogTitle>
                    <DialogDescription>
                      Complete class details and information
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Left Section - Image and Basic Info */}
                    <div className="space-y-4">
                      {props.program.banner_image_url ? (
                        <img
                          src={props.program.banner_image_url}
                          alt={selectedClassForModal.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      ) : (
                        <div
                          className={`w-full h-64 ${getRandomColor(
                            selectedClassForModal.id.toString()
                          )} rounded-lg flex items-center justify-center`}
                        >
                          <span className="text-white text-2xl font-semibold text-center px-4">
                            {selectedClassForModal.name}
                          </span>
                        </div>
                      )}

                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          £{getClassPrice(selectedClassForModal).toFixed(2)}
                          {isClassDeposit(selectedClassForModal) && (
                            <span className="text-base ml-2 text-gray-600">
                              (Deposit Amount)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Inclusive of a non-refundable service fee of £
                          {getClassServiceFee(selectedClassForModal).toFixed(2)}
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Full price: £{selectedClassForModal.price}</div>
                        {isClassDeposit(selectedClassForModal) && (
                          <div>
                            Deposit amount: £
                            {selectedClassForModal.deposit_amount}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Details */}
                    <div className="space-y-6">
                      {selectedClassForModal.description && (
                        <div>
                          <h3 className="text-lg font-semibold mb-2">About</h3>
                          <p className="text-gray-600 leading-relaxed">
                            {selectedClassForModal.description}
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
                                selectedClassForModal.start_date,
                                selectedClassForModal.end_date,
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
                                {selectedClassForModal.capacity
                                  ? `${selectedClassForModal.capacity} participants`
                                  : "Unlimited"}
                              </div>
                              {selectedClassForModal.availableSeats !==
                                null && (
                                <div className="">
                                  <span
                                    className={`font-medium ${
                                      selectedClassForModal.availableSeats < 1
                                        ? "text-red-600"
                                        : selectedClassForModal.availableSeats <=
                                          5
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    (
                                    {selectedClassForModal.availableSeats < 1
                                      ? "Sold out"
                                      : `${selectedClassForModal.availableSeats} seats available`}
                                    )
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Booking Timeline */}
                        {(!selectedClassForModal.start_booking_immediately ||
                          !selectedClassForModal.end_booking_when_class_ends) && (
                          <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-gray-700">
                                Booking Window
                              </div>
                              <div className="text-gray-600">
                                {!selectedClassForModal.start_booking_immediately &&
                                  selectedClassForModal.start_booking_date && (
                                    <div>
                                      Opens:{" "}
                                      {dayjs(
                                        selectedClassForModal.start_booking_date
                                      ).format("MMM D, YYYY")}
                                    </div>
                                  )}
                                {selectedClassForModal.start_booking_immediately && (
                                  <div>Opens: Immediately</div>
                                )}
                                {!selectedClassForModal.end_booking_when_class_ends &&
                                  selectedClassForModal.end_booking_date && (
                                    <div>
                                      Closes:{" "}
                                      {dayjs(
                                        selectedClassForModal.end_booking_date
                                      ).format("MMM D, YYYY")}
                                    </div>
                                  )}
                                {selectedClassForModal.end_booking_when_class_ends && (
                                  <div>
                                    Closes: When class ends (
                                    {dayjs(
                                      selectedClassForModal.end_date
                                    ).format("MMM D, YYYY")}
                                    )
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Early Bird */}
                        {selectedClassForModal.offer_early_bird && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Badge variant="secondary" className="mb-2">
                              Early Bird Available
                            </Badge>
                            {selectedClassForModal.early_bird_deadline && (
                              <div className="text-sm text-gray-600">
                                Available until{" "}
                                {dayjs(
                                  selectedClassForModal.early_bird_deadline
                                ).format("MMM D, YYYY")}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Deposits */}
                        {selectedClassForModal.allow_deposits &&
                          selectedClassForModal.deposit_amount && (
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <PoundSterling className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-700">
                                  Deposit Option Available
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Pay £
                                {getClassPrice(selectedClassForModal).toFixed(
                                  2
                                )}{" "}
                                now, balance due later
                              </div>
                            </div>
                          )}

                        {/* Refund Policy (from parent program) */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          {props.program.allow_refunds ? (
                            <>
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600 mb-2"
                              >
                                Refundable
                              </Badge>
                              <div className="text-sm text-gray-600">
                                {props.program.refund_percentage && (
                                  <div>
                                    {props.program.refund_percentage}% refund
                                    available
                                  </div>
                                )}
                                {props.program.refund_deadline_in_hours && (
                                  <div>
                                    Refund must be requested within{" "}
                                    {props.program.refund_deadline_in_hours}{" "}
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
                                This class does not offer refunds
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4 border-t">
                        {!canAddToCart(selectedClassForModal) ? (
                          <div className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            <span>
                              {getDisabledReason(selectedClassForModal)}
                            </span>
                          </div>
                        ) : selectedClasses.some(
                            (c) => c.id === selectedClassForModal.id
                          ) ? (
                          <Button
                            onClick={() => {
                              removeFromCart(selectedClassForModal.id);
                              closeClassModal();
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
                              addToCart(selectedClassForModal);
                              closeClassModal();
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

                  {/* Selected Classes Summary */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Selected Classes ({selectedClasses.length})
                    </h4>
                    <div className="space-y-3 max-h-40 overflow-y-auto">
                      {selectedClasses.map((programClass) => {
                        const basePrice = getClassBasePrice(programClass);
                        const discount = getClassDiscount(programClass);
                        const finalPrice =
                          getClassPriceWithDiscount(programClass);

                        return (
                          <div key={programClass.id} className="text-sm">
                            <div className="flex justify-between font-medium text-gray-900">
                              <span>{programClass.name}</span>
                              <span>£{finalPrice.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span> Base: £{basePrice.toFixed(2)}</span>
                                <span>Discount: -£{discount.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
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
