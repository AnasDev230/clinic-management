"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import type { ServiceCategoryListItem } from "@/types/medical-service";

interface CategoryDeleteDialogProps {
  target: ServiceCategoryListItem | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function CategoryDeleteDialog({ target, onClose, onConfirm, isLoading }: CategoryDeleteDialogProps) {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      open={target !== null}
      onOpenChange={(open) => !open && onClose()}
      title={t("confirm.deleteCategory.title")}
      description={t("confirm.deleteCategory.description")}
      confirmLabel={t("common.delete")}
      variant="danger"
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  );
}
