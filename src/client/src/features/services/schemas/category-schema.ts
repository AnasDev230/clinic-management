import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createCategorySchema(t: (key: TranslationKey) => string) {
  return z.object({
    name: z
      .string()
      .min(1, t("services.validation.nameRequired"))
      .max(200, t("services.validation.nameMax")),
    description: z
      .string()
      .max(500, t("services.validation.descriptionMax"))
      .optional()
      .or(z.literal("")),
    sortOrder: z.coerce.number().min(0, t("services.validation.sortOrderMin")),
  });
}

export type CategoryFormValues = z.infer<ReturnType<typeof createCategorySchema>>;

export function updateCategorySchema(t: (key: TranslationKey) => string) {
  return createCategorySchema(t).extend({
    isActive: z.boolean(),
  });
}

export type UpdateCategoryFormValues = z.infer<ReturnType<typeof updateCategorySchema>>;
