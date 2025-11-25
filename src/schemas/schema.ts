import { timezones } from "@/utils/time";
import { z } from "zod";

const policySchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  policies: z.array(z.string()).min(1, "At least one policy is required"),
});

// Form schemas
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters" }),
});

export const serviceSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Service name must be at least 2 characters" }),
  CategoryId: z.coerce.number().min(1, { message: "Please select a category" }),
  fullPrice: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number" }),
  duration: z.coerce
    .number()
    .min(5, { message: "Duration must be at least 5 minutes" }),
  description: z
    .string()
    .min(16, { message: "Description must be at least 16 characters" }),
  monday_enabled: z.boolean(),
  tuesday_enabled: z.boolean(),
  wednesday_enabled: z.boolean(),
  thursday_enabled: z.boolean(),
  friday_enabled: z.boolean(),
  saturday_enabled: z.boolean(),
  sunday_enabled: z.boolean(),
});

export const baseBookingSettingsSchema = (allowedTimeZones: string[]) =>
  z
    .object({
      welcome_message: z.string().min(24, {
        message:
          "Welcome message must be at least 24 characters long to provide sufficient information",
      }),
      custom_policies: z.array(policySchema),
      auto_generate_deposit_policy: z.boolean().default(true),
      auto_generate_cancellation_policy: z.boolean().default(true),
      auto_generate_reschedule_policy: z.boolean().default(true),
      auto_generate_no_show_policy: z.boolean().default(true),
      absorb_service_charge: z.boolean().default(false),
      time_slot_duration: z
        .number({
          required_error: "Please specify a time slot duration",
          invalid_type_error: "Time slot duration must be a valid number",
        })
        .min(30)
        .max(120),
      allow_deposits: z.boolean(),
      deposit_amount: z
        .number({
          required_error:
            "Please specify a deposit amount when deposits are allowed",
          invalid_type_error: "Deposit amount must be a valid number",
        })
        .int()
        .min(5)
        .optional(),
      cancellation_allowed: z.boolean(),
      cancellation_notice_hours: z
        .number()
        .int()
        .min(0, "Notice hours must be 0 or greater")
        .optional(),
      cancellation_fee_percent: z.number().int().min(0).max(100).optional(),
      no_show_fee_percent: z.number().int().min(0).max(100),
      reschedule_allowed: z.boolean(),
      reschedule_notice_hours: z
        .number()
        .int()
        .min(0, "Notice hours must be 0 or greater")
        .optional(),
      reschedule_penalty_enabled: z.boolean(),
      reschedule_fee_percent: z.number().int().min(0).max(100).optional(),
      maximum_notice: z.number().int().min(0),
      minimum_notice: z.number().int().min(0),
      time_zone: z
        .string()
        .min(2)
        .refine((val) => allowedTimeZones.includes(val), {
          message: "Please select a time zone from the provided list",
        }),

      // Days of the week
      sunday_enabled: z.boolean().default(false),
      sunday_opening: z.number().default(0),
      sunday_closing: z.number().default(0),
      monday_enabled: z.boolean().default(false),
      monday_opening: z.number().default(0),
      monday_closing: z.number().default(0),
      tuesday_enabled: z.boolean().default(false),
      tuesday_opening: z.number().default(0),
      tuesday_closing: z.number().default(0),
      wednesday_enabled: z.boolean().default(false),
      wednesday_opening: z.number().default(0),
      wednesday_closing: z.number().default(0),
      thursday_enabled: z.boolean().default(false),
      thursday_opening: z.number().default(0),
      thursday_closing: z.number().default(0),
      friday_enabled: z.boolean().default(false),
      friday_opening: z.number().default(0),
      friday_closing: z.number().default(0),
      saturday_enabled: z.boolean().default(false),
      saturday_opening: z.number().default(0),
      saturday_closing: z.number().default(0),
    })
    .refine((data) => data.maximum_notice >= data.minimum_notice + 1, {
      message:
        "Maximum advance booking notice must be atleast 1 day more than minimum notice for proper scheduling",
      path: ["maximum_notice"],
    })
    .superRefine((data: Record<string, any>, ctx) => {
      if (
        data.allow_deposits &&
        (data.deposit_amount === undefined || data.deposit_amount === undefined)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "When deposits are enabled, you must specify a deposit amount",
          path: ["deposit_amount"],
        });
      }

      if (data.cancellation_allowed) {
        if (data.cancellation_notice_hours === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Please specify how many hours in advance a cancellation must be made",
            path: ["cancellation_notice_hours"],
          });
        }
        if (data.cancellation_fee_percent === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the cancellation fee percentage",
            path: ["cancellation_fee_percent"],
          });
        }
      }
      if (data.reschedule_allowed) {
        if (data.reschedule_notice_hours === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Please specify how many hours in advance a reschedule must be requested",
            path: ["reschedule_notice_hours"],
          });
        }
        // Validate fee percentage when late rescheduling is enabled
        if (
          data.reschedule_penalty_enabled &&
          data.reschedule_fee_percent === undefined
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the late reschedule fee percentage",
            path: ["reschedule_fee_percent"],
          });
        }
      }
    });

