import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createAllergySchema(t: (key: TranslationKey) => string) {
  return z.object({
    name: z.string().min(1, t("patients.validation.nameRequired")),
    type: z.coerce.number().int().min(0).max(3),
    severity: z.coerce.number().int().min(0).max(2),
    notes: z.string().max(500).optional().or(z.literal("")),
  });
}

export type AllergyFormValues = z.infer<
  ReturnType<typeof createAllergySchema>
>;
