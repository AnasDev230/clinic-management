"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import type { MedicalServiceListItem } from "@/types/medical-service";

interface ServiceDeleteDialogProps {
  target: MedicalServiceListItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ServiceDeleteDialog({ target, onClose, onConfirm, isLoading }: ServiceDeleteDialogProps) {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      open={target !== null}
      onOpenChange={(open) => !open && onClose()}
      title={t("confirm.deleteService.title")}
      description={t("confirm.deleteService.description")}
      confirmLabel={t("common.delete")}
      variant="danger"
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  );
}
