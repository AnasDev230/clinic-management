"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import type { AuditLogDetail } from "@/types/audit-log";
import { AuditActionBadge } from "./audit-action-badge";

interface AuditLogDetailSheetProps {
  data?: AuditLogDetail | null;
  isPending: boolean;
  onClose: () => void;
}

function formatChangeValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value === "" ? "—" : value;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function AuditLogDetailSheet({ data, isPending, onClose }: AuditLogDetailSheetProps) {
  const { t, language } = useTranslation();

  return (
    <Dialog open={data !== null && data !== undefined} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("auditLogs.changes.title")}</DialogTitle>
        </DialogHeader>
        {isPending || !data ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
              <p>
                <span className="text-muted-foreground">{t("auditLogs.table.timestamp")}: </span>
                <span className="tabular-nums">{formatDate(data.timestamp, language)}</span>
              </p>
              <p>
                <span className="text-muted-foreground">{t("auditLogs.table.user")}: </span>
                {data.userName ?? "—"}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">{t("auditLogs.table.action")}: </span>
                <AuditActionBadge action={data.action} />
              </p>
              <p>
                <span className="text-muted-foreground">{t("auditLogs.table.entityType")}: </span>
                {data.entityType}
              </p>
              {data.entityDisplayName && (
                <p>
                  <span className="text-muted-foreground">{t("auditLogs.table.entityName")}: </span>
                  {data.entityDisplayName}
                </p>
              )}
              {data.ipAddress && (
                <p>
                  <span className="text-muted-foreground">{t("auditLogs.table.ip")}: </span>
                  <span className="tabular-nums">{data.ipAddress}</span>
                </p>
              )}
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">{t("auditLogs.changes.title")}</p>
              {!data.parsedChanges || data.parsedChanges.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("auditLogs.changes.empty")}</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow header>
                      <TableHead>{t("auditLogs.changes.field")}</TableHead>
                      <TableHead>{t("auditLogs.changes.oldValue")}</TableHead>
                      <TableHead>{t("auditLogs.changes.newValue")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.parsedChanges.map((change, index) => (
                      <TableRow key={`${change.field}-${index}`}>
                        <TableCell className="font-medium">{change.field}</TableCell>
                        <TableCell className="max-w-48 truncate text-muted-foreground">
                          {formatChangeValue(change.old)}
                        </TableCell>
                        <TableCell className="max-w-48 truncate">
                          {formatChangeValue(change.new)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
