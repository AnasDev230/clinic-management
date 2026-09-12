import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createClinicSettingsSchema(t: (key: TranslationKey) => string) {
  return z.object({
    currencyCode: z.string().length(3, t("clinic.validation.currencyLength")),
    timeZone: z.string().min(1, t("clinic.validation.timeZoneRequired")),
    allowOnlineBooking: z.boolean(),
    appointmentDurationMinutes: z.coerce
      .number()
      .int()
      .min(1, t("clinic.validation.durationPositive")),
    maxPatientsPerDay: z.coerce
      .number()
      .int()
      .min(1, t("clinic.validation.maxPatientsPositive")),
  });
}

export type ClinicSettingsFormValues = z.infer<
  ReturnType<typeof createClinicSettingsSchema>
>;
