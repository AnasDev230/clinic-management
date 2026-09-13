"use client";

import { CalendarX, Play, Check, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { AppointmentStatus, type AppointmentCalendarItem } from "@/types/appointment";
import { AppointmentStatusBadge } from "./appointment-status-badge";
import { useStartAppointment } from "../hooks/use-start-appointment";
import { useCompleteAppointment } from "../hooks/use-complete-appointment";
import { useMarkNoShow } from "../hooks/use-mark-no-show";

interface TodayScheduleViewProps {
  data?: AppointmentCalendarItem[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  onView: (item: AppointmentCalendarItem) => void;
}

export function TodayScheduleView({
  data,
  isPending,
  isError,
  error,
  refetch,
  onView,
}: TodayScheduleViewProps) {
  const { t } = useTranslation();
  const startMutation = useStartAppointment();
  const completeMutation = useCompleteAppointment();
  const noShowMutation = useMarkNoShow();

  if (isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t("toast.error.generic")}</AlertTitle>
        <AlertDescription className="flex items-center justify-between gap-2">
          <span>{getErrorMessage(error) || t("common.unexpectedError")}</span>
          <Button variant="outline" size="sm" onClick={refetch}>
            {t("common.retry")}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <CalendarX className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t("appointments.today.empty")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <button
              type="button"
              onClick={() => onView(item)}
              className="flex flex-1 flex-wrap items-center gap-3 text-start"
            >
              <div className="rounded-lg bg-primary/10 px-3 py-2 text-center">
                <p className="text-sm font-semibold tabular-nums text-primary">
                  {item.startTime.slice(0, 5)}
                </p>
                <p className="text-xs tabular-nums text-muted-foreground">
                  {item.endTime.slice(0, 5)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">{item.patientName}</p>
                <p className="text-xs text-muted-foreground">{item.doctorName}</p>
              </div>
              <AppointmentStatusBadge status={item.status as AppointmentStatus} />
            </button>
            <div className="flex items-center gap-1">
              {item.status === AppointmentStatus.Confirmed && (
                <Button
                  size="sm"
                  className="gap-2"
                  disabled={startMutation.isPending}
                  onClick={() => startMutation.mutate(item.id)}
                >
                  <Play className="h-4 w-4" />
                  {t("appointments.start")}
                </Button>
              )}
              {item.status === AppointmentStatus.InProgress && (
                <Button
                  size="sm"
                  className="gap-2"
                  disabled={completeMutation.isPending}
                  onClick={() => completeMutation.mutate(item.id)}
                >
                  <Check className="h-4 w-4" />
                  {t("appointments.complete")}
                </Button>
              )}
              {(item.status === AppointmentStatus.Scheduled ||
                item.status === AppointmentStatus.Confirmed) && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  disabled={noShowMutation.isPending}
                  onClick={() => noShowMutation.mutate(item.id)}
                >
                  <UserX className="h-4 w-4" />
                  {t("appointments.markNoShow")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
