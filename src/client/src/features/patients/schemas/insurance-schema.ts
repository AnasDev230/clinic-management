import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createInsuranceSchema(t: (key: TranslationKey) => string) {
  return z.object({
    providerName: z
      .string()
      .min(1, t("patients.validation.providerRequired")),
    policyNumber: z.string().min(1, t("patients.validation.policyRequired")),
    groupNumber: z.string().max(100).optional().or(z.literal("")),
    expiryDate: z.string().min(1),
    coveragePercentage: z.coerce
      .number()
      .min(0, t("patients.validation.coverageRange"))
      .max(100, t("patients.validation.coverageRange")),
    isActive: z.boolean(),
  });
}

export type InsuranceFormValues = z.infer<
  ReturnType<typeof createInsuranceSchema>
>;
