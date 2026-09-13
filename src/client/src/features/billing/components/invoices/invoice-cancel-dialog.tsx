"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";

interface InvoiceCancelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function InvoiceCancelDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
}: InvoiceCancelDialogProps) {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(value) => !value && onClose()}
      title={t("confirm.cancelInvoice.title")}
      description={t("confirm.cancelInvoice.description")}
      confirmLabel={t("common.confirm")}
      variant="danger"
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  );
}
