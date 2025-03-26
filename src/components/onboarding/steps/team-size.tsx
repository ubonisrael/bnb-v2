"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const teamSizeSchema = z.object({
  size: z.string().min(1, { message: "Please select a team size" }),
})

type TeamSizeData = z.infer<typeof teamSizeSchema>

interface TeamSizeStepProps {
  data: string
  onUpdate: (data: string) => void
}

export function TeamSizeStep({ data, onUpdate }: TeamSizeStepProps) {
  const form = useForm<TeamSizeData>({
    resolver: zodResolver(teamSizeSchema),
    defaultValues: {
      size: data,
    },
  })

  function onSubmit(values: TeamSizeData) {
    onUpdate(values.size)
  }

  // Update form data on every change for continuous saving
  const watchedValues = form.watch()
  if (watchedValues.size !== data && form.formState.isValid && !form.formState.isSubmitting) {
    onUpdate(watchedValues.size)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">Team Size</h2>
          <p className="text-sm text-[#6E6E73]">How many people work at your business?</p>
        </div>

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {[
                    { value: "solo", label: "Just me", description: "I work alone" },
                    { value: "small", label: "2-5 people", description: "Small team" },
                    { value: "medium", label: "6-15 people", description: "Medium team" },
                    { value: "large", label: "16-50 people", description: "Large team" },
                    { value: "xlarge", label: "51-100 people", description: "Extra large team" },
                    { value: "enterprise", label: "100+ people", description: "Enterprise" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`rounded-lg border border-[#E0E0E5] p-4 ${
                        field.value === option.value ? "border-[#7B68EE] bg-[#7B68EE]/5" : "hover:border-[#E0E0E5]/80"
                      }`}
                    >
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium">{option.label}</FormLabel>
                          <FormDescription className="text-xs">{option.description}</FormDescription>
                        </div>
                      </FormItem>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormDescription>This helps us customize your dashboard and features for your team size</FormDescription>
      </form>
    </Form>
  )
}

