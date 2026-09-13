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
import { formatCurrency } from "@/lib/formatters";
import {
  updateInvoiceSchema,
  type UpdateInvoiceFormValues,
} from "../../schemas/invoice-schema";
import { useUpdateInvoice } from "../../hooks/use-update-invoice";
import {
  InvoiceItemsEditor,
  calculateInvoiceTotals,
  type InvoiceLineInput,
} from "./invoice-items-editor";
import type { MedicalServiceDropdown } from "@/types/medical-service";
import type { InvoiceDetail } from "@/types/invoice";

interface InvoiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  services: MedicalServiceDropdown[];
  initialData?: InvoiceDetail | null;
}

export function InvoiceFormDialog({
  open,
  onClose,
  services,
  initialData,
}: InvoiceFormDialogProps) {
  const { t, language } = useTranslation();
  const schema = useMemo(() => updateInvoiceSchema(t), [t]);
  const updateMutation = useUpdateInvoice();

  const form = useForm<UpdateInvoiceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      dueDate: "",
      discountPercentage: 0,
      taxPercentage: 0,
      notes: "",
      items: [],
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 10) : "",
        discountPercentage: initialData.discountPercentage,
        taxPercentage: initialData.taxPercentage,
        notes: initialData.notes ?? "",
        items: initialData.items.map((i) => ({
          id: i.id,
          serviceName: i.serviceName,
          description: i.description ?? "",
          medicalServiceId: i.medicalServiceId ?? "",
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discountAmount: i.discountAmount,
        })),
      });
    }
  }, [open, initialData, form]);

  const watchedItems = (form.watch("items") ?? []) as InvoiceLineInput[];
  const totals = calculateInvoiceTotals(
    watchedItems,
    Number(form.watch("discountPercentage") ?? 0),
    Number(form.watch("taxPercentage") ?? 0),
  );

  const onSubmit = (values: UpdateInvoiceFormValues) => {
    if (!initialData) return;
    updateMutation.mutate(
      {
        id: initialData.id,
        data: {
          dueDate: values.dueDate || null,
          discountPercentage: Number(values.discountPercentage),
          taxPercentage: Number(values.taxPercentage),
          notes: values.notes || null,
          items: values.items.map((item) => ({
            id: item.id || null,
            serviceName: item.serviceName,
            description: item.description || null,
            medicalServiceId: item.medicalServiceId || null,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            discountAmount: Number(item.discountAmount ?? 0),
          })),
        },
      },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("invoices.edit")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("invoices.form.dueDate")}</Label>
            <Input type="date" {...form.register("dueDate")} className="h-10 tabular-nums" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("invoices.form.discountPercentage")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...form.register("discountPercentage")}
                className="h-10 tabular-nums"
              />
              {form.formState.errors.discountPercentage && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.discountPercentage.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("invoices.form.taxPercentage")}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="100"
                {...form.register("taxPercentage")}
                className="h-10 tabular-nums"
              />
              {form.formState.errors.taxPercentage && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.taxPercentage.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("invoices.form.notes")}</Label>
            <Textarea {...form.register("notes")} rows={2} />
          </div>
          <InvoiceItemsEditor form={form} services={services} />
          <div className="space-y-1 rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{t("invoices.summary.subTotal")}</span>
              <span className="tabular-nums">{formatCurrency(totals.subTotal, language)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{t("invoices.summary.discount")}</span>
              <span className="tabular-nums">{formatCurrency(totals.discountAmount, language)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">{t("invoices.summary.tax")}</span>
              <span className="tabular-nums">{formatCurrency(totals.taxAmount, language)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-border pt-1 font-semibold">
              <span>{t("invoices.summary.total")}</span>
              <span className="tabular-nums">{formatCurrency(totals.total, language)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? t("common.executing") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
