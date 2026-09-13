"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { PrescriptionStatus, type PrescriptionListItem } from "@/types/prescription";
import { usePrescriptions } from "@/features/prescriptions/hooks/use-prescriptions";
import { usePrescription } from "@/features/prescriptions/hooks/use-prescription";
import { useCancelPrescription } from "@/features/prescriptions/hooks/use-cancel-prescription";
import { useDeletePrescription } from "@/features/prescriptions/hooks/use-delete-prescription";
import { PrescriptionsTable } from "@/features/prescriptions/components/prescriptions-table";
import { PrescriptionFormDialog } from "@/features/prescriptions/components/prescription-form-dialog";

export default function PrescriptionsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<PrescriptionListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PrescriptionListItem | null>(null);
  const [cancelTarget, setCancelTarget] = useState<PrescriptionListItem | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const prescriptionsQuery = usePrescriptions({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    status: status === "all" ? undefined : (Number(status) as PrescriptionStatus),
  });

  const editQuery = usePrescription(editTarget?.id ?? "");
  const deleteMutation = useDeletePrescription();
  const cancelMutation = useCancelPrescription();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("prescriptions.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("prescriptions.description")}</p>
        </div>
        <Button className="gap-2" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("prescriptions.new")}
        </Button>
      </div>

      <PrescriptionsTable
        data={prescriptionsQuery.data}
        isPending={prescriptionsQuery.isPending}
        isError={prescriptionsQuery.isError}
        error={prescriptionsQuery.error}
        refetch={() => prescriptionsQuery.refetch()}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        onView={(item) => router.push(`/prescriptions/${item.id}`)}
        onEdit={(item) => setEditTarget(item)}
        onDelete={setDeleteTarget}
        onNew={() => setFormOpen(true)}
      />

      <PrescriptionFormDialog open={formOpen} onClose={() => setFormOpen(false)} />

      <PrescriptionFormDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        initialData={editQuery.data ?? null}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("confirm.deletePrescription.title")}
        description={t("confirm.deletePrescription.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
        }}
      />

      <ConfirmDialog
        open={cancelTarget !== null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title={t("confirm.cancelPrescription.title")}
        description={t("confirm.cancelPrescription.description")}
        confirmLabel={t("common.confirm")}
        variant="danger"
        isLoading={cancelMutation.isPending}
        onConfirm={() => {
          if (!cancelTarget) return;
          cancelMutation.mutate(cancelTarget.id, { onSuccess: () => setCancelTarget(null) });
        }}
      />
    </div>
  );
}
