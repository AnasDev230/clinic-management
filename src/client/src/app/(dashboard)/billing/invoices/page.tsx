"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { InvoiceStatus, type InvoiceListItem } from "@/types/invoice";
import { useInvoices } from "@/features/billing/hooks/use-invoices";
import { useInvoice } from "@/features/billing/hooks/use-invoice";
import { useDeleteInvoice } from "@/features/billing/hooks/use-delete-invoice";
import { useMedicalServicesDropdown } from "@/features/services/hooks/use-medical-services-dropdown";
import { InvoicesTable } from "@/features/billing/components/invoices/invoices-table";
import { InvoiceFormDialog } from "@/features/billing/components/invoices/invoice-form-dialog";

export default function InvoicesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [editTarget, setEditTarget] = useState<InvoiceListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InvoiceListItem | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const invoicesQuery = useInvoices({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    status: status === "all" ? undefined : (Number(status) as InvoiceStatus),
  });

  const editQuery = useInvoice(editTarget?.id ?? "");
  const deleteMutation = useDeleteInvoice();
  const servicesQuery = useMedicalServicesDropdown();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("invoices.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("invoices.description")}</p>
        </div>
        <Button className="gap-2" onClick={() => router.push("/billing/invoices/new")}>
          <Plus className="h-4 w-4" />
          {t("invoices.new")}
        </Button>
      </div>

      <InvoicesTable
        data={invoicesQuery.data}
        isPending={invoicesQuery.isPending}
        isError={invoicesQuery.isError}
        error={invoicesQuery.error}
        refetch={() => invoicesQuery.refetch()}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        onView={(item) => router.push(`/billing/invoices/${item.id}`)}
        onEdit={(item) => setEditTarget(item)}
        onDelete={setDeleteTarget}
        onNew={() => router.push("/billing/invoices/new")}
      />

      <InvoiceFormDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        services={servicesQuery.data ?? []}
        initialData={editQuery.data ?? null}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("confirm.deleteInvoice.title")}
        description={t("confirm.deleteInvoice.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
        }}
      />
    </div>
  );
}
