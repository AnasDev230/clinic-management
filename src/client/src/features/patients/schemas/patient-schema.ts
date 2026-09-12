import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createPatientSchema(t: (key: TranslationKey) => string) {
  return z.object({
    firstName: z.string().min(1, t("patients.validation.firstNameRequired")),
    lastName: z.string().min(1, t("patients.validation.lastNameRequired")),
    dateOfBirth: z
      .string()
      .min(1, t("patients.validation.dobPast"))
      .refine((value) => new Date(value) < new Date(), {
        message: t("patients.validation.dobPast"),
      }),
    gender: z.coerce.number().int().min(0).max(1),
    phone: z.string().min(1, t("patients.validation.phoneRequired")),
    email: z.string().email().optional().or(z.literal("")),
    address: z.string().max(500).optional().or(z.literal("")),
    city: z.string().max(100).optional().or(z.literal("")),
    nationalId: z.string().max(50).optional().or(z.literal("")),
    bloodType: z.string().max(5).optional().or(z.literal("")),
    emergencyContactName: z.string().max(200).optional().or(z.literal("")),
    emergencyContactPhone: z.string().max(20).optional().or(z.literal("")),
    notes: z.string().max(2000).optional().or(z.literal("")),
    isActive: z.boolean(),
  });
}

export type PatientFormValues = z.infer<ReturnType<typeof createPatientSchema>>;
