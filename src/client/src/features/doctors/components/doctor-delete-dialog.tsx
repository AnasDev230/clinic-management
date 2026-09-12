"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { useDeleteDoctor } from "../hooks/use-delete-doctor";
import type { DoctorListItem } from "@/types/doctor";

interface DoctorDeleteDialogProps {
  target: DoctorListItem | null;
  onClose: () => void;
}

export function DoctorDeleteDialog({ target, onClose }: DoctorDeleteDialogProps) {
  const { t } = useTranslation();
  const deleteMutation = useDeleteDoctor();

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
