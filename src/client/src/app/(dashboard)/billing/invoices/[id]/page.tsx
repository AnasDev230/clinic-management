"use client";

import { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "@/hooks/use-translation";
import { getErrorMessage } from "@/lib/error-handler";
import { useInvoice } from "@/features/billing/hooks/use-invoice";
import { useMedicalServicesDropdown } from "@/features/services/hooks/use-medical-services-dropdown";
import { InvoiceDetailPage } from "@/features/billing/components/invoices/invoice-detail-page";
import { InvoiceFormDialog } from "@/features/billing/components/invoices/invoice-form-dialog";
import { InvoicePrintView } from "@/features/billing/components/invoices/invoice-print-view";

export default function InvoiceDetailRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const invoiceQuery = useInvoice(id);
  const servicesQuery = useMedicalServicesDropdown();
  const [editOpen, setEditOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("invoices.detail")}</h1>
          <p className="text-muted-foreground font-mono text-sm tabular-nums">
            {invoiceQuery.data ? invoiceQuery.data.invoiceNumber : t("invoices.description")}
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => router.push("/billing/invoices")}>
          {t("common.back")}
        </Button>
      </div>

      {invoiceQuery.isPending && (
        <Card>
          <CardContent className="space-y-2 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {invoiceQuery.isError && (
        <Alert variant="destructive">
          <AlertTitle>{t("toast.error.generic")}</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-2">
            <span>{getErrorMessage(invoiceQuery.error) || t("common.unexpectedError")}</span>
            <Button variant="outline" size="sm" onClick={() => router.push("/billing/invoices")}>
              {t("common.back")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {invoiceQuery.data && (
        <>
          <InvoiceDetailPage
            data={invoiceQuery.data}
            onEdit={() => setEditOpen(true)}
            onPrint={handlePrint}
            onDeleted={() => router.push("/billing/invoices")}
          />
          <div className="hidden print:block">
            <InvoicePrintView ref={printRef} data={invoiceQuery.data} />
          </div>
        </>
      )}

      <InvoiceFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        services={servicesQuery.data ?? []}
        initialData={invoiceQuery.data ?? null}
      />
    </div>
  );
}
