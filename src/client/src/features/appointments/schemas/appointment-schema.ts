import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createAppointmentSchema(t: (key: TranslationKey) => string) {
  return z
    .object({
      patientId: z.string().min(1, t("appointments.validation.patientRequired")),
      doctorId: z.string().min(1, t("appointments.validation.doctorRequired")),
      appointmentDate: z
        .string()
        .min(1, t("appointments.validation.dateRequired")),
      startTime: z.string().min(1, t("appointments.validation.startRequired")),
      endTime: z.string().min(1, t("appointments.validation.endRequired")),
      type: z.coerce.number().int().min(0).max(3),
      reason: z.string().max(500, t("appointments.validation.reasonMax")).optional().or(z.literal("")),
      notes: z.string().max(2000, t("appointments.validation.notesMax")).optional().or(z.literal("")),
      priority: z.coerce.number().int().min(0).max(3),
      durationMinutes: z.coerce
        .number()
        .int()
        .min(1, t("appointments.validation.durationRange"))
        .max(480, t("appointments.validation.durationRange")),
      status: z.coerce.number().int().min(0).max(5).optional(),
    })
    .refine((values) => values.endTime > values.startTime, {
      message: t("appointments.validation.endAfterStart"),
      path: ["endTime"],
    });
}

export type AppointmentFormValues = z.infer<
  ReturnType<typeof createAppointmentSchema>
>;

export function cancelAppointmentSchema(t: (key: TranslationKey) => string) {
  return z.object({
    cancellationReason: z
      .string()
      .min(1, t("appointments.validation.cancelReasonRequired"))
      .max(500, t("appointments.validation.reasonMax")),
  });
}

export type CancelAppointmentFormValues = z.infer<
  ReturnType<typeof cancelAppointmentSchema>
>;
