"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import { AppointmentStatus, type AppointmentDetail } from "@/types/appointment";
import { AppointmentStatusBadge } from "./appointment-status-badge";
import { AppointmentPriorityBadge, AppointmentTypeBadge } from "./appointment-badges";

interface AppointmentDetailSheetProps {
  appointment?: AppointmentDetail;
  isPending: boolean;
}

export function AppointmentDetailSheet({ appointment, isPending }: AppointmentDetailSheetProps) {
  const { t, language } = useTranslation();

  if (isPending) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!appointment) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{t("appointments.detail.basicInfo")}</CardTitle>
          <div className="flex items-center gap-2">
            <AppointmentStatusBadge status={appointment.status as AppointmentStatus} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">{t("appointments.table.patient")}</p>
            <p className="text-sm font-medium">{appointment.patientName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("appointments.table.doctor")}</p>
            <p className="text-sm font-medium">{appointment.doctorName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("appointments.table.date")}</p>
            <p className="text-sm tabular-nums">{formatDate(appointment.appointmentDate, language)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("appointments.table.time")}</p>
            <p className="text-sm tabular-nums">
              {appointment.startTime.slice(0, 5)} - {appointment.endTime.slice(0, 5)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AppointmentTypeBadge type={appointment.type} />
            <AppointmentPriorityBadge priority={appointment.priority} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("appointments.detail.linkedVisit")}</p>
            {appointment.visitId ? (
              <Link href={`/visits/${appointment.visitId}`}>
                <Button variant="link" className="h-auto p-0">
                  {t("appointments.detail.viewVisit")}
                </Button>
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">{t("appointments.detail.noVisit")}</p>
            )}
          </div>
        </div>
        {appointment.reason && (
          <div>
            <p className="text-xs text-muted-foreground">{t("appointments.detail.reason")}</p>
            <p className="text-sm">{appointment.reason}</p>
          </div>
        )}
        {appointment.notes && (
          <div>
            <p className="text-xs text-muted-foreground">{t("appointments.detail.notes")}</p>
            <p className="text-sm">{appointment.notes}</p>
          </div>
        )}
        {appointment.cancellationReason && (
          <div>
            <p className="text-xs text-muted-foreground">{t("appointments.detail.cancellationReason")}</p>
            <p className="text-sm">{appointment.cancellationReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
