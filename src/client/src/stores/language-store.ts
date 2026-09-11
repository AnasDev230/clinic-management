"use client";

import { create } from "zustand";
import type { Language } from "@/lib/i18n-lang";
import { LANGUAGE_STORAGE_KEY } from "@/lib/constants";

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

function readStoredLanguage(): Language {
  if (typeof window === "undefined") return "ar";
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === "en" ? "en" : "ar";
}

export const useLanguageStore = create<LanguageState>()((set) => ({
  language: readStoredLanguage(),
  setLanguage: (language) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
    set({ language });
  },
  toggleLanguage: () =>
    set((state) => {
      const next: Language = state.language === "ar" ? "en" : "ar";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      }
      return { language: next };
    }),
}));
