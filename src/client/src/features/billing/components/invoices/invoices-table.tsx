"use client";

import { Receipt, Eye, Pencil, Trash2, Search } from "lucide-react";
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
import { InvoiceStatus, type InvoiceListItem } from "@/types/invoice";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoicesTableProps {
  data?: PagedResult<InvoiceListItem>;
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
  onView: (item: InvoiceListItem) => void;
  onEdit: (item: InvoiceListItem) => void;
  onDelete: (item: InvoiceListItem) => void;
  onNew: () => void;
}

export function InvoicesTable({
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
}: InvoicesTableProps) {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("invoices.search.placeholder")}
            className="ps-9"
          />
        </div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("invoices.filter.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("invoices.filter.allStatuses")}</SelectItem>
            <SelectItem value={String(InvoiceStatus.Draft)}>
              {t("invoices.status.draft")}
            </SelectItem>
            <SelectItem value={String(InvoiceStatus.Issued)}>
              {t("invoices.status.issued")}
            </SelectItem>
            <SelectItem value={String(InvoiceStatus.PartiallyPaid)}>
              {t("invoices.status.partiallyPaid")}
            </SelectItem>
            <SelectItem value={String(InvoiceStatus.Paid)}>
              {t("invoices.status.paid")}
            </SelectItem>
            <SelectItem value={String(InvoiceStatus.Overdue)}>
              {t("invoices.status.overdue")}
            </SelectItem>
            <SelectItem value={String(InvoiceStatus.Cancelled)}>
              {t("invoices.status.cancelled")}
            </SelectItem>
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
            <TableHead>{t("invoices.table.number")}</TableHead>
            <TableHead>{t("invoices.table.patient")}</TableHead>
            <TableHead>{t("invoices.table.date")}</TableHead>
            <TableHead>{t("invoices.table.dueDate")}</TableHead>
            <TableHead>{t("invoices.table.total")}</TableHead>
            <TableHead>{t("invoices.table.paid")}</TableHead>
            <TableHead>{t("invoices.table.remaining")}</TableHead>
            <TableHead>{t("invoices.table.status")}</TableHead>
            <TableHead className="text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 9 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {!isPending && (data?.items.length ?? 0) === 0 && !isError && (
            <TableRow>
              <TableCell colSpan={9}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Receipt className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{t("invoices.empty.title")}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t("invoices.empty.description")}
                  </p>
                  <Button className="gap-2" onClick={onNew}>
                    {t("invoices.new")}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono tabular-nums">
                {item.invoiceNumber}
              </TableCell>
              <TableCell className="font-medium">{item.patientName}</TableCell>
              <TableCell className="tabular-nums">
                {formatDate(item.invoiceDate, language)}
              </TableCell>
              <TableCell className="tabular-nums">
                {item.dueDate ? formatDate(item.dueDate, language) : "—"}
              </TableCell>
              <TableCell className="tabular-nums">
                {formatCurrency(item.totalAmount, language)}
              </TableCell>
              <TableCell className="tabular-nums">
                {formatCurrency(item.paidAmount, language)}
              </TableCell>
              <TableCell className="tabular-nums">
                {formatCurrency(item.remainingAmount, language)}
              </TableCell>
              <TableCell>
                <InvoiceStatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-end">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(item)} aria-label={t("invoices.detail")}>
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
