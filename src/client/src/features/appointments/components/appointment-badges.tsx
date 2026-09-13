"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { AppointmentPriority, AppointmentType } from "@/types/appointment";

export function AppointmentTypeBadge({ type }: { type: AppointmentType }) {
  const { t } = useTranslation();
  const label =
    type === AppointmentType.InPerson
      ? t("appointments.type.inPerson")
      : type === AppointmentType.Phone
        ? t("appointments.type.phone")
        : type === AppointmentType.VideoCall
          ? t("appointments.type.videoCall")
          : t("appointments.type.emergency");
  return <Badge variant="secondary">{label}</Badge>;
}

export function AppointmentPriorityBadge({
  priority,
}: {
  priority: AppointmentPriority;
}) {
  const { t } = useTranslation();
  const label =
    priority === AppointmentPriority.Low
      ? t("appointments.priority.low")
      : priority === AppointmentPriority.Normal
        ? t("appointments.priority.normal")
        : priority === AppointmentPriority.High
          ? t("appointments.priority.high")
          : t("appointments.priority.urgent");
  const variant =
    priority === AppointmentPriority.Urgent
      ? ("danger" as const)
      : priority === AppointmentPriority.High
        ? ("warning" as const)
        : ("neutral" as const);
  return <Badge variant={variant}>{label}</Badge>;
}
