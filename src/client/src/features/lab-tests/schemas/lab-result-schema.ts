import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createLabResultSchema(t: (key: TranslationKey) => string) {
  return z.object({
    id: z.string().optional().or(z.literal("")),
    parameterName: z
      .string()
      .min(1, t("labTests.validation.parameterRequired"))
      .max(200, t("labTests.validation.parameterMax")),
    value: z
      .string()
      .max(100, t("labTests.validation.valueMax"))
      .optional()
      .or(z.literal("")),
    unit: z
      .string()
      .max(50, t("labTests.validation.unitMax"))
      .optional()
      .or(z.literal("")),
    normalRange: z
      .string()
      .max(100, t("labTests.validation.normalRangeMax"))
      .optional()
      .or(z.literal("")),
    isAbnormal: z.boolean(),
    notes: z
      .string()
      .max(500, t("labTests.validation.notesMax"))
      .optional()
      .or(z.literal("")),
  });
}

export type LabResultFormValues = z.infer<ReturnType<typeof createLabResultSchema>>;
