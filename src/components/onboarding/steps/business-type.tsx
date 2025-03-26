"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const businessTypes = [
  { value: "hair-salon", label: "Hair Salon" },
  { value: "barber-shop", label: "Barber Shop" },
  { value: "nail-salon", label: "Nail Salon" },
  { value: "spa", label: "Spa & Wellness" },
  { value: "beauty-salon", label: "Beauty Salon" },
  { value: "makeup-studio", label: "Makeup Studio" },
  { value: "massage-therapy", label: "Massage Therapy" },
  { value: "waxing-salon", label: "Waxing Salon" },
  { value: "brow-lash", label: "Brow & Lash" },
  { value: "tanning-salon", label: "Tanning Salon" },
  { value: "other", label: "Other" },
]

const services = [
  { id: "haircut", label: "Haircut & Styling" },
  { id: "coloring", label: "Hair Coloring" },
  { id: "extensions", label: "Hair Extensions" },
  { id: "manicure", label: "Manicure" },
  { id: "extensions", label: "Hair Extensions" },
  { id: "manicure", label: "Manicure" },
  { id: "pedicure", label: "Pedicure" },
  { id: "facials", label: "Facials" },
  { id: "massage", label: "Massage" },
  { id: "waxing", label: "Waxing" },
  { id: "makeup", label: "Makeup" },
  { id: "brows", label: "Eyebrow Shaping" },
  { id: "lashes", label: "Eyelash Extensions" },
  { id: "tanning", label: "Tanning" },
]

const businessTypeSchema = z.object({
  category: z.string().min(1, { message: "Please select a business type" }),
  services: z.array(z.string()).min(1, { message: "Please select at least one service" }),
})

type BusinessTypeData = z.infer<typeof businessTypeSchema>

interface BusinessTypeStepProps {
  data: BusinessTypeData
  onUpdate: (data: BusinessTypeData) => void
}

export function BusinessTypeStep({ data, onUpdate }: BusinessTypeStepProps) {
  const form = useForm<BusinessTypeData>({
    resolver: zodResolver(businessTypeSchema),
    defaultValues: data,
  })

  function onSubmit(values: BusinessTypeData) {
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
          <h2 className="text-lg font-semibold text-[#121212]">Business Type</h2>
          <p className="text-sm text-[#6E6E73]">Select your business category and the services you offer</p>
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a business type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>This helps clients find the right type of business</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Services Offered</FormLabel>
                <FormDescription>Select all the services your business provides</FormDescription>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {services.map((service) => (
                  <FormField
                    key={service.id}
                    control={form.control}
                    name="services"
                    render={({ field }) => {
                      return (
                        <FormItem key={service.id} className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(service.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, service.id])
                                  : field.onChange(field.value?.filter((value) => value !== service.id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{service.label}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

