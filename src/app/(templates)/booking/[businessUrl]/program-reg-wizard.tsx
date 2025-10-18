"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/services/api-service";
import dayjs from "@/utils/dayjsConfig";
import { IExtendedProgram } from "@/types/response";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRandomColor } from "@/utils/color";
import { formatDateRange } from "@/utils/time";
import {
  Calendar,
  Users,
  PoundSterling,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";

interface ProgramRegistrationFormValues {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  student_id?: string;
  program_ids: string[];
}

interface ProgramRegistrationWizardProps {
  programs: IExtendedProgram[];
}

export function ProgramRegistrationWizard(
  props: ProgramRegistrationWizardProps
) {
  console.log("programs", props.programs);
  const [showProgRegistrationModal, setShowProgRegistrationModal] =
    useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState<IExtendedProgram[]>(
    []
  );

  const userTimezone = dayjs.tz.guess();

  // Get service provider info from first program (assuming all programs are from same provider)
  const serviceProvider =
    props.programs.length > 0 ? props.programs[0].ServiceProvider : null;

  const addToCart = (program: IExtendedProgram) => {
    if (!selectedPrograms.find((p) => p.id === program.id)) {
      setSelectedPrograms([...selectedPrograms, program]);
    }
  };

  const removeFromCart = (programId: string) => {
    setSelectedPrograms(selectedPrograms.filter((p) => p.id !== programId));
  };

  const getTotalPrice = () => {
    return selectedPrograms.reduce(
      (total, program) => total + parseFloat(program.price),
      0
    );
  };

  // const registrationMutation = useMutation({
  //   mutationFn: (data: ProgramRegistrationFormValues) => {
  //     toast.loading("Scheduling appointment...", { id: "booking" });
  //     return api.post(`programs/register`, data);
  //   },
  //   onSuccess: async (data) => {
  //     toast.dismiss("booking");
  //     setIsRedirecting(true); // Show loading overlay
  //     window.location.href = data.url;
  //   },
  //   onError: (error) => {
  //     toast.dismiss("booking");
  //     toast.remove("booking");
  //     toast.error(error.errors[0].message || "Error while registering for program(s)", {
  //       id: "prog-registration-error",
  //     });
  //   },
  // });

  // async function onSubmit(data) {
  //     try {
  //       await registrationMutation.mutateAsync(data);
  //     } catch (error) {
  //       console.error("Registration failed:", error);
  //     }
  //   }

  return (
    <div className="w-full bg-slate-100 py-16 sm:pb-20 lg:pb-24">
      <div className="sm:px-6 pb-4 sm:py-6 lg:py-8 mx-auto max-w-7xl">
        <div className="w-full bg-slate-100 min-h-screen py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Program Registration
              </h1>
              <p className="text-gray-600">
                Select the programs you'd like to register for and proceed to
                checkout.
              </p>
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
                      <div className="flex flex-col md:flex-row md:h-80">
                        {/* Banner Image or Random Color */}
                        <div className="relative w-full md:w-64 h-48 md:h-full">
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
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {program.name}
                            </h3>
                            <div className="text-2xl font-bold text-green-600">
                              £{program.price}
                            </div>
                          </div>

                          {program.about && (
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {program.about}
                            </p>
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
                                <div className="text-sm text-gray-600">
                                  {program.capacity
                                    ? `${program.capacity} participants`
                                    : "Unlimited"}
                                </div>
                              </div>
                            </div>

                            {/* Early Bird */}
                            {program.offer_early_bird && (
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                  Early Bird Available
                                </Badge>
                                {program.early_bird_deadline && (
                                  <div className="text-sm text-gray-600">
                                    Until{" "}
                                    {dayjs(program.early_bird_deadline).format(
                                      "MMM D, YYYY"
                                    )}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Deposits */}
                            {program.allow_deposits &&
                              program.deposit_amount && (
                                <div className="flex items-center gap-2">
                                  <PoundSterling className="h-4 w-4 text-gray-500" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-700">
                                      Deposit Option
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      £{program.deposit_amount} deposit
                                      available
                                    </div>
                                  </div>
                                </div>
                              )}

                            {/* Refund Policy */}
                            {program.allow_refunds && (
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-600"
                                >
                                  Refundable
                                </Badge>
                                {program.refund_percentage && (
                                  <div className="text-sm text-gray-600">
                                    {program.refund_percentage}% refund
                                    available
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          <div className="flex justify-end">
                            <Button
                              onClick={() => addToCart(program)}
                              disabled={selectedPrograms.some(
                                (p) => p.id === program.id
                              )}
                              className="flex items-center gap-2"
                            >
                              <Plus className="h-4 w-4" />
                              {selectedPrograms.some((p) => p.id === program.id)
                                ? "Added to Cart"
                                : "Add to Cart"}
                            </Button>
                          </div>
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
                                    {dayjs(program.start_date).format(
                                      "MMM D, YYYY"
                                    )}
                                  </div>
                                  <div className="text-lg font-semibold text-green-600">
                                    £{program.price}
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
