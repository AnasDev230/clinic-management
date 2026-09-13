import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";
import { createLabResultSchema } from "./lab-result-schema";

export function createLabTestSchema(t: (key: TranslationKey) => string) {
  return z.object({
    visitId: z.string().min(1, t("labTests.validation.visitRequired")),
    testName: z
      .string()
      .min(1, t("labTests.validation.testNameRequired"))
      .max(300, t("labTests.validation.testNameMax")),
    testCategory: z
      .string()
      .max(200, t("labTests.validation.categoryMax"))
      .optional()
      .or(z.literal("")),
    priority: z.coerce.number().min(0).max(3),
    notes: z
      .string()
      .max(1000, t("labTests.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    results: z.array(createLabResultSchema(t)),
  });
}

export type LabTestFormValues = z.infer<ReturnType<typeof createLabTestSchema>>;

export function updateLabTestSchema(t: (key: TranslationKey) => string) {
  return z.object({
    testName: z
      .string()
      .min(1, t("labTests.validation.testNameRequired"))
      .max(300, t("labTests.validation.testNameMax")),
    testCategory: z
      .string()
      .max(200, t("labTests.validation.categoryMax"))
      .optional()
      .or(z.literal("")),
    priority: z.coerce.number().min(0).max(3),
    status: z.coerce.number().min(0).max(3),
    notes: z
      .string()
      .max(1000, t("labTests.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    results: z.array(createLabResultSchema(t)).default([]),
  });
}

export type UpdateLabTestFormValues = z.infer<ReturnType<typeof updateLabTestSchema>>;
