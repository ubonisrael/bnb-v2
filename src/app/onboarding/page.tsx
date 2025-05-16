import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard"
import { requireAuth } from "@/actions/auth"
import api from "@/services/api-service"

export default async function OnboardingPage() {
  // Ensure the user is authenticated
  // await requireAuth()
  console.log('onboarding', api.getCsrfToken())

  return (
    <div className="min-h-screen bg-white">
      <div className=" px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#7B68EE]">
            <span className="text-xl font-bold text-white">B</span>
          </div>
          <span className="ml-2 text-xl font-semibold text-[#121212]">BanknBook</span>
        </div>

        <div className="mt-6">
          <OnboardingWizard />
        </div>
      </div>
    </div>
  )
}

