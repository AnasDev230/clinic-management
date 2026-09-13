"use client";

import { useState } from "react";
import { Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { PaymentStatus, type PaymentDetail } from "@/types/payment";
import { PaymentStatusBadge, getPaymentMethodLabel } from "./payments-table";
import { useRefundPayment } from "../../hooks/use-refund-payment";
import { PaymentRefundDialog } from "./payment-refund-dialog";

interface PaymentDetailSheetProps {
  data: PaymentDetail;
}

export function PaymentDetailSheet({ data }: PaymentDetailSheetProps) {
  const { t, language } = useTranslation();
  const refundMutation = useRefundPayment();
  const [refundOpen, setRefundOpen] = useState(false);
  const canRefund = data.status === PaymentStatus.Completed;

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="font-mono text-lg tabular-nums">
                {data.paymentNumber}
              </CardTitle>
              <p className="text-sm text-muted-foreground tabular-nums">
                {data.patientName} · {formatDate(data.paymentDate, language)}
              </p>
            </div>
            <PaymentStatusBadge status={data.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <p>
              <span className="text-muted-foreground">{t("payments.table.invoice")}: </span>
              <span className="font-mono tabular-nums">{data.invoiceNumber}</span>
            </p>
            <p>
              <span className="text-muted-foreground">{t("payments.table.method")}: </span>
              {getPaymentMethodLabel(t, data.paymentMethod)}
            </p>
            <p>
              <span className="text-muted-foreground">{t("payments.table.amount")}: </span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(data.amount, language)}
              </span>
            </p>
            {data.referenceNumber && (
              <p>
                <span className="text-muted-foreground">{t("payments.referenceNumber")}: </span>
                <span className="tabular-nums">{data.referenceNumber}</span>
              </p>
            )}
          </div>
          {data.notes && <p className="text-sm">{data.notes}</p>}
          {canRefund && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setRefundOpen(true)}
              >
                <Undo2 className="h-4 w-4" />
                {t("payments.refund")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentRefundDialog
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        isLoading={refundMutation.isPending}
        onConfirm={() => {
          refundMutation.mutate(data.id, { onSuccess: () => setRefundOpen(false) });
        }}
      />
    </div>
  );
}
