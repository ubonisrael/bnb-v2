import { AlertTriangle } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { Button } from "./ui/button"

interface UnsavedChangesBannerProps {
  form: UseFormReturn<any>
}

export function UnsavedChangesBanner({ form }: UnsavedChangesBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm sm:text-base">You have unsaved changes. Please save or discard your changes.</p>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => form.reset()} 
          className="bg-yellow-300 hover:text-yellow-900 hover:bg-yellow-100 rounded text-sm sm:text-base"
        >
          Discard Changes
        </Button>
      </div>
    </div>
  )
}