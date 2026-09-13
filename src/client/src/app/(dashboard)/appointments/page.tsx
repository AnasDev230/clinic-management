"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { AppointmentStatus, type AppointmentDetail, type AppointmentListItem } from "@/types/appointment";
import { useAppointments } from "@/features/appointments/hooks/use-appointments";
import { useAppointment } from "@/features/appointments/hooks/use-appointment";
import { useDeleteAppointment } from "@/features/appointments/hooks/use-delete-appointment";
import { AppointmentsTable } from "@/features/appointments/components/appointments-table";
import { AppointmentFormDialog } from "@/features/appointments/components/appointment-form-dialog";
import { AppointmentCancelDialog } from "@/features/appointments/components/appointment-cancel-dialog";

export default function AppointmentsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<AppointmentDetail | null>(null);
  const [cancelTarget, setCancelTarget] = useState<AppointmentListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppointmentListItem | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => window.clearTimeout(handle);
  }, [searchInput]);

  const appointmentsQuery = useAppointments({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: search || undefined,
    status: status === "all" ? undefined : (Number(status) as AppointmentStatus),
  });

  const editingQuery = useAppointment(editingId ?? "");
  const deleteMutation = useDeleteAppointment();

  useEffect(() => {
    if (editingQuery.data) setEditing(editingQuery.data);
  }, [editingQuery.data]);

  const openNew = () => {
    setEditing(null);
    setEditingId(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{t("appointments.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("appointments.description")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => router.push("/appointments/today")}>
            {t("nav.todaySchedule")}
          </Button>
          <Button className="gap-2" onClick={openNew}>
            <Plus className="h-4 w-4" />
            {t("appointments.new")}
          </Button>
        </div>
      </div>

      <AppointmentsTable
        data={appointmentsQuery.data}
        isPending={appointmentsQuery.isPending}
        isError={appointmentsQuery.isError}
        error={appointmentsQuery.error}
        refetch={() => appointmentsQuery.refetch()}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        page={page}
        onPageChange={setPage}
        onView={(item) => router.push(`/appointments/${item.id}`)}
        onEdit={(item) => {
          setEditingId(item.id);
          setEditing(null);
          setFormOpen(true);
        }}
        onCancel={setCancelTarget}
        onDelete={setDeleteTarget}
        onNew={openNew}
      />

      <AppointmentFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingId(null);
          setEditing(null);
        }}
        editing={editing}
      />

      <AppointmentCancelDialog target={cancelTarget} onClose={() => setCancelTarget(null)} />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("confirm.deleteAppointment.title")}
        description={t("confirm.deleteAppointment.description")}
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
