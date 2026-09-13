"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import {
  LabTestPriority,
  LabTestStatus,
  type LabTestListItem,
} from "@/types/lab-test";
import { useLabTests } from "@/features/lab-tests/hooks/use-lab-tests";
import { useLabTest } from "@/features/lab-tests/hooks/use-lab-test";
import { useCancelLabTest } from "@/features/lab-tests/hooks/use-cancel-lab-test";
import { useDeleteLabTest } from "@/features/lab-tests/hooks/use-delete-lab-test";
import { LabTestsTable } from "@/features/lab-tests/components/lab-tests-table";
import { LabTestFormDialog } from "@/features/lab-tests/components/lab-test-form-dialog";

export default function LabTestsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<LabTestListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LabTestListItem | null>(null);
  const [cancelTarget, setCancelTarget] = useState<LabTestListItem | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const labTestsQuery = useLabTests({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    status: status === "all" ? undefined : (Number(status) as LabTestStatus),
  });

  const editQuery = useLabTest(editTarget?.id ?? "");
  const deleteMutation = useDeleteLabTest();
  const cancelMutation = useCancelLabTest();

  const filteredItems = labTestsQuery.data
    ? {
        ...labTestsQuery.data,
        items: labTestsQuery.data.items.filter((item) =>
          priority === "all" ? true : item.priority === (Number(priority) as LabTestPriority),
        ),
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("labTests.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("labTests.description")}</p>
        </div>
        <Button className="gap-2" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("labTests.new")}
        </Button>
      </div>

      <LabTestsTable
        data={filteredItems}
        isPending={labTestsQuery.isPending}
        isError={labTestsQuery.isError}
        error={labTestsQuery.error}
        refetch={() => labTestsQuery.refetch()}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        priority={priority}
        onPriorityChange={(v) => {
          setPriority(v);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        onView={(item) => router.push(`/lab-tests/${item.id}`)}
        onEdit={(item) => setEditTarget(item)}
        onDelete={setDeleteTarget}
        onNew={() => setFormOpen(true)}
      />

      <LabTestFormDialog open={formOpen} onClose={() => setFormOpen(false)} />

      <LabTestFormDialog
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        initialData={editQuery.data ?? null}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("confirm.deleteLabTest.title")}
        description={t("confirm.deleteLabTest.description")}
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
        title={t("confirm.cancelLabTest.title")}
        description={t("confirm.cancelLabTest.description")}
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
