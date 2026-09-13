import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

const itemSchema = (t: (key: TranslationKey) => string) =>
  z.object({
    id: z.string().optional().or(z.literal("")),
    serviceName: z
      .string()
      .min(1, t("invoices.validation.serviceRequired"))
      .max(300, t("invoices.validation.serviceMax")),
    description: z
      .string()
      .max(500, t("invoices.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    medicalServiceId: z.string().optional().or(z.literal("")),
    quantity: z.coerce
      .number()
      .positive(t("invoices.validation.quantityPositive")),
    unitPrice: z.coerce
      .number()
      .positive(t("invoices.validation.pricePositive")),
    discountAmount: z.coerce
      .number()
      .min(0, t("invoices.validation.discountNegative")),
  });

export function createInvoiceSchema(t: (key: TranslationKey) => string) {
  return z.object({
    patientId: z.string().min(1, t("invoices.validation.patientRequired")),
    visitId: z.string().optional().or(z.literal("")),
    doctorId: z.string().optional().or(z.literal("")),
    dueDate: z.string().optional().or(z.literal("")),
    discountPercentage: z.coerce
      .number()
      .min(0, t("invoices.validation.percentageRange"))
      .max(100, t("invoices.validation.percentageRange")),
    taxPercentage: z.coerce
      .number()
      .min(0, t("invoices.validation.percentageRange"))
      .max(100, t("invoices.validation.percentageRange")),
    notes: z
      .string()
      .max(2000, t("invoices.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    items: z
      .array(itemSchema(t))
      .min(1, t("invoices.validation.itemsRequired")),
  });
}

export type InvoiceFormValues = z.infer<ReturnType<typeof createInvoiceSchema>>;

export function updateInvoiceSchema(t: (key: TranslationKey) => string) {
  return z.object({
    dueDate: z.string().optional().or(z.literal("")),
    discountPercentage: z.coerce
      .number()
      .min(0, t("invoices.validation.percentageRange"))
      .max(100, t("invoices.validation.percentageRange")),
    taxPercentage: z.coerce
      .number()
      .min(0, t("invoices.validation.percentageRange"))
      .max(100, t("invoices.validation.percentageRange")),
    notes: z
      .string()
      .max(2000, t("invoices.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    items: z
      .array(itemSchema(t))
      .min(1, t("invoices.validation.itemsRequired")),
  });
}

export type UpdateInvoiceFormValues = z.infer<
  ReturnType<typeof updateInvoiceSchema>
>;
