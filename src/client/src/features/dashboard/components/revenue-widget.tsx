"use client";

import { Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import type { RevenueSummary } from "@/types/dashboard";
import { ChartContainer } from "./chart-container";

interface RevenueWidgetProps {
  data?: RevenueSummary;
  isPending: boolean;
}

export function RevenueWidget({ data, isPending }: RevenueWidgetProps) {
  const { t, language } = useTranslation();

  if (isPending) {
    return (
      <ChartContainer title={t("dashboard.revenue.title")}>
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </ChartContainer>
    );
  }

  const rows = [
    { label: t("dashboard.revenue.total"), value: data?.totalRevenue ?? 0 },
    { label: t("dashboard.revenue.paid"), value: data?.totalPaid ?? 0 },
    { label: t("dashboard.revenue.outstanding"), value: data?.totalOutstanding ?? 0 },
    { label: t("dashboard.revenue.overdue"), value: data?.totalOverdue ?? 0 },
  ];

  return (
    <ChartContainer title={t("dashboard.revenue.title")}>
      <div className="grid grid-cols-2 gap-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-md border border-border p-3"
          >
            <p className="text-xs text-muted-foreground">{row.label}</p>
            <p className="mt-1 truncate text-base font-semibold tabular-nums">
              {formatCurrency(row.value, language)}
            </p>
          </div>
        ))}
      </div>
      <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {t("dashboard.revenue.byMethod")}
      </p>
      {!data || data.byMethod.length === 0 ? (
        <div className="flex flex-col items-center py-4 text-center">
          <Wallet className="mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("dashboard.activity.empty")}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-10 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("dashboard.revenue.byMethod")}
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("dashboard.topDoctors.appointments")}
              </TableHead>
              <TableHead className="h-10 px-4 text-end text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("dashboard.revenue.total")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.byMethod.map((item) => (
              <TableRow key={item.method} className="hover:bg-muted/30 transition-colors">
                <TableCell className="px-4 py-3 text-sm">{item.method}</TableCell>
                <TableCell className="px-4 py-3 text-sm tabular-nums">
                  {formatNumber(item.count, language)}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-end tabular-nums">
                  {formatCurrency(item.amount, language)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </ChartContainer>
  );
}
