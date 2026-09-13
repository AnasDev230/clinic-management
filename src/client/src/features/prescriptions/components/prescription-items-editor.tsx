"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/use-translation";
import type { PrescriptionFormValues } from "../schemas/prescription-schema";
import type { UseFormReturn } from "react-hook-form";

interface PrescriptionItemsEditorProps {
  form: UseFormReturn<PrescriptionFormValues>;
  fieldName?: "items";
}

export function PrescriptionItemsEditor({ form }: PrescriptionItemsEditorProps) {
  const { t } = useTranslation();
  const items = form.watch("items") ?? [];

  const addItem = () => {
    form.setValue("items", [
      ...items,
      {
        id: "",
        medicationName: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: undefined,
        instructions: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    form.setValue(
      "items",
      items.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{t("prescriptions.items.title")}</Label>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addItem}>
          <Plus className="h-4 w-4" />
          {t("prescriptions.addItem")}
        </Button>
      </div>
      {items.map((_, index) => (
        <div key={index} className="space-y-3 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium tabular-nums">
              #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              aria-label={t("prescriptions.removeItem")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>{t("prescriptions.items.medication")}</Label>
              <Input {...form.register(`items.${index}.medicationName`)} className="h-10" />
              {form.formState.errors.items?.[index]?.medicationName && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.items[index]?.medicationName?.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("prescriptions.items.dosage")}</Label>
              <Input {...form.register(`items.${index}.dosage`)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>{t("prescriptions.items.frequency")}</Label>
              <Input {...form.register(`items.${index}.frequency`)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>{t("prescriptions.items.duration")}</Label>
              <Input {...form.register(`items.${index}.duration`)} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label>{t("prescriptions.items.quantity")}</Label>
              <Input
                type="number"
                step="0.001"
                {...form.register(`items.${index}.quantity`)}
                className="h-10 tabular-nums"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>{t("prescriptions.items.instructions")}</Label>
              <Input {...form.register(`items.${index}.instructions`)} className="h-10" />
            </div>
          </div>
        </div>
      ))}
      {form.formState.errors.items?.message && (
        <p className="text-sm text-destructive">
          {String(form.formState.errors.items.message)}
        </p>
      )}
    </div>
  );
}
