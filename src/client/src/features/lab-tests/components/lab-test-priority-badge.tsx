"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { LabTestPriority } from "@/types/lab-test";

export function LabTestPriorityBadge({ priority }: { priority: LabTestPriority }) {
  const { t } = useTranslation();
  const label =
    priority === LabTestPriority.Routine
      ? t("labTests.priority.routine")
      : priority === LabTestPriority.Normal
        ? t("labTests.priority.normal")
        : priority === LabTestPriority.Urgent
          ? t("labTests.priority.urgent")
          : t("labTests.priority.stat");
  const variant =
    priority === LabTestPriority.Stat
      ? ("danger" as const)
      : priority === LabTestPriority.Urgent
        ? ("warning" as const)
        : priority === LabTestPriority.Normal
          ? ("info" as const)
          : ("neutral" as const);
  return <Badge variant={variant}>{label}</Badge>;
}
