import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export function createDoctorSchema(t: (key: TranslationKey) => string) {
  const scheduleSchema = z
    .object({
      dayOfWeek: z.number().int().min(0).max(6),
      startTime: z.string().regex(timePattern, t("doctors.validation.timeInvalid")),
      endTime: z.string().regex(timePattern, t("doctors.validation.timeInvalid")),
    })
    .refine((data) => data.endTime > data.startTime, {
      message: t("doctors.validation.timeOrder"),
    });

  return z.object({
    firstName: z.string().min(1, t("doctors.validation.firstNameRequired")),
    lastName: z.string().min(1, t("doctors.validation.lastNameRequired")),
    email: z
      .string()
      .min(1, t("doctors.validation.emailRequired"))
      .email(t("doctors.validation.emailInvalid")),
    phone: z.string().min(1, t("doctors.validation.phoneRequired")),
    licenseNumber: z
      .string()
      .min(1, t("doctors.validation.licenseRequired")),
    yearsOfExperience: z.coerce
      .number()
      .int()
      .min(0, t("doctors.validation.yearsNegative")),
    bio: z.string().max(1000).optional().or(z.literal("")),
    specialtyIds: z
      .array(z.string())
      .min(1, t("doctors.validation.specialtyRequired")),
    schedules: z.array(scheduleSchema),
    isActive: z.boolean(),
  });
}

export type DoctorFormValues = z.infer<ReturnType<typeof createDoctorSchema>>;
