"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { formatDate } from "@/lib/formatters";
import {
  useCreateMedicalHistory,
  useDeleteMedicalHistory,
  useUpdateMedicalHistory,
} from "../hooks/use-medical-history";
import {
  createMedicalHistorySchema,
  type MedicalHistoryFormValues,
} from "../schemas/medical-history-schema";
import {
  MedicalHistoryStatus,
  type MedicalHistoryItem,
} from "@/types/patient";

const STATUS_VARIANT = {
  [MedicalHistoryStatus.Active]: "warning",
  [MedicalHistoryStatus.Resolved]: "success",
  [MedicalHistoryStatus.Chronic]: "chronic",
} as const;

const STATUS_KEY = {
  [MedicalHistoryStatus.Active]: "enums.historyStatus.active",
  [MedicalHistoryStatus.Resolved]: "enums.historyStatus.resolved",
  [MedicalHistoryStatus.Chronic]: "enums.historyStatus.chronic",
} as const;

function toDateInput(value?: string | null): string {
  if (!value) return "";
  return value.length >= 10 ? value.slice(0, 10) : value;
}

export function MedicalHistorySection({
  patientId,
  items,
}: {
  patientId: string;
  items: MedicalHistoryItem[];
}) {
  const { t, language } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MedicalHistoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MedicalHistoryItem | null>(
    null,
  );
  const createMutation = useCreateMedicalHistory();
  const updateMutation = useUpdateMedicalHistory();
  const deleteMutation = useDeleteMedicalHistory();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<MedicalHistoryFormValues>({
    resolver: zodResolver(createMedicalHistorySchema(t)),
    defaultValues: {
      title: "",
      description: "",
      diagnosedDate: "",
      status: MedicalHistoryStatus.Active,
    },
  });

  const openNew = () => {
    setEditing(null);
    form.reset({
      title: "",
      description: "",
      diagnosedDate: "",
      status: MedicalHistoryStatus.Active,
    });
    setFormOpen(true);
  };

  const openEdit = (item: MedicalHistoryItem) => {
    setEditing(item);
    form.reset({
      title: item.title,
      description: item.description ?? "",
      diagnosedDate: toDateInput(item.diagnosedDate),
      status: item.status,
    });
    setFormOpen(true);
  };

  const onSubmit = (values: MedicalHistoryFormValues) => {
    const payload = {
      title: values.title,
      description: values.description || null,
      diagnosedDate: values.diagnosedDate || null,
      status: values.status,
    };
    if (editing) {
      updateMutation.mutate(
        { patientId, id: editing.id, data: payload },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(
        { patientId, data: payload },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button size="sm" className="gap-2" onClick={openNew}>
          <Plus className="h-4 w-4" />
          {t("patients.history.new")}
        </Button>
      </div>

      {items.length === 0 && !formOpen && (
        <p className="text-sm text-muted-foreground">
          {t("patients.history.empty")}
        </p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-border p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="font-medium">{item.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <Badge
                    variant={
                      STATUS_VARIANT[item.status] as
                        | "warning"
                        | "success"
                        | "secondary"
                    }
                    className={
                      item.status === MedicalHistoryStatus.Chronic
                        ? "border-purple-500/20 bg-purple-500/10 text-purple-600"
                        : undefined
                    }
                  >
                    {t(STATUS_KEY[item.status])}
                  </Badge>
                  {item.diagnosedDate && (
                    <span className="tabular-nums">
                      {formatDate(item.diagnosedDate, language)}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(item)}
                  aria-label={t("common.edit")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTarget(item)}
                  aria-label={t("common.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-lg border border-border p-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("patients.history.title")} *</Label>
              <Input {...form.register("title")} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("patients.history.diagnosedDate")}</Label>
              <Input type="date" {...form.register("diagnosedDate")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("patients.history.description")}</Label>
            <Textarea {...form.register("description")} />
          </div>
          <div className="space-y-2">
            <Label>{t("patients.history.status")}</Label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(MedicalHistoryStatus.Active)}>
                      {t("enums.historyStatus.active")}
                    </SelectItem>
                    <SelectItem value={String(MedicalHistoryStatus.Resolved)}>
                      {t("enums.historyStatus.resolved")}
                    </SelectItem>
                    <SelectItem value={String(MedicalHistoryStatus.Chronic)}>
                      {t("enums.historyStatus.chronic")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormOpen(false)}
              disabled={isPending}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" className="gap-2" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </form>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("confirm.delete.title")}
        description={t("confirm.delete.description")}
        confirmLabel={t("common.delete")}
        variant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={() =>
          deleteTarget &&
          deleteMutation.mutate(
            { patientId, id: deleteTarget.id },
            { onSuccess: () => setDeleteTarget(null) },
          )
        }
      />
    </div>
  );
}
