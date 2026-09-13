"use client";

import { Check, Eye, Pencil, Play, Trash2, UserX, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { AppointmentStatus } from "@/types/appointment";
import { useConfirmAppointment } from "../hooks/use-confirm-appointment";
import { useStartAppointment } from "../hooks/use-start-appointment";
import { useCompleteAppointment } from "../hooks/use-complete-appointment";
import { useMarkNoShow } from "../hooks/use-mark-no-show";
import { useDeleteAppointment } from "../hooks/use-delete-appointment";

interface AppointmentStatusActionsProps {
  id: string;
  status: AppointmentStatus;
  onView?: () => void;
  onEdit?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function AppointmentStatusActions({
  id,
  status,
  onView,
  onEdit,
  onCancel,
  onDelete,
  compact = false,
}: AppointmentStatusActionsProps) {
  const { t } = useTranslation();
  const confirmMutation = useConfirmAppointment();
  const startMutation = useStartAppointment();
  const completeMutation = useCompleteAppointment();
  const noShowMutation = useMarkNoShow();
  const deleteMutation = useDeleteAppointment();
  void deleteMutation;

  const busy =
    confirmMutation.isPending ||
    startMutation.isPending ||
    completeMutation.isPending ||
    noShowMutation.isPending;

  const canConfirm = status === AppointmentStatus.Scheduled;
  const canStart = status === AppointmentStatus.Confirmed;
  const canComplete = status === AppointmentStatus.InProgress;
  const canNoShow =
    status === AppointmentStatus.Scheduled ||
    status === AppointmentStatus.Confirmed;
  const canCancel =
    status === AppointmentStatus.Scheduled ||
    status === AppointmentStatus.Confirmed;

  if (compact) {
    return (
      <div className="flex items-center justify-end gap-1">
        {onView && (
          <Button variant="ghost" size="icon" onClick={onView} aria-label={t("appointments.detail")}>
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {canConfirm && (
          <Button
            variant="ghost"
            size="icon"
            disabled={busy}
            onClick={() => confirmMutation.mutate(id)}
            aria-label={t("appointments.confirm")}
            title={t("appointments.confirm")}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        {canStart && (
          <Button
            variant="ghost"
            size="icon"
            disabled={busy}
            onClick={() => startMutation.mutate(id)}
            aria-label={t("appointments.start")}
            title={t("appointments.start")}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
        {canComplete && (
          <Button
            variant="ghost"
            size="icon"
            disabled={busy}
            onClick={() => completeMutation.mutate(id)}
            aria-label={t("appointments.complete")}
            title={t("appointments.complete")}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        {canNoShow && (
          <Button
            variant="ghost"
            size="icon"
            disabled={busy}
            onClick={() => noShowMutation.mutate(id)}
            aria-label={t("appointments.markNoShow")}
            title={t("appointments.markNoShow")}
          >
            <UserX className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label={t("common.edit")}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
        {canCancel && onCancel && (
          <Button variant="ghost" size="icon" onClick={onCancel} aria-label={t("appointments.cancel.title")}>
            <XCircle className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label={t("common.delete")}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canConfirm && (
        <Button size="sm" className="gap-2" disabled={busy} onClick={() => confirmMutation.mutate(id)}>
          <Check className="h-4 w-4" />
          {t("appointments.confirm")}
        </Button>
      )}
      {canStart && (
        <Button size="sm" className="gap-2" disabled={busy} onClick={() => startMutation.mutate(id)}>
          <Play className="h-4 w-4" />
          {t("appointments.start")}
        </Button>
      )}
      {canComplete && (
        <Button size="sm" className="gap-2" disabled={busy} onClick={() => completeMutation.mutate(id)}>
          <Check className="h-4 w-4" />
          {t("appointments.complete")}
        </Button>
      )}
      {canNoShow && (
        <Button size="sm" variant="outline" className="gap-2" disabled={busy} onClick={() => noShowMutation.mutate(id)}>
          <UserX className="h-4 w-4" />
          {t("appointments.markNoShow")}
        </Button>
      )}
      {canCancel && onCancel && (
        <Button size="sm" variant="outline" className="gap-2" onClick={onCancel}>
          <XCircle className="h-4 w-4" />
          {t("appointments.cancel.title")}
        </Button>
      )}
    </div>
  );
}
