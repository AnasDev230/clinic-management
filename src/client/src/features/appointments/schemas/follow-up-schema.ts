import { z } from "zod";
import type { TranslationKey } from "@/lib/translations/en";

export function createFollowUpSchema(t: (key: TranslationKey) => string) {
  return z.object({
    followUpDate: z.string().min(1, t("followUps.validation.dateRequired")),
    notes: z.string().max(1000, t("followUps.validation.notesMax")).optional().or(z.literal("")),
    isCompleted: z.boolean().optional(),
  });
}

export type FollowUpFormValues = z.infer<
  ReturnType<typeof createFollowUpSchema>
>;
