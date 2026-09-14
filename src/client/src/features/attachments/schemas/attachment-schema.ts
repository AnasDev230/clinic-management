import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "dicom",
  "doc",
  "docx",
  "xls",
  "xlsx",
];

export function createUploadAttachmentSchema(t: (key: TranslationKey) => string) {
  return z.object({
    file: z
      .instanceof(File, { message: t("attachments.validation.fileRequired") })
      .refine((file) => file.size <= MAX_SIZE_BYTES, {
        message: t("attachments.invalidSize"),
      })
      .refine(
        (file) => {
          const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
          return ALLOWED_EXTENSIONS.includes(ext);
        },
        { message: t("attachments.invalidType") },
      ),
    description: z
      .string()
      .max(500, t("invoices.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    tags: z
      .string()
      .max(500, t("invoices.validation.notesMax"))
      .optional()
      .or(z.literal("")),
  });
}

export type UploadAttachmentFormValues = z.infer<
  ReturnType<typeof createUploadAttachmentSchema>
>;

export function updateAttachmentSchema(t: (key: TranslationKey) => string) {
  return z.object({
    description: z
      .string()
      .max(500, t("invoices.validation.notesMax"))
      .optional()
      .or(z.literal("")),
    tags: z
      .string()
      .max(500, t("invoices.validation.notesMax"))
      .optional()
      .or(z.literal("")),
  });
}

export type UpdateAttachmentFormValues = z.infer<
  ReturnType<typeof updateAttachmentSchema>
>;
