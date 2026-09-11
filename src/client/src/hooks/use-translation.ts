"use client";

import { useLanguageStore } from "@/stores/language-store";
import { getTranslation } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/translations/en";

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const dictionary = getTranslation(language);

  const t = (key: TranslationKey): string => dictionary[key] ?? key;

  return { t, language };
}
