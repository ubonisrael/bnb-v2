"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const businessInfoSchema = z.object({
  name: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
})

type BusinessInfoData = z.infer<typeof businessInfoSchema>

interface BusinessInfoStepProps {
  data: BusinessInfoData
  onUpdate: (data: BusinessInfoData) => void
}

export function BusinessInfoStep({ data, onUpdate }: BusinessInfoStepProps) {
  const form = useForm<BusinessInfoData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: data,
  })

  function onSubmit(values: BusinessInfoData) {
    onUpdate(values)
  }

  // Update form data on every change for continuous saving
  const watchedValues = form.watch()
  if (
    JSON.stringify(watchedValues) !== JSON.stringify(data) &&
    form.formState.isValid &&
    !form.formState.isSubmitting
  ) {
    onUpdate(watchedValues)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">Business Information</h2>
          <p className="text-sm text-[#6E6E73]">Tell us about your business</p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business name" {...field} />
              </FormControl>
              <FormDescription>This is how your business will appear to clients</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="contact@yourbusiness.com" {...field} />
              </FormControl>
              <FormDescription>Clients will use this email to contact you</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Phone</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
              <FormDescription>A phone number where clients can reach you</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

