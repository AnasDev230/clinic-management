"use client";

import { useState } from "react";
import { Printer, FileCheck, Ban, Trash2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { InvoiceStatus, type InvoiceDetail } from "@/types/invoice";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import { PaymentFormDialog } from "./payment-form-dialog";
import { InvoiceCancelDialog } from "./invoice-cancel-dialog";
import {
  PaymentStatusBadge,
  getPaymentMethodLabel,
} from "../payments/payments-table";
import { useIssueInvoice } from "../../hooks/use-issue-invoice";
import { useCancelInvoice } from "../../hooks/use-cancel-invoice";
import { useDeleteInvoice } from "../../hooks/use-delete-invoice";

interface InvoiceDetailPageProps {
  data: InvoiceDetail;
  onEdit: () => void;
  onPrint: () => void;
  onDeleted: () => void;
}

export function InvoiceDetailPage({ data, onEdit, onPrint, onDeleted }: InvoiceDetailPageProps) {
  const { t, language } = useTranslation();
  const issueMutation = useIssueInvoice();
  const cancelMutation = useCancelInvoice();
  const deleteMutation = useDeleteInvoice();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [issueOpen, setIssueOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isDraft = data.status === InvoiceStatus.Draft;
  const isPayable =
    data.status === InvoiceStatus.Issued ||
    data.status === InvoiceStatus.PartiallyPaid;
  const isIssued = data.status === InvoiceStatus.Issued;

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="font-mono text-lg tabular-nums">
                {data.invoiceNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground tabular-nums">
                {data.patientName} · {formatDate(data.invoiceDate, language)}
                {data.dueDate && ` · ${t("invoices.table.dueDate")}: ${formatDate(data.dueDate, language)}`}
              </p>
            </div>
            <InvoiceStatusBadge status={data.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={onPrint}>
              <Printer className="h-4 w-4" />
              {t("invoices.print")}
            </Button>
            {isDraft && (
              <>
                <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
                  {t("common.edit")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIssueOpen(true)}
                >
                  <FileCheck className="h-4 w-4" />
                  {t("invoices.issue")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  {t("common.delete")}
                </Button>
              </>
            )}
            {isPayable && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setPaymentOpen(true)}
              >
                <Wallet className="h-4 w-4" />
                {t("payments.recordPayment")}
              </Button>
            )}
            {isIssued && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setCancelOpen(true)}
              >
                <Ban className="h-4 w-4" />
                {t("invoices.cancel")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">{t("invoices.items.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow header>
                <TableHead>{t("invoices.items.service")}</TableHead>
                <TableHead>{t("invoices.items.quantity")}</TableHead>
                <TableHead>{t("invoices.items.unitPrice")}</TableHead>
                <TableHead>{t("invoices.items.discount")}</TableHead>
                <TableHead>{t("invoices.items.total")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.serviceName}</TableCell>
                  <TableCell className="tabular-nums">{item.quantity}</TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(item.unitPrice, language)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(item.discountAmount, language)}
                  </TableCell>
                  <TableCell className="tabular-nums">
                    {formatCurrency(item.totalAmount, language)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="ms-auto mt-4 w-full max-w-72 space-y-1 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{t("invoices.summary.subTotal")}</span>
              <span className="tabular-nums">{formatCurrency(data.subTotal, language)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{t("invoices.summary.discount")}</span>
              <span className="tabular-nums">{formatCurrency(data.discountAmount, language)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{t("invoices.summary.tax")}</span>
              <span className="tabular-nums">{formatCurrency(data.taxAmount, language)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-border pt-1 font-semibold">
              <span>{t("invoices.summary.total")}</span>
              <span className="tabular-nums">{formatCurrency(data.totalAmount, language)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{t("invoices.summary.paid")}</span>
              <span className="tabular-nums">{formatCurrency(data.paidAmount, language)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{t("invoices.summary.remaining")}</span>
              <span className="tabular-nums">{formatCurrency(data.remainingAmount, language)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base">{t("payments.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.payments.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {t("payments.empty.description")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow header>
                  <TableHead>{t("payments.table.number")}</TableHead>
                  <TableHead>{t("payments.table.method")}</TableHead>
                  <TableHead>{t("payments.table.date")}</TableHead>
                  <TableHead>{t("payments.table.amount")}</TableHead>
                  <TableHead>{t("payments.table.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono tabular-nums">
                      {payment.paymentNumber}
                    </TableCell>
                    <TableCell>{getPaymentMethodLabel(t, payment.paymentMethod)}</TableCell>
                    <TableCell className="tabular-nums">
                      {formatDate(payment.paymentDate, language)}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {formatCurrency(payment.amount, language)}
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PaymentFormDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        invoiceId={data.id}
        remainingBalance={data.remainingAmount}
      />

      <ConfirmDialog
        open={issueOpen}
        onOpenChange={setIssueOpen}
        title={t("confirm.issueInvoice.title")}
        description={t("confirm.issueInvoice.description")}
        confirmLabel={t("common.confirm")}
        isLoading={issueMutation.isPending}
        onConfirm={() => {
          issueMutation.mutate(data.id, { onSuccess: () => setIssueOpen(false) });
        }}
      />

      <InvoiceCancelDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        isLoading={cancelMutation.isPending}
        onConfirm={() => {
          cancelMutation.mutate(data.id, { onSuccess: () => setCancelOpen(false) });
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("confirm.deleteInvoice.title")}
        description={t("confirm.deleteInvoice.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          deleteMutation.mutate(data.id, { onSuccess: onDeleted });
        }}
      />
    </div>
  );
}
