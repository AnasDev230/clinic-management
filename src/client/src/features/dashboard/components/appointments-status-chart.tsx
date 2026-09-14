"use client";

import { PieChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { TranslationKey } from "@/lib/translations/en";
import { formatNumber } from "@/lib/formatters";
import type { AppointmentsByStatus } from "@/types/dashboard";
import { ChartContainer } from "./chart-container";

interface AppointmentsStatusChartProps {
  data: AppointmentsByStatus[];
  isPending: boolean;
}

const statusColors: Record<string, string> = {
  Scheduled: "bg-sky-500",
  Confirmed: "bg-violet-500",
  InProgress: "bg-amber-500",
  Completed: "bg-emerald-500",
  Cancelled: "bg-red-500",
  NoShow: "bg-slate-400",
};

function statusLabel(status: string, t: (key: TranslationKey) => string): string {
  switch (status) {
    case "Scheduled":
      return t("dashboard.status.scheduled");
    case "Confirmed":
      return t("dashboard.status.confirmed");
    case "Completed":
      return t("dashboard.status.completed");
    case "Cancelled":
      return t("dashboard.status.cancelled");
    case "NoShow":
      return t("dashboard.status.noShow");
    default:
      return status;
  }
}

export function AppointmentsStatusChart({
  data,
  isPending,
}: AppointmentsStatusChartProps) {
  const { t, language } = useTranslation();

  if (isPending) {
    return (
      <ChartContainer title={t("dashboard.status.title")}>
        <Skeleton className="h-32 w-full" />
      </ChartContainer>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <ChartContainer title={t("dashboard.status.title")}>
      {data.length === 0 || total === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <PieChart className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("dashboard.activity.empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            {data.map((item) => (
              <div
                key={item.status}
                className={statusColors[item.status] ?? "bg-primary"}
                style={{ width: `${(item.count / total) * 100}%` }}
                title={`${item.status}: ${item.count}`}
              />
            ))}
          </div>
          <ul className="space-y-2">
            {data.map((item) => (
              <li key={item.status} className="flex items-center gap-2 text-sm">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusColors[item.status] ?? "bg-primary"}`}
                />
                <span className="flex-1 text-muted-foreground">
                  {statusLabel(item.status, t)}
                </span>
                <span className="font-medium tabular-nums">
                  {formatNumber(item.count, language)}
                </span>
                <span className="w-12 text-end text-xs text-muted-foreground tabular-nums">
                  {Math.round((item.count / total) * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ChartContainer>
  );
}
