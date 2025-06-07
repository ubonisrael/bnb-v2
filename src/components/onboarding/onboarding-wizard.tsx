"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BusinessInfoStep } from "./steps/business-info";
import { ServicesSetupStep } from "./steps/services-setup";
import { BookingTemplateStep } from "./steps/booking-template";
import { NotificationSettingsStep } from "./steps/notification-settings";
import { BookingSettingsSetupStep } from "./steps/booking-settings";
import { OnboardingFormData } from "./type";
import { useOnboardingMutation } from "@/hooks/use-onboarding-mutation";
import useLocalStorage from "use-local-storage";
import toast from "react-hot-toast";

const steps = [
  { id: "business-info", title: "Business Information" },
  { id: "services-setup", title: "Services" },
  { id: "booking-settings", title: "Booking Settings" },
  { id: "booking-template", title: "Booking Template" },
  { id: "notification-settings", title: "Notifications" },
];

export function OnboardingWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useLocalStorage(
    "onboarding-step",
    0
  );
  const stepRef = useRef<{ validate: () => Promise<boolean> }>(null);
  const [formData, setFormData] = useLocalStorage<OnboardingFormData>(
    "onboarding-data",
    {
      businessInfo: {
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        logoUrl: "",
      },
      servicesSetup: {
        categories: [],
        services: [],
      },
      bookingTemplate: {
        templateType: "",
        images: [],
        aboutUs: "",
        additionalPolicies: ""
      },
      bookingSettings: {
        welcome_message: "",
        maximum_notice: 0,
        minimum_notice: 0,
        time_zone: "",
        allow_deposits: true,
        deposit_amount: 5,
        cancellation_allowed: false,
        cancellation_notice_hours: undefined,
        cancellation_fee_percent: undefined,
        reschedule_allowed: false,
        reschedule_notice_hours: undefined,
        reschedule_fee_percent: undefined,
        no_show_fee_percent: 100,
        sunday_enabled: false,
        sunday_opening: 480,
        sunday_closing: 1080,
        monday_enabled: false,
        monday_opening: 480,
        monday_closing: 1080,
        tuesday_enabled: false,
        tuesday_opening: 480,
        tuesday_closing: 1080,
        wednesday_enabled: false,
        wednesday_opening: 480,
        wednesday_closing: 1080,
        thursday_enabled: false,
        thursday_opening: 480,
        thursday_closing: 1080,
        friday_enabled: false,
        friday_opening: 480,
        friday_closing: 1080,
        saturday_enabled: false,
        saturday_opening: 480,
        saturday_closing: 1080,
      },
      notificationSettings: {
        emailSettings: {
          sendBookingConfirmations: true,
          sendReminders: true,
          reminderHours: 24,
          sendCancellationNotices: true,
          sendNoShowNotifications: true,
          sendFollowUpEmails: false,
          followUpDelayHours: 48,
        },
      },
    }
  );

  const onboardingMutation = useOnboardingMutation();

  const currentStep = steps[currentStepIndex];

  const updateFormData = (stepId: string, data: any) => {
    setFormData((prev) => ({
      ...(prev ?? formData),
      [stepId]: data,
    }));
  };

  const goToNextStep = async () => {
    const isValid = await stepRef.current?.validate?.();
    if (isValid) {
      setCurrentStepIndex((prev) => (prev ?? 0) + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinish = async () => {
    try {
      const isValid = await stepRef.current?.validate?.();
      if (isValid) {
        await onboardingMutation.mutateAsync(formData);
        // reset form data to initial state
        setFormData({
          businessInfo: {
            logoUrl: "",
            name: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
          },
          servicesSetup: { categories: [], services: [] },
          bookingTemplate: {
            templateType: "",
            images: [],
            aboutUs: "",
            additionalPolicies: ""
          },
          bookingSettings: {
            allow_deposits: true,
            deposit_amount: 5,
            cancellation_allowed: false,
            cancellation_notice_hours: undefined,
            cancellation_fee_percent: undefined,
            no_show_fee_percent: 100,
            reschedule_allowed: false,
            reschedule_notice_hours: undefined,
            reschedule_fee_percent: undefined,
            welcome_message: "",
            maximum_notice: 0,
            minimum_notice: 0,
            time_zone: "",
            sunday_enabled: false,
            sunday_opening: 480,
            sunday_closing: 1080,
            monday_enabled: false,
            monday_opening: 480,
            monday_closing: 1080,
            tuesday_enabled: false,
            tuesday_opening: 480,
            tuesday_closing: 1080,
            wednesday_enabled: false,
            wednesday_opening: 480,
            wednesday_closing: 1080,
            thursday_enabled: false,
            thursday_opening: 480,
            thursday_closing: 1080,
            friday_enabled: false,
            friday_opening: 480,
            friday_closing: 1080,
            saturday_enabled: false,
            saturday_opening: 480,
            saturday_closing: 1080,
          },
          notificationSettings: {
            emailSettings: {
              sendBookingConfirmations: true,
              sendReminders: true,
              reminderHours: 24,
              sendCancellationNotices: true,
              sendNoShowNotifications: true,
              sendFollowUpEmails: false,
              followUpDelayHours: 48,
            },
          },
        });
        setCurrentStepIndex(0);
      }
    } catch (error: any) {
      toast.error("Failed to complete onboarding:", error.message);
    }
  };

  return (
    <>
      <div className="flex mb-8 min-w-max border-b border-[#E0E0E5]">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex-1 px-2 py-3 text-center text-sm font-medium ${
              index === currentStepIndex
                ? "border-b-2 border-[#7B68EE] text-[#7B68EE]"
                : index < currentStepIndex
                ? "text-[#6E6E73]"
                : "text-[#6E6E73]"
            }`}
          >
            <div className="flex items-center justify-center">
              <div
                className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full ${
                  index < currentStepIndex
                    ? "bg-[#7B68EE]"
                    : index === currentStepIndex
                    ? "border border-[#7B68EE] bg-white"
                    : "border border-[#E0E0E5] bg-white"
                }`}
              >
                {index < currentStepIndex ? (
                  <Check className="h-3 w-3 text-white" />
                ) : (
                  <span
                    className={`text-xs ${
                      index === currentStepIndex
                        ? "text-[#7B68EE]"
                        : "text-[#6E6E73]"
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>
              <span
                className={`hidden ${
                  index === currentStepIndex ? "sm:inline" : ""
                } whitespace-nowrap`}
              >
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl mx-auto max-w-3xl w-full border border-[#E0E0E5] bg-white shadow-sm">
        <div className="border-b border-[#E0E0E5] px-6 py-4">
          <h1 className="text-xl font-semibold text-[#121212]">
            Set up your business
          </h1>
          <p className="text-sm text-[#6E6E73]">
            Let's get your beauty business ready to accept bookings
          </p>
        </div>

        <div className="overflow-x-auto"></div>

        <div className="px-6 py-6">
          {currentStep.id === "business-info" && (
            <BusinessInfoStep
              ref={stepRef}
              data={formData}
              onUpdate={(data) => updateFormData("businessInfo", data)}
            />
          )}

          {currentStep.id === "services-setup" && (
            <ServicesSetupStep
              ref={stepRef}
              data={formData}
              onUpdate={(data) => updateFormData("servicesSetup", data)}
            />
          )}

          {currentStep.id === "booking-template" && (
            <BookingTemplateStep
              ref={stepRef}
              data={formData.bookingTemplate}
              onUpdate={(data) => updateFormData("bookingTemplate", data)}
            />
          )}

          {currentStep.id === "booking-settings" && (
            <BookingSettingsSetupStep
              ref={stepRef}
              data={formData}
              onUpdate={(data) => updateFormData("bookingSettings", data)}
            />
          )}

          {currentStep.id === "notification-settings" && (
            <NotificationSettingsStep
              ref={stepRef}
              data={formData}
              onUpdate={(data) => updateFormData("notificationSettings", data)}
            />
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#E0E0E5] px-6 py-4">
          <Button
            variant="outline"
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStepIndex < steps.length - 1 ? (
            <Button onClick={goToNextStep}>
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={onboardingMutation.isPending}
            >
              {onboardingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finishing up...
                </>
              ) : (
                <>
                  Complete Setup
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
