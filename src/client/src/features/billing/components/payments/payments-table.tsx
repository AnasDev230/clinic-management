"use client";

import { Wallet, Eye, Undo2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import type { TranslationKey } from "@/lib/translations/en";
import type { PagedResult } from "@/types/common";
import {
  PaymentMethod,
  PaymentStatus,
  type PaymentListItem,
} from "@/types/payment";

export function getPaymentMethodLabel(
  t: (key: TranslationKey) => string,
  method: PaymentMethod,
): string {
  switch (method) {
    case PaymentMethod.Cash:
      return t("payments.method.cash");
    case PaymentMethod.CreditCard:
      return t("payments.method.creditCard");
    case PaymentMethod.DebitCard:
      return t("payments.method.debitCard");
    case PaymentMethod.BankTransfer:
      return t("payments.method.bankTransfer");
    case PaymentMethod.Cheque:
      return t("payments.method.cheque");
    case PaymentMethod.Insurance:
      return t("payments.method.insurance");
    default:
      return t("payments.method.other");
  }
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { t } = useTranslation();
  const label =
    status === PaymentStatus.Pending
      ? t("payments.status.pending")
      : status === PaymentStatus.Completed
        ? t("payments.status.completed")
        : status === PaymentStatus.Failed
          ? t("payments.status.failed")
          : t("payments.status.refunded");
  const variant =
    status === PaymentStatus.Completed
      ? ("success" as const)
      : status === PaymentStatus.Pending
        ? ("warning" as const)
        : status === PaymentStatus.Failed
          ? ("danger" as const)
          : ("neutral" as const);
  return <Badge variant={variant}>{label}</Badge>;
}

interface PaymentsTableProps {
  data?: PagedResult<PaymentListItem>;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  method: string;
  onMethodChange: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  onView: (item: PaymentListItem) => void;
  onRefund: (item: PaymentListItem) => void;
  onNew: () => void;
  showNewButton?: boolean;
}

export function PaymentsTable({
  data,
  isPending,
  isError,
  error,
  refetch,
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  method,
  onMethodChange,
  page,
  onPageChange,
  onView,
  onRefund,
  onNew,
  showNewButton = true,
}: PaymentsTableProps) {
  const { t, language } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("payments.search.placeholder")}
            className="ps-9"
          />
        </div>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("payments.filter.status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("payments.filter.allStatuses")}</SelectItem>
            <SelectItem value={String(PaymentStatus.Pending)}>
              {t("payments.status.pending")}
            </SelectItem>
            <SelectItem value={String(PaymentStatus.Completed)}>
              {t("payments.status.completed")}
            </SelectItem>
            <SelectItem value={String(PaymentStatus.Failed)}>
              {t("payments.status.failed")}
            </SelectItem>
            <SelectItem value={String(PaymentStatus.Refunded)}>
              {t("payments.status.refunded")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={method} onValueChange={onMethodChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={t("payments.filter.method")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("payments.filter.allMethods")}</SelectItem>
            <SelectItem value={String(PaymentMethod.Cash)}>
              {t("payments.method.cash")}
            </SelectItem>
            <SelectItem value={String(PaymentMethod.CreditCard)}>
              {t("payments.method.creditCard")}
            </SelectItem>
            <SelectItem value={String(PaymentMethod.DebitCard)}>
              {t("payments.method.debitCard")}
            </SelectItem>
            <SelectItem value={String(PaymentMethod.BankTransfer)}>
              {t("payments.method.bankTransfer")}
            </SelectItem>
            <SelectItem value={String(PaymentMethod.Cheque)}>
              {t("payments.method.cheque")}
            </SelectItem>
            <SelectItem value={String(PaymentMethod.Insurance)}>
              {t("payments.method.insurance")}
            </SelectItem>
            <SelectItem value={String(PaymentMethod.Other)}>
              {t("payments.method.other")}
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
            <TableHead>{t("payments.table.number")}</TableHead>
            <TableHead>{t("payments.table.patient")}</TableHead>
            <TableHead>{t("payments.table.invoice")}</TableHead>
            <TableHead>{t("payments.table.amount")}</TableHead>
            <TableHead>{t("payments.table.method")}</TableHead>
            <TableHead>{t("payments.table.date")}</TableHead>
            <TableHead>{t("payments.table.status")}</TableHead>
            <TableHead className="text-end">{t("common.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {!isPending && (data?.items.length ?? 0) === 0 && !isError && (
            <TableRow>
              <TableCell colSpan={8}>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-muted p-4">
                    <Wallet className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold">{t("payments.empty.title")}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {t("payments.empty.description")}
                  </p>
                  {showNewButton && (
                    <Button className="gap-2" onClick={onNew}>
                      {t("payments.new")}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
          {data?.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono tabular-nums">
                {item.paymentNumber}
              </TableCell>
              <TableCell className="font-medium">{item.patientName}</TableCell>
              <TableCell className="font-mono tabular-nums">
                {item.invoiceNumber}
              </TableCell>
              <TableCell className="tabular-nums">
                {formatCurrency(item.amount, language)}
              </TableCell>
              <TableCell>{getPaymentMethodLabel(t, item.paymentMethod)}</TableCell>
              <TableCell className="tabular-nums">
                {formatDate(item.paymentDate, language)}
              </TableCell>
              <TableCell>
                <PaymentStatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-end">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onView(item)} aria-label={t("payments.table.number")}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {item.status === PaymentStatus.Completed && (
                    <Button variant="ghost" size="icon" onClick={() => onRefund(item)} aria-label={t("payments.refund")}>
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  )}
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
