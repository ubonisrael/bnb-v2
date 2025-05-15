import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "@/services/api-service";
import { useMutation } from "@tanstack/react-query";
import { BookingResponse, ErrorResponse } from "@/types/response";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const bookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  gender: z.enum(["Male", "Female", "Prefer not to say"], {
    required_error: "Please select a gender",
  }),
  age_category: z.enum(["Adult", "Child"], {
    required_error: "Please select an age category",
  }),
});

interface BookingFormValues {
  name: string;
  email: string;
  fee: number;
  total_amount: number;
  gender: string;
  age_category: string;
  event_date: string;
  event_time: number;
  event_duration: number;
  service_ids: string[];
  client_tz: string;
}

interface BookingFormProps {
  bUrl: string;
  nxtStep: string;
  fee: number;
  total_amount: number;
  event_date: string;
  event_time: number;
  event_duration: number;
  service_ids: string[];
}

const BookingForm = ({
  bUrl,
  nxtStep,
  service_ids,
  event_date,
  event_time,
  event_duration,
  total_amount,
  fee,
}: BookingFormProps) => {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      gender: "Male",
      age_category: "Adult",
    },
  });
  const router = useRouter();
  const bookingMutation = useMutation<
    BookingResponse,
    ErrorResponse,
    BookingFormValues
  >({
    mutationFn: (data: BookingFormValues) => {
      toast.loading("Scheduling appointment...", { id: "booking" });
      return api.post<BookingResponse>(`/sp/${bUrl}/booking`, data);
    },
    onSuccess: async (data: BookingResponse) => {
      toast.dismiss("booking");
      toast.success(data.message);
      router.push(`/default/${bUrl}/${nxtStep}`);
    },
    onError: (error: ErrorResponse) => {
      console.log(error);
      toast.dismiss("booking");
      toast.remove("booking");
      // toast.error(error.message, { id: "booking-error" });
    },
  });

  async function onSubmit(data: z.infer<typeof bookingSchema>) {
    const payload = {
      ...data,
      fee,
      total_amount,
      event_date,
      event_time,
      event_duration,
      service_ids,
      client_tz: dayjs.tz.guess(),
    };
    console.log(payload);
    try {
      bookingMutation.mutateAsync(payload);
    } catch (error: any) {
      toast.dismiss("booking");
      toast.error("Error creating appointment", { id: "booking-error" });
    }
  }

  return (
    <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
      <DialogTrigger asChild>
        <Button className="w-full py-3 px-4">Schedule Appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enter your details</DialogTitle>
          <DialogDescription>Enter your details</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="e.g. jane@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Male", "Female", "Prefer not to say"].map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
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
              name="age_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an age category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Adult", "Child"].map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setShowServiceModal(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Make appointment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
