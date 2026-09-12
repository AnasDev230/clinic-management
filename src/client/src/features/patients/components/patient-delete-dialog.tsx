"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { useDeletePatient } from "../hooks/use-delete-patient";
import type { PatientListItem } from "@/types/patient";

interface PatientDeleteDialogProps {
  target: PatientListItem | null;
  onClose: () => void;
}

export function PatientDeleteDialog({ target, onClose }: PatientDeleteDialogProps) {
  const { t } = useTranslation();
  const deleteMutation = useDeletePatient();

  const handleConfirm = () => {
    if (!target) return;
    deleteMutation.mutate(target.id, { onSuccess: onClose });
  };

  return (
    <ConfirmDialog
      open={target !== null}
      onOpenChange={(open) => !open && onClose()}
      title={t("confirm.delete.title")}
      description={t("confirm.delete.description")}
      confirmLabel={t("common.delete")}
      variant="danger"
      isLoading={deleteMutation.isPending}
      onConfirm={handleConfirm}
    />
  );
}
