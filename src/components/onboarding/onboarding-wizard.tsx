"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BusinessInfoStep } from "./steps/business-info"
import { LocationStep } from "./steps/location"
import { VisualSettingsStep } from "./steps/visual-settings"
import { TeamSizeStep } from "./steps/team-size"
import { BusinessTypeStep } from "./steps/business-type"
import { ServicesSetupStep } from "./steps/services-setup"
import { BookingTemplateStep } from "./steps/booking-template"
import { PaymentDetailsStep } from "./steps/payment-details"
import { NotificationSettingsStep } from "./steps/notification-settings"
import { completeOnboarding } from "@/actions/onboarding"

const steps = [
  { id: "business-info", title: "Business Information" },
  { id: "business-type", title: "Business Type" },
  { id: "location", title: "Location" },
  { id: "team-size", title: "Team Size" },
  { id: "visual-settings", title: "Visual Settings" },
  { id: "services-setup", title: "Services" },
  // { id: "booking-template", title: "Booking Template" },
  { id: "payment-details", title: "Payment Details" },
  { id: "notification-settings", title: "Notifications" },
]

export function OnboardingWizard() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState({
    businessInfo: {
      name: "",
      email: "",
      phone: "",
    },
    businessType: {
      category: "",
      services: [],
    },
    location: {
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    teamSize: "",
    visualSettings: {
      logoUrl: "",
      primaryColor: "#7B68EE",
      accentColor: "",
    },
    servicesSetup: {
      categories: [],
      services: [],
    },
    // bookingTemplate: {
    //   templateType: "",
    //   settings: {},
    // },
    paymentDetails: {
      provider: "",
      accountDetails: {},
    },
    notificationSettings: {
      cancelNoticeHours: 24,
      emailSettings: {
        sendBookingConfirmations: true,
        sendReminders: true,
        reminderHours: 24,
      },
    },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const currentStep = steps[currentStepIndex]

  const updateFormData = (stepId: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [stepId]: data,
    }))
  }

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleFinish = async () => {
    setIsSubmitting(true)

    try {
      await completeOnboarding(formData)
      router.push("/onboarding/complete")
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#E0E0E5] bg-white shadow-sm">
      <div className="border-b border-[#E0E0E5] px-6 py-4">
        <h1 className="text-xl font-semibold text-[#121212]">Set up your business</h1>
        <p className="text-sm text-[#6E6E73]">Let's get your beauty business ready to accept bookings</p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max border-b border-[#E0E0E5]">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex-1 px-2 py-3 text-center text-sm font-medium ${index === currentStepIndex
                ? "border-b-2 border-[#7B68EE] text-[#7B68EE]"
                : index < currentStepIndex
                  ? "text-[#6E6E73]"
                  : "text-[#6E6E73]"
                }`}
            >
              <div className="flex items-center justify-center">
                <div
                  className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full ${index < currentStepIndex
                    ? "bg-[#7B68EE]"
                    : index === currentStepIndex
                      ? "border border-[#7B68EE] bg-white"
                      : "border border-[#E0E0E5] bg-white"
                    }`}
                >
                  {index < currentStepIndex ? (
                    <Check className="h-3 w-3 text-white" />
                  ) : (
                    <span className={`text-xs ${index === currentStepIndex ? "text-[#7B68EE]" : "text-[#6E6E73]"}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className="hidden whitespace-nowrap sm:inline">{step.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        {currentStep.id === "business-info" && (
          <BusinessInfoStep data={formData.businessInfo} onUpdate={(data) => updateFormData("businessInfo", data)} />
        )}

        {currentStep.id === "business-type" && (
          <BusinessTypeStep data={formData.businessType} onUpdate={(data) => updateFormData("businessType", data)} />
        )}

        {currentStep.id === "location" && (
          <LocationStep data={formData.location} onUpdate={(data) => updateFormData("location", data)} />
        )}

        {currentStep.id === "team-size" && (
          <TeamSizeStep data={formData.teamSize} onUpdate={(data) => updateFormData("teamSize", data)} />
        )}

        {currentStep.id === "visual-settings" && (
          <VisualSettingsStep
            data={formData.visualSettings}
            onUpdate={(data) => updateFormData("visualSettings", data)}
          />
        )}

        {currentStep.id === "services-setup" && (
          <ServicesSetupStep data={formData.servicesSetup} onUpdate={(data) => updateFormData("servicesSetup", data)} />
        )}

        {/* {currentStep.id === "booking-template" && (
          <BookingTemplateStep
            data={formData.bookingTemplate}
            onUpdate={(data) => updateFormData("bookingTemplate", data)}
          />
        )} */}

        {currentStep.id === "payment-details" && (
          <PaymentDetailsStep
            data={formData.paymentDetails}
            onUpdate={(data) => updateFormData("paymentDetails", data)}
          />
        )}

        {currentStep.id === "notification-settings" && (
          <NotificationSettingsStep
            data={formData.notificationSettings}
            onUpdate={(data) => updateFormData("notificationSettings", data)}
          />
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#E0E0E5] px-6 py-4">
        <Button variant="outline" onClick={goToPreviousStep} disabled={currentStepIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {currentStepIndex < steps.length - 1 ? (
          <Button onClick={goToNextStep}>
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={isSubmitting}>
            {isSubmitting ? (
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
  )
}

