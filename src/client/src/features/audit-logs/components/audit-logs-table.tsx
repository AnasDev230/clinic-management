"use client";

import { ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { formatDate } from "@/lib/formatters";
import type { PagedResult } from "@/types/common";
import type { AuditLogListItem } from "@/types/audit-log";
import { AuditActionBadge } from "./audit-action-badge";

interface AuditLogsTableProps {
  data?: PagedResult<AuditLogListItem>;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  page: number;
  onPageChange: (page: number) => void;
  onView: (item: AuditLogListItem) => void;
  disableView?: boolean;
}

export function AuditLogsTable({
  data,
  isPending,
  isError,
  error,
  refetch,
  page,
  onPageChange,
  onView,
  disableView = false,
}: AuditLogsTableProps) {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-4">
      {isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("toast.error.generic")}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{getErrorMessage(error) || t("common.unexpectedError")}</span>
            <Button variant="outline" size="sm" onClick={refetch}>
              {t("common.retry")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Table>
        <TableHeader>
          <TableRow header>
            <TableHead>{t("auditLogs.table.timestamp")}</TableHead>
            <TableHead>{t("auditLogs.table.user")}</TableHead>
            <TableHead>{t("auditLogs.table.action")}</TableHead>
            <TableHead>{t("auditLogs.table.entityType")}</TableHead>
            <TableHead>{t("auditLogs.table.entityName")}</TableHead>
            <TableHead>{t("auditLogs.table.ip")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {!isPending && (data?.items.length ?? 0) === 0 && !isError && (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <ScrollText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{t("auditLogs.empty.title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("auditLogs.empty.description")}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.items.map((item) => (
            <TableRow
              key={item.id}
              className={disableView ? undefined : "cursor-pointer"}
              onClick={disableView ? undefined : () => onView(item)}
            >
              <TableCell className="tabular-nums">
                {formatDate(item.timestamp, language)}
              </TableCell>
              <TableCell className="font-medium">{item.userName ?? "—"}</TableCell>
              <TableCell>
                <AuditActionBadge action={item.action} />
              </TableCell>
              <TableCell className="text-muted-foreground">{item.entityType}</TableCell>
              <TableCell>{item.entityDisplayName ?? "—"}</TableCell>
              <TableCell className="tabular-nums">{item.ipAddress ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(data?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {t("common.page")} {data?.page} {t("common.of")} {data?.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              {t("common.previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data != null && page >= data.totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              {t("common.next")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
