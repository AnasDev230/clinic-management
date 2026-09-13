"use client";

import { ClipboardList, Eye, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { PagedResult } from "@/types/common";
import { VisitStatus, type VisitListItem } from "@/types/visit";
import { VisitStatusBadge } from "./visit-status-badge";

interface VisitsTableProps {
  data?: PagedResult<VisitListItem>;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  onView: (item: VisitListItem) => void;
  onEdit: (item: VisitListItem) => void;
  onDelete: (item: VisitListItem) => void;
  onNew: () => void;
}

export function VisitsTable({
  data,
  isPending,
  isError,
  error,
  refetch,
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  page,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onNew,
}: VisitsTableProps) {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("visits.search.placeholder")}
            className="ps-9"
          />
        </div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("visits.filter.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("visits.filter.allStatuses")}</SelectItem>
            <SelectItem value={String(VisitStatus.Waiting)}>{t("visits.status.waiting")}</SelectItem>
            <SelectItem value={String(VisitStatus.InConsultation)}>
              {t("visits.status.inConsultation")}
            </SelectItem>
            <SelectItem value={String(VisitStatus.Completed)}>{t("visits.status.completed")}</SelectItem>
            <SelectItem value={String(VisitStatus.Cancelled)}>{t("visits.status.cancelled")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
            <TableHead>{t("visits.table.patient")}</TableHead>
            <TableHead>{t("visits.table.doctor")}</TableHead>
            <TableHead>{t("visits.table.date")}</TableHead>
            <TableHead>{t("visits.table.status")}</TableHead>
            <TableHead>{t("visits.table.amount")}</TableHead>
            <TableHead className="text-end">{t("common.actions")}</TableHead>
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
                    <ClipboardList className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{t("visits.empty.title")}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t("visits.empty.description")}
                  </p>
                  <Button className="gap-2" onClick={onNew}>
                    {t("visits.new")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.patientName}</TableCell>
              <TableCell className="text-muted-foreground">{item.doctorName}</TableCell>
              <TableCell className="tabular-nums">{formatDate(item.visitDate, language)}</TableCell>
              <TableCell>
                <VisitStatusBadge status={item.status as VisitStatus} />
              </TableCell>
              <TableCell className="tabular-nums">
                {formatCurrency(item.totalAmount, language)}
              </TableCell>
              <TableCell className="text-end">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(item)} aria-label={t("visits.detail")}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item)} aria-label={t("common.edit")}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(item)} aria-label={t("common.delete")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
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
