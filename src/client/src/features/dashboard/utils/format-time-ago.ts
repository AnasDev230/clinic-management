import type { TranslationKey } from "@/lib/translations/en";

export function formatTimeAgo(
  date: string | Date,
  t: (key: TranslationKey) => string,
): string {
  const value = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - value.getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return t("notifications.timeAgo.justNow");
  if (minutes < 60) return `${minutes} ${t("notifications.timeAgo.minutesAgo")}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${t("notifications.timeAgo.hoursAgo")}`;

  const days = Math.floor(hours / 24);
  return `${days} ${t("notifications.timeAgo.daysAgo")}`;
}
