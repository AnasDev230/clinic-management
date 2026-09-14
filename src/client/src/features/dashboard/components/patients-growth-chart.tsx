"use client";

import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { formatNumber } from "@/lib/formatters";
import type { PatientsGrowth } from "@/types/dashboard";
import { ChartContainer } from "./chart-container";

interface PatientsGrowthChartProps {
  data?: PatientsGrowth;
  isPending: boolean;
}

const CHART_WIDTH = 600;
const CHART_HEIGHT = 160;
const CHART_PADDING = 12;

export function PatientsGrowthChart({ data, isPending }: PatientsGrowthChartProps) {
  const { t, language } = useTranslation();

  if (isPending) {
    return (
      <ChartContainer title={t("dashboard.growth.title")}>
        <Skeleton className="h-44 w-full" />
      </ChartContainer>
    );
  }

  const months = data?.months ?? [];
  const maxValue = Math.max(1, ...months.map((m) => m.newPatients));

  const points = months.map((month, index) => {
    const x =
      months.length === 1
        ? CHART_WIDTH / 2
        : CHART_PADDING +
          (index / (months.length - 1)) * (CHART_WIDTH - CHART_PADDING * 2);
    const y =
      CHART_HEIGHT -
      CHART_PADDING -
      (month.newPatients / maxValue) * (CHART_HEIGHT - CHART_PADDING * 2);
    return `${x},${y}`;
  });

  const areaPoints =
    points.length > 0
      ? `${CHART_PADDING},${CHART_HEIGHT - CHART_PADDING} ${points.join(" ")} ${
          months.length === 1
            ? CHART_WIDTH / 2
            : CHART_WIDTH - CHART_PADDING
        },${CHART_HEIGHT - CHART_PADDING}`
      : "";

  return (
    <ChartContainer
      title={t("dashboard.growth.title")}
      action={
        <p className="text-xs text-muted-foreground tabular-nums">
          {t("dashboard.growth.newPatients")}:{" "}
          {formatNumber(
            months.reduce((sum, m) => sum + m.newPatients, 0),
            language,
          )}
        </p>
      }
    >
      {months.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <TrendingUp className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("dashboard.activity.empty")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-44 w-full"
            role="img"
            aria-label={t("dashboard.growth.title")}
          >
            <polygon points={areaPoints} className="fill-primary/10" />
            <polyline
              points={points.join(" ")}
              className="fill-none stroke-primary"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {months.map((month, index) => {
              const x =
                months.length === 1
                  ? CHART_WIDTH / 2
                  : CHART_PADDING +
                    (index / (months.length - 1)) *
                      (CHART_WIDTH - CHART_PADDING * 2);
              const y =
                CHART_HEIGHT -
                CHART_PADDING -
                (month.newPatients / maxValue) *
                  (CHART_HEIGHT - CHART_PADDING * 2);
              return (
                <circle key={`${month.year}-${month.monthName}`} cx={x} cy={y} r="4" className="fill-primary" />
              );
            })}
          </svg>
          <div className="flex items-start gap-1">
            {months.map((month) => (
              <div
                key={`${month.year}-${month.monthName}`}
                className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center"
              >
                <span className="text-xs font-medium tabular-nums">
                  {formatNumber(month.newPatients, language)}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {month.monthName}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ChartContainer>
  );
}
