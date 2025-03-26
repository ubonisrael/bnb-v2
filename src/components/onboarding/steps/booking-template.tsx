"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Check } from "lucide-react"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

const bookingTemplateSchema = z.object({
  templateType: z.string().min(1, { message: "Please select a booking template" }),
  settings: z.record(z.any()),
})

type BookingTemplateData = z.infer<typeof bookingTemplateSchema>

interface BookingTemplateStepProps {
  data: BookingTemplateData
  onUpdate: (data: BookingTemplateData) => void
}

export function BookingTemplateStep({ data, onUpdate }: BookingTemplateStepProps) {
  const form = useForm<BookingTemplateData>({
    resolver: zodResolver(bookingTemplateSchema),
    defaultValues: {
      templateType: data.templateType || "",
      settings: data.settings || {},
    },
  })

  function onSubmit(values: BookingTemplateData) {
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

  // Get the selected template type
  const selectedTemplate = form.watch("templateType")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#121212]">Booking Template</h2>
          <p className="text-sm text-[#6E6E73]">Choose how your clients will book appointments with you</p>
        </div>

        <FormField
          control={form.control}
          name="templateType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Booking Template</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 gap-4 md:grid-cols-3"
                >
                  {[
                    {
                      value: "simple",
                      title: "Simple Booking",
                      description: "Basic appointment booking with minimal client information",
                    },
                    {
                      value: "detailed",
                      title: "Detailed Booking",
                      description: "Comprehensive booking with client details and preferences",
                    },
                    {
                      value: "service-first",
                      title: "Service First",
                      description: "Clients select services before choosing time and staff",
                    },
                  ].map((template) => (
                    <div
                      key={template.value}
                      className={`relative rounded-lg border p-4 ${
                        field.value === template.value
                          ? "border-[#7B68EE] bg-[#7B68EE]/5"
                          : "border-[#E0E0E5] hover:border-[#E0E0E5]/80"
                      }`}
                    >
                      {field.value === template.value && (
                        <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#7B68EE]">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={template.value} />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="font-medium">{template.title}</FormLabel>
                          <FormDescription className="text-xs">{template.description}</FormDescription>
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

        {selectedTemplate === "simple" && (
          <Card className="border-[#E0E0E5]">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="settings.requireClientName"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Require Client Name</FormLabel>
                        <FormDescription>Clients must provide their name when booking</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.requireClientEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Require Client Email</FormLabel>
                        <FormDescription>Clients must provide their email when booking</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.requireClientPhone"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Require Client Phone</FormLabel>
                        <FormDescription>Clients must provide their phone number when booking</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.allowClientNotes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Allow Client Notes</FormLabel>
                        <FormDescription>Clients can add notes to their booking</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTemplate === "detailed" && (
          <Card className="border-[#E0E0E5]">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="settings.welcomeMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Welcome Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Welcome message for your booking page"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>This message will be displayed at the top of your booking page</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.collectClientAddress"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Collect Client Address</FormLabel>
                        <FormDescription>Ask clients for their address during booking</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.collectClientBirthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Collect Client Birthday</FormLabel>
                        <FormDescription>Ask clients for their birthday during booking</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.allowClientPreferences"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Collect Client Preferences</FormLabel>
                        <FormDescription>Ask clients for their preferences during booking</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.requireClientPhoto"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Allow Client Photo Upload</FormLabel>
                        <FormDescription>Clients can upload a photo for reference</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTemplate === "service-first" && (
          <Card className="border-[#E0E0E5]">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="settings.showServiceDescriptions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Service Descriptions</FormLabel>
                        <FormDescription>Display service descriptions on the booking page</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.showServicePrices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Service Prices</FormLabel>
                        <FormDescription>Display service prices on the booking page</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.showServiceDuration"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Show Service Duration</FormLabel>
                        <FormDescription>Display service duration on the booking page</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.allowMultipleServices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Allow Multiple Services</FormLabel>
                        <FormDescription>Clients can book multiple services in one appointment</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="settings.staffSelection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff Selection</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="required" />
                            </FormControl>
                            <FormLabel className="font-normal">Required (clients must select a staff member)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="optional" />
                            </FormControl>
                            <FormLabel className="font-normal">Optional (clients can select "any available")</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="hidden" />
                            </FormControl>
                            <FormLabel className="font-normal">Hidden (staff assigned automatically)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  )
}

