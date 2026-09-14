"use client";

import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import type { WeeklyStats } from "@/types/dashboard";
import { ChartContainer } from "./chart-container";

interface WeeklyChartProps {
  data?: WeeklyStats;
  isPending: boolean;
}

export function WeeklyChart({ data, isPending }: WeeklyChartProps) {
  const { t, language } = useTranslation();

  if (isPending) {
    return (
      <ChartContainer title={t("dashboard.weekly.title")}>
        <Skeleton className="h-40 w-full" />
      </ChartContainer>
    );
  }

  const days = data?.days ?? [];
  const maxCount = Math.max(1, ...days.map((d) => d.appointmentsCount));

  return (
    <ChartContainer
      title={t("dashboard.weekly.title")}
      action={
        <p className="text-xs text-muted-foreground tabular-nums">
          {t("dashboard.weekly.appointments")}:{" "}
          {formatNumber(data?.totalAppointments ?? 0, language)} ·{" "}
          {t("dashboard.weekly.revenue")}:{" "}
          {formatCurrency(data?.totalRevenue ?? 0, language)}
        </p>
      }
    >
      {days.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <BarChart3 className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("dashboard.activity.empty")}</p>
        </div>
      ) : (
        <div className="flex h-40 items-end gap-2">
          {days.map((day) => (
            <div
              key={day.date}
              className="flex min-w-0 flex-1 flex-col items-center gap-1"
              title={`${day.appointmentsCount} · ${formatCurrency(day.revenue, language)}`}
            >
              <span className="text-xs font-medium tabular-nums">
                {formatNumber(day.appointmentsCount, language)}
              </span>
              <div className="flex h-28 w-full items-end rounded-t-sm bg-muted/50">
                <div
                  className="w-full rounded-t-sm bg-primary/70 transition-all hover:bg-primary"
                  style={{
                    height: `${Math.max(
                      day.appointmentsCount > 0 ? 6 : 0,
                      (day.appointmentsCount / maxCount) * 100,
                    )}%`,
                  }}
                />
              </div>
              <span className="truncate text-xs text-muted-foreground">
                {day.dayName.slice(0, 3)}
              </span>
            </div>
          ))}
        </div>
      )}
    </ChartContainer>
  );
}
