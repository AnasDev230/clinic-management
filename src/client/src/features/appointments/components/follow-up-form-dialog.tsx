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
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/hooks/use-translation";
import type { FollowUpItem } from "@/types/appointment";
import { createFollowUpSchema, type FollowUpFormValues } from "../schemas/follow-up-schema";
import { useCreateFollowUp } from "../hooks/use-create-follow-up";
import { useUpdateFollowUp } from "../hooks/use-update-follow-up";

interface FollowUpFormDialogProps {
  appointmentId: string;
  open: boolean;
  onClose: () => void;
  editing?: FollowUpItem | null;
}

export function FollowUpFormDialog({
  appointmentId,
  open,
  onClose,
  editing,
}: FollowUpFormDialogProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createFollowUpSchema(t), [t]);
  const createMutation = useCreateFollowUp();
  const updateMutation = useUpdateFollowUp();

  const form = useForm<FollowUpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { followUpDate: "", notes: "", isCompleted: false },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        followUpDate: editing?.followUpDate.slice(0, 10) ?? "",
        notes: editing?.notes ?? "",
        isCompleted: editing?.isCompleted ?? false,
      });
    }
  }, [open, editing, form]);

  const pending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: FollowUpFormValues) => {
    if (editing) {
      updateMutation.mutate(
        {
          appointmentId,
          id: editing.id,
          data: {
            followUpDate: values.followUpDate,
            notes: values.notes || null,
            isCompleted: values.isCompleted ?? false,
          },
        },
        { onSuccess: onClose },
      );
    } else {
      createMutation.mutate(
        {
          appointmentId,
          data: { followUpDate: values.followUpDate, notes: values.notes || null },
        },
        { onSuccess: onClose },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? t("followUps.edit") : t("followUps.add")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("followUps.form.date")}</Label>
            <Input type="date" {...form.register("followUpDate")} className="h-10" />
            {form.formState.errors.followUpDate && (
              <p className="text-sm text-destructive">{form.formState.errors.followUpDate.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("followUps.form.notes")}</Label>
            <Textarea {...form.register("notes")} rows={3} />
          </div>
          {editing && (
            <div className="flex items-center justify-between gap-2">
              <Label>{t("followUps.form.completed")}</Label>
              <Switch
                checked={form.watch("isCompleted") ?? false}
                onCheckedChange={(v) => form.setValue("isCompleted", v)}
              />
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={pending}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? t("common.executing") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
