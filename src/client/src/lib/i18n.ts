import type { Language } from "./i18n-lang";
import { ar } from "./translations/ar";
import { en } from "./translations/en";

export type { Language };

export function getTranslation(language: Language) {
  return language === "ar" ? ar : en;
}

export function getDirection(language: Language): "rtl" | "ltr" {
  return language === "ar" ? "rtl" : "ltr";
}
