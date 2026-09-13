"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/use-translation";
import { formatCurrency } from "@/lib/formatters";
import type { MedicalServiceDropdown } from "@/types/medical-service";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export interface InvoiceLineInput {
  quantity: number;
  unitPrice: number;
  discountAmount: number;
}

export function calculateLineTotal(line: InvoiceLineInput): number {
  const quantity = Number(line.quantity) || 0;
  const unitPrice = Number(line.unitPrice) || 0;
  const discount = Number(line.discountAmount) || 0;
  return Math.max(0, quantity * unitPrice - discount);
}

export function calculateInvoiceTotals(
  lines: InvoiceLineInput[],
  discountPercentage: number,
  taxPercentage: number,
) {
  const subTotal = lines.reduce((sum, line) => sum + calculateLineTotal(line), 0);
  const discountAmount = (subTotal * (Number(discountPercentage) || 0)) / 100;
  const taxableBase = subTotal - discountAmount;
  const taxAmount = (taxableBase * (Number(taxPercentage) || 0)) / 100;
  const total = taxableBase + taxAmount;
  return { subTotal, discountAmount, taxAmount, total };
}

interface InvoiceItemsEditorProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  services: MedicalServiceDropdown[];
}

export function InvoiceItemsEditor<T extends FieldValues>({
  form,
  services,
}: InvoiceItemsEditorProps<T>) {
  const { t, language } = useTranslation();
  const items =
    (form.watch("items" as Path<T>) as unknown as Array<Record<string, unknown>>) ?? [];

  const addItem = () => {
    form.setValue(
      "items" as Path<T>,
      [
        ...items,
        {
          id: "",
          serviceName: "",
          description: "",
          medicalServiceId: "",
          quantity: 1,
          unitPrice: 0,
          discountAmount: 0,
        },
      ] as never,
    );
  };

  const removeItem = (index: number) => {
    form.setValue(
      "items" as Path<T>,
      items.filter((_, i) => i !== index) as never,
    );
  };

  const handleServiceChange = (index: number, value: string) => {
    if (value === "manual") {
      form.setValue(`items.${index}.medicalServiceId` as Path<T>, "" as never);
      return;
    }
    const service = services.find((s) => s.id === value);
    form.setValue(`items.${index}.medicalServiceId` as Path<T>, value as never);
    if (service) {
      form.setValue(`items.${index}.serviceName` as Path<T>, service.name as never);
      form.setValue(`items.${index}.unitPrice` as Path<T>, service.price as never);
    }
  };

  const errors = (
    form.formState.errors as unknown as {
      items?: Array<{ serviceName?: { message?: string } }>;
    }
  ).items;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{t("invoices.items.title")}</Label>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={addItem}>
          <Plus className="h-4 w-4" />
          {t("invoices.items.addItem")}
        </Button>
      </div>
      {items.map((_, index) => {
        const serviceId = String(
          (form.watch(`items.${index}.medicalServiceId` as Path<T>) as unknown as string) ?? "",
        );
        const lineTotal = calculateLineTotal({
          quantity: Number(form.watch(`items.${index}.quantity` as Path<T>) ?? 0),
          unitPrice: Number(form.watch(`items.${index}.unitPrice` as Path<T>) ?? 0),
          discountAmount: Number(
            form.watch(`items.${index}.discountAmount` as Path<T>) ?? 0,
          ),
        });
        return (
          <div key={index} className="space-y-3 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium tabular-nums">#{index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                aria-label={t("invoices.items.removeItem")}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label>{t("invoices.selectService")}</Label>
              <Select
                value={serviceId || "manual"}
                onValueChange={(v) => handleServiceChange(index, v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("invoices.selectService")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">{t("invoices.manualEntry")}</SelectItem>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} · {formatCurrency(s.price, language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("invoices.items.service")}</Label>
              <Input {...form.register(`items.${index}.serviceName` as Path<T>)} className="h-10" />
              {errors?.[index]?.serviceName && (
                <p className="text-sm text-destructive">
                  {errors[index]?.serviceName?.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <Label>{t("invoices.items.quantity")}</Label>
                <Input
                  type="number"
                  step="0.001"
                  min="0"
                  {...form.register(`items.${index}.quantity` as Path<T>)}
                  className="h-10 tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("invoices.items.unitPrice")}</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...form.register(`items.${index}.unitPrice` as Path<T>)}
                  className="h-10 tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("invoices.items.discount")}</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...form.register(`items.${index}.discountAmount` as Path<T>)}
                  className="h-10 tabular-nums"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-2">
              <span className="text-sm text-muted-foreground">{t("invoices.items.total")}</span>
              <span className="text-sm font-semibold tabular-nums">
                {formatCurrency(lineTotal, language)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
