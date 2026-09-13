import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

function nullableRangedNumber(min: number, max: number, message: string) {
  return z
    .union([z.literal(""), z.coerce.number(), z.nan()])
    .transform((value) =>
      value === "" || (typeof value === "number" && Number.isNaN(value))
        ? null
        : (value as number),
    )
    .refine((value) => value === null || (value >= min && value <= max), {
      message,
    });
}

export function createVitalsSchema(t: (key: TranslationKey) => string) {
  return z.object({
    temperature: nullableRangedNumber(
      30,
      45,
      t("vitals.validation.temperatureRange"),
    ),
    bloodPressureSystolic: nullableRangedNumber(
      50,
      300,
      t("vitals.validation.systolicRange"),
    ),
    bloodPressureDiastolic: nullableRangedNumber(
      30,
      200,
      t("vitals.validation.diastolicRange"),
    ),
    heartRate: nullableRangedNumber(20, 300, t("vitals.validation.heartRateRange")),
    respiratoryRate: nullableRangedNumber(
      5,
      80,
      t("vitals.validation.respiratoryRateRange"),
    ),
    oxygenSaturation: nullableRangedNumber(
      0,
      100,
      t("vitals.validation.oxygenRange"),
    ),
    weight: nullableRangedNumber(1, 500, t("vitals.validation.weightRange")),
    height: nullableRangedNumber(30, 250, t("vitals.validation.heightRange")),
    notes: z
      .string()
      .max(500, t("vitals.validation.notesMax"))
      .optional()
      .or(z.literal("")),
  });
}

export type VitalsFormValues = z.infer<ReturnType<typeof createVitalsSchema>>;
