"use client";

import { Activity, CreditCard, Pencil, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import type { RecentActivityItem } from "@/types/dashboard";
import { ChartContainer } from "./chart-container";
import { formatTimeAgo } from "../utils/format-time-ago";

interface RecentActivityWidgetProps {
  data: RecentActivityItem[];
  isPending: boolean;
}

function activityIcon(action: string) {
  switch (action) {
    case "Create":
      return Plus;
    case "Update":
      return Pencil;
    case "Delete":
      return Trash2;
    case "Payment":
      return CreditCard;
    default:
      return Activity;
  }
}

export function RecentActivityWidget({ data, isPending }: RecentActivityWidgetProps) {
  const { t, language } = useTranslation();

  if (isPending) {
    return (
      <ChartContainer title={t("dashboard.activity.title")}>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title={t("dashboard.activity.title")}>
      {data.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <Activity className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">{t("dashboard.activity.empty")}</p>
        </div>
      ) : (
        <ul className="space-y-1">
          {data.map((activity) => {
            const Icon = activityIcon(activity.action);
            return (
              <li key={activity.id} className="flex items-start gap-3 py-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-medium">{activity.userName}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>{" "}
                    <span className="font-medium">{activity.entityDisplayName}</span>
                  </p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatTimeAgo(activity.timestamp, t)} ·{" "}
                    {formatDate(activity.timestamp, language)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ChartContainer>
  );
}
