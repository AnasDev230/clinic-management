"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import {
  PaymentMethod,
  PaymentStatus,
  type PaymentListItem,
} from "@/types/payment";
import { usePayments } from "@/features/billing/hooks/use-payments";
import { usePayment } from "@/features/billing/hooks/use-payment";
import { useRefundPayment } from "@/features/billing/hooks/use-refund-payment";
import { PaymentsTable } from "@/features/billing/components/payments/payments-table";
import { PaymentDetailSheet } from "@/features/billing/components/payments/payment-detail-sheet";
import { PaymentRefundDialog } from "@/features/billing/components/payments/payment-refund-dialog";

export default function PaymentsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [viewTarget, setViewTarget] = useState<PaymentListItem | null>(null);
  const [refundTarget, setRefundTarget] = useState<PaymentListItem | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const paymentsQuery = usePayments({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    method: method === "all" ? undefined : (Number(method) as PaymentMethod),
    status: status === "all" ? undefined : (Number(status) as PaymentStatus),
  });

  const viewQuery = usePayment(viewTarget?.id ?? "");
  const refundMutation = useRefundPayment();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("payments.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("payments.description")}</p>
        </div>
      </div>

      <PaymentsTable
        data={paymentsQuery.data}
        isPending={paymentsQuery.isPending}
        isError={paymentsQuery.isError}
        error={paymentsQuery.error}
        refetch={() => paymentsQuery.refetch()}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        method={method}
        onMethodChange={(v) => {
          setMethod(v);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        onView={(item) => setViewTarget(item)}
        onRefund={(item) => setRefundTarget(item)}
        onNew={() => {}}
        showNewButton={false}
      />

      <Dialog open={viewTarget !== null} onOpenChange={(open) => !open && setViewTarget(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono tabular-nums">
              {viewQuery.data?.paymentNumber ?? t("payments.table.number")}
            </DialogTitle>
          </DialogHeader>
          {viewQuery.data && <PaymentDetailSheet data={viewQuery.data} />}
        </DialogContent>
      </Dialog>

      <PaymentRefundDialog
        open={refundTarget !== null}
        onClose={() => setRefundTarget(null)}
        isLoading={refundMutation.isPending}
        onConfirm={() => {
          if (!refundTarget) return;
          refundMutation.mutate(refundTarget.id, { onSuccess: () => setRefundTarget(null) });
        }}
      />
    </div>
  );
}
