"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { AuditAction, type AuditLogListItem } from "@/types/audit-log";
import { useAuditLogs } from "@/features/audit-logs/hooks/use-audit-logs";
import { useAuditLog } from "@/features/audit-logs/hooks/use-audit-log";
import { AuditLogsTable } from "@/features/audit-logs/components/audit-logs-table";
import {
  AuditLogFiltersBar,
  type AuditLogFilters,
} from "@/features/audit-logs/components/audit-log-filters";
import { AuditLogDetailSheet } from "@/features/audit-logs/components/audit-log-detail-sheet";

export default function AuditLogsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AuditLogFilters>({
    action: "all",
    entityType: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [viewTarget, setViewTarget] = useState<AuditLogListItem | null>(null);

  const auditLogsQuery = useAuditLogs({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    action: filters.action === "all" ? undefined : (Number(filters.action) as AuditAction),
    entityType: filters.entityType === "all" ? undefined : filters.entityType,
    dateFrom: filters.dateFrom || undefined,
    dateTo: filters.dateTo || undefined,
  });

  const detailQuery = useAuditLog(viewTarget?.id ?? "");

  const handleFiltersChange = (next: AuditLogFilters) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("auditLogs.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("auditLogs.description")}</p>
        </div>
      </div>

      <AuditLogFiltersBar
        filters={filters}
        onChange={handleFiltersChange}
        entityTypes={[]}
      />

      <AuditLogsTable
        data={auditLogsQuery.data}
        isPending={auditLogsQuery.isPending}
        isError={auditLogsQuery.isError}
        error={auditLogsQuery.error}
        refetch={() => auditLogsQuery.refetch()}
        page={page}
        onPageChange={setPage}
        onView={setViewTarget}
      />

      <AuditLogDetailSheet
        data={detailQuery.data ?? null}
        isPending={detailQuery.isPending}
        onClose={() => setViewTarget(null)}
      />
    </div>
  );
}
