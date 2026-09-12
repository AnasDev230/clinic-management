import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createClinicProfileSchema(t: (key: TranslationKey) => string) {
  return z
    .object({
      name: z.string().min(1, t("clinic.validation.nameRequired")),
      logo: z.string().max(500).optional().or(z.literal("")),
      address: z.string().max(500).optional().or(z.literal("")),
      city: z.string().max(100).optional().or(z.literal("")),
      phone: z.string().max(20).optional().or(z.literal("")),
      email: z.string().email().optional().or(z.literal("")),
      workingHoursStart: z.string().min(1),
      workingHoursEnd: z.string().min(1),
      about: z.string().max(1000).optional().or(z.literal("")),
    })
    .refine((data) => data.workingHoursEnd > data.workingHoursStart, {
      message: t("clinic.validation.endAfterStart"),
      path: ["workingHoursEnd"],
    });
}

export type ClinicProfileFormValues = z.infer<
  ReturnType<typeof createClinicProfileSchema>
>;
