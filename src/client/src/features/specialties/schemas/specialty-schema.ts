import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createSpecialtySchema(t: (key: TranslationKey) => string) {
  return z.object({
    name: z
      .string()
      .min(1, t("specialties.validation.nameRequired"))
      .max(200, t("specialties.validation.nameMax")),
    description: z
      .string()
      .max(500, t("specialties.validation.descriptionMax"))
      .optional()
      .or(z.literal("")),
    isActive: z.boolean(),
    sortOrder: z.coerce
      .number()
      .int()
      .min(0, t("specialties.validation.sortOrderMin")),
  });
}

export type SpecialtyFormValues = z.infer<
  ReturnType<typeof createSpecialtySchema>
>;
