"use client";

import { useRouter } from "next/navigation";
import { Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency } from "@/lib/formatters";
import { useInvoiceSummary } from "@/features/billing/hooks/use-invoice-summary";
import { useInvoices } from "@/features/billing/hooks/use-invoices";
import { usePayments } from "@/features/billing/hooks/use-payments";
import { InvoiceSummaryCards } from "@/features/billing/components/invoices/invoice-summary-cards";
import { InvoiceStatusBadge } from "@/features/billing/components/invoices/invoice-status-badge";
import {
  PaymentStatusBadge,
  getPaymentMethodLabel,
} from "@/features/billing/components/payments/payments-table";

export default function BillingDashboardPage() {
  const { t, language } = useTranslation();
  const router = useRouter();
  const summaryQuery = useInvoiceSummary();
  const recentInvoicesQuery = useInvoices({ page: 1, pageSize: 5 });
  const recentPaymentsQuery = usePayments({ page: 1, pageSize: 5 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("billing.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("billing.description")}</p>
        </div>
        <Button className="gap-2" onClick={() => router.push("/billing/invoices/new")}>
          <Plus className="h-4 w-4" />
          {t("invoices.new")}
        </Button>
      </div>

      <InvoiceSummaryCards data={summaryQuery.data} isPending={summaryQuery.isPending} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">{t("billing.recentInvoices")}</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/billing/invoices")}>
              {t("invoices.title")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentInvoicesQuery.isPending ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow header>
                    <TableHead>{t("invoices.table.number")}</TableHead>
                    <TableHead>{t("invoices.table.patient")}</TableHead>
                    <TableHead>{t("invoices.table.total")}</TableHead>
                    <TableHead>{t("invoices.table.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(recentInvoicesQuery.data?.items.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          {t("invoices.empty.description")}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                  {recentInvoicesQuery.data?.items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/billing/invoices/${item.id}`)}
                    >
                      <TableCell className="font-mono tabular-nums">
                        {item.invoiceNumber}
                      </TableCell>
                      <TableCell className="font-medium">{item.patientName}</TableCell>
                      <TableCell className="tabular-nums">
                        {formatCurrency(item.totalAmount, language)}
                      </TableCell>
                      <TableCell>
                        <InvoiceStatusBadge status={item.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">{t("billing.recentPayments")}</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push("/billing/payments")}>
              {t("payments.title")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentPaymentsQuery.isPending ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow header>
                    <TableHead>{t("payments.table.number")}</TableHead>
                    <TableHead>{t("payments.table.patient")}</TableHead>
                    <TableHead>{t("payments.table.method")}</TableHead>
                    <TableHead>{t("payments.table.amount")}</TableHead>
                    <TableHead>{t("payments.table.status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(recentPaymentsQuery.data?.items.length ?? 0) === 0 && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <p className="py-4 text-center text-sm text-muted-foreground">
                          {t("payments.empty.description")}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                  {recentPaymentsQuery.data?.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono tabular-nums">
                        {item.paymentNumber}
                      </TableCell>
                      <TableCell className="font-medium">{item.patientName}</TableCell>
                      <TableCell>{getPaymentMethodLabel(t, item.paymentMethod)}</TableCell>
                      <TableCell className="tabular-nums">
                        {formatCurrency(item.amount, language)}
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={item.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
