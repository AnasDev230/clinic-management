"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { PrescriptionStatus } from "@/types/prescription";

export function PrescriptionStatusBadge({ status }: { status: PrescriptionStatus }) {
  const { t } = useTranslation();
  const label =
    status === PrescriptionStatus.Active
      ? t("prescriptions.status.active")
      : status === PrescriptionStatus.Completed
        ? t("prescriptions.status.completed")
        : status === PrescriptionStatus.Cancelled
          ? t("prescriptions.status.cancelled")
          : t("prescriptions.status.expired");
  const variant =
    status === PrescriptionStatus.Completed
      ? ("success" as const)
      : status === PrescriptionStatus.Active
        ? ("info" as const)
        : status === PrescriptionStatus.Cancelled
          ? ("danger" as const)
          : ("neutral" as const);
  return <Badge variant={variant}>{label}</Badge>;
}
