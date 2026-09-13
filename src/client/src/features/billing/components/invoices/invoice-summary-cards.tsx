"use client";

import { Receipt, Banknote, Hourglass, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import type { InvoiceSummary } from "@/types/invoice";

interface InvoiceSummaryCardsProps {
  data?: InvoiceSummary;
  isPending: boolean;
}

export function InvoiceSummaryCards({ data, isPending }: InvoiceSummaryCardsProps) {
  const { t, language } = useTranslation();

  const cards = [
    {
      title: t("billing.totalInvoices"),
      value: data ? formatNumber(data.totalInvoices, language) : "—",
      icon: Receipt,
    },
    {
      title: t("billing.totalRevenue"),
      value: data ? formatCurrency(data.totalPaid, language) : "—",
      icon: Banknote,
    },
    {
      title: t("billing.outstanding"),
      value: data ? formatCurrency(data.totalOutstanding, language) : "—",
      icon: Hourglass,
    },
    {
      title: t("billing.overdue"),
      value: data
        ? `${formatNumber(data.overdueCount, language)} · ${formatCurrency(data.overdueAmount, language)}`
        : "—",
      icon: TriangleAlert,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, value, icon: Icon }) => (
        <Card key={title} className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isPending ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
