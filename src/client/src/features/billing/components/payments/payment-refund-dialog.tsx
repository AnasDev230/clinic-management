"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";

interface PaymentRefundDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function PaymentRefundDialog({
  open,
  onClose,
  onConfirm,
  isLoading,
}: PaymentRefundDialogProps) {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(value) => !value && onClose()}
      title={t("confirm.refundPayment.title")}
      description={t("confirm.refundPayment.description")}
      confirmLabel={t("common.confirm")}
      variant="danger"
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  );
}
