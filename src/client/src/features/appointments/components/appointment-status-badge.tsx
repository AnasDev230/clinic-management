"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { AppointmentStatus } from "@/types/appointment";

const statusVariant: Record<AppointmentStatus, "info" | "default" | "warning" | "success" | "danger" | "neutral"> = {
  [AppointmentStatus.Scheduled]: "info",
  [AppointmentStatus.Confirmed]: "default",
  [AppointmentStatus.InProgress]: "warning",
  [AppointmentStatus.Completed]: "success",
  [AppointmentStatus.Cancelled]: "danger",
  [AppointmentStatus.NoShow]: "neutral",
};

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const { t } = useTranslation();
  const label =
    status === AppointmentStatus.Scheduled
      ? t("appointments.status.scheduled")
      : status === AppointmentStatus.Confirmed
        ? t("appointments.status.confirmed")
        : status === AppointmentStatus.InProgress
          ? t("appointments.status.inProgress")
          : status === AppointmentStatus.Completed
            ? t("appointments.status.completed")
            : status === AppointmentStatus.Cancelled
              ? t("appointments.status.cancelled")
              : t("appointments.status.noShow");

  return <Badge variant={statusVariant[status]}>{label}</Badge>;
}
