import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

const itemSchema = (t: (key: TranslationKey) => string) =>
  z.object({
    id: z.string().optional().or(z.literal("")),
    medicationName: z
      .string()
      .min(1, t("prescriptions.validation.medicationRequired"))
      .max(300, t("prescriptions.validation.medicationMax")),
    dosage: z
      .string()
      .max(200, t("prescriptions.validation.dosageMax"))
      .optional()
      .or(z.literal("")),
    frequency: z
      .string()
      .max(200, t("prescriptions.validation.frequencyMax"))
      .optional()
      .or(z.literal("")),
    duration: z
      .string()
      .max(200, t("prescriptions.validation.durationMax"))
      .optional()
      .or(z.literal("")),
    quantity: z.coerce.number().positive(t("prescriptions.validation.quantityPositive")).optional(),
    instructions: z
      .string()
      .max(500, t("prescriptions.validation.instructionsMax"))
      .optional()
      .or(z.literal("")),
  });

export function createPrescriptionSchema(t: (key: TranslationKey) => string) {
  return z.object({
    visitId: z.string().min(1, t("prescriptions.validation.visitRequired")),
    notes: z
      .string()
      .max(1000, t("prescriptions.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    validUntil: z.string().optional().or(z.literal("")),
    items: z
      .array(itemSchema(t))
      .min(1, t("prescriptions.validation.itemsRequired")),
  });
}

export type PrescriptionFormValues = z.infer<
  ReturnType<typeof createPrescriptionSchema>
>;

export function updatePrescriptionSchema(t: (key: TranslationKey) => string) {
  return z.object({
    notes: z
      .string()
      .max(1000, t("prescriptions.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    validUntil: z.string().optional().or(z.literal("")),
    status: z.coerce.number().min(0).max(3),
    items: z
      .array(itemSchema(t))
      .min(1, t("prescriptions.validation.itemsRequired")),
  });
}

export type UpdatePrescriptionFormValues = z.infer<
  ReturnType<typeof updatePrescriptionSchema>
>;
