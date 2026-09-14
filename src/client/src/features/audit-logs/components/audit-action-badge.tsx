"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";
import { AuditAction } from "@/types/audit-log";

export function AuditActionBadge({ action }: { action: AuditAction }) {
  const { t } = useTranslation();
  const label =
    action === AuditAction.Create
      ? t("auditLogs.action.create")
      : action === AuditAction.Update
        ? t("auditLogs.action.update")
        : action === AuditAction.Delete
          ? t("auditLogs.action.delete")
          : action === AuditAction.Login
            ? t("auditLogs.action.login")
            : action === AuditAction.Logout
              ? t("auditLogs.action.logout")
              : action === AuditAction.FailedLogin
                ? t("auditLogs.action.failedLogin")
                : action === AuditAction.StatusChange
                  ? t("auditLogs.action.statusChange")
                  : action === AuditAction.Payment
                    ? t("auditLogs.action.payment")
                    : action === AuditAction.Refund
                      ? t("auditLogs.action.refund")
                      : action === AuditAction.Print
                        ? t("auditLogs.action.print")
                        : t("auditLogs.action.export");
  const variant =
    action === AuditAction.Create || action === AuditAction.Payment
      ? ("success" as const)
      : action === AuditAction.Update
        ? ("info" as const)
        : action === AuditAction.Delete ||
            action === AuditAction.FailedLogin ||
            action === AuditAction.Refund
          ? ("danger" as const)
          : action === AuditAction.StatusChange
            ? ("warning" as const)
            : ("neutral" as const);
  return <Badge variant={variant}>{label}</Badge>;
}
