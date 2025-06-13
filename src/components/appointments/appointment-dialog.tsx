"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

// Mock data for staff
const staff = [
  { id: 1, name: "Emma Johnson", role: "Hair Stylist", avatar: "/placeholder.svg" },
  { id: 2, name: "Michael Smith", role: "Barber", avatar: "/placeholder.svg" },
  { id: 3, name: "Sophia Lee", role: "Nail Technician", avatar: "/placeholder.svg" },
  { id: 4, name: "David Wilson", role: "Massage Therapist", avatar: "/placeholder.svg" },
]

// Mock data for services
const services = [
  { id: 1, name: "Haircut & Styling", duration: 60, price: 75 },
  { id: 2, name: "Hair Coloring", duration: 120, price: 150 },
  { id: 3, name: "Beard Trim", duration: 30, price: 35 },
  { id: 4, name: "Manicure", duration: 60, price: 50 },
  { id: 5, name: "Pedicure", duration: 60, price: 60 },
  { id: 6, name: "Facial", duration: 60, price: 80 },
  { id: 7, name: "Massage", duration: 60, price: 90 },
]

// Mock data for clients
const clients = [
  { id: 1, name: "Jane Doe", email: "jane@example.com", phone: "123-456-7890" },
  { id: 2, name: "John Smith", email: "john@example.com", phone: "123-456-7891" },
  { id: 3, name: "Emily Johnson", email: "emily@example.com", phone: "123-456-7892" },
  { id: 4, name: "Robert Brown", email: "robert@example.com", phone: "123-456-7893" },
  { id: 5, name: "Sarah Wilson", email: "sarah@example.com", phone: "123-456-7894" },
]

// Time slots
const timeSlots = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

// Form schema
const appointmentFormSchema = z.object({
  clientId: z.string().min(1, { message: "Please select a client" }),
  serviceId: z.string().min(1, { message: "Please select a service" }),
  staffId: z.string().min(1, { message: "Please select a staff member" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  notes: z.string().optional(),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

export interface AppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDate?: Date
  initialTime?: string
  initialStaffId?: number
}

export function AppointmentDialog({
  open,
  onOpenChange,
  initialDate,
  initialTime,
  initialStaffId,
}: AppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default form values
  const defaultValues: Partial<AppointmentFormValues> = {
    date: initialDate || new Date(),
    time: initialTime || "10:00",
    staffId: initialStaffId ? String(initialStaffId) : undefined,
    notes: "",
  }

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues,
  })

  async function onSubmit(data: AppointmentFormValues) {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form and close dialog
    form.reset()
    setIsSubmitting(false)
    onOpenChange(false)

    // In a real app, you would save the appointment to your database here
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#121212]">New Appointment</DialogTitle>
          <DialogDescription className="text-[#6E6E73]">
            Create a new appointment by filling out the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#121212]">Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#E0E0E5]">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={String(client.id)}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#121212]">Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#E0E0E5]">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={String(service.id)}>
                            {service.name} (${service.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#121212]">Staff Member</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#E0E0E5]">
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {staff.map((person) => (
                          <SelectItem key={person.id} value={String(person.id)}>
                            {person.name} ({person.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-[#121212]">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal border-[#E0E0E5]",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        {/* <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /> */}
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#121212]">Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-[#E0E0E5]">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel className="text-[#121212]">Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes here..."
                        className="resize-none border-[#E0E0E5]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[#6E6E73]">
                      Optional: Add any special requests or notes for this appointment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-[#E0E0E5]">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

