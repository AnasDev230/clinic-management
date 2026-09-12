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
import {
  useCreateAllergy,
  useDeleteAllergy,
  useUpdateAllergy,
} from "../hooks/use-allergies";
import {
  createAllergySchema,
  type AllergyFormValues,
} from "../schemas/allergy-schema";
import {
  AllergySeverity,
  AllergyType,
  type AllergyItem,
} from "@/types/patient";

const SEVERITY_VARIANT = {
  [AllergySeverity.Mild]: "info",
  [AllergySeverity.Moderate]: "warning",
  [AllergySeverity.Severe]: "danger",
} as const;

const SEVERITY_KEY = {
  [AllergySeverity.Mild]: "enums.allergySeverity.mild",
  [AllergySeverity.Moderate]: "enums.allergySeverity.moderate",
  [AllergySeverity.Severe]: "enums.allergySeverity.severe",
} as const;

const TYPE_KEY = {
  [AllergyType.Drug]: "enums.allergyType.drug",
  [AllergyType.Food]: "enums.allergyType.food",
  [AllergyType.Environmental]: "enums.allergyType.environmental",
  [AllergyType.Other]: "enums.allergyType.other",
} as const;

export function AllergiesSection({
  patientId,
  items,
}: {
  patientId: string;
  items: AllergyItem[];
}) {
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AllergyItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AllergyItem | null>(null);
  const createMutation = useCreateAllergy();
  const updateMutation = useUpdateAllergy();
  const deleteMutation = useDeleteAllergy();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<AllergyFormValues>({
    resolver: zodResolver(createAllergySchema(t)),
    defaultValues: {
      name: "",
      type: AllergyType.Other,
      severity: AllergySeverity.Mild,
      notes: "",
    },
  });

  const openNew = () => {
    setEditing(null);
    form.reset({
      name: "",
      type: AllergyType.Other,
      severity: AllergySeverity.Mild,
      notes: "",
    });
    setFormOpen(true);
  };

  const openEdit = (item: AllergyItem) => {
    setEditing(item);
    form.reset({
      name: item.name,
      type: item.type,
      severity: item.severity,
      notes: item.notes ?? "",
    });
    setFormOpen(true);
  };

  const onSubmit = (values: AllergyFormValues) => {
    const payload = {
      name: values.name,
      type: values.type,
      severity: values.severity,
      notes: values.notes || null,
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
          {t("patients.allergies.new")}
        </Button>
      </div>

      {items.length === 0 && !formOpen && (
        <p className="text-sm text-muted-foreground">
          {t("patients.allergies.empty")}
        </p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="font-medium">{item.name}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{t(TYPE_KEY[item.type])}</Badge>
                  <Badge variant={SEVERITY_VARIANT[item.severity]}>
                    {t(SEVERITY_KEY[item.severity])}
                  </Badge>
                </div>
                {item.notes && (
                  <p className="text-sm text-muted-foreground">{item.notes}</p>
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
              <Label>{t("patients.allergies.name")} *</Label>
              <Input {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("patients.allergies.type")}</Label>
              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(AllergyType.Drug)}>
                        {t("enums.allergyType.drug")}
                      </SelectItem>
                      <SelectItem value={String(AllergyType.Food)}>
                        {t("enums.allergyType.food")}
                      </SelectItem>
                      <SelectItem
                        value={String(AllergyType.Environmental)}
                      >
                        {t("enums.allergyType.environmental")}
                      </SelectItem>
                      <SelectItem value={String(AllergyType.Other)}>
                        {t("enums.allergyType.other")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("patients.allergies.severity")}</Label>
              <Controller
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={String(AllergySeverity.Mild)}>
                        {t("enums.allergySeverity.mild")}
                      </SelectItem>
                      <SelectItem value={String(AllergySeverity.Moderate)}>
                        {t("enums.allergySeverity.moderate")}
                      </SelectItem>
                      <SelectItem value={String(AllergySeverity.Severe)}>
                        {t("enums.allergySeverity.severe")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("patients.allergies.notes")}</Label>
            <Textarea {...form.register("notes")} />
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
