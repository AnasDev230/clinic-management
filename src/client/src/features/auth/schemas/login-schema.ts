import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createLoginSchema(t: (key: TranslationKey) => string) {
  return z.object({
    email: z
      .string()
      .min(1, t("auth.login.validation.emailRequired"))
      .email(t("auth.login.validation.emailInvalid")),
    password: z
      .string()
      .min(1, t("auth.login.validation.passwordRequired"))
      .min(8, t("auth.login.validation.passwordMin")),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
