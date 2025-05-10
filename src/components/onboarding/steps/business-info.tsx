"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, Ref, useImperativeHandle } from "react"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { OnboardingFormData } from "../type"

const businessInfoSchema = z.object({
  name: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  description: z.string().min(24, { message: "Description must be at least 24 characters" }).max(500, { message: "Description must be at most 500 characters" })
})

type BusinessInfoData = z.infer<typeof businessInfoSchema>

interface BusinessInfoStepProps {
  data: OnboardingFormData
  onUpdate: (data: BusinessInfoData) => void
  ref: Ref<{ validate: () => Promise<boolean> }>
}

export function BusinessInfoStep({ data, onUpdate, ref }: BusinessInfoStepProps) {
  const form = useForm<BusinessInfoData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: data.businessInfo,
  })

  // function onSubmit(values: BusinessInfoData) {
  //   onUpdate(values)
  // }

  useImperativeHandle(ref, () => ({
    async validate() {
      const isValid = await form.trigger(); // runs validation
      if (isValid) {
        onUpdate(form.getValues());
      }
      return isValid;
    },
  }));

  // Use useEffect to handle form updates
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values && form.formState.isValid && !form.formState.isSubmitting) {
        onUpdate(values as BusinessInfoData)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, onUpdate])

  return (
    <Form {...form}>
      <form className="space-y-6">
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

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your business here." {...field} />
              </FormControl>
              <FormDescription>Tell us about your business</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
