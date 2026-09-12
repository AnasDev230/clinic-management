"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { useDeleteSpecialty } from "../hooks/use-delete-specialty";
import type { SpecialtyListItem } from "@/types/specialty";

interface SpecialtyDeleteDialogProps {
  target: SpecialtyListItem | null;
  onClose: () => void;
}

export function SpecialtyDeleteDialog({
  target,
  onClose,
}: SpecialtyDeleteDialogProps) {
  const { t } = useTranslation();
  const deleteMutation = useDeleteSpecialty();

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
