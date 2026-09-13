import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createPaymentSchema(
  t: (key: TranslationKey) => string,
  remainingBalance: number,
) {
  return z.object({
    amount: z.coerce
      .number()
      .positive(t("payments.validation.amountPositive"))
      .max(remainingBalance, t("payments.validation.amountExceeds")),
    paymentMethod: z.coerce.number().min(0).max(6),
    referenceNumber: z
      .string()
      .max(100, t("invoices.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    notes: z
      .string()
      .max(500, t("invoices.validation.notesMax"))
      .optional()
      .or(z.literal("")),
  });
}

export type PaymentFormValues = z.infer<ReturnType<typeof createPaymentSchema>>;
