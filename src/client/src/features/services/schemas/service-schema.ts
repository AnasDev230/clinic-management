import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createServiceSchema(t: (key: TranslationKey) => string) {
  return z.object({
    name: z
      .string()
      .min(1, t("services.validation.nameRequired"))
      .max(300, t("services.validation.serviceNameMax")),
    description: z
      .string()
      .max(1000, t("services.validation.serviceDescriptionMax"))
      .optional()
      .or(z.literal("")),
    categoryId: z.string().min(1, t("services.validation.categoryRequired")),
    price: z.coerce.number().positive(t("services.validation.pricePositive")),
    durationMinutes: z.coerce.number().positive(t("services.validation.durationPositive")),
    requiresAppointment: z.boolean(),
    sortOrder: z.coerce.number().min(0, t("services.validation.sortOrderMin")),
  });
}

export type ServiceFormValues = z.infer<ReturnType<typeof createServiceSchema>>;

export function updateServiceSchema(t: (key: TranslationKey) => string) {
  return createServiceSchema(t).extend({
    isActive: z.boolean(),
  });
}

export type UpdateServiceFormValues = z.infer<ReturnType<typeof updateServiceSchema>>;
