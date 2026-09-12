import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createMedicalHistorySchema(t: (key: TranslationKey) => string) {
  return z.object({
    title: z.string().min(1, t("patients.validation.titleRequired")),
    description: z.string().max(2000).optional().or(z.literal("")),
    diagnosedDate: z.string().optional().or(z.literal("")),
    status: z.coerce.number().int().min(0).max(2),
  });
}

export type MedicalHistoryFormValues = z.infer<
  ReturnType<typeof createMedicalHistorySchema>
>;
