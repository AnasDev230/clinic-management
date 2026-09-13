"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { VisitStatus } from "@/types/visit";

export function VisitStatusBadge({ status }: { status: VisitStatus }) {
  const { t } = useTranslation();
  const label =
    status === VisitStatus.Waiting
      ? t("visits.status.waiting")
      : status === VisitStatus.InConsultation
        ? t("visits.status.inConsultation")
        : status === VisitStatus.Completed
          ? t("visits.status.completed")
          : t("visits.status.cancelled");
  const variant =
    status === VisitStatus.Completed
      ? ("success" as const)
      : status === VisitStatus.InConsultation
        ? ("warning" as const)
        : status === VisitStatus.Cancelled
          ? ("danger" as const)
          : ("info" as const);
  return <Badge variant={variant}>{label}</Badge>;
}
