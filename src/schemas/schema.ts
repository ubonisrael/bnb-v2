import { capitalize } from "@/utils/strings";
import { timezones } from "@/utils/time";
import { z } from "zod";

const policySchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Title must be at least 2 characters"),
  policies: z.array(z.string()).min(1, "At least one policy is required"),
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
        .min(5)
        .optional(),
      cancellation_allowed: z.boolean(),
      cancellation_notice_hours: z
        .number()
        .min(0, "Notice hours must be 0 or greater")
        .optional(),
      cancellation_fee_percent: z.number().min(0).max(100).optional(),
      no_show_fee_percent: z.number().min(0).max(100),
      reschedule_allowed: z.boolean(),
      reschedule_notice_hours: z
        .number()
        .min(0, "Notice hours must be 0 or greater")
        .optional(),
      reschedule_fee_percent: z.number().min(0).max(100).optional(),
      maximum_notice: z.number().min(0),
      minimum_notice: z.number().min(0),
      time_zone: z
        .string()
        .min(2)
        .refine((val) => allowedTimeZones.includes(val), {
          message: "Please select a time zone from the provided list",
        }),
      special_off_days: z.array(
        z.object({
          id: z.string(),
          start_date: z.string().optional(),
          dates: z.array(z.string()).optional(),
          end_date: z.string().optional(),
          reason: z.string().optional(),
          is_recurring: z.boolean().optional(),
          mode: z.enum(["single", "multiple", "range"]),
        })
      ),
      break_times: z.array(
        z.object({
          id: z.string(),
          day_of_week: z.string(),
          start_time: z.number(),
          end_time: z.number(),
          name: z.string().optional(),
        })
      ),

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
        if (data.reschedule_fee_percent === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the reschedule fee percentage",
            path: ["reschedule_fee_percent"],
          });
        }
      }

      const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];

      for (const day of days) {
        const enabled = data[`${day}_enabled`];
        const opening = data[`${day}_opening`];
        const closing = data[`${day}_closing`];

        if (enabled) {
          if (closing >= 1439) {
            ctx.addIssue({
              path: [`${day}_closing`],
              message: `${
                day.charAt(0).toUpperCase() + day.slice(1)
              } closing time must be before 11:59 PM`,
              code: z.ZodIssueCode.custom,
            });
          }

          if (closing <= opening) {
            ctx.addIssue({
              path: [`${day}_closing`],
              message: `${
                day.charAt(0).toUpperCase() + day.slice(1)
              } closing time must be later than opening time`,
              code: z.ZodIssueCode.custom,
            });
          }
        }
        // Break time checks for the current day
        const breaks = (data.break_times || []).filter(
          (b: BreakTime) => b.day_of_week.toLowerCase() === day
        );

        // Sort breaks by startTime to check for overlap
        const sortedBreaks = breaks
          .slice()
          .sort((a: BreakTime, b: BreakTime) => a.start_time - b.start_time);

        for (let i = 0; i < sortedBreaks.length; i++) {
          const curr = sortedBreaks[i];

          // Start >= End?
          if (curr.start_time >= curr.end_time) {
            ctx.addIssue({
              path: [`${day}_break_times_${i}_end_time`],
              message: `Break end time must be after start time`,
              code: z.ZodIssueCode.custom,
            });
          }

          // Start before opening?
          if (curr.start_time < opening) {
            ctx.addIssue({
              path: [`${day}_break_times_${i}_start_time`],
              message: `Break start time cannot be before ${capitalize(
                day
              )} opening time`,
              code: z.ZodIssueCode.custom,
            });
          }

          // End after closing?
          if (curr.end_time > closing) {
            ctx.addIssue({
              path: [`${day}_break_times_${i}_end_time`],
              message: `Break end time cannot be after ${capitalize(
                day
              )} closing time`,
              code: z.ZodIssueCode.custom,
            });
          }

          // Overlap with next break
          const next = sortedBreaks[i + 1];
          if (next && curr.end_time > next.start_time) {
            ctx.addIssue({
              path: [`${day}_break_times_${i}`],
              message: `Break time overlaps with another break on ${capitalize(
                day
              )}`,
              code: z.ZodIssueCode.custom,
            });
          }
        }
      }

      // SPECIAL OFF DAY VALIDATION
      const allOffDatesSet = new Set<string>();

      data.special_off_days?.forEach((offDay: OffDay, index: number) => {
        const mode = offDay.mode;
        const pathPrefix = [`special_off_days_${index}`];

        if (mode === "single") {
          if (!offDay.start_date) {
            ctx.addIssue({
              path: [`${pathPrefix}_start_date`],
              message: "start_date is required for 'single' mode",
              code: z.ZodIssueCode.custom,
            });
          }
          if (offDay.dates || offDay.end_date) {
            ctx.addIssue({
              path: [...pathPrefix],
              message:
                "'dates' and 'end_date' must not be set for 'single' mode",
              code: z.ZodIssueCode.custom,
            });
          }

          if (offDay.start_date) {
            if (allOffDatesSet.has(offDay.start_date)) {
              ctx.addIssue({
                path: [`${pathPrefix}_start_date`],
                message: `Date ${offDay.start_date} overlaps with another special off day`,
                code: z.ZodIssueCode.custom,
              });
            }
            allOffDatesSet.add(offDay.start_date);
          }
        } else if (mode === "multiple") {
          if (!offDay.dates || offDay.dates.length === 0) {
            ctx.addIssue({
              path: [`${pathPrefix}_dates`],
              message: "'dates' must be a non-empty array for 'multiple' mode",
              code: z.ZodIssueCode.custom,
            });
          }

          if (offDay.start_date || offDay.end_date) {
            ctx.addIssue({
              path: [...pathPrefix],
              message:
                "'start_date' and 'end_date' must not be set for 'multiple' mode",
              code: z.ZodIssueCode.custom,
            });
          }

          for (const date of offDay.dates || []) {
            if (allOffDatesSet.has(date)) {
              ctx.addIssue({
                path: [`${pathPrefix}_dates`],
                message: `Date ${date} overlaps with another special off day`,
                code: z.ZodIssueCode.custom,
              });
            }
            allOffDatesSet.add(date);
          }
        } else if (mode === "range") {
          if (!offDay.start_date || !offDay.end_date) {
            ctx.addIssue({
              path: [...pathPrefix],
              message:
                "Both 'start_date' and 'end_date' are required for 'range' mode",
              code: z.ZodIssueCode.custom,
            });
            return;
          }

          if (offDay.dates) {
            ctx.addIssue({
              path: [`${pathPrefix}_dates`],
              message: "'dates' must not be set for 'range' mode",
              code: z.ZodIssueCode.custom,
            });
          }

          const start = new Date(offDay.start_date);
          const end = new Date(offDay.end_date);

          if (start > end) {
            ctx.addIssue({
              path: [`${pathPrefix}_end_date`],
              message: "end_date must be after start_date",
              code: z.ZodIssueCode.custom,
            });
          } else {
            const current = new Date(start);
            while (current <= end) {
              const dateStr = current.toISOString().split("T")[0];
              if (allOffDatesSet.has(dateStr)) {
                ctx.addIssue({
                  path: [...pathPrefix],
                  message: `Date ${dateStr} overlaps with another special off day`,
                  code: z.ZodIssueCode.custom,
                });
              }
              allOffDatesSet.add(dateStr);
              current.setDate(current.getDate() + 1);
            }
          }
        }
      });
    });

export const bookingSettingsSchema = baseBookingSettingsSchema(timezones);