"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import type { AppointmentListItem } from "@/types/appointment";
import {
  cancelAppointmentSchema,
  type CancelAppointmentFormValues,
} from "../schemas/appointment-schema";
import { useCancelAppointment } from "../hooks/use-cancel-appointment";

interface AppointmentCancelDialogProps {
  target: AppointmentListItem | null;
  onClose: () => void;
}

export function AppointmentCancelDialog({ target, onClose }: AppointmentCancelDialogProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => cancelAppointmentSchema(t), [t]);
  const cancelMutation = useCancelAppointment();

  const form = useForm<CancelAppointmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { cancellationReason: "" },
  });

  const onSubmit = (values: CancelAppointmentFormValues) => {
    if (!target) return;
    cancelMutation.mutate(
      { id: target.id, data: values },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("confirm.cancelAppointment.title")}</DialogTitle>
          <DialogDescription>{t("confirm.cancelAppointment.description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("appointments.cancel.reason")}</Label>
            <Textarea
              {...form.register("cancellationReason")}
              rows={3}
              placeholder={t("appointments.cancel.placeholder")}
            />
            {form.formState.errors.cancellationReason && (
              <p className="text-sm text-destructive">
                {form.formState.errors.cancellationReason.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={cancelMutation.isPending}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="destructive" disabled={cancelMutation.isPending}>
              {cancelMutation.isPending ? t("common.executing") : t("common.confirm")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
