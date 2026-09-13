"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import {
  createPrescriptionSchema,
  type PrescriptionFormValues,
} from "../schemas/prescription-schema";
import { useCreatePrescription } from "../hooks/use-create-prescription";
import { useUpdatePrescription } from "../hooks/use-update-prescription";
import { PrescriptionItemsEditor } from "./prescription-items-editor";
import { PrescriptionStatus, type PrescriptionDetail } from "@/types/prescription";

interface PrescriptionFormDialogProps {
  open: boolean;
  onClose: () => void;
  visitId?: string;
  initialData?: PrescriptionDetail | null;
}

export function PrescriptionFormDialog({
  open,
  onClose,
  visitId,
  initialData,
}: PrescriptionFormDialogProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createPrescriptionSchema(t), [t]);
  const createMutation = useCreatePrescription();
  const updateMutation = useUpdatePrescription();
  const isEditing = Boolean(initialData);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { visitId: "", notes: "", validUntil: "", items: [] },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          visitId: initialData.visitId,
          notes: initialData.notes ?? "",
          validUntil: initialData.validUntil ? initialData.validUntil.slice(0, 10) : "",
          items: initialData.items.map((i) => ({
            id: i.id,
            medicationName: i.medicationName,
            dosage: i.dosage ?? "",
            frequency: i.frequency ?? "",
            duration: i.duration ?? "",
            quantity: i.quantity ?? undefined,
            instructions: i.instructions ?? "",
          })),
        });
      } else {
        form.reset({
          visitId: visitId ?? "",
          notes: "",
          validUntil: "",
          items: [
            {
              id: "",
              medicationName: "",
              dosage: "",
              frequency: "",
              duration: "",
              quantity: undefined,
              instructions: "",
            },
          ],
        });
      }
    }
  }, [open, visitId, initialData, form]);

  const onSubmit = (values: PrescriptionFormValues) => {
    const items = values.items.map((item) => ({
      id: item.id || null,
      medicationName: item.medicationName,
      dosage: item.dosage || null,
      frequency: item.frequency || null,
      duration: item.duration || null,
      quantity: item.quantity ?? null,
      instructions: item.instructions || null,
    }));
    if (isEditing && initialData) {
      updateMutation.mutate(
        {
          id: initialData.id,
          data: {
            notes: values.notes || null,
            validUntil: values.validUntil || null,
            status: initialData.status ?? PrescriptionStatus.Active,
            items,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        {
          visitId: values.visitId,
          notes: values.notes || null,
          validUntil: values.validUntil || null,
          items: items.map(({ medicationName, dosage, frequency, duration, quantity, instructions }) => ({
            medicationName,
            dosage,
            frequency,
            duration,
            quantity,
            instructions,
          })),
        },
        { onSuccess: onClose },
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("prescriptions.edit") : t("prescriptions.new")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isEditing && (
            <div className="space-y-2">
              <Label>{t("prescriptions.form.visitId")}</Label>
              <Input {...form.register("visitId")} className="h-10 tabular-nums" />
              {form.formState.errors.visitId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.visitId.message}
                </p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label>{t("prescriptions.form.notes")}</Label>
            <Textarea {...form.register("notes")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{t("prescriptions.validUntil")}</Label>
            <Input type="date" {...form.register("validUntil")} className="h-10 tabular-nums" />
          </div>
          <PrescriptionItemsEditor form={form} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t("common.executing") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
