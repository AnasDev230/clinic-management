"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { InvoiceStatus } from "@/types/invoice";

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { t } = useTranslation();
  const label =
    status === InvoiceStatus.Draft
      ? t("invoices.status.draft")
      : status === InvoiceStatus.Issued
        ? t("invoices.status.issued")
        : status === InvoiceStatus.PartiallyPaid
          ? t("invoices.status.partiallyPaid")
          : status === InvoiceStatus.Paid
            ? t("invoices.status.paid")
            : status === InvoiceStatus.Overdue
              ? t("invoices.status.overdue")
              : t("invoices.status.cancelled");
  const variant =
    status === InvoiceStatus.Paid
      ? ("success" as const)
      : status === InvoiceStatus.Issued
        ? ("info" as const)
        : status === InvoiceStatus.PartiallyPaid
          ? ("warning" as const)
          : status === InvoiceStatus.Overdue
            ? ("danger" as const)
            : ("neutral" as const);
  return <Badge variant={variant}>{label}</Badge>;
}
