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
import type { DiagnosisItem } from "@/types/visit";
import { createDiagnosisSchema, type DiagnosisFormValues } from "../schemas/diagnosis-schema";
import { useCreateDiagnosis } from "../hooks/use-create-diagnosis";
import { useUpdateDiagnosis } from "../hooks/use-update-diagnosis";

interface DiagnosisFormDialogProps {
  visitId: string;
  open: boolean;
  onClose: () => void;
  editing?: DiagnosisItem | null;
}

export function DiagnosisFormDialog({
  visitId,
  open,
  onClose,
  editing,
}: DiagnosisFormDialogProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createDiagnosisSchema(t), [t]);
  const createMutation = useCreateDiagnosis();
  const updateMutation = useUpdateDiagnosis();

  const form = useForm<DiagnosisFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: "", name: "", description: "", isPrimary: false },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        code: editing?.code ?? "",
        name: editing?.name ?? "",
        description: editing?.description ?? "",
        isPrimary: editing?.isPrimary ?? false,
      });
    }
  }, [open, editing, form]);

  const pending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: DiagnosisFormValues) => {
    const payload = {
      code: values.code || null,
      name: values.name,
      description: values.description || null,
      isPrimary: values.isPrimary,
    };
    if (editing) {
      updateMutation.mutate({ visitId, id: editing.id, data: payload }, { onSuccess: onClose });
    } else {
      createMutation.mutate({ visitId, data: payload }, { onSuccess: onClose });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? t("diagnoses.edit") : t("diagnoses.add")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("diagnoses.form.code")}</Label>
              <Input {...form.register("code")} className="h-10 tabular-nums" />
              {form.formState.errors.code && (
                <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("diagnoses.form.name")}</Label>
              <Input {...form.register("name")} className="h-10" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("diagnoses.form.description")}</Label>
            <Textarea {...form.register("description")} rows={3} />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Label>{t("diagnoses.form.isPrimary")}</Label>
            <Switch
              checked={form.watch("isPrimary")}
              onCheckedChange={(v) => form.setValue("isPrimary", v)}
            />
          </div>
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
