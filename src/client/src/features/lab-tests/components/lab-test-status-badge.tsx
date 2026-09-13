"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { LabTestStatus } from "@/types/lab-test";

export function LabTestStatusBadge({ status }: { status: LabTestStatus }) {
  const { t } = useTranslation();
  const label =
    status === LabTestStatus.Ordered
      ? t("labTests.status.ordered")
      : status === LabTestStatus.InProgress
        ? t("labTests.status.inProgress")
        : status === LabTestStatus.Completed
          ? t("labTests.status.completed")
          : t("labTests.status.cancelled");
  const variant =
    status === LabTestStatus.Completed
      ? ("success" as const)
      : status === LabTestStatus.Ordered
        ? ("info" as const)
        : status === LabTestStatus.InProgress
          ? ("warning" as const)
          : ("danger" as const);
  return <Badge variant={variant}>{label}</Badge>;
}
