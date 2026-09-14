"use client";

import { Trophy } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { TopDoctorItem } from "@/types/dashboard";
import { ChartContainer } from "./chart-container";

interface TopDoctorsWidgetProps {
  data: TopDoctorItem[];
  isPending: boolean;
}

export function TopDoctorsWidget({ data, isPending }: TopDoctorsWidgetProps) {
  const { t, language } = useTranslation();

  if (isPending) {
    return (
      <ChartContainer title={t("dashboard.topDoctors.title")}>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title={t("dashboard.topDoctors.title")}>
      {data.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-center">
          <Trophy className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t("dashboard.activity.empty")}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-10 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("dashboard.topDoctors.rank")}
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("dashboard.topDoctors.name")}
              </TableHead>
              <TableHead className="h-10 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("dashboard.topDoctors.appointments")}
              </TableHead>
              <TableHead className="h-10 px-4 text-end text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("dashboard.topDoctors.revenue")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((doctor, index) => (
              <TableRow key={doctor.doctorId} className="hover:bg-muted/30 transition-colors">
                <TableCell className="px-4 py-3 text-sm">
                  <span className="flex items-center gap-1 tabular-nums">
                    {index === 0 && <Trophy className="h-4 w-4 text-amber-500" />}
                    <span className={cn(index === 0 && "font-semibold")}>
                      {formatNumber(index + 1, language)}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm">
                  <p className="font-medium">{doctor.doctorName}</p>
                  <p className="text-xs text-muted-foreground">{doctor.specialtyName}</p>
                </TableCell>
                <TableCell className="px-4 py-3 text-sm tabular-nums">
                  {formatNumber(doctor.appointmentsCount, language)}
                </TableCell>
                <TableCell className="px-4 py-3 text-sm text-end tabular-nums">
                  {formatCurrency(doctor.revenue, language)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </ChartContainer>
  );
}
