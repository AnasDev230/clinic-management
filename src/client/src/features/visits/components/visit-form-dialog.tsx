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
import { createVisitSchema, type VisitFormValues } from "../schemas/visit-schema";
import { useCreateVisit } from "../hooks/use-create-visit";

interface VisitFormDialogProps {
  open: boolean;
  onClose: () => void;
  appointmentId?: string;
}

export function VisitFormDialog({ open, onClose, appointmentId }: VisitFormDialogProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createVisitSchema(t), [t]);
  const createMutation = useCreateVisit();

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { appointmentId: "", chiefComplaint: "", symptoms: "", notes: "" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        appointmentId: appointmentId ?? "",
        chiefComplaint: "",
        symptoms: "",
        notes: "",
      });
    }
  }, [open, appointmentId, form]);

  const onSubmit = (values: VisitFormValues) => {
    createMutation.mutate(
      {
        appointmentId: values.appointmentId,
        chiefComplaint: values.chiefComplaint || null,
        symptoms: values.symptoms || null,
        notes: values.notes || null,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("visits.new")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("visits.form.appointment")}</Label>
            <Input {...form.register("appointmentId")} className="h-10 tabular-nums" placeholder="appointment-id" />
            {form.formState.errors.appointmentId && (
              <p className="text-sm text-destructive">{form.formState.errors.appointmentId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("visits.form.chiefComplaint")}</Label>
            <Textarea {...form.register("chiefComplaint")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{t("visits.form.symptoms")}</Label>
            <Textarea {...form.register("symptoms")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>{t("visits.form.notes")}</Label>
            <Textarea {...form.register("notes")} rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={createMutation.isPending}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? t("common.executing") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
