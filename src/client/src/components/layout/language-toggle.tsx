"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/stores/language-store";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      title={language === "ar" ? "English" : "عربي"}
    >
      <Languages className="h-5 w-5" />
    </Button>
  );
}
