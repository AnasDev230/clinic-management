import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createDiagnosisSchema(t: (key: TranslationKey) => string) {
  return z.object({
    code: z.string().max(20, t("diagnoses.validation.codeMax")).optional().or(z.literal("")),
    name: z
      .string()
      .min(1, t("diagnoses.validation.nameRequired"))
      .max(300, t("diagnoses.validation.nameMax")),
    description: z
      .string()
      .max(1000, t("diagnoses.validation.descriptionMax"))
      .optional()
      .or(z.literal("")),
    isPrimary: z.boolean(),
  });
}

export type DiagnosisFormValues = z.infer<
  ReturnType<typeof createDiagnosisSchema>
>;
