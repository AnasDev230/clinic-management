import type { Language } from "./i18n-lang";

export function formatCurrency(
  amount: number,
  language: Language,
  currency = "SYP",
): string {
  const locale = language === "ar" ? "ar-SY" : "en-US";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export function formatDate(
  date: string | Date,
  language: Language,
): string {
  const locale = language === "ar" ? "ar-SY" : "en-US";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(value);
}

export function formatNumber(value: number, language: Language): string {
  const locale = language === "ar" ? "ar-SY" : "en-US";
  return new Intl.NumberFormat(locale).format(value);
}
