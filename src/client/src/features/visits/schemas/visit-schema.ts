import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createVisitSchema(t: (key: TranslationKey) => string) {
  return z.object({
    appointmentId: z.string().min(1, t("visits.validation.appointmentRequired")),
    chiefComplaint: z
      .string()
      .max(1000, t("visits.validation.chiefComplaintMax"))
      .optional()
      .or(z.literal("")),
    symptoms: z
      .string()
      .max(2000, t("visits.validation.symptomsMax"))
      .optional()
      .or(z.literal("")),
    notes: z.string().max(2000, t("visits.validation.notesMax")).optional().or(z.literal("")),
  });
}

export type VisitFormValues = z.infer<ReturnType<typeof createVisitSchema>>;

export function updateVisitSchema(t: (key: TranslationKey) => string) {
  return z
    .object({
      chiefComplaint: z
        .string()
        .max(1000, t("visits.validation.chiefComplaintMax"))
        .optional()
        .or(z.literal("")),
      symptoms: z
        .string()
        .max(2000, t("visits.validation.symptomsMax"))
        .optional()
        .or(z.literal("")),
      diagnosis: z
        .string()
        .max(2000, t("visits.validation.diagnosisMax"))
        .optional()
        .or(z.literal("")),
      treatmentPlan: z
        .string()
        .max(2000, t("visits.validation.treatmentPlanMax"))
        .optional()
        .or(z.literal("")),
      notes: z
        .string()
        .max(2000, t("visits.validation.notesMax"))
        .optional()
        .or(z.literal("")),
      nextVisitRecommended: z.boolean(),
      nextVisitNotes: z
        .string()
        .max(500, t("visits.validation.nextVisitNotesMax"))
        .optional()
        .or(z.literal("")),
      totalAmount: z.coerce
        .number()
        .min(0, t("visits.validation.amountNegative")),
      discountAmount: z.coerce
        .number()
        .min(0, t("visits.validation.amountNegative")),
    })
    .refine((values) => values.discountAmount <= values.totalAmount, {
      message: t("visits.validation.discountExceeds"),
      path: ["discountAmount"],
    });
}

export type UpdateVisitFormValues = z.infer<
  ReturnType<typeof updateVisitSchema>
>;
