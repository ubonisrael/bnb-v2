import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api-service";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const supportFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

const defaultSupportFormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

type SupportFormData = z.infer<typeof supportFormSchema>;

interface SupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  const [isSuccess, setIsSuccess] = useState({ status: false, message: "" });

  const form = useForm<SupportFormData>({
    mode: "all",
    resolver: zodResolver(supportFormSchema),
    defaultValues: defaultSupportFormValues,
  });

  const formRef = useRef<HTMLFormElement | null>(null);

  const onError = (errors: any) => {
    if (!formRef.current) return;
    const firstErrorField = Object.keys(errors)[0];
    const errorElement = formRef.current.querySelector(
      `[name="${firstErrorField}"]`
    );
    if (errorElement) {
      errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      (errorElement as HTMLElement).focus();
    }
  };

  const updateBookingSettingsMutation = useMutation({
    mutationFn: async (values: z.infer<typeof supportFormSchema>) => {
      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await api.post<{ message: string }>(
          "customer-support",
          {
            ...values,
          },
          { signal }
        );
        return response;
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          toast.error("Request was cancelled");
        }
        throw error;
      }
    },
    onMutate: () => {
      toast.loading("Sending message...", {
        id: "support-message-send",
      });
    },
    onSuccess: (response) => {
      toast.success("Message has been sent successfully", {
        id: "support-message-send",
      });
      setIsSuccess({ status: true, message: response.message });
      // reset form after successful save
      form.reset(defaultSupportFormValues);
    },
    onError: (error: Error) => {
      toast.error("Failed to send message. Try again later", {
        id: "support-message-send",
      });
    },
  });

  const onSubmit = async (values: SupportFormData) => {
    try {
      await updateBookingSettingsMutation.mutateAsync(values);
    } catch (error) {
      console.error("Error saving booking days:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        form.reset(defaultSupportFormValues);
        onOpenChange(e);
      }}
    >
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
        </DialogHeader>

        {isSuccess.status ? (
          <div className="text-center text-green-600">
            <p>{isSuccess.message || "Thank you for your message! We'll get back to you soon."}</p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="space-y-4"
            >
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Subject of message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Message</FormLabel>
                    <FormControl>
                      <Textarea rows={10} placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>
                      Message sent to your clients upon confirmation of booking
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={updateBookingSettingsMutation.isPending}
                >
                  {updateBookingSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* <div className="text-center text-sm">
          <Link href="/support" className="text-primary hover:underline">
            Need more help? Visit our full support page
          </Link>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
