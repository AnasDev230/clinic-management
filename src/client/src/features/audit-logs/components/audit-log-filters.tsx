"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import type { TranslationKey } from "@/lib/translations/en";
import { AuditAction } from "@/types/audit-log";

export interface AuditLogFilters {
  action: string;
  entityType: string;
  dateFrom: string;
  dateTo: string;
}

interface AuditLogFiltersProps {
  filters: AuditLogFilters;
  onChange: (filters: AuditLogFilters) => void;
  entityTypes: string[];
}

const COMMON_ENTITY_TYPES = [
  "Patient",
  "Doctor",
  "Appointment",
  "Visit",
  "Prescription",
  "LabTest",
  "Invoice",
  "Payment",
  "User",
];

export function AuditLogFiltersBar({ filters, onChange, entityTypes }: AuditLogFiltersProps) {
  const { t } = useTranslation();

  const set = (patch: Partial<AuditLogFilters>) => onChange({ ...filters, ...patch });

  const hasActiveFilters =
    filters.action !== "all" ||
    filters.entityType !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  const entities = entityTypes.length > 0 ? entityTypes : COMMON_ENTITY_TYPES;

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-end">
      <div className="space-y-1">
        <Label>{t("auditLogs.filters.action")}</Label>
        <Select value={filters.action} onValueChange={(v) => set({ action: v })}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("auditLogs.filters.action")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("auditLogs.filters.allActions")}</SelectItem>
            {Object.values(AuditAction)
              .filter((v): v is number => typeof v === "number")
              .map((action) => (
                <SelectItem key={action} value={String(action)}>
                  {actionLabel(t, action)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t("auditLogs.filters.entityType")}</Label>
        <Select value={filters.entityType} onValueChange={(v) => set({ entityType: v })}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("auditLogs.filters.entityType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("auditLogs.filters.allEntities")}</SelectItem>
            {entities.map((entity) => (
              <SelectItem key={entity} value={entity}>
                {entity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t("auditLogs.filters.dateFrom")}</Label>
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => set({ dateFrom: e.target.value })}
          className="h-10 tabular-nums"
        />
      </div>
      <div className="space-y-1">
        <Label>{t("auditLogs.filters.dateTo")}</Label>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => set({ dateTo: e.target.value })}
          className="h-10 tabular-nums"
        />
      </div>
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => onChange({ action: "all", entityType: "all", dateFrom: "", dateTo: "" })}
        >
          <X className="h-4 w-4" />
          {t("auditLogs.filters.clear")}
        </Button>
      )}
    </div>
  );
}

function actionLabel(
  t: (key: TranslationKey) => string,
  action: number,
): string {
  switch (action) {
    case AuditAction.Create:
      return t("auditLogs.action.create");
    case AuditAction.Update:
      return t("auditLogs.action.update");
    case AuditAction.Delete:
      return t("auditLogs.action.delete");
    case AuditAction.Login:
      return t("auditLogs.action.login");
    case AuditAction.Logout:
      return t("auditLogs.action.logout");
    case AuditAction.FailedLogin:
      return t("auditLogs.action.failedLogin");
    case AuditAction.StatusChange:
      return t("auditLogs.action.statusChange");
    case AuditAction.Payment:
      return t("auditLogs.action.payment");
    case AuditAction.Refund:
      return t("auditLogs.action.refund");
    case AuditAction.Print:
      return t("auditLogs.action.print");
    default:
      return t("auditLogs.action.export");
  }
}