export const bookingSettingsSchema = baseBookingSettingsSchema(timezones);

export const programSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Program name must be at least 2 characters" })
      .max(255, { message: "Program name must not exceed 255 characters" })
      .trim(),
    about: z
      .string()
      .min(10, {
        message: "Program description must be at least 10 characters",
      })
      .max(2000, {
        message: "Program description must not exceed 2000 characters",
      })
      .trim(),
    start_date: z
      .date({ required_error: "Start date is required" })
      .refine((date) => date > new Date(), {
        message: "Start date must be in the future",
      }),
    end_date: z.date({ required_error: "End date is required" }),
    price: z.coerce
      .number({ required_error: "Price is required" })
      .min(0, { message: "Price cannot be negative" }),
    capacity: z.coerce
      .number()
      .int()
      .min(1, { message: "Capacity must be a positive integer" })
      .optional()
      .nullable(),
    start_booking_immediately: z.boolean().default(true),
    start_booking_date: z.date().optional().nullable(),
    end_booking_when_program_ends: z.boolean().default(true),
    end_booking_date: z.date().optional().nullable(),
    is_active: z.boolean().default(true),
    is_published: z.boolean().default(false),
    offer_early_bird: z.boolean().default(false),
    early_bird_discount_type: z
      .enum(["percentage", "fixed_amount"])
      .optional()
      .nullable(),
    early_bird_discount_value: z.coerce
      .number()
      .min(0, { message: "Early bird discount value cannot be negative" })
      .optional()
      .nullable(),
    early_bird_deadline: z.date().optional().nullable(),
    banner_image_url: z
      .string()
      .url({ message: "Banner image URL must be a valid URL" })
      .optional()
      .nullable(),
    allow_deposits: z.boolean().default(false),
    deposit_amount: z.coerce
      .number()
      .int()
      .min(1, { message: "Deposit amount must be a positive integer" })
      .optional()
      .nullable(),
    absorb_service_charge: z.boolean().default(false),
    allow_refunds: z.boolean().default(false),
    refund_deadline_in_hours: z.coerce
      .number()
      .int()
      .min(0, { message: "Refund deadline must be a non-negative integer" })
      .optional()
      .nullable(),
    refund_percentage: z.coerce
      .number()
      .int()
      .min(0, { message: "Refund percentage must be between 0 and 100" })
      .max(100, { message: "Refund percentage must be between 0 and 100" })
      .optional()
      .nullable(),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  })
  .refine(
    (data) => {
      if (!data.start_booking_immediately && !data.start_booking_date) {
        return false;
      }
      return true;
    },
    {
      message: "Start booking date is required when not starting immediately",
      path: ["start_booking_date"],
    }
  )
  .refine(
    (data) => {
      if (data.start_booking_date && data.start_booking_immediately) {
        return false;
      }
      return true;
    },
    {
      message:
        "Cannot set start booking date when start booking immediately is true",
      path: ["start_booking_date"],
    }
  )
  .refine(
    (data) => {
      if (!data.end_booking_when_program_ends && !data.end_booking_date) {
        return false;
      }
      return true;
    },
    {
      message: "End booking date is required when not ending with program",
      path: ["end_booking_date"],
    }
  )
  .refine(
    (data) => {
      if (data.end_booking_date && data.end_booking_when_program_ends) {
        return false;
      }
      return true;
    },
    {
      message:
        "Cannot set end booking date when end booking when program ends is true",
      path: ["end_booking_date"],
    }
  )
  .refine(
    (data) => {
      if (data.end_booking_date && data.end_booking_date >= data.start_date) {
        return false;
      }
      return true;
    },
    {
      message: "End booking date must be before program start date",
      path: ["end_booking_date"],
    }
  )
  .refine(
    (data) => {
      if (
        data.early_bird_deadline &&
        data.early_bird_deadline >= data.start_date
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Early bird deadline must be before program start date",
      path: ["early_bird_deadline"],
    }
  )
  .refine(
    (data) => {
      if (
        data.early_bird_discount_type === "percentage" &&
        data.early_bird_discount_value
      ) {
        return data.early_bird_discount_value <= 100;
      }
      return true;
    },
    {
      message: "Percentage discount must be between 0 and 100",
      path: ["early_bird_discount_value"],
    }
  )
  .refine(
    (data) => {
      if (data.allow_deposits && !data.deposit_amount) {
        return false;
      }
      return true;
    },
    {
      message: "Deposit amount is required when allow deposits is true",
      path: ["deposit_amount"],
    }
  )
  .refine(
    (data) => {
      if (data.deposit_amount && !data.allow_deposits) {
        return false;
      }
      return true;
    },
    {
      message: "Deposit amount can only be set when allow deposits is true",
      path: ["deposit_amount"],
    }
  )
  .refine(
    (data) => {
      if (
        data.allow_refunds &&
        (data.refund_deadline_in_hours === null ||
          data.refund_deadline_in_hours === undefined)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Refund deadline in hours is required when allow refunds is true",
      path: ["refund_deadline_in_hours"],
    }
  )
  .refine(
    (data) => {
      if (
        data.allow_refunds &&
        (data.refund_percentage === null ||
          data.refund_percentage === undefined)
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Refund percentage is required when allow refunds is true",
      path: ["refund_percentage"],
    }
  )
  .refine(
    (data) => {
      if (
        data.refund_deadline_in_hours !== null &&
        data.refund_deadline_in_hours !== undefined &&
        !data.allow_refunds
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Refund deadline can only be set when allow refunds is true",
      path: ["refund_deadline_in_hours"],
    }
  )
  .refine(
    (data) => {
      if (
        data.refund_percentage !== null &&
        data.refund_percentage !== undefined &&
        !data.allow_refunds
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Refund percentage can only be set when allow refunds is true",
      path: ["refund_percentage"],
    }
  );

// New Program Schema (simplified for parent programs)
export const newProgramSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Program name must be at least 2 characters" })
    .max(255, { message: "Program name must not exceed 255 characters" })
    .trim(),
  about: z
    .string()
    .min(10, {
      message: "Program description must be at least 10 characters",
    })
    .max(2000, {
      message: "Program description must not exceed 2000 characters",
    })
    .trim(),
  capacity: z.coerce
    .number()
    .int()
    .min(1, { message: "Capacity must be a positive integer" })
    .optional()
    .nullable(),
  set_capacity_per_class: z.boolean().default(false),
  banner_image_url: z
    .string()
    .url({ message: "Banner image URL must be a valid URL" })
    .optional()
    .nullable(),
  is_active: z.boolean().default(true),
  is_published: z.boolean().default(false),
  set_deposit_instructions_per_class: z.boolean().default(false),
  allow_deposits: z.boolean().default(false),
  deposit_amount: z.coerce
    .number()
    .int()
    .min(1, { message: "Deposit amount must be a positive integer" })
    .optional()
    .nullable(),
  absorb_service_charge: z.boolean().default(false),
  allow_refunds: z.boolean().default(false),
  refund_deadline_in_hours: z.coerce
    .number()
    .int()
    .min(0, { message: "Refund deadline must be a non-negative integer" })
    .optional()
    .nullable(),
  refund_percentage: z.coerce
    .number()
    .int()
    .min(0, { message: "Refund percentage must be between 0 and 100" })
    .max(100, { message: "Refund percentage must be between 0 and 100" })
    .optional()
    .nullable(),
});

// Program Class Schema
export const programClassSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Class name must be at least 2 characters" })
      .max(255, { message: "Class name must not exceed 255 characters" })
      .trim(),
    description: z
      .string()
      .min(10, {
        message: "Class description must be at least 10 characters",
      })
      .max(2000, {
        message: "Class description must not exceed 2000 characters",
      })
      .trim(),
    start_date: z
      .date({ required_error: "Start date is required" })
      .refine((date) => date > new Date(), {
        message: "Start date must be in the future",
      }),
    end_date: z.date({ required_error: "End date is required" }),
    price: z.coerce
      .number({ required_error: "Price is required" })
      .min(0, { message: "Price cannot be negative" }),
    capacity: z.coerce
      .number()
      .int()
      .min(1, { message: "Capacity must be a positive integer" })
      .optional()
      .nullable(),
    is_active: z.boolean().default(true),
    is_published: z.boolean().default(false),
    start_booking_immediately: z.boolean().default(true),
    start_booking_date: z.date().optional().nullable(),
    end_booking_when_class_ends: z.boolean().default(true),
    end_booking_date: z.date().optional().nullable(),
    offer_early_bird: z.boolean().default(false),
    early_bird_discount_type: z
      .enum(["percentage", "fixed_amount"])
      .optional()
      .nullable(),
    early_bird_discount_value: z.coerce
      .number()
      .min(0, { message: "Early bird discount value cannot be negative" })
      .optional()
      .nullable(),
    early_bird_deadline: z.date().optional().nullable(),
    allow_deposits: z.boolean().default(false),
    deposit_amount: z.coerce
      .number()
      .int()
      .min(1, { message: "Deposit amount must be a positive integer" })
      .optional()
      .nullable(),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  })
  .refine(
    (data) => {
      if (!data.start_booking_immediately && !data.start_booking_date) {
        return false;
      }
      return true;
    },
    {
      message: "Start booking date is required when not starting immediately",
      path: ["start_booking_date"],
    }
  )
  .refine(
    (data) => {
      if (data.start_booking_date && data.start_booking_immediately) {
        return false;
      }
      return true;
    },
    {
      message: "Cannot set start booking date when starting immediately",
      path: ["start_booking_date"],
    }
  )
  .refine(
    (data) => {
      if (!data.end_booking_when_class_ends && !data.end_booking_date) {
        return false;
      }
      return true;
    },
    {
      message: "End booking date is required when not ending with class",
      path: ["end_booking_date"],
    }
  )
  .refine(
    (data) => {
      if (data.end_booking_date && data.end_booking_when_class_ends) {
        return false;
      }
      return true;
    },
    {
      message: "Cannot set end booking date when ending with class",
      path: ["end_booking_date"],
    }
  )
  .refine(
    (data) => {
      if (data.offer_early_bird && !data.early_bird_discount_type) {
        return false;
      }
      return true;
    },
    {
      message: "Early bird discount type is required when offering early bird",
      path: ["early_bird_discount_type"],
    }
  )
  .refine(
    (data) => {
      if (data.offer_early_bird && !data.early_bird_discount_value) {
        return false;
      }
      return true;
    },
    {
      message: "Early bird discount value is required when offering early bird",
      path: ["early_bird_discount_value"],
    }
  )
  .refine(
    (data) => {
      if (data.offer_early_bird && !data.early_bird_deadline) {
        return false;
      }
      return true;
    },
    {
      message: "Early bird deadline is required when offering early bird",
      path: ["early_bird_deadline"],
    }
  )
  .refine(
    (data) => {
      if (data.allow_deposits && !data.deposit_amount) {
        return false;
      }
      return true;
    },
    {
      message: "Deposit amount is required when allowing deposits",
      path: ["deposit_amount"],
    }
  );
