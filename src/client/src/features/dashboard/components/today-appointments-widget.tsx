"use client";

import Link from "next/link";
import { CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { TodayAppointmentItem } from "@/types/dashboard";

interface TodayAppointmentsWidgetProps {
  items: TodayAppointmentItem[];
  isPending: boolean;
}

function statusVariant(status: string) {
  switch (status) {
    case "Completed":
      return "success" as const;
    case "Confirmed":
      return "info" as const;
    case "Cancelled":
      return "danger" as const;
    case "NoShow":
      return "warning" as const;
    default:
      return "neutral" as const;
  }
}

export function TodayAppointmentsWidget({
  items,
  isPending,
}: TodayAppointmentsWidgetProps) {
  const { t } = useTranslation();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base">{t("dashboard.today.upcoming")}</CardTitle>
        <Link href="/appointments/today">
          <Button variant="ghost" size="sm">
            {t("dashboard.today.viewAll")}
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-14 shrink-0 rounded-md" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CalendarX className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">{t("dashboard.today.noAppointments")}</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {items.map((appointment) => (
              <li
                key={appointment.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="w-14 shrink-0 rounded-md bg-primary/10 px-2 py-1 text-center text-xs font-semibold text-primary tabular-nums">
                  {appointment.startTime.slice(0, 5)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {appointment.patientName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {appointment.doctorName}
                  </p>
                </div>
                <Badge variant={statusVariant(appointment.status)}>
                  {appointment.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
