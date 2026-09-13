"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { VisitStatus, type VisitListItem } from "@/types/visit";
import { useVisits } from "@/features/visits/hooks/use-visits";
import { useVisit } from "@/features/visits/hooks/use-visit";
import { useUpdateVisit } from "@/features/visits/hooks/use-update-visit";
import { useDeleteVisit } from "@/features/visits/hooks/use-delete-visit";
import { VisitsTable } from "@/features/visits/components/visits-table";
import { VisitFormDialog } from "@/features/visits/components/visit-form-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function VisitsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<VisitListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VisitListItem | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const visitsQuery = useVisits({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    status: status === "all" ? undefined : (Number(status) as VisitStatus),
  });

  const deleteMutation = useDeleteVisit();
  const editQuery = useVisit(editTarget?.id ?? "");
  const updateMutation = useUpdateVisit();

  const [notes, setNotes] = useState("");
  const [totalAmount, setTotalAmount] = useState("0");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [nextVisitRecommended, setNextVisitRecommended] = useState(false);

  useEffect(() => {
    if (editQuery.data) {
      setNotes(editQuery.data.notes ?? "");
      setTotalAmount(String(editQuery.data.totalAmount));
      setDiscountAmount(String(editQuery.data.discountAmount));
      setNextVisitRecommended(editQuery.data.nextVisitRecommended);
    }
  }, [editQuery.data]);

  const handleQuickSave = () => {
    if (!editTarget) return;
    updateMutation.mutate(
      {
        id: editTarget.id,
        data: {
          chiefComplaint: editQuery.data?.chiefComplaint ?? null,
          symptoms: editQuery.data?.symptoms ?? null,
          diagnosis: editQuery.data?.diagnosis ?? null,
          treatmentPlan: editQuery.data?.treatmentPlan ?? null,
          notes: notes || null,
          nextVisitRecommended,
          nextVisitNotes: editQuery.data?.nextVisitNotes ?? null,
          totalAmount: Number(totalAmount),
          discountAmount: Number(discountAmount),
        },
      },
      { onSuccess: () => setEditTarget(null) },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("visits.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("visits.description")}</p>
        </div>
        <Button className="gap-2" onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" />
          {t("visits.new")}
        </Button>
      </div>

      <VisitsTable
        data={visitsQuery.data}
        isPending={visitsQuery.isPending}
        isError={visitsQuery.isError}
        error={visitsQuery.error}
        refetch={() => visitsQuery.refetch()}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        onView={(item) => router.push(`/visits/${item.id}`)}
        onEdit={(item) => setEditTarget(item)}
        onDelete={setDeleteTarget}
        onNew={() => setFormOpen(true)}
      />

      <VisitFormDialog open={formOpen} onClose={() => setFormOpen(false)} />

      <Dialog open={editTarget !== null} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("visits.edit")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("visits.form.notes")}</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("visits.form.totalAmount")}</Label>
                <Input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="h-10 tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("visits.form.discountAmount")}</Label>
                <Input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="h-10 tabular-nums"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Label>{t("visits.form.nextVisitRecommended")}</Label>
              <Switch checked={nextVisitRecommended} onCheckedChange={setNextVisitRecommended} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleQuickSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? t("common.executing") : t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("confirm.deleteVisit.title")}
        description={t("confirm.deleteVisit.description")}
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
